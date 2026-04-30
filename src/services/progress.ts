import type { LearnerLevel, ProgressEvent } from "../domain/types.ts";

export interface ProgressState {
  level: LearnerLevel;
  objectivesPracticed: Set<string>;
  phraseReuseCount: Map<string, number>;
  pronunciationSignals: number;
}

export function createProgressState(level: LearnerLevel): ProgressState {
  return {
    level,
    objectivesPracticed: new Set(),
    phraseReuseCount: new Map(),
    pronunciationSignals: 0
  };
}

export function applyProgressEvents(state: ProgressState, events: ProgressEvent[]): ProgressState {
  const next = createProgressState(state.level);
  next.objectivesPracticed = new Set(state.objectivesPracticed);
  next.phraseReuseCount = new Map(state.phraseReuseCount);
  next.pronunciationSignals = state.pronunciationSignals;

  for (const event of events) {
    if (event.type === "objective_practiced") {
      next.objectivesPracticed.add(event.value);
    }

    if (event.type === "phrase_reused") {
      next.phraseReuseCount.set(event.value, (next.phraseReuseCount.get(event.value) ?? 0) + 1);
    }

    if (event.type === "pronunciation_signal") {
      next.pronunciationSignals += 1;
    }
  }

  if (next.level < 5 && next.objectivesPracticed.size >= 3 && next.pronunciationSignals >= 1) {
    next.level = (next.level + 1) as LearnerLevel;
  }

  return next;
}
