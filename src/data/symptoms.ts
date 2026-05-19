import type { SymptomMapping, SymptomSuggestion } from "../types";
import { normalizeSymptomInput } from "../utils/medicalTranslation";

export const RED_FLAG_KEYWORDS: string[] = [
  // English
  "chest pain", "chest pressure", "chest tightness",
  "difficulty breathing", "can't breathe", "cannot breathe", "shortness of breath",
  "stroke", "face drooping", "arm weakness", "speech difficulty",
  "sudden numbness", "sudden confusion", "sudden vision",
  "severe allergic", "anaphylaxis", "throat closing", "throat swelling",
  "tongue swelling", "lips swelling",
  "overdose", "took too many", "took too much", "accidental ingestion",
  "suicidal", "suicide", "want to die", "self-harm", "self harm",
  "pregnancy emergency", "heavy bleeding pregnant",
  "seizure", "unconscious", "unresponsive", "poisoning",
  // Chinese
  "胸痛", "胸部压迫", "胸闷",
  "呼吸困难", "无法呼吸", "喘不过气",
  "中风", "口角下垂", "单侧无力", "言语不清", "突然麻木", "突然视力",
  "过敏性休克", "严重过敏", "喉咙发紧", "喉咙肿胀", "舌头肿胀",
  "药物过量", "服药过多", "误服",
  "自杀", "想死", "自伤", "自残",
  "癫痫发作", "昏迷", "失去意识", "意识丧失",
  "中毒",
];

export interface RedFlagGroup {
  triggers: string[];
  emergencyLine: string;
  emergencyLineZh: string;
  callAction: string;
  callActionZh: string;
}

export const RED_FLAG_GROUPS: RedFlagGroup[] = [
  {
    triggers: [
      "chest pain", "chest pressure", "chest tightness",
      "shortness of breath", "difficulty breathing", "can't breathe", "cannot breathe",
      "胸痛", "胸部压迫", "胸闷", "呼吸困难", "无法呼吸", "喘不过气",
    ],
    emergencyLine: "These symptoms may indicate a heart attack or serious breathing emergency.",
    emergencyLineZh: "这些症状可能提示心脏病发作或严重呼吸紧急情况。",
    callAction: "Call 911 immediately",
    callActionZh: "立即拨打 911 / 120",
  },
  {
    triggers: [
      "stroke", "face drooping", "arm weakness", "speech difficulty",
      "sudden numbness", "sudden confusion", "sudden vision",
      "中风", "口角下垂", "单侧无力", "言语不清", "突然麻木", "突然视力",
    ],
    emergencyLine: "These could be signs of a stroke — every minute matters.",
    emergencyLineZh: "这些可能是中风迹象，时间至关重要，请立即就医。",
    callAction: "Call 911 immediately — use the FAST acronym (Face, Arms, Speech, Time)",
    callActionZh: "立即拨打 911 / 120 — 记住 FAST：面部下垂、手臂无力、言语不清、立即呼救",
  },
  {
    triggers: [
      "severe allergic", "anaphylaxis", "throat closing", "throat swelling",
      "tongue swelling", "lips swelling",
      "过敏性休克", "严重过敏", "喉咙发紧", "喉咙肿胀", "舌头肿胀",
    ],
    emergencyLine: "This may be a severe allergic reaction (anaphylaxis).",
    emergencyLineZh: "这可能是严重过敏反应（过敏性休克）。",
    callAction: "Use an epinephrine auto-injector (EpiPen) if available, then call 911",
    callActionZh: "如有肾上腺素自动注射器（EpiPen）请立即使用，然后拨打 911 / 120",
  },
  {
    triggers: [
      "overdose", "took too many", "took too much", "accidental ingestion", "poisoning",
      "药物过量", "服药过多", "误服", "中毒",
    ],
    emergencyLine: "Possible overdose or poisoning — do not wait for symptoms to worsen.",
    emergencyLineZh: "疑似药物过量或中毒，请勿等待症状恶化。",
    callAction: "Call Poison Control at 1-800-222-1222 or call 911",
    callActionZh: "拨打中毒控制中心 1-800-222-1222 或 911 / 120",
  },
  {
    triggers: [
      "suicidal", "suicide", "want to die", "self-harm", "self harm",
      "自杀", "想死", "自伤", "自残",
    ],
    emergencyLine: "If you or someone you know is in crisis, please reach out now.",
    emergencyLineZh: "如果您或身边的人正处于心理危机，请立即寻求帮助。",
    callAction: "Call or text 988 (Suicide & Crisis Lifeline) or call 911",
    callActionZh: "拨打或发短信至 988 心理危机热线，或拨打 911 / 120",
  },
  {
    triggers: [
      "pregnancy emergency", "heavy bleeding pregnant", "seizure", "unconscious", "unresponsive",
      "癫痫发作", "昏迷", "失去意识", "意识丧失",
    ],
    emergencyLine: "This requires immediate emergency medical attention.",
    emergencyLineZh: "这需要立即紧急医疗救治。",
    callAction: "Call 911 immediately",
    callActionZh: "立即拨打 911 / 120",
  },
];

export const SYMPTOM_MAPPINGS: SymptomMapping[] = [
  {
    symptomKeywords: ["headache", "head pain", "migraine", "head ache"],
    suggestions: [
      {
        categoryName: "Pain Relievers (NSAIDs)",
        exampleDrugs: ["ibuprofen", "aspirin"],
        whyItHelps:
          "NSAIDs block prostaglandins that cause pain and inflammation, providing 4–8 hours of relief.",
        whoShouldAvoid:
          "People with stomach ulcers, kidney disease, blood thinners, or aspirin allergy.",
        keyRisks:
          "Stomach irritation; take with food. Do not use more than 10 days without seeing a doctor.",
        whenToSeekCare:
          "Sudden severe 'thunderclap' headache, headache with fever and stiff neck, or headache after a head injury — go to emergency immediately.",
      },
      {
        categoryName: "Acetaminophen",
        exampleDrugs: ["acetaminophen"],
        whyItHelps:
          "Raises pain threshold without irritating the stomach. Good first choice if you can't take NSAIDs.",
        whoShouldAvoid: "People with liver disease or heavy daily alcohol use.",
        keyRisks:
          "Overdose risk if combined with other acetaminophen-containing products (many cold medicines contain it).",
        whenToSeekCare:
          "Headache lasting more than 2 weeks or getting progressively worse.",
      },
    ],
  },
  {
    symptomKeywords: ["fever", "high temperature", "temperature", "chills"],
    suggestions: [
      {
        categoryName: "Fever Reducers",
        exampleDrugs: ["acetaminophen", "ibuprofen"],
        whyItHelps:
          "Reduce fever by acting on the brain's temperature-regulating center.",
        whoShouldAvoid:
          "Ibuprofen should not be used in children under 6 months. Acetaminophen is safe from birth.",
        keyRisks:
          "Never use aspirin for fever in children under 18 (Reye's syndrome risk).",
        whenToSeekCare:
          "Fever above 103°F (39.4°C) in adults, any fever in infants under 3 months, or fever with stiff neck/rash.",
      },
    ],
  },
  {
    symptomKeywords: ["cough", "dry cough", "productive cough", "coughing"],
    suggestions: [
      {
        categoryName: "Cough Suppressants",
        exampleDrugs: ["dextromethorphan"],
        whyItHelps:
          "Dextromethorphan acts on the brain's cough center to reduce the urge to cough.",
        whoShouldAvoid:
          "People taking MAOIs, SSRIs (serotonin syndrome risk), or those with chronic cough from asthma/COPD.",
        keyRisks:
          "Do not use for a cough with excessive mucus — suppressing it can worsen a chest infection.",
        whenToSeekCare:
          "Cough with blood, cough lasting more than 3 weeks, or cough with high fever.",
      },
    ],
  },
  {
    symptomKeywords: [
      "runny nose",
      "stuffy nose",
      "congestion",
      "nasal congestion",
      "sinus",
      "cold",
      "blocked nose",
    ],
    suggestions: [
      {
        categoryName: "Decongestants",
        exampleDrugs: ["pseudoephedrine"],
        whyItHelps: "Shrinks swollen nasal blood vessels to relieve stuffiness.",
        whoShouldAvoid:
          "People with high blood pressure, heart disease, thyroid problems, or taking MAOIs. Pseudoephedrine is sold behind the pharmacy counter.",
        keyRisks:
          "Can raise blood pressure and cause insomnia. Limit to 3 days to avoid rebound congestion.",
        whenToSeekCare:
          "Sinus pain with fever lasting more than 10 days (may indicate bacterial sinusitis).",
      },
    ],
  },
  {
    symptomKeywords: [
      "allergy",
      "allergies",
      "sneezing",
      "itchy eyes",
      "watery eyes",
      "hay fever",
      "allergic",
    ],
    suggestions: [
      {
        categoryName: "Non-Drowsy Antihistamines",
        exampleDrugs: ["loratadine", "cetirizine"],
        whyItHelps:
          "Block histamine receptors to relieve sneezing, itching, and runny nose without significant drowsiness.",
        whoShouldAvoid:
          "People with severe liver disease; cetirizine can cause more drowsiness than loratadine.",
        keyRisks: "Cetirizine may impair driving in some people. Avoid alcohol.",
        whenToSeekCare:
          "Allergy symptoms that significantly affect daily life or do not respond to OTC medications.",
      },
      {
        categoryName: "Sedating Antihistamines",
        exampleDrugs: ["diphenhydramine"],
        whyItHelps:
          "Diphenhydramine blocks histamine but crosses the blood-brain barrier, causing sedation that can help with itching at night.",
        whoShouldAvoid:
          "Elderly patients (fall risk, confusion), people with glaucoma, enlarged prostate, or bladder obstruction.",
        keyRisks: "Significant drowsiness — do not drive. Avoid in elderly patients.",
        whenToSeekCare:
          "Severe or sudden allergic reactions with throat swelling — call 911.",
      },
    ],
  },
  {
    symptomKeywords: [
      "stomach ache",
      "stomach pain",
      "heartburn",
      "acid reflux",
      "indigestion",
      "gerd",
      "acid",
    ],
    suggestions: [
      {
        categoryName: "Proton Pump Inhibitors (PPIs)",
        exampleDrugs: ["omeprazole"],
        whyItHelps:
          "Reduce stomach acid production for 24 hours, providing relief from heartburn and acid reflux.",
        whoShouldAvoid:
          "Not for immediate relief — takes 1–4 days to work. Avoid long-term OTC use without medical supervision.",
        keyRisks:
          "Long-term use may reduce magnesium levels and increase risk of C. difficile infection.",
        whenToSeekCare:
          "Difficulty swallowing, unexplained weight loss, persistent symptoms beyond 14 days.",
      },
      {
        categoryName: "H2 Blockers",
        exampleDrugs: ["ranitidine"],
        whyItHelps:
          "Work within 1 hour to reduce stomach acid for 10–12 hours. Good for predictable heartburn (e.g., before a big meal).",
        whoShouldAvoid:
          "People with kidney disease (dose adjustment needed). Not for immediate antacid effect.",
        keyRisks: "Less effective than PPIs for severe acid problems.",
        whenToSeekCare:
          "Heartburn more than twice weekly for more than 2 weeks — see your doctor.",
      },
    ],
  },
  {
    symptomKeywords: ["diarrhea", "loose stool", "watery stool"],
    suggestions: [
      {
        categoryName: "Anti-Diarrheal",
        exampleDrugs: ["loperamide", "bismuth-subsalicylate"],
        whyItHelps:
          "Loperamide slows intestinal movement; bismuth subsalicylate reduces inflammation and has mild antibacterial effect.",
        whoShouldAvoid:
          "Do not use loperamide if you have bloody stool or fever — may indicate bacterial infection that needs antibiotics. Avoid bismuth in children (aspirin-related compound).",
        keyRisks:
          "Do not exceed recommended dose of loperamide (cardiac risk at high doses).",
        whenToSeekCare:
          "Blood in stool, fever over 101°F, signs of dehydration, or diarrhea lasting more than 2 days.",
      },
    ],
  },
  {
    symptomKeywords: ["nausea", "upset stomach", "vomiting", "nauseous", "queasy"],
    suggestions: [
      {
        categoryName: "Bismuth-Based Digestive Relief",
        exampleDrugs: ["bismuth-subsalicylate"],
        whyItHelps:
          "Coats the stomach lining and has mild antacid and antimicrobial properties.",
        whoShouldAvoid:
          "Children under 12, people taking blood thinners, those allergic to aspirin.",
        keyRisks:
          "Can temporarily turn tongue/stool dark. Contains salicylate (aspirin-related).",
        whenToSeekCare:
          "Vomiting blood, severe abdominal pain, or vomiting that lasts more than 24 hours.",
      },
    ],
  },
  {
    symptomKeywords: [
      "trouble sleeping",
      "can't sleep",
      "insomnia",
      "sleep problems",
      "sleep",
      "awake at night",
    ],
    suggestions: [
      {
        categoryName: "Sleep Aids",
        exampleDrugs: ["diphenhydramine", "melatonin"],
        whyItHelps:
          "Diphenhydramine causes drowsiness. Melatonin helps reset the sleep-wake cycle and is less likely to cause morning grogginess.",
        whoShouldAvoid:
          "Diphenhydramine: elderly patients, glaucoma, enlarged prostate. Melatonin: generally safe but consult doctor if on blood thinners.",
        keyRisks:
          "Diphenhydramine tolerance develops quickly — not for chronic insomnia. Melatonin: start with lowest dose (0.5–1 mg).",
        whenToSeekCare:
          "Chronic insomnia (more than 3 nights/week for more than 3 months) warrants medical evaluation.",
      },
    ],
  },
  {
    symptomKeywords: [
      "itchy skin",
      "rash",
      "skin irritation",
      "eczema",
      "contact dermatitis",
      "hives",
      "itch",
      "red skin",
    ],
    suggestions: [
      {
        categoryName: "Topical Corticosteroids",
        exampleDrugs: ["hydrocortisone-cream"],
        whyItHelps:
          "Reduce skin inflammation, redness, and itching from contact dermatitis, mild eczema, and insect bites.",
        whoShouldAvoid:
          "Do not use on face, groin, or underarms unless directed. Not for fungal skin infections (will worsen them).",
        keyRisks: "Skin thinning with prolonged use. Maximum 7 days OTC.",
        whenToSeekCare:
          "Rash spreading rapidly, rash with fever, or skin infection signs (warmth, pus, red streaks).",
      },
      {
        categoryName: "Antifungal Creams",
        exampleDrugs: ["clotrimazole"],
        whyItHelps:
          "Treats fungal skin infections like athlete's foot, ringworm, and yeast infections.",
        whoShouldAvoid:
          "Confirm it is a fungal infection — antifungals do not help bacterial or viral rashes.",
        keyRisks:
          "If symptoms do not improve in 2 weeks, see a doctor to confirm diagnosis.",
        whenToSeekCare:
          "Rapidly spreading rash, signs of bacterial superinfection (warmth, swelling, pus).",
      },
    ],
  },
  {
    symptomKeywords: ["sore throat", "throat pain", "throat ache", "pharyngitis"],
    suggestions: [
      {
        categoryName: "Pain Relievers for Throat",
        exampleDrugs: ["acetaminophen", "ibuprofen"],
        whyItHelps:
          "Acetaminophen and ibuprofen reduce throat inflammation and pain. OTC throat lozenges (benzocaine-based) can numb locally.",
        whoShouldAvoid:
          "NSAIDs should be avoided by those with stomach ulcers or kidney disease. Do not give aspirin to children.",
        keyRisks:
          "Sore throat may be strep (bacterial) — if no improvement in 3 days or fever develops, see a doctor.",
        whenToSeekCare:
          "Severe throat pain with difficulty swallowing, high fever, drooling, or visible white patches — may require antibiotics or urgent care.",
      },
    ],
  },
  {
    symptomKeywords: ["body ache", "muscle ache", "muscle pain", "ache", "flu ache", "myalgia"],
    suggestions: [
      {
        categoryName: "NSAIDs / Pain Relievers",
        exampleDrugs: ["ibuprofen", "aspirin"],
        whyItHelps:
          "NSAIDs reduce inflammation causing muscle aches, especially common in flu and viral illness.",
        whoShouldAvoid:
          "People with stomach ulcers, kidney disease, or on blood thinners. Aspirin not for children.",
        keyRisks:
          "Take with food to reduce stomach upset. Do not use more than 10 days without medical consultation.",
        whenToSeekCare:
          "Severe muscle pain with dark urine, weakness, or swelling — could indicate rhabdomyolysis. Seek emergency care.",
      },
    ],
  },
  {
    symptomKeywords: ["back pain", "backache", "lower back", "back ache", "lumbar"],
    suggestions: [
      {
        categoryName: "NSAIDs for Back Pain",
        exampleDrugs: ["ibuprofen", "naproxen"],
        whyItHelps:
          "NSAIDs reduce the inflammation around spinal muscles and discs, providing better relief than acetaminophen for most mechanical back pain.",
        whoShouldAvoid:
          "People with stomach ulcers, kidney disease, or on blood thinners.",
        keyRisks:
          "Limit use to 10 days. For chronic back pain, physical therapy is more effective long-term.",
        whenToSeekCare:
          "Back pain with leg numbness or weakness, loss of bladder/bowel control, or pain following trauma — go to emergency.",
      },
      {
        categoryName: "Muscle Relaxants (Rx)",
        exampleDrugs: [],
        whyItHelps:
          "Prescription muscle relaxants (cyclobenzaprine, methocarbamol) reduce muscle spasm. OTC options don't exist — ask your doctor.",
        whoShouldAvoid:
          "Elderly patients (fall/sedation risk). Not for use with alcohol.",
        keyRisks:
          "These are prescription-only. Do not obtain without a prescription.",
        whenToSeekCare:
          "Acute severe back spasm lasting more than 3–4 days without improvement.",
      },
    ],
  },
  {
    symptomKeywords: ["constipation", "can't poop", "hard stool", "no bowel movement", "bloating constipated"],
    suggestions: [
      {
        categoryName: "Osmotic Laxatives",
        exampleDrugs: ["polyethylene glycol"],
        whyItHelps:
          "Polyethylene glycol (MiraLax) draws water into the colon to soften stool. Works within 1–3 days without causing dependency.",
        whoShouldAvoid:
          "Not for long-term use without medical evaluation. People with kidney disease should consult a doctor.",
        keyRisks:
          "Overuse can cause electrolyte imbalance. Drink plenty of fluids.",
        whenToSeekCare:
          "No bowel movement for more than 1 week, severe abdominal pain, or blood in stool.",
      },
      {
        categoryName: "Fiber Supplements",
        exampleDrugs: [],
        whyItHelps:
          "Psyllium husk (Metamucil) adds bulk to stool and supports gut health. Safe for long-term use.",
        whoShouldAvoid:
          "Take with plenty of water — dry ingestion can cause choking or esophageal blockage.",
        keyRisks:
          "May reduce absorption of some medications if taken at same time. Take 2 hours apart from other drugs.",
        whenToSeekCare:
          "Persistent constipation despite fiber and hydration warrants a medical visit.",
      },
    ],
  },
  {
    symptomKeywords: ["joint pain", "joint ache", "arthritis", "knee pain", "hip pain", "swollen joint"],
    suggestions: [
      {
        categoryName: "NSAIDs for Joint Pain",
        exampleDrugs: ["ibuprofen", "naproxen"],
        whyItHelps:
          "Anti-inflammatory drugs reduce swelling and pain in arthritic and overuse joint injuries more effectively than plain acetaminophen.",
        whoShouldAvoid:
          "Avoid in kidney disease, GI bleeding, or if on blood thinners.",
        keyRisks:
          "Long-term NSAID use increases risk of GI bleeding and kidney damage. Use lowest effective dose.",
        whenToSeekCare:
          "Sudden severe joint pain with swelling and fever (could be gout or infection), or joint pain after injury.",
      },
      {
        categoryName: "Glucosamine / Chondroitin",
        exampleDrugs: [],
        whyItHelps:
          "These supplements may help maintain cartilage in mild osteoarthritis — evidence is modest but side effects are minimal.",
        whoShouldAvoid:
          "People with shellfish allergy (glucosamine is often shellfish-derived). Blood thinner users should check with doctor.",
        keyRisks:
          "May take 2–4 months to notice benefit. Not proven to work for all people.",
        whenToSeekCare:
          "Significant joint limitation, pain that wakes you from sleep, or rapidly worsening arthritis.",
      },
    ],
  },
  {
    symptomKeywords: ["eye irritation", "red eye", "dry eye", "itchy eye", "burning eye", "watery eye"],
    suggestions: [
      {
        categoryName: "Artificial Tears / Lubricating Eye Drops",
        exampleDrugs: [],
        whyItHelps:
          "OTC artificial tears (Systane, Refresh) lubricate the eye surface and relieve dryness and mild irritation.",
        whoShouldAvoid:
          "Avoid drops with vasoconstrictors (e.g., Visine) for chronic use — they cause rebound redness.",
        keyRisks:
          "Preservative-free single-use vials are better for frequent users (more than 4x/day).",
        whenToSeekCare:
          "Eye pain (not just irritation), vision changes, discharge with crusting, or redness that doesn't resolve in 48 hours.",
      },
      {
        categoryName: "OTC Antihistamine Eye Drops",
        exampleDrugs: [],
        whyItHelps:
          "Ketotifen (Zaditor, Alaway) relieves allergic eye symptoms — itching, redness, and watering from pollen or pet dander.",
        whoShouldAvoid:
          "Contact lens wearers: remove lenses before use, wait 10 minutes before reinserting.",
        keyRisks:
          "Only for allergic causes — won't help dry eye or infections.",
        whenToSeekCare:
          "Eye discharge (pus/mucus), light sensitivity, or pain — may be conjunctivitis needing prescription treatment.",
      },
    ],
  },
  {
    symptomKeywords: ["period pain", "menstrual cramp", "cramps", "dysmenorrhea", "pms", "period"],
    suggestions: [
      {
        categoryName: "NSAIDs for Menstrual Pain",
        exampleDrugs: ["ibuprofen", "naproxen"],
        whyItHelps:
          "NSAIDs block prostaglandins — the hormones that cause uterine cramping. More effective than acetaminophen for menstrual cramps. Start taking 1–2 days before expected period for best results.",
        whoShouldAvoid:
          "People with stomach ulcers, kidney disease, or on blood thinners.",
        keyRisks:
          "Take with food. Maximum recommended doses: ibuprofen 400–600 mg every 6–8 hours, naproxen 500 mg twice daily.",
        whenToSeekCare:
          "Severe pain that is new or worsening, pain between periods, or pelvic pain — could indicate endometriosis or other conditions.",
      },
    ],
  },
  {
    symptomKeywords: ["toothache", "tooth pain", "dental pain", "gum pain", "jaw pain", "tooth ache"],
    suggestions: [
      {
        categoryName: "OTC Pain Relievers for Dental Pain",
        exampleDrugs: ["ibuprofen", "acetaminophen"],
        whyItHelps:
          "Ibuprofen reduces dental inflammation most effectively. Alternating ibuprofen and acetaminophen every few hours can extend pain coverage without exceeding individual drug limits.",
        whoShouldAvoid:
          "People with stomach ulcers, kidney disease, or on blood thinners should stick to acetaminophen.",
        keyRisks:
          "OTC treatments are temporary. Dental pain is a symptom of a problem that requires dental treatment.",
        whenToSeekCare:
          "Tooth pain lasting more than 2 days, swelling of the face or jaw, fever with tooth pain — see a dentist urgently.",
      },
      {
        categoryName: "Topical Oral Anesthetics",
        exampleDrugs: [],
        whyItHelps:
          "Benzocaine gel (Orajel) numbs the gum and tooth area within minutes. Provides 20–30 minutes of local relief.",
        whoShouldAvoid:
          "Children under 2. Large amounts can cause methemoglobinemia (rare but serious).",
        keyRisks:
          "Use sparingly — not for frequent repeat use. Only temporary relief.",
        whenToSeekCare:
          "See a dentist as soon as possible — dental infection can spread to jaw, neck, or bloodstream.",
      },
    ],
  },
  {
    symptomKeywords: ["anxiety", "stress", "anxious", "nervous", "panic", "worried"],
    suggestions: [
      {
        categoryName: "General Wellness Note",
        exampleDrugs: [],
        whyItHelps:
          "There are no proven OTC medications for anxiety or panic disorder. Some people use magnesium, L-theanine, or valerian — evidence is limited. Lifestyle approaches (exercise, sleep, reduced caffeine) have good evidence.",
        whoShouldAvoid:
          "Do not use OTC sleep aids (diphenhydramine) as anti-anxiety medication — they are habit-forming for this purpose.",
        keyRisks:
          "Self-treating anxiety with alcohol, sedatives, or supplement stacks can worsen the condition or create dependence.",
        whenToSeekCare:
          "Anxiety affecting daily function, panic attacks, or anxiety with chest pain or shortness of breath — speak with a doctor or mental health professional.",
      },
    ],
  },
  {
    symptomKeywords: ["fatigue", "tired", "tiredness", "low energy", "exhausted", "always tired"],
    suggestions: [
      {
        categoryName: "Iron / B12 Deficiency Check",
        exampleDrugs: [],
        whyItHelps:
          "Iron deficiency anemia and vitamin B12 deficiency are common, treatable causes of fatigue. A simple blood test can diagnose these.",
        whoShouldAvoid:
          "Do not self-supplement iron without a confirmed deficiency — excess iron is harmful.",
        keyRisks:
          "Fatigue has many causes (thyroid, sleep apnea, depression, chronic illness). A diagnosis is important before treating.",
        whenToSeekCare:
          "Persistent fatigue lasting more than 2 weeks, fatigue with shortness of breath or rapid heartbeat, or unexplained weight loss.",
      },
      {
        categoryName: "Vitamin D Supplementation",
        exampleDrugs: ["vitamin-d3"],
        whyItHelps:
          "Vitamin D deficiency is very common and can cause fatigue, muscle weakness, and low mood. Supplementation (1,000–2,000 IU/day) is generally safe and often beneficial.",
        whoShouldAvoid:
          "People with hypercalcemia or sarcoidosis. High doses (>4,000 IU/day) require medical supervision.",
        keyRisks:
          "Take with a fat-containing meal for best absorption. Get blood levels checked after 3 months of supplementation.",
        whenToSeekCare:
          "Fatigue with bone pain, muscle weakness, or depression — see your doctor for a comprehensive workup.",
      },
    ],
  },
];

export const CHIP_SYMPTOM_KEYWORDS: Record<string, string[]> = {
  fever: ["fever"],
  headache: ["headache"],
  cough: ["cough"],
  allergy: ["allergy"],
  stomachPain: ["stomach pain", "heartburn"],
  diarrhea: ["diarrhea"],
  soreThroat: ["sore throat"],
  insomnia: ["trouble sleeping"],
  nausea: ["nausea"],
  rash: ["itchy skin", "rash"],
  runnyNose: ["runny nose"],
  bodyAche: ["body ache"],
  backPain: ["back pain"],
  jointPain: ["joint pain"],
  constipation: ["constipation"],
  eyeIrritation: ["eye irritation"],
  periodPain: ["period pain"],
  toothache: ["toothache"],
  anxiety: ["anxiety"],
  fatigue: ["fatigue"],
};

export function detectRedFlags(input: string): string[] {
  const lower = input.toLowerCase();
  return RED_FLAG_KEYWORDS.filter((kw) => lower.includes(kw) || input.includes(kw));
}

export function getMatchedRedFlagGroups(flags: string[]): RedFlagGroup[] {
  if (flags.length === 0) return [];
  const matched: RedFlagGroup[] = [];
  for (const group of RED_FLAG_GROUPS) {
    if (group.triggers.some((t) => flags.includes(t))) {
      matched.push(group);
    }
  }
  return matched;
}

export function getSymptomSuggestions(input: string): SymptomSuggestion[] {
  const normalized = normalizeSymptomInput(input);
  const lower = normalized.toLowerCase();
  const seen = new Set<string>();
  const results: SymptomSuggestion[] = [];

  for (const mapping of SYMPTOM_MAPPINGS) {
    if (mapping.symptomKeywords.some((kw) => lower.includes(kw))) {
      for (const suggestion of mapping.suggestions) {
        if (!seen.has(suggestion.categoryName)) {
          seen.add(suggestion.categoryName);
          results.push(suggestion);
        }
      }
    }
  }
  return results;
}
