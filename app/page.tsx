import { initialScenarios } from "../src/content/scenarios.ts";

const firstScenario = initialScenarios[0];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Mobile-first web MVP</p>
        <h1>Speak Sinhala from the first session.</h1>
        <p className="lede">
          Practice colloquial Sinhala through guided conversation, romanized prompts,
          small English captions, and privacy-first voice controls.
        </p>
      </section>

      <section className="conversation-card" aria-labelledby="conversation-title">
        <div>
          <p className="caption">First guided conversation</p>
          <h2 id="conversation-title">{firstScenario.title}</h2>
          <p>{firstScenario.objective}</p>
        </div>

        <div className="prompt-stack">
          <div className="bubble tutor">
            <span>Sinhala audio</span>
            <strong>{firstScenario.targetPhrases[0].romanizedSinhala}</strong>
            <small>{firstScenario.targetPhrases[0].english}</small>
          </div>
          <div className="bubble learner">
            <span>Suggested reply</span>
            <strong>{firstScenario.targetPhrases[1].romanizedSinhala}</strong>
            <small>{firstScenario.targetPhrases[1].english}</small>
          </div>
        </div>

        <button className="mic-button" type="button">
          Hold to speak
        </button>
      </section>

      <section className="principles" aria-label="MVP principles">
        <article>
          <h3>Conversation first</h3>
          <p>No reading or writing curriculum. The loop is listen, speak, repair, continue.</p>
        </article>
        <article>
          <h3>Romanized support</h3>
          <p>Latin-letter Sinhala appears beside English meaning because that is how many speakers message day to day.</p>
        </article>
        <article>
          <h3>Audio privacy</h3>
          <p>Raw learner audio is off by default and only stored after explicit opt-in.</p>
        </article>
      </section>
    </main>
  );
}
