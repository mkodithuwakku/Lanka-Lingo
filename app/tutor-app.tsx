"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type {
  ConversationMessage,
  PracticeMode,
  PronunciationFeedback,
  TutorReply,
  TutorRequest
} from "../src/domain/types.ts";
import { conversationTopics, getTopicOfTheDay } from "../src/content/topics.ts";
import { createLocalTutorReply } from "../src/services/localTutor.ts";
import type { RuntimeCapabilities } from "../src/services/runtimeConfiguration.ts";
import PhraseLibrary from "./phrase-library.tsx";
import { evaluatePronunciation } from "../src/services/pronunciation.ts";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<ArrayLike<SpeechRecognitionAlternativeLike>>;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface PracticeTarget {
  sinhala: string;
  romanized: string;
  english: string;
}

const openingMessage: ConversationMessage = {
  id: "opening",
  role: "tutor",
  language: "si",
  text: "ආයුබෝවන්! අද කොහොමද?",
  romanized: "ayubowan! ada kohomada?",
  english: "Hello! How are you today?"
};

const openingTarget: PracticeTarget = {
  sinhala: "මම හොඳින් ඉන්නවා.",
  romanized: "mama hondin innawa.",
  english: "I am doing well."
};

function makeId(prefix: string): string {
  return `${prefix}-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
}

function findSinhalaVoice(): SpeechSynthesisVoice | null {
  if (!("speechSynthesis" in window)) return null;

  return window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase() === "si-lk" || voice.lang.toLowerCase().startsWith("si-")) ?? null;
}

async function waitForSinhalaVoice(): Promise<SpeechSynthesisVoice | null> {
  const available = findSinhalaVoice();
  if (available || !("speechSynthesis" in window)) return available;

  await new Promise<void>((resolve) => {
    const synthesis = window.speechSynthesis;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      synthesis.removeEventListener("voiceschanged", finish);
      resolve();
    };

    synthesis.addEventListener("voiceschanged", finish, { once: true });
    window.setTimeout(finish, 400);
  });

  return findSinhalaVoice();
}

export default function TutorApp({ capabilities }: { capabilities: RuntimeCapabilities }) {
  const [mode, setMode] = useState<PracticeMode>("conversation");
  const [messages, setMessages] = useState<ConversationMessage[]>([openingMessage]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Ready when you are");
  const [source, setSource] = useState<TutorReply["source"]>("local");
  const [target, setTarget] = useState<PracticeTarget>(openingTarget);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(capabilities.azureSpeech);
  const [progress, setProgress] = useState<TutorReply["localProgress"]>();
  const conversationStepRef = useRef(0);
  const conversationTargetRef = useRef<PracticeTarget>(openingTarget);
  const requestBusyRef = useRef(false);
  const [suggestions, setSuggestions] = useState<TutorReply["suggestedReplies"]>([]);
  const [currentTopic, setCurrentTopic] = useState("Everyday life");
  const [topicPickerOpen, setTopicPickerOpen] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechAbortRef = useRef<AbortController | null>(null);
  const speechRequestRef = useRef(0);
  const audioCacheRef = useRef(new Map<string, string>());
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const dailyTopicStartedRef = useRef(false);

  useEffect(() => {
    setSpeechSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    const updateVoices = () => setVoiceAvailable(capabilities.azureSpeech || Boolean(findSinhalaVoice()));
    updateVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", updateVoices);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", updateVoices);
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
      speechAbortRef.current?.abort();
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
      for (const url of audioCacheRef.current.values()) URL.revokeObjectURL(url);
      audioCacheRef.current.clear();
    };
  }, [capabilities.azureSpeech]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (dailyTopicStartedRef.current) return;
    dailyTopicStartedRef.current = true;
    void startConversation(getTopicOfTheDay().title);
  }, []);

  function stopListening() {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    }
    setIsListening(false);
  }

  function stopAudio() {
    speechRequestRef.current += 1;
    speechAbortRef.current?.abort();
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }

  async function requestTutor(request: TutorRequest): Promise<TutorReply> {
    if (!capabilities.liveTutor) return createLocalTutorReply(request);
    const response = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) throw new Error("Tutor request failed");
    return await response.json() as TutorReply;
  }

  async function speakSinhala(text: string, rate = 0.88) {
    const phrase = text.trim();
    if (!phrase || recognitionRef.current) return;

    const requestId = ++speechRequestRef.current;
    speechAbortRef.current?.abort();
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();

    const controller = new AbortController();
    speechAbortRef.current = controller;
    setIsSpeaking(true);

    try {
      const cacheKey = `${rate}:${phrase}`;
      let audioUrl = audioCacheRef.current.get(cacheKey);

      if (!audioUrl && capabilities.azureSpeech) {
        const response = await fetch("/api/speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: phrase, rate }),
          signal: controller.signal
        });

        if (!response.ok) {
          setStatusMessage("Cloud audio is unavailable. Trying an installed Sinhala voice.");
        } else {
          const audioBlob = await response.blob();
          audioUrl = URL.createObjectURL(audioBlob);
          audioCacheRef.current.set(cacheKey, audioUrl);
        }
      }

      if (requestId !== speechRequestRef.current) return;

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        await new Promise<void>((resolve, reject) => {
          audio.addEventListener("ended", () => resolve(), { once: true });
          audio.addEventListener("error", () => reject(new Error("Audio playback failed.")), { once: true });
          controller.signal.addEventListener("abort", () => { audio.pause(); resolve(); }, { once: true });
          audio.play().catch(reject);
        });
        return;
      }

      const sinhalaVoice = await waitForSinhalaVoice();
      if (requestId !== speechRequestRef.current) return;

      if (!sinhalaVoice) {
        setStatusMessage("No Sinhala voice is available. Follow the romanization and practice aloud; typed practice still works.");
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = "si-LK";
        utterance.voice = sinhalaVoice;
        utterance.rate = rate;
        utterance.onend = () => resolve();
        utterance.onerror = () => reject(new Error("Browser Sinhala playback failed."));
        controller.signal.addEventListener("abort", () => resolve(), { once: true });
        window.speechSynthesis.speak(utterance);
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (requestId === speechRequestRef.current) {
        setStatusMessage("Chrome could not play the Sinhala audio. Click Listen to try again.");
      }
    } finally {
      if (requestId === speechRequestRef.current) setIsSpeaking(false);
    }
  }

  function applyTutorReply(reply: TutorReply, replaceConversation = false, replyMode: PracticeMode = "conversation") {
    const tutorMessage: ConversationMessage = {
      id: makeId("tutor"),
      role: "tutor",
      language: "si",
      text: reply.sinhala,
      romanized: reply.romanized,
      english: reply.english,
      notice: reply.notice
    };

    setMessages((current) => replaceConversation ? [tutorMessage] : [...current, tutorMessage]);
    setSource(reply.source);
    if (replyMode === "conversation") {
      setSuggestions(reply.suggestedReplies);
      setProgress(reply.localProgress);
    }
    const practicePhrase = reply.suggestedReplies[0] ?? {
      sinhala: reply.expectedPhrase || reply.sinhala,
      romanized: reply.romanized,
      english: reply.english
    };
    if (!reply.localProgress?.complete) {
      setTarget(practicePhrase);
      if (replyMode === "conversation") conversationTargetRef.current = practicePhrase;
    }
    setStatusMessage(reply.coaching);
    if (autoPlay && voiceAvailable) void speakSinhala(reply.sinhala);
  }

  async function startConversation(topic: string) {
    const cleanedTopic = topic.trim().slice(0, 120);
    if (!cleanedTopic || requestBusyRef.current) return;
    requestBusyRef.current = true;
    stopListening();
    stopAudio();
    conversationStepRef.current = 0;
    setProgress(undefined);

    setMode("conversation");
    setCurrentTopic(cleanedTopic);
    setTopicPickerOpen(false);
    setCustomTopic("");
    setMessages([]);
    setSuggestions([]);
    setFeedback(null);
    setInput("");
    setIsLoading(true);
    setStatusMessage(`Starting a casual conversation about ${cleanedTopic.toLowerCase()}…`);

    try {
      const reply = await requestTutor({
        mode: "conversation",
        message: "Start a new casual conversation.",
        topic: cleanedTopic,
        startConversation: true,
        conversationStep: 0,
        history: []
      });
      applyTutorReply(reply, true);
    } catch {
      applyTutorReply(createLocalTutorReply({ mode: "conversation", message: "Start", topic: cleanedTopic, startConversation: true, history: [] }), true);
      setStatusMessage("The live tutor is unavailable. You can continue with this free guided round.");
    } finally {
      requestBusyRef.current = false;
      setIsLoading(false);
    }
  }

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || requestBusyRef.current || (mode === "conversation" && progress?.complete)) return;
    requestBusyRef.current = true;
    stopListening();
    stopAudio();
    const nextStep = conversationStepRef.current + (mode === "conversation" ? 1 : 0);

    const learnerMessage: ConversationMessage = {
      id: makeId("learner"),
      role: "learner",
      language: mode === "english-help" ? "en" : "si",
      text: message
    };
    const historyForRequest = [...messages, learnerMessage];

    setMessages(historyForRequest);
    setInput("");
    setFeedback(null);
    setIsLoading(true);
    setStatusMessage(mode === "english-help" ? "Building your Sinhala phrase…" : "Tutor is thinking…");

    try {
      const reply = await requestTutor({
        mode,
        message,
        topic: currentTopic,
        conversationStep: nextStep,
        history: historyForRequest.slice(-12).map(({ role, text, english }) => ({ role, text, english }))
      });
      conversationStepRef.current = nextStep;
      applyTutorReply(reply, false, mode);
    } catch {
      const reply = createLocalTutorReply({ mode, message, topic: currentTopic, conversationStep: nextStep, history: [] });
      conversationStepRef.current = nextStep;
      applyTutorReply(reply, false, mode);
      setStatusMessage("The live tutor is unavailable. Your message is kept; continue with free practice.");
    } finally {
      requestBusyRef.current = false;
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function startListening(intent: "message" | "pronunciation") {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechSupported(false);
      setStatusMessage("Voice recognition is unavailable here. Chrome is the most reliable option, or type your message below.");
      return;
    }

    if (requestBusyRef.current) return;
    stopListening();
    stopAudio();
    let recognition: SpeechRecognitionLike;
    try {
      recognition = new Recognition();
    } catch {
      setStatusMessage("Voice recognition could not start. You can type instead.");
      return;
    }
    let receivedResult = false;
    recognitionRef.current = recognition;
    recognition.lang = intent === "pronunciation" || mode === "conversation" ? "si-LK" : "en-CA";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[0]?.[0];
      if (!result) return;

      receivedResult = true;
      const transcript = result.transcript.trim();
      if (intent === "pronunciation") {
        setFeedback(
          evaluatePronunciation({
            transcript,
            confidence: Number.isFinite(result.confidence) ? result.confidence : 0.7,
            expectedPhrase: target.sinhala
          })
        );
        setStatusMessage("Pronunciation check complete. This score measures transcript similarity, not individual sounds.");
      } else {
        setInput(transcript);
        void sendMessage(transcript);
      }
    };

    recognition.onerror = (event) => {
      receivedResult = true;
      const message = event.error === "not-allowed"
        ? "Microphone permission was denied. Allow it in the browser, or type instead."
        : `Voice recognition stopped: ${event.error.replaceAll("-", " ")}. You can type instead.`;
      setStatusMessage(message);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      if (!receivedResult) setStatusMessage("No speech was captured. Try again or type your reply.");
    };

    setFeedback(intent === "pronunciation" ? null : feedback);
    setIsListening(true);
    setStatusMessage(intent === "pronunciation" ? "Listening for your Sinhala practice phrase…" : `Listening in ${mode === "conversation" ? "Sinhala" : "English"}…`);
    try {
      recognition.start();
    } catch {
      stopListening();
      setStatusMessage("Voice recognition could not start. Try again or type your reply.");
    }
  }

  function changeMode(nextMode: PracticeMode) {
    if (requestBusyRef.current) return;
    stopListening();
    stopAudio();
    setFeedback(null);
    if (nextMode === "conversation") setTarget(conversationTargetRef.current);
    setMode(nextMode);
    setInput("");
    setStatusMessage(
      nextMode === "english-help"
        ? "Choose a phrase below, or ask how to say an included English sentence."
        : "Conversation mode listens for Sinhala. Use English help whenever you get stuck."
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">ල</div>
          <div>
            <strong>Lanka Lingo</strong>
            <span>Your private Sinhala speaking room</span>
          </div>
        </div>
        <div className={`runtime-pill ${source}`}>
          <span aria-hidden="true" />
          {source === "openai" ? "Live tutor" : "Free practice"}
        </div>
      </header>

      <section className="workspace">
        <aside className="coach-panel">
          <div className="welcome-copy">
            <p className="eyebrow">Today’s practice</p>
            <h1>Stop studying.<br />Start talking.</h1>
            <p>Practice a short Sinhala exchange, find a phrase when you freeze, and try saying it in your own voice.</p>
          </div>

          {!capabilities.liveTutor && <div className="free-note">
            <strong>Ready without keys or credits</strong>
            <p>Five guided topics and 38 included phrases. Prompts follow a fixed sequence; they do not interpret your answer. Your session resets on refresh.</p>
          </div>}

          <div className="topic-selector">
            <div className="topic-summary">
              <div>
                <p className="eyebrow">Conversation topic</p>
                <strong>{currentTopic}</strong>
              </div>
              <button type="button" onClick={() => setTopicPickerOpen((open) => !open)} aria-expanded={topicPickerOpen}>
                {topicPickerOpen ? "Close" : "Change"}
              </button>
            </div>
            {topicPickerOpen && (
              <div className="topic-options">
                <button className="daily-topic" type="button" onClick={() => void startConversation(getTopicOfTheDay().title)} disabled={isLoading}>
                  Today’s pick
                </button>
                {conversationTopics.map((topic) => (
                  <button
                    className={currentTopic === topic.title ? "selected" : ""}
                    type="button"
                    key={topic.id}
                    onClick={() => void startConversation(topic.title)}
                    disabled={isLoading}
                  >
                    {topic.title}
                  </button>
                ))}
                <form
                  className="custom-topic"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void startConversation(customTopic);
                  }}
                >
                  <label>
                    <span className="sr-only">Custom conversation topic</span>
                    <input
                      value={customTopic}
                      onChange={(event) => setCustomTopic(event.target.value)}
                      placeholder="Or enter any topic…"
                      maxLength={120}
                    />
                  </label>
                  <button type="submit" disabled={!customTopic.trim() || isLoading}>Start</button>
                  {!capabilities.liveTutor && <small>Custom topics use general prompts from the free phrase set.</small>}
                </form>
              </div>
            )}
          </div>

          <div className="mode-switch" aria-label="Practice mode">
            <button className={mode === "conversation" ? "active" : ""} onClick={() => changeMode("conversation")} type="button" disabled={isLoading} aria-pressed={mode === "conversation"}>
              <span>සිං</span>
              Sinhala
            </button>
            <button className={mode === "english-help" ? "active" : ""} onClick={() => changeMode("english-help")} type="button" disabled={isLoading} aria-pressed={mode === "english-help"}>
              <span>EN</span>
              English help
            </button>
          </div>

          <div className="target-card">
            <div className="target-heading">
              <div>
                <p className="eyebrow">Phrase in focus</p>
                <h2 lang="si">{target.sinhala}</h2>
              </div>
              <button className="sound-button" type="button" onClick={() => void speakSinhala(target.sinhala)} aria-label="Play Sinhala phrase" disabled={!voiceAvailable || isListening}>
                <span aria-hidden="true">◖))</span>
              </button>
            </div>
            <p className="romanized">{target.romanized}</p>
            <p className="translation">{target.english}</p>
            <div className="target-actions">
              <button type="button" onClick={() => void speakSinhala(target.sinhala, 0.68)} disabled={!voiceAvailable || isListening}>Play slowly</button>
              <button className="practice-button" type="button" onClick={() => startListening("pronunciation")} disabled={isListening || isLoading || !speechSupported}>
                Practice this phrase
              </button>
            </div>

            <p className="practice-note">{voiceAvailable ? "Listen, then repeat aloud." : "No Sinhala voice is installed in this browser. Follow the romanization and practice aloud; playback is optional."} Recognition checks words, not individual sounds.</p>
            {!speechSupported && <p className="practice-note">Microphone recognition is unavailable. Say the phrase aloud for self-practice, or use the typed conversation.</p>}
            {isListening && <button className="stop-control" type="button" onClick={() => { stopListening(); setStatusMessage("Microphone stopped. You can type or try again."); }}>Stop microphone</button>}
            {isSpeaking && <button className="stop-control" type="button" onClick={stopAudio}>Stop audio</button>}

            {feedback && (
              <div className={`feedback ${feedback.status}`} role="status">
                <div className="score-ring" aria-label={`${feedback.score} percent transcript match`}>{feedback.score}</div>
                <div>
                  <strong>{feedback.status === "great" ? "Clear match" : feedback.status === "close" ? "Nearly there" : "Try once more"}</strong>
                  <p>{feedback.messageEnglish}</p>
                  {feedback.recognizedPhrase && <small>Heard: {feedback.recognizedPhrase}</small>}
                </div>
              </div>
            )}
          </div>

          <div className="privacy-note">
            <span aria-hidden="true">⌂</span>
            <p><strong>Local-first.</strong> No account or database. Browser speech recognition may still send audio to your browser vendor.</p>
          </div>
        </aside>

        <section className="conversation-panel" aria-label="Sinhala tutor conversation">
          <div className="conversation-header">
            <div>
              <p className="eyebrow">{currentTopic}</p>
              <h2>{mode === "conversation" ? "Speak in Sinhala" : "Ask in English"}</h2>
            </div>
            <label className="autoplay-toggle">
              <input type="checkbox" checked={autoPlay} disabled={!voiceAvailable} onChange={(event) => { setAutoPlay(event.target.checked); if (!event.target.checked) stopAudio(); }} />
              <span />
              Auto-play voice
            </label>
          </div>

          {mode === "english-help" && <PhraseLibrary disabled={isLoading || isListening} onSelect={(phrase) => void sendMessage(phrase.english)} />}
          {mode === "conversation" && progress && <div className="round-status" role="status">
            <div><strong>{progress.complete ? "Round complete" : `Question ${progress.question} of ${progress.total}`}</strong>
              <p>{progress.complete ? "Try the same topic again, or choose a different one." : "Answer aloud or type. Suggested replies are there when you need them."}</p></div>
            <button type="button" disabled={isLoading} onClick={() => void startConversation(currentTopic)}>Restart topic</button>
            {progress.complete && <button type="button" onClick={() => void startConversation(conversationTopics[(conversationTopics.findIndex((topic) => topic.title === currentTopic) + 1) % conversationTopics.length].title)}>Next topic</button>}
          </div>}

          <div className="transcript" aria-live="polite">
            {messages.map((message) => (
              <article className={`message ${message.role}`} key={message.id}>
                <div className="speaker">{message.role === "tutor" ? "Tutor" : "You"}</div>
                <div className="message-bubble">
                  {message.notice && <p className="message-notice">{message.notice}</p>}
                  <p lang={message.language} className={message.language === "si" ? "sinhala-text" : "english-text"}>{message.text}</p>
                  {message.romanized && <p className="message-romanized">{message.romanized}</p>}
                  {message.english && <p className="message-english">{message.english}</p>}
                  {message.role === "tutor" && (
                    <button className="inline-audio" type="button" onClick={() => void speakSinhala(message.text)} aria-label="Play tutor message" disabled={!voiceAvailable || isListening}>
                      Listen
                    </button>
                  )}
                </div>
              </article>
            ))}
            {isLoading && (
              <article className="message tutor loading-message">
                <div className="speaker">Tutor</div>
                <div className="message-bubble"><i /><i /><i /></div>
              </article>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {suggestions.length > 0 && mode === "conversation" && (
            <div className="suggestions" aria-label="Suggested Sinhala replies">
              <span>Try saying</span>
              {suggestions.map((suggestion) => (
                <button type="button" key={suggestion.sinhala} disabled={isLoading || isListening} onClick={() => { setInput(suggestion.sinhala); setTarget(suggestion); conversationTargetRef.current = suggestion; setFeedback(null); }}>
                  {suggestion.romanized}
                  <small>{suggestion.english}</small>
                </button>
              ))}
            </div>
          )}

          <div className="composer-wrap">
            {mode === "english-help" && (
              <button className="return-to-conversation" type="button" onClick={() => changeMode("conversation")} disabled={isLoading}>
                Return to the {currentTopic.toLowerCase()} conversation →
              </button>
            )}
            <p className="status-line" role="status"><span className={isListening ? "listening" : ""} />{statusMessage}</p>
            <form className="composer" onSubmit={handleSubmit}>
              <button
                className={`mic-control ${isListening ? "listening" : ""}`}
                type="button"
                onClick={() => startListening("message")}
                disabled={isListening || isLoading || !speechSupported || (mode === "conversation" && progress?.complete)}
                aria-label={mode === "conversation" ? "Speak Sinhala" : "Speak English"}
              >
                <span aria-hidden="true">●</span>
              </button>
              <label>
                <span className="sr-only">Your message</span>
                <input
                  value={input}
                  disabled={isLoading || isListening || (mode === "conversation" && progress?.complete)}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={mode === "conversation" ? "Speak or type Sinhala…" : "How do I say…"}
                  maxLength={800}
                />
              </label>
              <button className="send-button" type="submit" disabled={!input.trim() || isLoading || isListening || (mode === "conversation" && progress?.complete)} aria-label="Send message">↑</button>
            </form>
            {!speechSupported && <p className="browser-warning">Voice recognition is not supported in this browser; typed practice still works.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}
