const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const {
  ratingToScore,
  normalizeBehaviorResults,
  buildCoachingDynamoItems,
  selectFocusBehavior
} = require(path.join(repoRoot, "Lambda.js")).__test;

const HOSTED_COACH_CHEWY_URL = "https://pub-f427f39912f4461691149d76a2e41031.r2.dev/Coach_Chewy_Circle_large.png";
const HOSTED_COACH_CHEWY_RE = new RegExp(HOSTED_COACH_CHEWY_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test("maps official behavior ratings to score numerator and denominator", () => {
  assert.deepStrictEqual(ratingToScore("To a Great Extent"), { score_numerator: 100, score_denominator: 1 });
  assert.deepStrictEqual(ratingToScore("To Some Extent"), { score_numerator: 50, score_denominator: 1 });
  assert.deepStrictEqual(ratingToScore("Missed Opportunity"), { score_numerator: 0, score_denominator: 1 });
  assert.deepStrictEqual(ratingToScore("No Opportunity"), { score_numerator: 0, score_denominator: 0 });
});

test("normalizes behavior results to the official seven behavior rows and excludes No Opportunity from score", () => {
  const result = normalizeBehaviorResults([
    { behavior_name: "issue_understanding", rating: "To a Great Extent", evidence_turn_id: 1 },
    { behavior_name: "emotional_acknowledgement", rating: "To Some Extent", evidence_turn_id: 2 },
    { behavior_name: "pet_engagement", rating: "No Opportunity" }
  ], "Agent: hello\nCustomer: worried");

  assert.strictEqual(result.behaviors.length, 7);
  assert.strictEqual(result.total_score_numerator, 150);
  assert.strictEqual(result.total_score_denominator, 2);
  assert.strictEqual(result.final_score, 75);
  assert.strictEqual(result.behaviors.find((item) => item.behavior_name === "pet_engagement").score_denominator, 0);
});

test("builds one session item and one item per behavior for DynamoDB reporting", () => {
  const items = buildCoachingDynamoItems({
    simulation_session_id: "session-1",
    learner_id: "12345",
    learner_name: "Jane Learner",
    course_id: "course-1",
    scenario_id: "scenario-1",
    scenario_name: "Late Delivery",
    channel: "chat",
    completed_at: "2026-05-13T12:00:00.000Z",
    transcript: "Agent: hello",
    behavior_results: [
      { behavior_name: "issue_understanding", rating: "Missed Opportunity", evidence_turn_id: 1 }
    ]
  });

  assert.strictEqual(items.length, 8);
  assert.strictEqual(items[0].record_type, "simulation_session");
  assert.strictEqual(items[0].learner_employee_id, "12345");
  assert.strictEqual(items[0].learner_first_name, "Jane");
  assert.strictEqual(items[0].learner_last_name, "Learner");

  const behaviorItems = items.slice(1);
  assert.strictEqual(behaviorItems.length, 7);
  assert.ok(behaviorItems.every((item) => item.record_type === "behavior_result"));
  assert.ok(behaviorItems.every((item) => item.simulation_session_id === "session-1"));
  assert.ok(behaviorItems.every((item) => item.endedAt_sessionId.includes("#behavior#")));
});

test("selects the lowest scoring behavior with opportunity as the learner focus", () => {
  const focus = selectFocusBehavior([
    { behavior_name: "issue_understanding", rating: "To Some Extent", score_numerator: 50, score_denominator: 1 },
    { behavior_name: "problem_ownership", rating: "Missed Opportunity", score_numerator: 0, score_denominator: 1 },
    { behavior_name: "pet_engagement", rating: "No Opportunity", score_numerator: 0, score_denominator: 0 }
  ]);

  assert.strictEqual(focus.behavior_name, "problem_ownership");
});

test("voice coaching report uses the updated learner-facing report layout", () => {
  const voiceHtml = fs.readFileSync(path.join(repoRoot, "ArticulateRise-VoiceExperience.html"), "utf8");

  assert.match(voiceHtml, /Customer Care Behaviors/);
  assert.match(voiceHtml, /View details/);
  assert.match(voiceHtml, /DOING WELL/);
  assert.match(voiceHtml, /OPPORTUNITY/);
  assert.match(voiceHtml, HOSTED_COACH_CHEWY_RE);
  assert.doesNotMatch(voiceHtml, /Here's what I noticed/);
  assert.doesNotMatch(voiceHtml, /Behavior snapshot/);
  assert.doesNotMatch(voiceHtml, /Overall summary/);
  assert.doesNotMatch(voiceHtml, /openAttr/);
  assert.doesNotMatch(voiceHtml, /<details class="behavior-row"\$\{openAttr\}/);
});

test("chat coaching report uses the updated learner-facing report layout", () => {
  const chatHtml = fs.readFileSync(path.join(repoRoot, "ArticulateRise-ChatExperience.html"), "utf8");

  assert.match(chatHtml, /Customer Care Behaviors/);
  assert.match(chatHtml, /View details/);
  assert.match(chatHtml, /DOING WELL/);
  assert.match(chatHtml, /OPPORTUNITY/);
  assert.match(chatHtml, HOSTED_COACH_CHEWY_RE);
  assert.doesNotMatch(chatHtml, /Here's what I noticed/);
  assert.doesNotMatch(chatHtml, /Behavior snapshot/);
  assert.doesNotMatch(chatHtml, /Overall summary/);
  assert.doesNotMatch(chatHtml, /data:image\/png;base64/);
  assert.doesNotMatch(chatHtml, /item\.open\s*=\s*!!isFocus/);
});
