import assert from "node:assert/strict";
import test from "node:test";
import { initialScenarios } from "../../src/content/scenarios.ts";
import { addReviewerApproval, canPublishScenario, markReleaseReady } from "../../src/services/contentReview.ts";

test("FR-12: scenario cannot be release-ready without multiple Sinhala speaker approvals", () => {
  const scenario = addReviewerApproval(initialScenarios[0], "speaker-1");

  assert.throws(() => markReleaseReady(scenario), /Multiple Sinhala speaker approvals/);
  assert.equal(canPublishScenario(scenario), false);
});

test("FR-12: scenario can be marked release-ready after multiple colloquial phrasing reviews", () => {
  const scenario = addReviewerApproval(addReviewerApproval(initialScenarios[0], "speaker-1"), "speaker-2");
  const releaseReady = markReleaseReady(scenario);

  assert.equal(releaseReady.releaseStatus, "release-ready");
  assert.equal(canPublishScenario(releaseReady), true);
});

test("FR-12: duplicate reviewer approval is counted only once", () => {
  const scenario = addReviewerApproval(addReviewerApproval(initialScenarios[0], "speaker-1"), "speaker-1");

  assert.equal(scenario.reviewerApprovals.length, 1);
});
