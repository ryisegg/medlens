import type { SymptomMapping, SymptomSuggestion } from "../types";

export const RED_FLAG_KEYWORDS: string[] = [
  "chest pain",
  "chest pressure",
  "chest tightness",
  "difficulty breathing",
  "can't breathe",
  "cannot breathe",
  "shortness of breath",
  "stroke",
  "face drooping",
  "arm weakness",
  "speech difficulty",
  "sudden numbness",
  "sudden confusion",
  "sudden vision",
  "severe allergic",
  "anaphylaxis",
  "throat closing",
  "throat swelling",
  "tongue swelling",
  "lips swelling",
  "overdose",
  "took too many",
  "took too much",
  "accidental ingestion",
  "suicidal",
  "suicide",
  "want to die",
  "self-harm",
  "self harm",
  "pregnancy emergency",
  "heavy bleeding pregnant",
  "seizure",
  "unconscious",
  "unresponsive",
  "poisoning",
];

export interface RedFlagGroup {
  triggers: string[];
  emergencyLine: string;
  callAction: string;
}

export const RED_FLAG_GROUPS: RedFlagGroup[] = [
  {
    triggers: [
      "chest pain",
      "chest pressure",
      "chest tightness",
      "shortness of breath",
      "difficulty breathing",
      "can't breathe",
      "cannot breathe",
    ],
    emergencyLine:
      "These symptoms may indicate a heart attack or serious breathing emergency.",
    callAction: "Call 911 immediately",
  },
  {
    triggers: [
      "stroke",
      "face drooping",
      "arm weakness",
      "speech difficulty",
      "sudden numbness",
      "sudden confusion",
      "sudden vision",
    ],
    emergencyLine: "These could be signs of a stroke — every minute matters.",
    callAction:
      "Call 911 immediately — use the FAST acronym (Face, Arms, Speech, Time)",
  },
  {
    triggers: [
      "severe allergic",
      "anaphylaxis",
      "throat closing",
      "throat swelling",
      "tongue swelling",
      "lips swelling",
    ],
    emergencyLine: "This may be a severe allergic reaction (anaphylaxis).",
    callAction:
      "Use an epinephrine auto-injector (EpiPen) if available, then call 911",
  },
  {
    triggers: ["overdose", "took too many", "took too much", "accidental ingestion", "poisoning"],
    emergencyLine: "Possible overdose or poisoning — do not wait for symptoms to worsen.",
    callAction: "Call Poison Control at 1-800-222-1222 or call 911",
  },
  {
    triggers: ["suicidal", "suicide", "want to die", "self-harm", "self harm"],
    emergencyLine: "If you or someone you know is in crisis, please reach out now.",
    callAction: "Call or text 988 (Suicide & Crisis Lifeline) or call 911",
  },
  {
    triggers: [
      "pregnancy emergency",
      "heavy bleeding pregnant",
      "seizure",
      "unconscious",
      "unresponsive",
    ],
    emergencyLine: "This requires immediate emergency medical attention.",
    callAction: "Call 911 immediately",
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
];

export function detectRedFlags(input: string): string[] {
  const lower = input.toLowerCase();
  return RED_FLAG_KEYWORDS.filter((kw) => lower.includes(kw));
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
  const lower = input.toLowerCase();
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
