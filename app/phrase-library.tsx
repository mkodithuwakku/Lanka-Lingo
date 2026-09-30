"use client";

import { useState } from "react";
import { phraseLibrary, searchPhraseLibrary, type LibraryPhrase } from "../src/content/phrases.ts";

export default function PhraseLibrary({ onSelect, disabled }: {
  onSelect: (phrase: LibraryPhrase) => void;
  disabled: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All phrases");
  const results = searchPhraseLibrary(query, category);
  return <section className="phrase-library" aria-label="Phrase library">
    <h3>Find a phrase</h3>
    <p>Choose an included sentence to see it in the conversation and practice it. No translation service needed.</p>
    <div className="library-filters">
      <label>Search phrases
        <input type="search" placeholder="English, Sinhala, or romanization" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <label>Topic
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {["All phrases", ...new Set(phraseLibrary.map((phrase) => phrase.category))].map((name) => <option key={name}>{name}</option>)}
        </select>
      </label>
    </div>
    <p className="library-count" role="status">{results.length} {results.length === 1 ? "phrase" : "phrases"} found</p>
    <div className="library-results">
      {results.map((phrase) => <button key={phrase.id} type="button" disabled={disabled} onClick={() => onSelect(phrase)}>
        <strong>{phrase.english}</strong>
        <span lang="si">{phrase.sinhala}</span>
        <small>{phrase.romanized}</small>
      </button>)}
      {!results.length && <p>No included phrase matches. Try a shorter search, choose another topic, or <button className="clear-search" type="button" onClick={() => { setQuery(""); setCategory("All phrases"); }}>show all phrases</button>.</p>}
    </div>
  </section>;
}
