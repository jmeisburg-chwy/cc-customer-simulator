# Scenario Authoring Guide

This guide defines the scenario object used by the current Customer Simulator platform. Author scenarios to this shape so chat and voice frontends can render display content, use chat progression rules, and submit coaching results consistently.

## Required Fields

These fields should always be present:

- `version`
- `id`
- `label`
- `title`
- `channels`
- `customer.persona.name`
- `customer.persona.tone`
- `customer.persona.goal`
- `customer.opening`
- `frontend.shared.introInstructions`
- `coaching.qualityChecklist`

Required when `channels` includes `chat`:

- `frontend.chat.guideTitle`
- `frontend.chat.hotkeyProfile`
- `frontend.chat.guideSections`
- `frontend.chat.initialTranscript`
- `simulation.stateModel.chatStepProgression`

Required when `channels` includes `voice`:

- `frontend.voice.guideTopNote`
- `frontend.voice.guideSections`
- `frontend.voice.endNote`

## Optional Fields

- `customer.facts`
- `frontend.chat.customerDisplayName`
- `frontend.voice.customerDisplayName`
- `coaching.summaryGuidance`

These fields are optional for the schema, but they are strongly recommended because they improve frontend display quality and evaluation clarity.

## Shared Fields

- `version`: Schema version for authoring compatibility. Use a simple string such as `"1.0"`.
- `id`: Stable scenario slug. Use lowercase letters, numbers, and underscores only.
- `label`: Human-readable scenario name used in reporting and selection.
- `title`: Full scenario title.
- `channels`: Array containing `"chat"`, `"voice"`, or both.
- `customer.persona.name`: Primary customer name.
- `customer.persona.tone`: Short description of how the customer should sound or behave.
- `customer.persona.goal`: What the customer wants resolved.
- `customer.opening.chat`: Initial chat opening line.
- `customer.opening.voice`: Initial voice opening line.
- `customer.facts`: Supporting details the scenario may rely on.
- `frontend.shared.introInstructions`: Intro instructions shown before the experience.

## Chat-Only Fields

- `frontend.chat.guideTitle`: Title for the right-side guidance panel.
- `frontend.chat.customerDisplayName`: Name shown in chat metadata. If omitted, the platform can fall back to customer name fields.
- `frontend.chat.hotkeyProfile`: Use `"core"` or `"rx"`.
- `frontend.chat.guideSections`: Guidance sections shown to the learner.
- `frontend.chat.initialTranscript`: Initial chat turn list. The first customer turn should currently use `role: "assistant"` because of the current frontend rendering logic.
- `simulation.stateModel.chatStepProgression`: Keyword-based rules used by the current chat simulator to decide whether the learner has progressed.

## Voice-Only Fields

- `frontend.voice.guideTopNote`: Short note above the voice guide.
- `frontend.voice.customerDisplayName`: Optional display name for voice-oriented metadata or future display usage.
- `frontend.voice.guideSections`: Voice guide sections shown during the call.
- `frontend.voice.endNote`: Short note near the end of the experience.

## Coaching Fields

- `coaching.qualityChecklist`: Categories and behaviors the evaluator should assess.
- `coaching.summaryGuidance`: Optional guidance for how the summary should be written.

## Validation Rules

- Keep the file valid JSON. No comments or trailing commas.
- `id` must be stable and slug-like.
- `channels` must contain only `"chat"` and/or `"voice"`.
- Every string array should contain non-empty strings only.
- `frontend.chat.hotkeyProfile` must be `"core"` or `"rx"`.
- `frontend.chat.initialTranscript[*].content` must be non-empty.
- `frontend.chat.initialTranscript[*].role` should currently be `"assistant"` for customer opening turns.
- `simulation.stateModel.chatStepProgression[*].match.all` and `.match.any` currently support only:
  - `op: "contains_any"`
  - `phrases: string[]`
- `coaching.qualityChecklist[*].behaviors` should be observable behaviors, not broad themes.

## Practical Authoring Tips

- Write `customer.persona.goal` as the resolution target, not the emotional state.
- Keep guide bullets coachable and behavior-specific. Good bullets describe what the learner should say or do.
- Keep chat progression rules broad enough to recognize natural phrasing. Include synonyms in `phrases`.
- Use `customer.facts` for details authors need to track, but avoid adding extra top-level fields outside the contract.
- If a scenario is chat-only, still include `customer.opening.voice` as a placeholder only if your workflow requires it. Otherwise, omit the unused channel block.
- For voice scenarios, write guide copy that supports a spoken flow rather than copy-paste text behavior.
- For coaching behaviors, prefer concise, binary-observable phrasing such as `"Asked a clarifying question"` over vague phrasing like `"Demonstrated excellence"`.
