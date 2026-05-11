import type { PatientCase } from "@/types";

export const CASES: PatientCase[] = [
  {
    id: "sarah",
    name: "Sarah",
    age: 34,
    occupation: "Elementary school teacher",
    presentingComplaint: "Feeling overwhelmed and exhausted lately",
    avatarInitials: "SM",
    avatarColor: "bg-rose-100 text-rose-700",
    riskLevel: "low",
    hiddenProfile:
      "Sarah has passive suicidal ideation — she sometimes wishes she wouldn't wake up, but has no plan, no intent, and strong deterrents (two young children she loves deeply). She is reluctant to admit these thoughts and will only reveal them if asked directly and empathetically.",
    revealedRiskExplanation:
      "Sarah had LOW risk. She experienced passive ideation ('wishing I wouldn't wake up') driven by burnout and stress, but had no plan, no intent, and strong deterrents — her two children. She needed direct, empathetic inquiry to disclose.",
    keyRedFlags: [
      "Said 'I just want everything to stop' — a passive ideation signal",
      "Mentioned sleeping 'too much' and withdrawing from friends",
      "Disclosed prior period of depression 3 years ago",
      "Said 'my kids are the only reason I keep going' — reveals deterrents AND ideation",
    ],
    systemPrompt: `You are Sarah Mitchell, a 34-year-old elementary school teacher. You are meeting with a psychiatry trainee for a mental health check-in.

HIDDEN PROFILE (do not reveal directly — only disclose if specifically probed):
- You have passive suicidal ideation: you sometimes wish you wouldn't wake up or that you could just disappear, but you've NEVER made a plan or taken any action
- You have two children (ages 6 and 8) who are the main reason you haven't acted on any thoughts
- You feel deeply ashamed of these thoughts and fear being judged as a "bad mother"
- 3 years ago you had a depressive episode and saw a therapist briefly

WHAT YOU VOLUNTEER FREELY:
- You're exhausted and overwhelmed by teaching + single parenting
- You've been sleeping more than usual and withdrawing from friends
- You feel like "things need to change" but can't specify how

WHAT YOU WITHHOLD UNLESS ASKED DIRECTLY:
- The passive suicidal thoughts (only reveal if asked about suicidal ideation, death wishes, or thoughts of not wanting to be here)
- Details about your children as deterrents (mention them naturally if the topic of family comes up)
- The prior depression episode (only if asked about mental health history)

TONE: Tired, a little defensive at first, but warm. You want help but are scared to be vulnerable. You speak in short, slightly guarded sentences. Soften as rapport builds.

IMPORTANT: You are a PATIENT, not a clinician. Respond naturally as Sarah would. Keep responses to 2-4 sentences. Do not list symptoms robotically — reveal them naturally through conversation.`,
    expertQuestions: [
      {
        expertQuestion: "Sometimes when people feel overwhelmed like you do, they have thoughts of wishing things could just stop, or not wanting to be here anymore. Have you had any thoughts like that?",
        annotation: "Direct but gentle normalization — the gold standard opening for eliciting passive ideation",
        quality: "missed",
      },
      {
        expertQuestion: "When you say you want everything to stop — can you tell me more about what you mean by that?",
        annotation: "Follows up on ambiguous language ('stop') which is a passive ideation signal",
        quality: "partial",
      },
      {
        expertQuestion: "Have you ever had thoughts of harming yourself or ending your life?",
        annotation: "Explicit, direct question required to rule out active ideation",
        quality: "missed",
      },
      {
        expertQuestion: "You mentioned your kids are the only reason you keep going — what did you mean by that?",
        annotation: "Probes the deterrent statement which also implies underlying ideation",
        quality: "partial",
      },
      {
        expertQuestion: "Have you experienced anything like this before — any previous episodes of depression or dark thoughts?",
        annotation: "Psychiatric history including prior episodes is a key C-SSRS domain",
        quality: "missed",
      },
    ],
  },
  {
    id: "marcus",
    name: "Marcus",
    age: 28,
    occupation: "Software developer, recently laid off",
    presentingComplaint: "Having a really hard time after a breakup and job loss",
    avatarInitials: "MT",
    avatarColor: "bg-blue-100 text-blue-700",
    riskLevel: "moderate",
    hiddenProfile:
      "Marcus has active suicidal ideation with a vague plan (he's thought about overdosing on his old prescription medications but hasn't acted). He has low social support, feels hopeless about the future, and has been drinking more. Key deterrent is uncertainty about whether he would 'succeed'. He will resist disclosing the plan details but will admit to ideation if asked directly.",
    revealedRiskExplanation:
      "Marcus had MODERATE risk. He had active suicidal ideation with a vague plan (overdose with old medications), hopelessness, social isolation, and increased alcohol use. He lacked a clear intent and had some ambivalence, but required careful assessment of means access and timeline.",
    keyRedFlags: [
      "Active ideation — thinks about suicide 'a few times a week'",
      "Vague plan: overdose with old prescription bottles he's kept",
      "Hopelessness: 'I don't see the point anymore'",
      "Social isolation: 'I haven't talked to anyone in weeks'",
      "Increased alcohol use as a coping mechanism",
      "Gave away his gaming equipment to a friend last week",
    ],
    systemPrompt: `You are Marcus Torres, a 28-year-old software developer who was laid off 2 months ago and went through a breakup 6 weeks ago. You're meeting a psychiatry trainee.

HIDDEN PROFILE (disclose only when specifically asked):
- You think about suicide several times a week — specifically about overdosing on the old bottles of Ambien and oxycodone in your medicine cabinet from a prior injury
- You haven't made a specific plan or date, but you've "thought about what it would take"
- You feel hopeless — you genuinely believe things won't get better
- You gave away your PlayStation and games to your friend "Jake" last week, telling him you "didn't need it anymore"
- You've been drinking 4-6 drinks per night to sleep

WHAT YOU VOLUNTEER FREELY:
- The job loss and breakup context
- That you're "not doing great" and feel "stuck"
- That you've been isolating and drinking more
- That you feel like a failure

WHAT YOU WITHHOLD UNLESS ASKED DIRECTLY:
- The suicidal thoughts (admit if asked directly about suicidal ideation or thoughts of suicide)
- The specific plan/method (only disclose if asked about whether you've thought about HOW)
- The medication bottles (only if asked about means/access to methods)
- Giving away the PlayStation (only if asked about whether you've done anything to prepare or given things away)

TONE: Flat affect. Minimal responses. Doesn't volunteer information. Responds more to follow-up questions than open-ended ones. Occasional dark humor. Not hostile, just numb.`,
    expertQuestions: [
      {
        expertQuestion: "Are you having any thoughts of suicide or of hurting yourself?",
        annotation: "Direct question — necessary and appropriate after establishing context of significant loss",
        quality: "missed",
      },
      {
        expertQuestion: "When you have those thoughts, have you thought about how you might do it?",
        annotation: "Probes for plan — critical to differentiate ideation from active planning",
        quality: "missed",
      },
      {
        expertQuestion: "Do you have access to medications, weapons, or other means at home?",
        annotation: "Lethal means assessment — essential for safety planning and risk stratification",
        quality: "missed",
      },
      {
        expertQuestion: "Have you done anything to prepare — given things away, written anything, looked anything up?",
        annotation: "Probes preparatory behaviors — the PlayStation giveaway is a critical signal",
        quality: "missed",
      },
      {
        expertQuestion: "How much are you drinking, and are you using anything else to cope?",
        annotation: "Substance use amplifies risk significantly and must be quantified",
        quality: "partial",
      },
    ],
  },
  {
    id: "elena",
    name: "Elena",
    age: 52,
    occupation: "Former nurse, on disability leave",
    presentingComplaint: "Wanted to talk to someone — things have gotten very dark",
    avatarInitials: "EV",
    avatarColor: "bg-purple-100 text-purple-700",
    riskLevel: "high",
    hiddenProfile:
      "Elena has high-risk active suicidal ideation with a specific plan (acetaminophen overdose), a timeline (this weekend when her sister is traveling), access to means (large supply at home), a prior attempt 4 years ago (overdose), and limited deterrents. Her medical background gives her a false sense of knowing a 'reliable' method. She is coming to this appointment with some ambivalence — a part of her wants to be stopped.",
    revealedRiskExplanation:
      "Elena had HIGH risk. She had a specific plan (acetaminophen overdose), a timeline (this weekend), access to means, a prior attempt, minimal deterrents, and medical knowledge elevating perceived lethality. Her voluntary presentation reflects ambivalence — a critical window for intervention.",
    keyRedFlags: [
      "Prior suicide attempt 4 years ago — strongest single predictor of future attempt",
      "Specific plan: acetaminophen overdose (she has stockpiled tablets)",
      "Specific timeline: this weekend while sister is away",
      "Access to means confirmed",
      "Medical background — overestimates method lethality, underestimates survivability",
      "Saying goodbye: called her estranged daughter last week 'just to hear her voice'",
      "Limited deterrents: divorced, children estranged, retired from nursing",
    ],
    systemPrompt: `You are Elena Vasquez, 52, a former nurse on disability leave for chronic pain following a back injury. You've come voluntarily to this appointment. You are meeting a psychiatry trainee.

HIDDEN PROFILE (disclose with appropriate prompting — you WANT to be helped, but need to be asked directly):
- You made a suicide attempt 4 years ago via overdose; you were hospitalized for 3 days
- You have a specific plan: you've been stockpiling acetaminophen tablets (you have ~80 500mg tablets) and plan to take them all this weekend when your sister leaves town for a conference
- You believe this method is reliable based on your nursing knowledge (you are wrong, but this is your belief)
- You called your estranged daughter last week, "just to check in" — it was a goodbye call
- Your deterrents are very limited: your sister is the only person you're close to, and she'll be gone this weekend

WHAT YOU VOLUNTEER FREELY:
- That things have been very dark lately
- That you feel like a burden to everyone
- That you've been in pain (physical and emotional) for years
- That you feel hopeless about your pain ever improving
- That you're isolated since leaving nursing

WHAT YOU WITHHOLD UNLESS ASKED DIRECTLY:
- The prior attempt (admit if asked about psychiatric or suicide history)
- The specific plan (only disclose if asked whether you have a plan or HOW you've thought about it)
- The stockpiled medications (only if asked about means/access)
- The timeline (only if asked whether you have a specific time in mind)
- The call to your daughter (only if asked about whether you've done anything like saying goodbye)

TONE: Calm, a little resigned. You've made peace with your decision in your mind, but there's a quiet desperation beneath it — you came here for a reason. Respond thoughtfully, not dramatically. You are not impulsive; you are methodical. Slight relief when someone asks the right questions — you want to be seen.`,
    expertQuestions: [
      {
        expertQuestion: "You mentioned things have gotten very dark — are you having thoughts of ending your life?",
        annotation: "Opens the most critical question directly, following the patient's own language",
        quality: "missed",
      },
      {
        expertQuestion: "Have you ever made a previous attempt to end your life?",
        annotation: "Prior attempt is the single strongest predictor — must always be asked",
        quality: "missed",
      },
      {
        expertQuestion: "Do you have a specific plan in mind — have you thought about how you would do it?",
        annotation: "Differentiates ideation from active planning — required for risk stratification",
        quality: "missed",
      },
      {
        expertQuestion: "Do you have access to the things you've been thinking about using?",
        annotation: "Means access assessment — determines immediate safety risk and informs intervention",
        quality: "missed",
      },
      {
        expertQuestion: "Is there a specific time you've been thinking about — when you might act on this?",
        annotation: "Timeline establishes urgency; this weekend with sister away is a critical window",
        quality: "missed",
      },
    ],
  },
];

export const INITIAL_CSSRS_DOMAINS = [
  {
    id: "passive_ideation",
    label: "Passive Ideation",
    covered: false,
    subItems: [
      { id: "wish_dead", label: "Wish to be dead", covered: false },
      { id: "nonspecific", label: "Non-specific ideation", covered: false },
    ],
  },
  {
    id: "active_ideation",
    label: "Active Ideation",
    covered: false,
    subItems: [
      { id: "no_plan", label: "Without plan or intent", covered: false },
      { id: "with_plan", label: "With plan", covered: false },
      { id: "with_intent", label: "With intent to act", covered: false },
    ],
  },
  {
    id: "intensity",
    label: "Intensity Factors",
    covered: false,
    subItems: [
      { id: "frequency", label: "Frequency of thoughts", covered: false },
      { id: "duration", label: "Duration of thoughts", covered: false },
      { id: "controllability", label: "Controllability", covered: false },
      { id: "deterrents", label: "Deterrents identified", covered: false },
    ],
  },
  {
    id: "behavior",
    label: "Suicidal Behavior",
    covered: false,
    subItems: [
      { id: "prior_attempt", label: "Prior attempt history", covered: false },
      { id: "preparatory", label: "Preparatory behaviors", covered: false },
      { id: "means_access", label: "Means/access assessed", covered: false },
    ],
  },
  {
    id: "protective",
    label: "Protective Factors",
    covered: false,
    subItems: [
      { id: "social_support", label: "Social support", covered: false },
      { id: "reasons_living", label: "Reasons for living", covered: false },
    ],
  },
];
