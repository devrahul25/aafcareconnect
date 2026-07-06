// Course data for the interactive AAF CareConnect™ Course Player
// Course: Safeguarding Children — Level 2
// Each lesson defines an ordered `content` array of blocks rendered by LessonContent.
// Block types: rich_text | image | video | key_points | knowledge_check | scenario | pdf | resource
export const COURSE = {
  id: "sg-2",
  title: "Safeguarding Children — Level 2",
  subtitle: "Intermediate safeguarding training for UK foster carers",
  category: "Safeguarding",
  level: "Intermediate",
  cpd_hours: 3,
  pass_mark: 80,
  number_of_questions: 10,
  modules: [
    // ── Module 1 : Introduction ───────────────────────────────────────────
    {
      id: "m1",
      title: "Introduction",
      lessons: [
        {
          id: "1-1",
          title: "Welcome & Course Overview",
          type: "video",
          duration: "5 min",
          content: [
            {
              type: "rich_text",
              text: "Welcome to Safeguarding Children Level 2. Over the next modules we'll cover your responsibilities as a foster carer under UK law — the types of abuse, recognising signs, recording concerns accurately, and the correct reporting and escalation routes. By the end you'll complete a 10-question assessment and earn a certificate worth 3 CPD hours.",
            },
            {
              type: "image",
              url: "https://placehold.co/800x420/1e293b/60a5fa?text=Course+Overview",
              caption: "Course roadmap — six modules from introduction to final assessment",
            },
            {
              type: "knowledge_check",
              question: {
                q: "Whose responsibility is safeguarding?",
                options: [
                  "Only the registered manager",
                  "Everyone who works with or cares for children",
                  "Only social workers",
                  "Only the child's school",
                ],
                correct: 1,
                explanation:
                  "Safeguarding is everyone's responsibility — foster carers are often closest to the child and best placed to notice concerns early.",
              },
            },
            {
              type: "video",
              title: "Welcome & Course Overview",
              transcript:
                "Welcome to Safeguarding Children Level 2. I'm your AI trainer, and over the next modules we'll cover your responsibilities as a foster carer under UK law. We'll explore types of abuse, recognising signs, recording concerns accurately, and the correct reporting routes. By the end you'll complete a 10-question assessment and earn a certificate worth 3 CPD hours.",
            },
            {
              type: "key_points",
              points: [
                "Why safeguarding is everyone's responsibility",
                "The 4 R's: Recognise, Respond, Record, Report",
                "Legal framework: Children Act 1989 & 2004",
                "How this course is structured and assessed",
              ],
            },
            {
              type: "knowledge_check",
              question: {
                q: "Which framework underpins UK safeguarding practice for foster carers?",
                options: ["Children Act 1989 & 2004", "Health and Safety Act 1974", "Data Protection Act only", "Housing Act 1996"],
                correct: 0,
                explanation:
                  "The Children Act 1989 (and 2004 amendments) is the statutory foundation for safeguarding and promoting the welfare of children in the UK.",
              },
            },
          ],
        },
        {
          id: "1-2",
          title: "What is Safeguarding?",
          type: "video",
          duration: "8 min",
          content: [
            {
              type: "rich_text",
              text: "Safeguarding means protecting a child's right to live in safety, free from abuse and neglect. It's broader than child protection — it includes prevention, early help, and promoting welfare. As a foster carer you are a critical part of the safeguarding system, often closest to the child.",
            },
            {
              type: "image",
              url: "https://placehold.co/800x420/1e293b/60a5fa?text=What+is+Safeguarding",
              caption: "Safeguarding spans prevention, early help and child protection",
            },
            {
              type: "video",
              title: "What is Safeguarding?",
              transcript:
                "Safeguarding means protecting a child's right to live in safety, free from abuse and neglect. It's broader than child protection — it includes prevention, early help, and promoting welfare. As a foster carer you are a critical part of the safeguarding system, often closest to the child.",
            },
            {
              type: "key_points",
              points: [
                "Definition: protecting children from abuse and maltreatment",
                "Preventing impairment of health and development",
                "Ensuring children grow up in safe, effective care",
                "Taking action to enable best outcomes",
              ],
            },
            {
              type: "knowledge_check",
              question: {
                q: "Safeguarding is broader than child protection because it also includes…",
                options: [
                  "Only responding after harm happens",
                  "Prevention, early help and promoting welfare",
                  "Criminal prosecution",
                  "Adult social care only",
                ],
                correct: 1,
                explanation:
                  "Safeguarding spans prevention, early identification, and promotion of welfare — not just reactive child protection.",
              },
            },
          ],
        },
      ],
    },

    // ── Module 2 : Types of Abuse ─────────────────────────────────────────
    {
      id: "m2",
      title: "Types of Abuse",
      lessons: [
        {
          id: "2-1",
          title: "The Four Categories of Abuse",
          type: "video",
          duration: "9 min",
          content: [
            {
              type: "rich_text",
              text: "UK guidance recognises four main categories of abuse: physical, emotional, sexual and neglect. As a foster carer you must understand each type — children may experience more than one simultaneously. Signs are rarely conclusive alone; look for patterns and changes, and always record factually.",
            },
            {
              type: "image",
              url: "https://placehold.co/800x420/1e293b/60a5fa?text=Types+of+Abuse",
              caption: "Physical · Emotional · Sexual · Neglect",
            },
            {
              type: "knowledge_check",
              question: {
                q: "Which of the following is NOT one of the four recognised categories of abuse?",
                options: ["Physical abuse", "Neglect", "Financial abuse", "Emotional abuse"],
                correct: 2,
                explanation:
                  "The four categories are physical, emotional, sexual abuse and neglect. Financial abuse is not a statutory category of child abuse.",
              },
            },
            {
              type: "video",
              title: "The Four Categories of Abuse",
              transcript:
                "Working Together to Safeguard Children recognises four main categories of abuse: physical, emotional, sexual and neglect. As a foster carer you must understand each type — children may experience more than one simultaneously. Signs are rarely conclusive alone; look for patterns and changes, and always record factually.",
            },
            {
              type: "key_points",
              points: [
                "Physical abuse: hitting, shaking, burning, poisoning",
                "Emotional abuse: persistent belittling, intimidation, rejection",
                "Sexual abuse: involvement in or exposure to sexual activity",
                "Neglect: persistent failure to meet basic physical/psychological needs",
              ],
            },
            {
              type: "knowledge_check",
              question: {
                q: "Which of the following is an example of emotional abuse?",
                options: [
                  "A child falling over while playing",
                  "Persistent humiliation and making a child feel worthless",
                  "A child losing their appetite during an illness",
                  "A child missing a hospital appointment once",
                ],
                correct: 1,
                explanation:
                  "Emotional abuse is the persistent emotional ill-treatment of a child causing severe adverse effects — such as making a child feel worthless or frightened.",
              },
            },
          ],
        },
        {
          id: "2-2",
          title: "Recognising Neglect",
          type: "video",
          duration: "7 min",
          content: [
            {
              type: "rich_text",
              text: "Neglect is the persistent failure to meet a child's basic needs. Watch for inadequate supervision, persistent hunger, untreated medical needs, poor hygiene, or being late or absent from school. Neglect is the most common category of abuse identified in the UK and can seriously harm development.",
            },
            {
              type: "image",
              url: "https://placehold.co/800x420/1e293b/60a5fa?text=Recognising+Neglect",
              caption: "Neglect is often cumulative and chronic",
            },
            {
              type: "video",
              title: "Recognising Neglect",
              transcript:
                "Neglect is the persistent failure to meet a child's basic needs. Watch for inadequate supervision, persistent hunger, untreated medical needs, poor hygiene, or being late or absent from school. Neglect is the most common category of abuse identified in the UK and can seriously harm development.",
            },
            {
              type: "key_points",
              points: [
                "Neglect is the most common form of abuse in the UK",
                "Look for inadequate food, clothing, hygiene, supervision or medical care",
                "Failure to access education is a safeguarding concern",
                "Neglect can be cumulative and chronic, not always a single event",
              ],
            },
            {
              type: "knowledge_check",
              question: {
                q: "A child repeatedly arrives at school hungry, unwashed and without lunch. This most likely indicates…",
                options: [
                  "A one-off forgetful morning",
                  "Possible neglect — a pattern requiring recording and reporting",
                  "A dietary preference of the family",
                  "Normal behaviour for that age group",
                ],
                correct: 1,
                explanation:
                  "Persistent failure to meet basic needs is a hallmark of neglect. Record the pattern factually and report through your SSW/DSL.",
              },
            },
            {
              type: "rich_text",
              text: "Neglect is rarely a single act — it is a pattern of omissions across different domains. Familiarise yourself with the five main dimensions: physical (adequate food, clothing, warmth, safe housing), medical (seeking treatment or giving prescribed medication), educational (persistent absence, lateness or failure to access schooling), emotional (warmth, stimulation and affection), and supervisory (leaving a child in situations beyond their maturity or exposing them to harm).",
            },
            {
              type: "image",
              url: "https://placehold.co/800x420/1e293b/60a5fa?text=Five+Dimensions+of+Neglect",
              caption: "Physical · Medical · Educational · Emotional · Supervisory",
            },
            {
              type: "key_points",
              points: [
                "Physical neglect: lack of adequate food, clothing, warmth or safe housing",
                "Medical neglect: health, dental and prescribed medication needs left untreated",
                "Educational neglect: persistent absence, lateness or failure to access schooling",
                "Emotional neglect: absence of affection, responsiveness and emotional security",
                "Supervisory neglect: leaving children unsupervised in unsafe or age-inappropriate situations",
              ],
            },
            {
              type: "scenario",
              title: "Recognising neglect in placement",
              scenario: {
                prompt:
                  "A child you care for has missed three medical appointments in two months and tells you 'no one takes me to the doctor.' Contact staff say the child was last seen dirty and without their prescribed asthma inhaler. What is the most appropriate first action?",
                responses: [
                  {
                    text: "Wait to see if the pattern continues another month before acting.",
                    feedback:
                      "Not appropriate. Neglect is cumulative — a clear pattern is already evident. Delay risks the child's health deteriorating. Record and escalate now.",
                    correct: false,
                  },
                  {
                    text: "Record each concern factually, escalate to your Supervising Social Worker / DSL the same day, and ensure the child's immediate medication and health needs are met.",
                    feedback:
                      "Correct. With repeated missed appointments, untreated asthma and poor hygiene, you have a clear pattern of medical and physical neglect. Record factually, escalate promptly and prioritise the child's immediate health.",
                    correct: true,
                  },
                  {
                    text: "Directly confront the birth family about failing the child.",
                    feedback:
                      "Not appropriate. Confronting family is not the carer's role and can place the child at greater risk. Escalate through your SSW/DSL rather than investigating personally.",
                    correct: false,
                  },
                  {
                    text: "Assume the missed appointments were a simple administrative error and do nothing.",
                    feedback:
                      "Not appropriate. Persistent missed appointments plus a child's own disclosure strongly indicate neglect. Never assume — record and report through your SSW/DSL.",
                    correct: false,
                  },
                ],
              },
            },
            {
              type: "knowledge_check",
              question: {
                q: "A parent repeatedly fails to collect a child's prescribed medication for an ongoing condition. This is best described as…",
                options: ["Supervisory neglect", "Medical neglect", "Emotional neglect", "Educational neglect"],
                correct: 1,
                explanation:
                  "Failure to meet a child's medical and treatment needs is medical neglect — record factually and escalate to your SSW/DSL.",
              },
            },
          ],
        },
      ],
    },

    // ── Module 3 : Recognising Signs ───────────────────────────────────────
    {
      id: "m3",
      title: "Recognising Signs",
      lessons: [
        {
          id: "3-1",
          title: "Physical & Behavioural Indicators",
          type: "video",
          duration: "10 min",
          content: [
            {
              type: "rich_text",
              text: "Recognising abuse relies on observing patterns over time. Look for unexplained or inconsistent injuries, sudden changes in behaviour, fear of going home, or sexualised behaviour inappropriate for age. No single sign confirms abuse — trust your concerns, record factually, and report.",
            },
            {
              type: "image",
              url: "https://placehold.co/800x420/1e293b/60a5fa?text=Recognising+Signs",
              caption: "Observe patterns over time — never assume from a single sign",
            },
            {
              type: "video",
              title: "Physical & Behavioural Indicators",
              transcript:
                "Recognising abuse relies on observing patterns over time. Look for unexplained or inconsistent injuries, sudden changes in behaviour, fear of going home, or sexualised behaviour inappropriate for age. No single sign confirms abuse — trust your concerns, record factually, and report.",
            },
            {
              type: "key_points",
              points: [
                "Physical signs: unexplained bruises, marks, changes in appearance",
                "Behavioural signs: withdrawal, aggression, regression, sexualised behaviour",
                "Context matters — never assume a single sign confirms abuse",
                "Maintain a factual, non-judgemental record",
              ],
            },
            {
              type: "knowledge_check",
              question: {
                q: "You notice a child has unexplained bruising. The best first step is to…",
                options: [
                  "Confront the child's birth parent directly",
                  "Record factually and report to your SSW / DSL",
                  "Ignore it unless the child discloses",
                  "Wait to see if it happens again over months",
                ],
                correct: 1,
                explanation:
                  "Always record factually and report to your Supervising Social Worker or DSL — never investigate or confront independently.",
              },
            },
          ],
        },
        {
          id: "3-2",
          title: "Scenario: Child Returns Upset",
          type: "scenario",
          duration: "6 min",
          content: [
            {
              type: "rich_text",
              text: "A child returns from contact upset and refuses to speak. Let's apply what you've learned about recognising and responding to concerns — choose the option that best protects the child's immediate safety and welfare.",
            },
            {
              type: "scenario",
              title: "A child returns from contact upset and refuses to speak",
              scenario: {
                prompt:
                  "A child returns from contact upset and refuses to speak. They mention 'I don't want to go back there again.' What should the foster carer do FIRST?",
                responses: [
                  {
                    text: "Insist the child explains immediately what happened during contact.",
                    feedback:
                      "Not the best first step. Pressuring a distressed child to disclose before they're ready can re-traumatise them and damage trust. Prioritise safety and reassurance first.",
                    correct: false,
                  },
                  {
                    text: "Provide a calm, safe space, reassure the child, listen if they wish, and record factually — then contact the SSW/DSL the same day.",
                    feedback:
                      "Correct. The immediate priority is emotional safety and reassurance. Listen without pressure, record observations factually, and escalate to your SSW/DSL the same day given the safeguarding concern.",
                    correct: true,
                  },
                  {
                    text: "Cancel all future contact arrangements yourself immediately.",
                    feedback:
                      "Not the best first step. Contact arrangements are legally governed and must be changed through the SSW/social worker — never unilaterally by the carer, even with safeguarding concerns. Report instead.",
                    correct: false,
                  },
                  {
                    text: "Do nothing until the child brings it up again next week.",
                    feedback:
                      "Not the best first step. Safeguarding concerns must be acted on promptly — delay risks the child's welfare. Record and report the same day.",
                    correct: false,
                  },
                ],
              },
            },
            {
              type: "knowledge_check",
              question: {
                q: "When a child discloses a concern, you should never…",
                options: [
                  "Stay calm and listen",
                  "Record their exact words",
                  "Promise to keep it a secret",
                  "Report to your SSW/DSL the same day",
                ],
                correct: 2,
                explanation:
                  "Never promise a child secrecy — be honest that you must share concerns to help keep them safe.",
              },
            },
          ],
        },
      ],
    },

    // ── Module 4 : Recording and Reporting ────────────────────────────────
    {
      id: "m4",
      title: "Recording and Reporting",
      lessons: [
        {
          id: "4-1",
          title: "How to Record a Disclosure",
          type: "video",
          duration: "9 min",
          content: [
            {
              type: "rich_text",
              text: "When a child discloses, stay calm, listen without leading questions, and use their exact words in your record. Write what you saw and heard, not your interpretation. Sign, date, and store records securely. Never promise confidentiality — be honest that you'll share concerns to help keep them safe.",
            },
            {
              type: "video",
              title: "How to Record a Disclosure",
              transcript:
                "When a child discloses, stay calm, listen without leading questions, and use their exact words in your record. Write what you saw and heard, not your interpretation. Sign, date, and store records securely. Never promise confidentiality — be honest that you'll share concerns to help keep them safe.",
            },
            {
              type: "key_points",
              points: [
                "Use the child's exact words where possible",
                "Record factually — what was seen/heard, not opinion",
                "Note date, time, setting, and people present",
                "Never promise secrecy to a child",
              ],
            },
            {
              type: "knowledge_check",
              question: {
                q: "A child says 'grandad touched my willy.' You should record…",
                options: [
                  "'Child made inappropriate allegation against grandfather.'",
                  "'Child disclosure of sexual abuse by grandfather.'",
                  "'Child said: \"grandad touched my willy\", [date/time/setting].'",
                  "Nothing — wait for formal assessment.",
                ],
                correct: 2,
                explanation:
                  "Use the child's exact words in quotation marks, with date/time/setting context. Avoid interpretation or summary.",
              },
            },
            {
              type: "pdf",
              title: "Disclosure Recording Template (PDF)",
            },
            {
              type: "resource",
              title: "Recording Template (DOCX)",
              fileType: "DOCX",
            },
          ],
        },
        {
          id: "4-2",
          title: "Reporting Flow & Timelines",
          type: "video",
          duration: "7 min",
          content: [
            {
              type: "rich_text",
              text: "Report to your Supervising Social Worker or Designated Safeguarding Lead the same day you have a concern. If a child is in immediate danger, call 999 first. The Local Authority Multi-Agency Safeguarding Hub (MASH) should receive a written referral within 24 hours.",
            },
            {
              type: "video",
              title: "Reporting Flow & Timelines",
              transcript:
                "Report to your Supervising Social Worker or Designated Safeguarding Lead the same day you have a concern. If a child is in immediate danger, call 999 first. The Local Authority Multi-Agency Safeguarding Hub (MASH) should receive a written referral within 24 hours.",
            },
            {
              type: "key_points",
              points: [
                "Contact SSW or DSL the same day",
                "Emergency risk to life → 999 first",
                "Local Authority MASH referral within 24 hours",
                "Verbal followed by written referral",
              ],
            },
            {
              type: "knowledge_check",
              question: {
                q: "You believe a child is in immediate danger right now. You should…",
                options: [
                  "Email your SSW and wait for a reply tomorrow",
                  "Call 999 immediately, then notify your SSW/DSL",
                  "Record it and discuss at next supervision",
                  "Ask the child to call themselves",
                ],
                correct: 1,
                explanation:
                  "Immediate risk to life/safety → 999 first, then immediately notify your SSW/DSL.",
              },
            },
            {
              type: "resource",
              title: "Local Authority MASH Referral Form (DOCX)",
              fileType: "DOCX",
            },
          ],
        },
      ],
    },

    // ── Module 5 : Escalation ──────────────────────────────────────────────
    {
      id: "m5",
      title: "Escalation",
      lessons: [
        {
          id: "5-1",
          title: "Whistleblowing & Escalation Channels",
          type: "video",
          duration: "8 min",
          content: [
            {
              type: "rich_text",
              text: "Whistleblowing is raising a concern about wrongdoing — you're protected by the Public Interest Disclosure Act 1998. Report internally to your DSL or registered manager; if unresolved, escalate to Ofsted or the Local Authority Designated Officer (LADO) for allegations against staff or carers.",
            },
            {
              type: "image",
              url: "https://placehold.co/800x420/1e293b/60a5fa?text=Escalation+Channels",
              caption: "Internal DSL → Ofsted / LADO for allegations against carers",
            },
            {
              type: "video",
              title: "Whistleblowing & Escalation Channels",
              transcript:
                "Whistleblowing is raising a concern about wrongdoing — you're protected by the Public Interest Disclosure Act 1998. Report internally to your DSL or registered manager; if unresolved, escalate to Ofsted or the Local Authority Designated Officer (LADO) for allegations against staff or carers.",
            },
            {
              type: "key_points",
              points: [
                "Whistleblowing protects carers and children",
                "Report concerns about colleagues or carers",
                "Use internal channels first, then external if needed",
                "Public Interest Disclosure Act 1998 protection",
              ],
            },
            {
              type: "knowledge_check",
              question: {
                q: "An allegation is made against a foster carer. Who should it be referred to?",
                options: ["The carer's family", "Local Authority Designated Officer (LADO)", "The child directly", "HR only"],
                correct: 1,
                explanation:
                  "Allegations against those working with children go to the LADO, who coordinates the independent safeguarding response.",
              },
            },
          ],
        },
        {
          id: "5-2",
          title: "Scenario: Allegation Against a Carer",
          type: "scenario",
          duration: "7 min",
          content: [
            {
              type: "rich_text",
              text: "A child in your care makes an allegation against another foster carer in the same household. Choose the correct immediate action.",
            },
            {
              type: "scenario",
              title: "Allegation against another foster carer",
              scenario: {
                prompt:
                  "A child in your care makes an allegation against another foster carer in the same household. What is the correct immediate action?",
                responses: [
                  {
                    text: "Investigate the matter yourself by questioning both parties.",
                    feedback:
                      "Not the best action. Carers must never investigate allegations — this risks contaminating evidence and further harm. Refer to the LADO via your DSL/SSW immediately.",
                    correct: false,
                  },
                  {
                    text: "Ensure the child's immediate safety, do not question further about detail, and refer immediately to your DSL/SSW for LADO involvement.",
                    feedback:
                      "Correct. Make the child safe, avoid detailed questioning (which can compromise an investigation), and escalate immediately to DSL/SSW for LADO referral.",
                    correct: true,
                  },
                  {
                    text: "Tell the other carer what was said so they can explain.",
                    feedback:
                      "Not the best action. Never disclose allegations to the subject — this risks interference, retaliation, or evidence loss. Escalate to the LADO instead.",
                    correct: false,
                  },
                  {
                    text: "Wait a week to see if the child changes their account.",
                    feedback:
                      "Not the best action. Allegations must be escalated immediately — delay risks the child and breaches safeguarding procedures.",
                    correct: false,
                  },
                ],
              },
            },
            {
              type: "knowledge_check",
              question: {
                q: "Who coordinates the response to allegations against those working with children?",
                options: ["The LADO", "The carer's partner", "The Ofsted media team", "The child's teacher"],
                correct: 0,
                explanation:
                  "The Local Authority Designated Officer coordinates the independent safeguarding response to allegations against those working with children.",
              },
            },
          ],
        },
      ],
    },

    // ── Module 6 : Final Assessment ────────────────────────────────────────
    {
      id: "m6",
      title: "Final Assessment",
      lessons: [
        {
          id: "6-1",
          title: "Final MCQ Assessment",
          type: "assessment",
          duration: "15 min",
          content: [],
        },
      ],
    },
  ],
};

export const ASSESSMENT_QUESTIONS = [
  {
    q: "Which Act is the statutory foundation of UK child safeguarding?",
    options: ["Children Act 1989 & 2004", "Equality Act 2010", "Housing Act 1996", "Health Act 2009"],
    correct: 0,
    explanation: "The Children Act 1989 (and 2004 amendment) underpins safeguarding duties.",
  },
  {
    q: "The '4 R's' of safeguarding are Recognise, Respond, Record, and…",
    options: ["Resolve", "Report", "Recover", "Review"],
    correct: 1,
    explanation: "Recognise, Respond, Record, Report — the core safeguarding sequence.",
  },
  {
    q: "The four main categories of abuse are physical, emotional, sexual and…",
    options: ["Financial", "Neglect", "Verbal only", "Educational"],
    correct: 1,
    explanation: "Physical, emotional, sexual abuse and neglect are the four categories recognised in UK guidance.",
  },
  {
    q: "When recording a child's disclosure, you should…",
    options: [
      "Interpret what the child meant",
      "Use the child's exact words, dated and contextualised",
      "Summarise in your own professional terms",
      "Omit anything that sounds improbable",
    ],
    correct: 1,
    explanation: "Use the child's exact words with date/time/setting — factually, no interpretation.",
  },
  {
    q: "A child is in immediate danger right now. Your first action is…",
    options: ["Email your SSW", "Call 999", "Record and wait", "Discuss at supervision"],
    correct: 1,
    explanation: "Immediate risk → 999 first, then notify SSW/DSL.",
  },
  {
    q: "An allegation against a foster carer must be referred to…",
    options: ["The carer's family", "LADO", "The child", "Their employer's HR only"],
    correct: 1,
    explanation: "The Local Authority Designated Officer (LADO) handles allegations against those working with children.",
  },
  {
    q: "When a child discloses abuse, you should…",
    options: [
      "Promise to keep it secret so they talk freely",
      "Stay calm, listen without leading questions, never promise secrecy",
      "Question them thoroughly to gather evidence",
      "Tell the alleged abuser to get their side",
    ],
    correct: 1,
    explanation: "Stay calm, avoid leading questions, and be honest that you must share concerns to keep them safe.",
  },
  {
    q: "A Local Authority MASH written referral should be made within…",
    options: ["24 hours", "2 weeks", "30 days", "Whenever convenient"],
    correct: 0,
    explanation: "Written MASH referral within 24 hours, following verbal notification.",
  },
  {
    q: "Whistleblowing UK carers are protected by…",
    options: ["Public Interest Disclosure Act 1998", "Children Act only", "Data Protection Act", "Employment Rights Act 1996 only"],
    correct: 0,
    explanation: "PIDA 1998 protects workers raising genuine safeguarding concerns.",
  },
  {
    q: "A child returns from contact upset and refuses to speak. You should first…",
    options: [
      "Force them to explain immediately",
      "Provide a calm, safe space and reassure them",
      "Cancel contact arrangements yourself",
      "Wait a week before acting",
    ],
    correct: 1,
    explanation: "Prioritise emotional safety and reassurance first, then record factually and report the same day.",
  },
];