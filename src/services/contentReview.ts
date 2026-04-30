import type { Scenario } from "../domain/types.ts";

export const REQUIRED_COLLOQUIAL_REVIEWERS = 2;

export function addReviewerApproval(scenario: Scenario, reviewerId: string): Scenario {
  return {
    ...scenario,
    reviewerApprovals: Array.from(new Set([...scenario.reviewerApprovals, reviewerId])),
    releaseStatus: "review"
  };
}

export function markReleaseReady(scenario: Scenario): Scenario {
  if (scenario.reviewerApprovals.length < REQUIRED_COLLOQUIAL_REVIEWERS) {
    throw new Error("Multiple Sinhala speaker approvals are required before release.");
  }

  return {
    ...scenario,
    releaseStatus: "release-ready"
  };
}

export function canPublishScenario(scenario: Scenario): boolean {
  return scenario.releaseStatus === "release-ready" && scenario.reviewerApprovals.length >= REQUIRED_COLLOQUIAL_REVIEWERS;
}
