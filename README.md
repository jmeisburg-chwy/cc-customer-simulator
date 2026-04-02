# Customer Simulator

This project is a lightweight customer-service training simulator built around one AWS Lambda backend and two standalone browser frontends.

- The backend defines training scenarios, generates AI customer responses, evaluates completed conversations, and stores coaching results.
- The chat frontend provides a typed roleplay experience.
- The voice frontend provides a live call experience using OpenAI Realtime over WebRTC.

## Project Structure

- `Lambda.js`: Main backend entry point. Contains scenario definitions, prompt construction, API integrations, evaluation logic, and coaching persistence.
- `ArticulateRise-ChatExperience.html`: Standalone chat simulator UI.
- `ArticulateRise-VoiceExperience.html`: Standalone voice simulator UI.
- `README.md`: Developer overview and setup notes.
- `test`: Placeholder file. There is not currently a real automated test suite in this repo.

## How The System Works

At a high level, the HTML frontends call the Lambda backend through an API Gateway-style base URL. The Lambda is the source of truth for scenario content and AI behavior.

### Backend Responsibilities

`Lambda.js` exposes several HTTP-style routes through `exports.handler`:

- `GET /scenarios`
  Returns the list of available scenarios.
- `POST /session`
  Creates an ephemeral OpenAI Realtime session for the voice experience.
- `POST /chat-turn`
  Generates the next customer message for the chat experience.
- `POST /evaluate`
  Reviews the final transcript and returns structured coaching feedback.
- `POST /coaching`
  Saves coaching results to DynamoDB.

### Frontend Responsibilities

The two HTML files are self-contained UIs with embedded CSS and JavaScript:

- `ArticulateRise-ChatExperience.html`
  Sends agent messages to `/chat-turn`, displays customer replies, requests final coaching from `/evaluate`, and optionally saves results to `/coaching`.
- `ArticulateRise-VoiceExperience.html`
  Loads available scenarios from `/scenarios`, requests a voice session from `/session`, connects to OpenAI Realtime, collects transcript turns, requests coaching from `/evaluate`, and saves results to `/coaching`.

## Interaction Flow

### Chat Experience

1. The learner opens `ArticulateRise-ChatExperience.html`.
2. The page uses a configured scenario ID and API base URL.
3. Each learner message is sent to `POST /chat-turn`.
4. The backend uses the scenario instructions in `Lambda.js` to generate the next customer reply.
5. When the learner ends the chat, the page sends the transcript to `POST /evaluate`.
6. The page optionally sends the coaching payload to `POST /coaching`.

### Voice Experience

1. The learner opens `ArticulateRise-VoiceExperience.html`.
2. The page loads scenarios from `GET /scenarios`.
3. The page requests an ephemeral OpenAI session from `POST /session`.
4. The browser creates a WebRTC connection directly to OpenAI Realtime using the returned client secret.
5. When the call ends, the page sends the transcript to `POST /evaluate`.
6. The page optionally sends the coaching payload to `POST /coaching`.

## Scenarios

All scenarios currently live inside `Lambda.js` in the `SCENARIOS` object. Each scenario includes:

- a stable `id`
- a learner-facing `label` and `title`
- an `about` description
- a `conversationBetween` section that shapes the AI customer's role and opening line
- a `facts` section that constrains what the AI customer can say
- a `qualityChecklist` and `evaluationCriteria` used for coaching

If you add or rename a scenario in `Lambda.js`, make sure the frontend `DEFAULT_SCENARIO_ID` values still match a real scenario ID.

## Configuration

The backend depends on environment variables:

- `OPENAI_API_KEY`: Required for chat, realtime session creation, and evaluation
- `COACHING_TABLE`: DynamoDB table name for saved coaching records
- `INGEST_TOKEN`: Optional shared token required by `POST /coaching`
- `AWS_REGION` or `AWS_DEFAULT_REGION`: AWS region for DynamoDB writes

The frontends currently contain hardcoded API URLs and default scenario IDs. Before using them in a new environment, update:

- the `SESSION_BASE` constant in both HTML files
- the `DEFAULT_SCENARIO_ID` constant in each experience
- any storage key or scenario label constants tied to that scenario

## Running The Project

There is no local app server or package-based setup in this repository right now. Running the project is mostly a matter of deploying the backend and opening the HTML files in a browser or LMS container.

### High-Level Setup

1. Deploy `Lambda.js` as an AWS Lambda function behind an HTTP endpoint.
2. Configure the required environment variables in Lambda.
3. Ensure CORS is enabled for the frontend origin.
4. Update the HTML files to point at the correct backend base URL.
5. Open the HTML files directly in a browser, host them on a static site, or embed them in Articulate Rise or another LMS flow.

## Testing

There is not currently an automated test suite in this repo.

### Current Practical Testing Approach

- Verify `GET /scenarios` returns the expected scenario IDs.
- For chat:
  Open `ArticulateRise-ChatExperience.html`, complete a sample conversation, and confirm:
  - customer replies are generated
  - coaching renders at the end
  - coaching save works if configured
- For voice:
  Open `ArticulateRise-VoiceExperience.html`, allow microphone access, complete a short call, and confirm:
  - session creation works
  - audio connects
  - transcript-based coaching appears after ending the call
  - coaching save works if configured
- For backend changes:
  manually test any route whose payload shape or scenario behavior changed

## Notes For Future Changes

- `Lambda.js` is the main source of truth. Start there before changing frontend behavior.
- Scenario IDs must stay in sync between the backend and the HTML files.
- Because prompt content and evaluation rules live in code, even small wording changes can affect behavior.
- The repo currently relies heavily on manual validation, so changes should be tested end-to-end.
