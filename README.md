# Customer Simulator

## What this project is

Customer Simulator is a Chewy training tool with one AWS Lambda backend and two separate frontend experiences:

- `ArticulateRise-ChatExperience.html` for chat practice
- `ArticulateRise-VoiceExperience.html` for voice practice

The backend is the source of truth for scenarios, customer behavior, evaluation, and coaching storage.

## How it works at a high level

`Lambda.js` contains the `SCENARIOS` object and serves scenario configuration to both frontends.

- Chat and voice stay separate in the UI.
- Both frontends load scenario-specific display/config data from `GET /scenario`.
- Chat uses `POST /chat-turn` for turn-by-turn customer replies.
- Voice uses `POST /session` to create an OpenAI Realtime session.
- Both experiences use `POST /evaluate` to generate coaching.
- Both can save coaching records through `POST /coaching`.

Scenario selection is controlled in each frontend by:
- `SCENARIO_OVERRIDE` if set
- otherwise the `scenarioId` query parameter
- otherwise the frontend default scenario id

## Quick start

1. Deploy `Lambda.js` behind an HTTP endpoint.
2. Set the required Lambda environment variables.
3. Update `SESSION_BASE` in both frontend HTML files.
4. Optionally set `SCENARIO_OVERRIDE` in either frontend.
5. Open or embed the frontend HTML files in Articulate Rise.

For a new scenario:
1. Use the GPT prompt in `gpt-scenario-generation-prompt.md` with the Customer Simulator Scenario Builder.
2. Paste the generated scenario JSON into `SCENARIOS` in `Lambda.js`.
3. Point the frontend to that scenario with `SCENARIO_OVERRIDE` or `?scenarioId=...`.

## AWS setup

Required Lambda environment variables:

- `OPENAI_API_KEY`
- `COACHING_TABLE`
- `INGEST_TOKEN`
- `AWS_REGION`

Required API routes:

- `GET /scenario`
- `GET /scenarios`
- `POST /chat-turn`
- `POST /evaluate`
- `POST /coaching`
- `POST /session`

Practical notes:

- `GET /scenario` is what the frontends use to load scenario-specific guidance and configuration.
- `GET /scenarios` is useful for listing available scenarios and voice discovery flows.
- `POST /coaching` writes to DynamoDB using `COACHING_TABLE`.
- Make sure CORS is configured for the domain or LMS origin that will host the HTML files.

## Frontend setup

Key frontend files:

- `ArticulateRise-ChatExperience.html`
- `ArticulateRise-VoiceExperience.html`

For most deployments, the only frontend values you need to change are:

- `SESSION_BASE`
- `SCENARIO_OVERRIDE`

How scenario selection works:

- Leave `SCENARIO_OVERRIDE` blank to use the URL parameter or default scenario.
- Use `?scenarioId=your_scenario_id` when you want the host page to control the scenario.
- Set `SCENARIO_OVERRIDE` when you want a frontend locked to one scenario.

## Creating a new scenario

Use these files:

- `scenario-template.json`
- `scenario-authoring-guide.md`
- `gpt-scenario-generation-prompt.md`

Recommended workflow:

1. Start with the GPT "Customer Simulator Scenario Builder".
2. Have it generate runtime-valid scenario JSON using the current contract.
3. Review the output against `scenario-authoring-guide.md`.
4. Paste the final scenario object into `SCENARIOS` in `Lambda.js`.
5. Test the scenario in chat and/or voice depending on the channels you enabled.

Important:

- `Lambda.js` is the backend source of truth for scenarios.
- Do not create new scenarios only in the frontend.
- The frontend should consume scenario data from `/scenario`, not hardcoded scenario copy whenever backend config is available.

## Architecture overview

Key files:

- `Lambda.js`
  Backend routes, scenario definitions, prompt construction, evaluation, and coaching persistence.
- `ArticulateRise-ChatExperience.html`
  Standalone chat experience for Rise or browser embedding.
- `ArticulateRise-VoiceExperience.html`
  Standalone voice experience using Realtime session creation.
- `scenario-template.json`
  Starter template for new scenarios.
- `scenario-authoring-guide.md`
  Field-by-field scenario authoring guide.
- `gpt-scenario-generation-prompt.md`
  Prompt for the GPT-based scenario builder.

High-level flow:

1. Frontend resolves the active scenario id.
2. Frontend requests scenario config from `GET /scenario`.
3. Learner completes chat or voice interaction.
4. Backend evaluates the transcript with `POST /evaluate`.
5. Frontend optionally saves the coaching record with `POST /coaching`.

## Notes / important behaviors

- Chat and voice are separate experiences and can point to different scenarios.
- Cleaned scenarios in `Lambda.js` use the current runtime contract. Older scenarios may still be using compatibility paths until they are refactored.
- Generated scenario JSON should be pasted directly into `SCENARIOS` in `Lambda.js`.
- `simulation.stateModel.chatStepProgression` is the source of truth for chat progression in cleaned scenarios.
- Because prompt behavior lives in scenario data and backend logic, small wording changes can change learner experience.
- There is no full automated test suite here yet, so test changes end to end after updating scenarios, prompts, or frontend config.
