import assert from "node:assert/strict";
import test from "node:test";
import { initialScenarios } from "../../src/content/scenarios.ts";

test("FR-8: MVP includes at least ten beginner-to-early scenarios from the spec", () => {
  assert.equal(initialScenarios.length, 10);
  assert.ok(initialScenarios.some((scenario) => scenario.title === "At a family dinner"));
  assert.ok(initialScenarios.some((scenario) => scenario.title === "Explaining that you are learning Sinhala"));
});

test("FR-8/FR-10: scenario phrases include romanized Sinhala and English meaning", () => {
  for (const scenario of initialScenarios) {
    assert.ok(scenario.targetPhrases.length > 0, `${scenario.id} has target phrases`);

    for (const phrase of scenario.targetPhrases) {
      assert.ok(phrase.romanizedSinhala.length > 0, `${phrase.id} has romanized Sinhala`);
      assert.ok(phrase.english.length > 0, `${phrase.id} has English meaning`);
    }
  }
});
