import type { Drug } from "../types";

export const drugs: Drug[] = [
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    genericName: "ibuprofen",
    brandNames: ["Advil", "Motrin", "Nuprin"],
    category: "Pain Relief",
    activeIngredient: "Ibuprofen",
    description: "An NSAID that relieves pain, reduces fever, and decreases inflammation.",
    uses: [
      "Mild to moderate pain (headache, toothache, muscle ache, menstrual cramps)",
      "Fever reduction in adults and children over 6 months",
      "Inflammation from arthritis or minor injuries",
    ],
    mechanism:
      "Inhibits COX-1 and COX-2 enzymes, blocking prostaglandin synthesis and reducing pain and inflammation signals.",
    dosageForms: ["tablet", "liquid", "capsule", "chewable"],
    commonDoses: [
      "Adults: 200–400 mg every 4–6 hours (max 1,200 mg/day OTC)",
      "Children: 5–10 mg/kg every 6–8 hours",
    ],
    sideEffects: [
      { effect: "Stomach upset or nausea", severity: "common" },
      { effect: "Heartburn", severity: "common" },
      { effect: "Headache", severity: "common" },
      { effect: "Stomach bleeding or ulcers", severity: "serious" },
      { effect: "Kidney damage with long-term use", severity: "serious" },
      { effect: "Increased blood pressure", severity: "serious" },
      { effect: "Allergic reaction (rash, swelling)", severity: "rare" },
    ],
    contraindications: [
      "Allergy to ibuprofen or any NSAID",
      "History of aspirin-induced asthma",
      "Active stomach ulcer or GI bleeding",
      "Severe kidney or liver disease",
      "Last trimester of pregnancy",
    ],
    interactions: [
      {
        drugName: "Aspirin",
        severity: "moderate",
        description:
          "Taking together reduces aspirin's heart-protective effect and increases GI bleed risk.",
      },
      {
        drugName: "Warfarin",
        severity: "severe",
        description:
          "Increases anticoagulant effect significantly; risk of dangerous bleeding.",
      },
      {
        drugName: "Lisinopril",
        severity: "moderate",
        description:
          "NSAIDs can reduce the blood-pressure-lowering effect of ACE inhibitors.",
      },
    ],
    pregnancyCategory: "C",
    pregnancyNote:
      "Avoid in the first and third trimester. Third-trimester use can cause premature closure of the fetal ductus arteriosus.",
    breastfeedingNote:
      "Generally considered safe at low doses for short periods. Consult your doctor.",
    whenToCallDoctor: [
      "Stomach pain that does not improve after 10 days",
      "Fever lasting more than 3 days",
      "Signs of stomach bleeding (black/tarry stools, vomiting blood)",
      "Swelling of hands or feet",
      "Shortness of breath",
    ],
    lastReviewed: "2025-01-15",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["white", "orange", "brown"],
    pillShapes: ["round", "oval", "oblong"],
    imprintExamples: ["I2", "44 183", "ADVIL"],
  },
  {
    id: "acetaminophen",
    name: "Acetaminophen",
    genericName: "acetaminophen",
    brandNames: ["Tylenol", "Panadol", "Feverall"],
    category: "Pain Relief",
    activeIngredient: "Acetaminophen (paracetamol)",
    description: "A widely used analgesic and fever reducer that is gentle on the stomach.",
    uses: [
      "Mild to moderate pain relief (headache, muscle aches, back pain)",
      "Fever reduction for adults and children",
      "Pain relief when NSAIDs are contraindicated",
    ],
    mechanism:
      "Thought to inhibit prostaglandin synthesis in the CNS and raise the pain threshold. Does not significantly inhibit COX enzymes in peripheral tissues, making it gentler on the stomach.",
    dosageForms: ["tablet", "capsule", "liquid", "chewable", "softgel"],
    commonDoses: [
      "Adults: 325–650 mg every 4–6 hours (max 3,000–4,000 mg/day)",
      "Children: 10–15 mg/kg every 4–6 hours",
    ],
    sideEffects: [
      { effect: "Nausea (rare at normal doses)", severity: "common" },
      { effect: "Liver damage with overdose or heavy alcohol use", severity: "serious" },
      { effect: "Rare severe skin reactions (Stevens-Johnson Syndrome)", severity: "rare" },
    ],
    contraindications: [
      "Severe liver disease",
      "Allergy to acetaminophen",
      "Heavy daily alcohol use (3+ drinks/day)",
    ],
    interactions: [
      {
        drugName: "Warfarin",
        severity: "moderate",
        description: "High doses may increase anticoagulant effect.",
      },
      {
        drugName: "Alcohol",
        severity: "severe",
        description:
          "Concurrent heavy alcohol use greatly increases risk of liver toxicity.",
      },
    ],
    pregnancyCategory: "B",
    pregnancyNote:
      "Generally considered the safest OTC pain reliever during pregnancy. Use the lowest effective dose for the shortest time.",
    breastfeedingNote: "Compatible with breastfeeding at recommended doses.",
    whenToCallDoctor: [
      "Pain or fever lasts more than 3 days",
      "Redness or swelling is present",
      "Signs of overdose: nausea, vomiting, stomach pain, confusion, jaundice",
    ],
    lastReviewed: "2025-02-10",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["white", "off-white", "red"],
    pillShapes: ["round", "oval", "oblong"],
    imprintExamples: ["TYLENOL 500", "44 175", "T3"],
  },
  {
    id: "aspirin",
    name: "Aspirin",
    genericName: "aspirin",
    brandNames: ["Bayer", "Bufferin", "Ecotrin"],
    category: "Pain Relief",
    activeIngredient: "Acetylsalicylic acid",
    description:
      "An NSAID used for pain, fever, and inflammation, also prescribed in low doses for cardiovascular protection.",
    uses: [
      "Pain relief (headache, muscle pain, minor arthritis)",
      "Fever reduction",
      "Anti-inflammatory effects",
      "Low-dose: prevention of heart attacks and strokes (Rx use)",
    ],
    mechanism:
      "Irreversibly inhibits COX-1 and COX-2, reducing prostaglandins and thromboxane A2. This anti-platelet effect is why low-dose aspirin protects the heart.",
    dosageForms: ["tablet", "chewable"],
    commonDoses: [
      "Pain/fever: 325–650 mg every 4–6 hours",
      "Heart protection: 81 mg once daily (consult doctor)",
    ],
    sideEffects: [
      { effect: "Stomach irritation", severity: "common" },
      { effect: "Heartburn", severity: "common" },
      { effect: "GI bleeding", severity: "serious" },
      { effect: "Tinnitus (ringing in ears) at high doses", severity: "serious" },
      { effect: "Reye's syndrome in children", severity: "rare" },
    ],
    contraindications: [
      "Children and teenagers with viral illness (Reye's syndrome risk)",
      "Bleeding disorders",
      "Active peptic ulcer",
      "Allergy to NSAIDs",
      "Third trimester of pregnancy",
    ],
    interactions: [
      {
        drugName: "Ibuprofen",
        severity: "moderate",
        description: "Ibuprofen can block aspirin's cardioprotective platelet effect.",
      },
      {
        drugName: "Warfarin",
        severity: "severe",
        description: "Significantly increases bleeding risk when combined.",
      },
    ],
    pregnancyCategory: "D",
    pregnancyNote:
      "Avoid, especially in the third trimester. Can cause premature closure of the ductus arteriosus and maternal/fetal bleeding.",
    breastfeedingNote:
      "Use with caution; small amounts pass into breast milk. Avoid high doses.",
    whenToCallDoctor: [
      "Ringing in ears or hearing loss",
      "Vomiting blood or tarry stools",
      "Severe stomach pain",
      "Signs of allergic reaction",
    ],
    lastReviewed: "2025-01-20",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["white", "off-white"],
    pillShapes: ["round"],
    imprintExamples: ["BAYER", "81", "325"],
  },
  {
    id: "diphenhydramine",
    name: "Diphenhydramine",
    genericName: "diphenhydramine",
    brandNames: ["Benadryl", "ZzzQuil", "Unisom SleepTabs"],
    category: "Allergy",
    activeIngredient: "Diphenhydramine hydrochloride",
    description:
      "A first-generation antihistamine that relieves allergy symptoms and causes drowsiness, often used as a sleep aid.",
    uses: [
      "Allergic reactions (hives, itching, sneezing, runny nose)",
      "Motion sickness",
      "Short-term sleep aid",
      "Relief of cold symptoms",
    ],
    mechanism:
      "Blocks H1 histamine receptors, reducing allergy symptoms. Also crosses the blood-brain barrier, causing sedation.",
    dosageForms: ["tablet", "capsule", "liquid"],
    commonDoses: [
      "Allergy/sleep: 25–50 mg every 4–6 hours",
      "Children (6–12 yrs): 12.5–25 mg every 4–6 hours",
    ],
    sideEffects: [
      { effect: "Drowsiness (significant)", severity: "common" },
      { effect: "Dry mouth, nose, and throat", severity: "common" },
      { effect: "Dizziness", severity: "common" },
      { effect: "Confusion and memory problems in elderly", severity: "serious" },
      { effect: "Urinary retention", severity: "serious" },
    ],
    contraindications: [
      "Glaucoma",
      "Enlarged prostate or bladder obstruction",
      "Severe liver disease",
      "Use with MAOIs",
      "Children under 2 years",
    ],
    interactions: [
      {
        drugName: "Alcohol",
        severity: "severe",
        description: "Dramatically increases CNS depression and sedation.",
      },
      {
        drugName: "MAOIs",
        severity: "severe",
        description: "Can cause severe CNS depression and anticholinergic crisis.",
      },
    ],
    pregnancyCategory: "B",
    pregnancyNote:
      "Generally considered safe, but use the lowest effective dose and avoid in the third trimester.",
    breastfeedingNote:
      "Not recommended — can cause irritability or sedation in infants, and may reduce milk supply.",
    whenToCallDoctor: [
      "Difficulty urinating",
      "Sedation that interferes with daily function",
      "Use in elderly patients with confusion or falls",
    ],
    lastReviewed: "2025-03-05",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["pink", "white"],
    pillShapes: ["oval", "round"],
    imprintExamples: ["44 107", "BENADRYL 25"],
  },
  {
    id: "loratadine",
    name: "Loratadine",
    genericName: "loratadine",
    brandNames: ["Claritin", "Alavert"],
    category: "Allergy",
    activeIngredient: "Loratadine",
    description:
      "A non-drowsy second-generation antihistamine for seasonal and year-round allergies.",
    uses: [
      "Seasonal allergic rhinitis (hay fever)",
      "Perennial allergic rhinitis",
      "Chronic hives (urticaria)",
      "Itchy, watery eyes from allergies",
    ],
    mechanism:
      "Selectively blocks peripheral H1 histamine receptors without significantly crossing the blood-brain barrier, providing allergy relief with minimal sedation.",
    dosageForms: ["tablet", "liquid", "chewable"],
    commonDoses: [
      "Adults and children 6+: 10 mg once daily",
      "Children 2–5 yrs: 5 mg once daily",
    ],
    sideEffects: [
      { effect: "Headache", severity: "common" },
      { effect: "Dry mouth", severity: "common" },
      { effect: "Mild drowsiness (rare)", severity: "common" },
      { effect: "Liver problems with high doses in liver disease", severity: "serious" },
    ],
    contraindications: [
      "Severe liver disease (dose adjustment required)",
      "Allergy to loratadine",
    ],
    interactions: [
      {
        drugName: "Ketoconazole",
        severity: "mild",
        description: "Increases loratadine blood levels; monitor for side effects.",
      },
    ],
    pregnancyCategory: "B",
    pregnancyNote:
      "Generally considered safe. Preferred over older antihistamines during pregnancy.",
    breastfeedingNote:
      "Small amounts pass into breast milk; use with caution and consult your doctor.",
    whenToCallDoctor: [
      "Symptoms do not improve after 3 days",
      "New rash or hives worsen",
      "Signs of serious allergic reaction",
    ],
    lastReviewed: "2025-02-20",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["white"],
    pillShapes: ["round", "oval"],
    imprintExamples: ["L612", "CLARITIN 10"],
  },
  {
    id: "cetirizine",
    name: "Cetirizine",
    genericName: "cetirizine",
    brandNames: ["Zyrtec", "All Day Allergy"],
    category: "Allergy",
    activeIngredient: "Cetirizine hydrochloride",
    description:
      "A second-generation antihistamine with slightly more sedating properties than loratadine, effective for allergy symptoms.",
    uses: [
      "Seasonal and perennial allergic rhinitis",
      "Chronic hives",
      "Allergic conjunctivitis",
    ],
    mechanism:
      "Potent peripheral H1 receptor antagonist. Slightly more CNS penetration than loratadine, which can cause mild drowsiness in some patients.",
    dosageForms: ["tablet", "capsule", "liquid"],
    commonDoses: [
      "Adults and children 6+: 5–10 mg once daily",
      "Children 2–5 yrs: 2.5–5 mg once daily",
    ],
    sideEffects: [
      { effect: "Drowsiness (more likely than loratadine)", severity: "common" },
      { effect: "Dry mouth", severity: "common" },
      { effect: "Headache", severity: "common" },
      { effect: "Fatigue", severity: "common" },
    ],
    contraindications: [
      "Severe kidney impairment (dose reduction required)",
      "Allergy to cetirizine or hydroxyzine",
    ],
    interactions: [
      {
        drugName: "Alcohol",
        severity: "moderate",
        description: "Increases risk of sedation and impaired driving.",
      },
    ],
    pregnancyCategory: "B",
    pregnancyNote: "Generally considered safe during pregnancy. Consult your doctor.",
    breastfeedingNote:
      "Passes into breast milk; use with caution. Loratadine may be preferred.",
    whenToCallDoctor: [
      "Difficulty driving or performing tasks requiring alertness",
      "Symptoms not controlled after 1 week",
    ],
    lastReviewed: "2025-03-10",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["white"],
    pillShapes: ["round", "oblong"],
    imprintExamples: ["Z10", "ZYRTEC 10"],
  },
  {
    id: "pseudoephedrine",
    name: "Pseudoephedrine",
    genericName: "pseudoephedrine",
    brandNames: ["Sudafed", "SudoGest"],
    category: "Cold & Flu",
    activeIngredient: "Pseudoephedrine hydrochloride",
    description:
      "A nasal decongestant that effectively clears stuffy noses. Sold behind the pharmacy counter due to misuse potential.",
    uses: [
      "Nasal congestion from colds, hay fever, or sinusitis",
      "Eustachian tube congestion",
    ],
    mechanism:
      "Acts on alpha-adrenergic receptors in nasal blood vessels, causing vasoconstriction that reduces swelling and congestion.",
    dosageForms: ["tablet"],
    commonDoses: [
      "Immediate release: 60 mg every 4–6 hours",
      "Extended release: 120 mg every 12 hours or 240 mg once daily",
    ],
    sideEffects: [
      { effect: "Increased heart rate", severity: "common" },
      { effect: "Elevated blood pressure", severity: "common" },
      { effect: "Insomnia", severity: "common" },
      { effect: "Nervousness or restlessness", severity: "common" },
      { effect: "Severe hypertension in susceptible individuals", severity: "serious" },
    ],
    contraindications: [
      "Severe or uncontrolled hypertension",
      "Coronary artery disease",
      "Use with MAOIs (within 14 days)",
      "Severe kidney disease",
      "Hyperthyroidism",
    ],
    interactions: [
      {
        drugName: "MAOIs",
        severity: "severe",
        description: "Can cause dangerous hypertensive crisis.",
      },
      {
        drugName: "Beta-blockers",
        severity: "moderate",
        description: "May cause reflex tachycardia and reduce effectiveness of both drugs.",
      },
    ],
    pregnancyCategory: "C",
    pregnancyNote:
      "Use only if clearly needed; may reduce blood flow to the uterus. Avoid in the first trimester.",
    breastfeedingNote:
      "Passes into breast milk; may reduce milk supply. Avoid or use with caution.",
    whenToCallDoctor: [
      "Chest pain or palpitations",
      "Significant increase in blood pressure",
      "Symptoms that do not improve in 7 days",
    ],
    lastReviewed: "2025-01-25",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["red", "white"],
    pillShapes: ["tablet", "oblong"],
    imprintExamples: ["SUDAFED 30", "44 527"],
  },
  {
    id: "dextromethorphan",
    name: "Dextromethorphan",
    genericName: "dextromethorphan",
    brandNames: ["Robitussin DM", "Delsym", "NyQuil (component)"],
    category: "Cold & Flu",
    activeIngredient: "Dextromethorphan hydrobromide",
    description:
      "A cough suppressant that acts on the brain's cough center to reduce the urge to cough.",
    uses: [
      "Temporary relief of dry, irritating cough from colds or flu",
      "Cough suppression when productive coughing is not needed",
    ],
    mechanism:
      "Acts as an NMDA receptor antagonist and sigma-1 receptor agonist in the brainstem, suppressing the cough reflex.",
    dosageForms: ["liquid", "capsule", "tablet"],
    commonDoses: [
      "Adults: 10–20 mg every 4 hours or 30 mg every 6–8 hours",
      "Children 6–11 yrs: 5–10 mg every 4 hours",
    ],
    sideEffects: [
      { effect: "Dizziness", severity: "common" },
      { effect: "Drowsiness", severity: "common" },
      { effect: "Nausea", severity: "common" },
      { effect: "Serotonin syndrome when combined with SSRIs/MAOIs", severity: "serious" },
    ],
    contraindications: [
      "Use with MAOIs (within 14 days)",
      "Children under 4 years",
      "Chronic cough from asthma, COPD, or smoking",
      "Cough with excessive mucus",
    ],
    interactions: [
      {
        drugName: "MAOIs",
        severity: "severe",
        description: "Can cause dangerous serotonin syndrome.",
      },
      {
        drugName: "SSRIs (e.g., fluoxetine)",
        severity: "moderate",
        description: "Increases risk of serotonin syndrome.",
      },
    ],
    pregnancyCategory: "C",
    pregnancyNote:
      "Use only if clearly needed. Limited safety data available. Avoid in first trimester.",
    breastfeedingNote: "Small amounts may pass into breast milk; use with caution.",
    whenToCallDoctor: [
      "Cough lasting more than 7 days",
      "Cough with fever, rash, or persistent headache",
      "Cough producing significant phlegm",
      "Shortness of breath with cough",
    ],
    lastReviewed: "2025-02-15",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["orange", "red"],
    pillShapes: ["capsule", "liquid"],
    imprintExamples: ["DM 30"],
  },
  {
    id: "omeprazole",
    name: "Omeprazole",
    genericName: "omeprazole",
    brandNames: ["Prilosec", "Zegerid"],
    category: "Digestive Health",
    activeIngredient: "Omeprazole",
    description:
      "A proton pump inhibitor (PPI) that reduces stomach acid production, used for heartburn and acid reflux.",
    uses: [
      "Frequent heartburn (2 or more days per week)",
      "Gastroesophageal reflux disease (GERD)",
      "Stomach ulcers",
      "Erosive esophagitis",
    ],
    mechanism:
      "Irreversibly inhibits the H+/K+ ATPase enzyme (proton pump) in stomach lining cells, dramatically reducing acid secretion for up to 24 hours.",
    dosageForms: ["capsule", "tablet"],
    commonDoses: [
      "OTC: 20 mg once daily for up to 14 days",
      "Rx doses vary: 20–40 mg once or twice daily",
    ],
    sideEffects: [
      { effect: "Headache", severity: "common" },
      { effect: "Nausea or diarrhea", severity: "common" },
      { effect: "Abdominal pain", severity: "common" },
      { effect: "Vitamin B12 and magnesium deficiency with long-term use", severity: "serious" },
      { effect: "Increased risk of C. difficile infection", severity: "serious" },
      { effect: "Bone fracture risk with prolonged use", severity: "serious" },
    ],
    contraindications: [
      "Allergy to PPIs or substituted benzimidazoles",
      "Low magnesium levels (without correction)",
    ],
    interactions: [
      {
        drugName: "Clopidogrel",
        severity: "moderate",
        description: "May reduce clopidogrel's antiplatelet effect; consult your doctor.",
      },
      {
        drugName: "Methotrexate",
        severity: "moderate",
        description: "PPIs can increase methotrexate levels and toxicity.",
      },
    ],
    pregnancyCategory: "C",
    pregnancyNote:
      "Use only if clearly needed. Antacids and H2 blockers are generally preferred in pregnancy.",
    breastfeedingNote: "Passes into breast milk; avoid if possible.",
    whenToCallDoctor: [
      "Difficulty swallowing or painful swallowing",
      "Unexplained weight loss",
      "Heartburn does not improve after 14 days of treatment",
      "Vomiting blood or black stools",
    ],
    lastReviewed: "2025-03-01",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["pink", "purple"],
    pillShapes: ["capsule"],
    imprintExamples: ["PRILOSEC 20", "742"],
  },
  {
    id: "ranitidine",
    name: "Famotidine",
    genericName: "famotidine",
    brandNames: ["Pepcid", "Pepcid AC"],
    category: "Digestive Health",
    activeIngredient: "Famotidine",
    description:
      "An H2 receptor blocker that reduces stomach acid, used for heartburn and acid indigestion.",
    uses: [
      "Heartburn and acid indigestion",
      "GERD",
      "Stomach and duodenal ulcers",
      "Prevention of heartburn before meals",
    ],
    mechanism:
      "Blocks H2 receptors on stomach lining cells, reducing histamine-stimulated acid secretion. Works within 1 hour and lasts 10–12 hours.",
    dosageForms: ["tablet"],
    commonDoses: [
      "OTC: 10–20 mg up to twice daily",
      "Rx: 20–40 mg twice daily",
    ],
    sideEffects: [
      { effect: "Headache", severity: "common" },
      { effect: "Constipation or diarrhea", severity: "common" },
      { effect: "Dizziness", severity: "common" },
      { effect: "Confusion in elderly patients", severity: "serious" },
    ],
    contraindications: [
      "Allergy to H2 blockers",
      "Severe kidney impairment (dose reduction required)",
    ],
    interactions: [
      {
        drugName: "Atazanavir",
        severity: "severe",
        description: "H2 blockers reduce atazanavir absorption significantly.",
      },
    ],
    pregnancyCategory: "B",
    pregnancyNote: "Generally considered safe during pregnancy; often used for GERD in pregnancy.",
    breastfeedingNote: "Passes into breast milk in small amounts; generally considered safe.",
    whenToCallDoctor: [
      "Symptoms not controlled after 2 weeks",
      "Difficulty swallowing",
      "Stomach pain that is severe or persistent",
    ],
    lastReviewed: "2025-02-01",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["white", "off-white"],
    pillShapes: ["round", "oval"],
    imprintExamples: ["PEPCID 20", "MSD 963"],
  },
  {
    id: "loperamide",
    name: "Loperamide",
    genericName: "loperamide",
    brandNames: ["Imodium", "Diamode"],
    category: "Digestive Health",
    activeIngredient: "Loperamide hydrochloride",
    description:
      "An anti-diarrheal medication that slows intestinal motility to reduce loose stools.",
    uses: [
      "Acute diarrhea",
      "Traveler's diarrhea",
      "Chronic diarrhea associated with inflammatory bowel disease (under medical supervision)",
    ],
    mechanism:
      "Acts on opioid receptors in the gut wall to slow intestinal movement and increase water and electrolyte absorption.",
    dosageForms: ["tablet", "capsule", "liquid"],
    commonDoses: [
      "Adults: 4 mg initially, then 2 mg after each loose stool (max 16 mg/day)",
      "Children 6–8 yrs: 2 mg initially, then 1 mg after each loose stool",
    ],
    sideEffects: [
      { effect: "Constipation", severity: "common" },
      { effect: "Abdominal cramps", severity: "common" },
      { effect: "Nausea", severity: "common" },
      { effect: "Serious cardiac arrhythmias at very high doses", severity: "serious" },
    ],
    contraindications: [
      "Bloody diarrhea or diarrhea with fever (may indicate bacterial infection)",
      "Children under 2 years",
      "Acute ulcerative colitis",
      "Pseudomembranous colitis",
    ],
    interactions: [
      {
        drugName: "Quinidine or ritonavir",
        severity: "moderate",
        description: "Can increase loperamide blood levels and cardiac risk.",
      },
    ],
    pregnancyCategory: "C",
    pregnancyNote: "Use only if clearly needed; limited data available.",
    breastfeedingNote: "Small amounts may pass into breast milk; generally considered low risk.",
    whenToCallDoctor: [
      "Diarrhea lasting more than 2 days",
      "Blood in stool",
      "Fever above 101°F (38.3°C)",
      "Signs of dehydration (extreme thirst, dark urine, dizziness)",
    ],
    lastReviewed: "2025-01-30",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["green", "white"],
    pillShapes: ["capsule", "tablet"],
    imprintExamples: ["IMODIUM 2", "J&J 2"],
  },
  {
    id: "bismuth-subsalicylate",
    name: "Bismuth Subsalicylate",
    genericName: "bismuth subsalicylate",
    brandNames: ["Pepto-Bismol", "Kaopectate"],
    category: "Digestive Health",
    activeIngredient: "Bismuth subsalicylate",
    description:
      "A multi-purpose digestive remedy that relieves nausea, diarrhea, heartburn, and upset stomach.",
    uses: [
      "Nausea and upset stomach",
      "Diarrhea and traveler's diarrhea",
      "Heartburn and indigestion",
      "Prevention of traveler's diarrhea",
    ],
    mechanism:
      "Has anti-secretory, antimicrobial, and anti-inflammatory effects on the GI tract. The salicylate component reduces fluid secretion; bismuth ions have antibacterial properties.",
    dosageForms: ["liquid", "chewable", "tablet"],
    commonDoses: [
      "Adults: 525 mg every 30–60 minutes as needed (max 8 doses/day)",
      "Children (9–11 yrs): 262 mg every 30–60 minutes",
    ],
    sideEffects: [
      { effect: "Temporary darkening of tongue and stools (harmless)", severity: "common" },
      { effect: "Constipation", severity: "common" },
      { effect: "Tinnitus at high doses (salicylate toxicity)", severity: "serious" },
      { effect: "Reye's syndrome risk in children with viral illness", severity: "rare" },
    ],
    contraindications: [
      "Children and teenagers with viral illness (Reye's syndrome risk)",
      "Allergy to aspirin or salicylates",
      "Taking blood thinners",
      "Pregnancy (especially third trimester)",
    ],
    interactions: [
      {
        drugName: "Aspirin",
        severity: "moderate",
        description: "Combined salicylate load increases risk of toxicity and GI bleeding.",
      },
      {
        drugName: "Tetracycline antibiotics",
        severity: "moderate",
        description: "Bismuth can reduce absorption of tetracyclines.",
      },
    ],
    pregnancyCategory: "C",
    pregnancyNote:
      "Avoid, especially in the third trimester, due to salicylate component.",
    breastfeedingNote: "Not recommended; salicylate passes into breast milk.",
    whenToCallDoctor: [
      "Diarrhea or upset stomach lasting more than 2 days",
      "Ringing in ears",
      "Hearing loss",
    ],
    lastReviewed: "2025-02-25",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: ["pink"],
    pillShapes: ["round", "chewable"],
    imprintExamples: ["PEPTO"],
  },
  {
    id: "hydrocortisone-cream",
    name: "Hydrocortisone Cream",
    genericName: "hydrocortisone",
    brandNames: ["Cortaid", "Cortizone-10", "Aveeno 1% HC"],
    category: "Skin",
    activeIngredient: "Hydrocortisone 1%",
    description:
      "A mild topical corticosteroid that reduces skin inflammation, redness, and itching.",
    uses: [
      "Mild eczema and contact dermatitis",
      "Insect bites and minor skin irritations",
      "Itchy rash from poison ivy, poison oak, or poison sumac",
      "Minor skin inflammation",
    ],
    mechanism:
      "Corticosteroids bind to glucocorticoid receptors, reducing inflammatory cytokines, prostaglandins, and histamine release in the skin.",
    dosageForms: ["cream"],
    commonDoses: [
      "Apply a thin layer to affected area 2–4 times daily",
      "Maximum OTC use: 7 days",
    ],
    sideEffects: [
      { effect: "Mild burning or stinging on application", severity: "common" },
      { effect: "Skin thinning with prolonged use", severity: "serious" },
      { effect: "Stretch marks with long-term use on skin folds", severity: "serious" },
      { effect: "Systemic absorption with extensive use", severity: "rare" },
    ],
    contraindications: [
      "Fungal skin infections (will worsen the infection)",
      "Viral skin infections (herpes, chickenpox)",
      "Bacterial skin infections without antibiotic coverage",
      "Rosacea or perioral dermatitis",
    ],
    interactions: [],
    pregnancyCategory: "C",
    pregnancyNote:
      "Use sparingly and only on small areas. Avoid extensive use, especially in the first trimester.",
    breastfeedingNote:
      "Avoid applying to the breast area; use minimally on other areas.",
    whenToCallDoctor: [
      "Rash not improving after 7 days of use",
      "Signs of skin infection (increasing redness, warmth, pus)",
      "Rash spreading rapidly or covering a large area",
    ],
    lastReviewed: "2025-03-15",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: [],
    pillShapes: [],
    imprintExamples: [],
  },
  {
    id: "clotrimazole",
    name: "Clotrimazole",
    genericName: "clotrimazole",
    brandNames: ["Lotrimin AF", "Canesten", "Mycelex"],
    category: "Skin",
    activeIngredient: "Clotrimazole 1%",
    description:
      "A topical antifungal medication that treats athlete's foot, ringworm, and jock itch.",
    uses: [
      "Athlete's foot (tinea pedis)",
      "Ringworm (tinea corporis)",
      "Jock itch (tinea cruris)",
      "Vaginal yeast infections (different formulation)",
    ],
    mechanism:
      "Inhibits ergosterol synthesis in fungal cell membranes, causing membrane disruption and fungal cell death.",
    dosageForms: ["cream"],
    commonDoses: [
      "Apply a thin layer to the affected area twice daily",
      "Athlete's foot: treat for 4 weeks; ringworm/jock itch: 2–4 weeks",
    ],
    sideEffects: [
      { effect: "Mild burning, stinging, or itching on application", severity: "common" },
      { effect: "Redness at application site", severity: "common" },
      { effect: "Skin blistering (rare)", severity: "rare" },
    ],
    contraindications: [
      "Allergy to clotrimazole or imidazole antifungals",
      "Eye or nail infections (not effective for these)",
    ],
    interactions: [],
    pregnancyCategory: "B",
    pregnancyNote:
      "Generally considered safe for topical use. Vaginal clotrimazole is preferred over oral antifungals in pregnancy.",
    breastfeedingNote: "Topical use considered safe; avoid application to the breast area.",
    whenToCallDoctor: [
      "Infection not improving after 2 weeks of treatment",
      "Infection spreading despite treatment",
      "Signs of bacterial superinfection (warmth, swelling, pus)",
    ],
    lastReviewed: "2025-02-28",
    source: "FDA Drug Label / NIH MedlinePlus",
    otcOrRx: "OTC",
    pillColors: [],
    pillShapes: [],
    imprintExamples: [],
  },
  {
    id: "melatonin",
    name: "Melatonin",
    genericName: "melatonin",
    brandNames: ["ZzzQuil Pure Zzzs", "Natrol", "Nature Made"],
    category: "Sleep",
    activeIngredient: "Melatonin",
    description:
      "A hormone supplement that helps regulate the sleep-wake cycle, used for jet lag and mild insomnia.",
    uses: [
      "Jet lag from long-distance travel",
      "Delayed sleep phase disorder",
      "Shift work sleep disorder",
      "Short-term relief of sleep onset difficulties",
    ],
    mechanism:
      "Melatonin is a naturally occurring hormone produced by the pineal gland. Supplemental melatonin activates MT1 and MT2 receptors to signal the body that it is time to sleep.",
    dosageForms: ["tablet", "capsule", "softgel", "liquid", "chewable"],
    commonDoses: [
      "0.5–5 mg taken 30–60 minutes before bedtime",
      "Start with 0.5–1 mg; increase only if needed",
    ],
    sideEffects: [
      { effect: "Drowsiness the next morning", severity: "common" },
      { effect: "Headache", severity: "common" },
      { effect: "Dizziness", severity: "common" },
      { effect: "Nausea", severity: "common" },
      { effect: "Hormonal effects with long-term use in children (under research)", severity: "serious" },
    ],
    contraindications: [
      "Autoimmune disorders (may stimulate immune function)",
      "Taking immunosuppressants",
      "Use with caution in epilepsy",
    ],
    interactions: [
      {
        drugName: "Warfarin",
        severity: "mild",
        description: "May increase anticoagulant effect; monitor INR.",
      },
      {
        drugName: "Fluvoxamine",
        severity: "moderate",
        description: "Increases melatonin levels significantly.",
      },
    ],
    pregnancyCategory: "N",
    pregnancyNote:
      "Safety in pregnancy not established; use not recommended without medical supervision.",
    breastfeedingNote: "Passes into breast milk; avoid or consult your doctor.",
    whenToCallDoctor: [
      "Persistent sleep difficulties despite 2+ weeks of use",
      "Depression or anxiety accompanying sleep problems",
      "Excessive daytime sleepiness",
    ],
    lastReviewed: "2025-03-20",
    source: "NIH Office of Dietary Supplements",
    otcOrRx: "OTC",
    pillColors: ["white", "yellow", "purple"],
    pillShapes: ["round", "oval", "tablet"],
    imprintExamples: ["MEL 3", "MEL 5"],
  },
  {
    id: "vitamin-d3",
    name: "Vitamin D3",
    genericName: "cholecalciferol",
    brandNames: ["Nature Made", "NatureBell", "Garden of Life"],
    category: "Vitamins",
    activeIngredient: "Cholecalciferol (Vitamin D3)",
    description:
      "A fat-soluble vitamin essential for calcium absorption, bone health, and immune function.",
    uses: [
      "Prevention and treatment of Vitamin D deficiency",
      "Bone health (reduces rickets, osteoporosis risk)",
      "Supporting immune function",
      "Maintaining healthy calcium and phosphate levels",
    ],
    mechanism:
      "Converted in the liver to 25-hydroxyvitamin D, then in the kidneys to the active form 1,25-dihydroxyvitamin D (calcitriol), which promotes calcium and phosphorus absorption.",
    dosageForms: ["tablet", "capsule", "softgel", "liquid"],
    commonDoses: [
      "General adults: 1,000–2,000 IU daily",
      "Deficiency treatment: 2,000–4,000 IU daily (follow lab testing)",
      "Tolerable upper limit: 4,000 IU/day (without medical supervision)",
    ],
    sideEffects: [
      { effect: "Nausea at very high doses", severity: "common" },
      { effect: "Hypercalcemia (excess calcium) with very high doses", severity: "serious" },
      { effect: "Kidney stones with chronic very high intake", severity: "serious" },
    ],
    contraindications: [
      "Hypercalcemia (high blood calcium)",
      "Granulomatous diseases (e.g., sarcoidosis) — increased sensitivity",
      "Severe kidney disease (impaired activation)",
    ],
    interactions: [
      {
        drugName: "Thiazide diuretics",
        severity: "mild",
        description: "May increase risk of hypercalcemia.",
      },
      {
        drugName: "Digoxin",
        severity: "moderate",
        description: "Hypercalcemia from high vitamin D can increase digoxin toxicity.",
      },
    ],
    pregnancyCategory: "A",
    pregnancyNote:
      "Essential during pregnancy. Standard prenatal vitamins include 400–1,000 IU. Do not exceed 4,000 IU/day without medical guidance.",
    breastfeedingNote:
      "Breastfed infants may need additional supplementation (400 IU/day); consult your pediatrician.",
    whenToCallDoctor: [
      "Symptoms of vitamin D toxicity: nausea, vomiting, weakness, frequent urination",
      "Before starting high-dose supplementation (>4,000 IU)",
    ],
    lastReviewed: "2025-03-25",
    source: "NIH Office of Dietary Supplements",
    otcOrRx: "OTC",
    pillColors: ["yellow", "white", "clear"],
    pillShapes: ["softgel", "tablet", "capsule"],
    imprintExamples: ["D3 1000", "D3 2000"],
  },
  {
    id: "metformin",
    name: "Metformin",
    genericName: "metformin",
    brandNames: ["Glucophage", "Fortamet", "Glumetza"],
    category: "Chronic Conditions",
    activeIngredient: "Metformin hydrochloride",
    description:
      "The first-line oral medication for type 2 diabetes, reducing blood glucose without causing significant hypoglycemia.",
    uses: [
      "Type 2 diabetes mellitus (first-line treatment)",
      "Pre-diabetes (off-label, to delay progression)",
      "Polycystic ovary syndrome — PCOS (off-label)",
    ],
    mechanism:
      "Reduces hepatic glucose production, decreases intestinal glucose absorption, and improves insulin sensitivity in peripheral tissues.",
    dosageForms: ["tablet"],
    commonDoses: [
      "Starting: 500 mg twice daily with meals",
      "Maintenance: 1,000–2,550 mg per day in divided doses",
    ],
    sideEffects: [
      { effect: "Nausea, vomiting, diarrhea (common at start)", severity: "common" },
      { effect: "Metallic taste", severity: "common" },
      { effect: "Lactic acidosis (rare but serious)", severity: "serious" },
      { effect: "Vitamin B12 deficiency with long-term use", severity: "serious" },
    ],
    contraindications: [
      "Severe kidney disease (eGFR < 30 mL/min/1.73 m²)",
      "Acute or chronic metabolic acidosis",
      "Liver disease",
      "Hold before surgery or contrast dye procedures",
    ],
    interactions: [
      {
        drugName: "Iodinated contrast agents",
        severity: "severe",
        description: "Hold metformin before and 48 hours after contrast imaging to prevent lactic acidosis.",
      },
      {
        drugName: "Alcohol",
        severity: "moderate",
        description: "Increases risk of lactic acidosis.",
      },
    ],
    pregnancyCategory: "B",
    pregnancyNote:
      "Used in gestational diabetes and PCOS in pregnancy; consult your endocrinologist.",
    breastfeedingNote: "Passes into breast milk in small amounts; generally considered safe.",
    whenToCallDoctor: [
      "Unusual muscle pain, difficulty breathing, or unusual sleepiness (signs of lactic acidosis — go to ER)",
      "Blood sugar not controlled despite medication",
      "Before any surgery or imaging with contrast dye",
    ],
    lastReviewed: "2025-01-10",
    source: "FDA Drug Label / ADA Standards of Care",
    otcOrRx: "Rx",
    pillColors: ["white", "off-white"],
    pillShapes: ["round", "oblong"],
    imprintExamples: ["BMS 6070 500", "GLUCOPHAGE 500"],
  },
  {
    id: "lisinopril",
    name: "Lisinopril",
    genericName: "lisinopril",
    brandNames: ["Prinivil", "Zestril"],
    category: "Chronic Conditions",
    activeIngredient: "Lisinopril",
    description:
      "An ACE inhibitor used to treat high blood pressure, heart failure, and to protect kidneys in diabetes.",
    uses: [
      "Hypertension (high blood pressure)",
      "Heart failure",
      "After a heart attack to reduce heart damage",
      "Diabetic nephropathy (kidney protection)",
    ],
    mechanism:
      "Inhibits angiotensin-converting enzyme (ACE), reducing production of angiotensin II and causing blood vessel dilation and reduced blood pressure.",
    dosageForms: ["tablet"],
    commonDoses: [
      "Hypertension: 5–40 mg once daily",
      "Heart failure: starting 2.5–5 mg, up to 40 mg daily",
    ],
    sideEffects: [
      { effect: "Dry persistent cough (very common)", severity: "common" },
      { effect: "Dizziness on standing (orthostatic hypotension)", severity: "common" },
      { effect: "Elevated potassium (hyperkalemia)", severity: "serious" },
      { effect: "Angioedema (swelling of face/throat — rare but life-threatening)", severity: "rare" },
      { effect: "Kidney function decline in certain patients", severity: "serious" },
    ],
    contraindications: [
      "History of ACE inhibitor-induced angioedema",
      "Pregnancy (all trimesters)",
      "Combined use with aliskiren in patients with diabetes",
      "Bilateral renal artery stenosis",
    ],
    interactions: [
      {
        drugName: "Potassium supplements or potassium-sparing diuretics",
        severity: "severe",
        description: "Can cause dangerous hyperkalemia (high potassium).",
      },
      {
        drugName: "NSAIDs (ibuprofen, naproxen)",
        severity: "moderate",
        description: "Reduce antihypertensive effect and increase risk of kidney damage.",
      },
    ],
    pregnancyCategory: "D",
    pregnancyNote:
      "CONTRAINDICATED in pregnancy — can cause fetal renal dysplasia and death. Must be discontinued immediately if pregnancy is detected.",
    breastfeedingNote: "Use with caution; limited data available.",
    whenToCallDoctor: [
      "Swelling of face, lips, tongue, or throat — go to ER immediately (angioedema)",
      "Persistent cough that is bothersome",
      "Dizziness when standing",
      "Decreased urine output",
    ],
    lastReviewed: "2025-01-05",
    source: "FDA Drug Label / JNC Guidelines",
    otcOrRx: "Rx",
    pillColors: ["white", "pink"],
    pillShapes: ["round"],
    imprintExamples: ["ZESTRIL 10", "PRINIVIL 10", "L10"],
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    genericName: "atorvastatin",
    brandNames: ["Lipitor"],
    category: "Chronic Conditions",
    activeIngredient: "Atorvastatin calcium",
    description:
      "A statin medication that lowers cholesterol and reduces the risk of heart attack and stroke.",
    uses: [
      "High LDL cholesterol (hypercholesterolemia)",
      "Prevention of heart attack and stroke in high-risk patients",
      "Reduction of triglycerides",
      "Familial hypercholesterolemia",
    ],
    mechanism:
      "Inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis in the liver, reducing LDL-C and triglycerides while modestly increasing HDL-C.",
    dosageForms: ["tablet"],
    commonDoses: [
      "Starting: 10–20 mg once daily (in the evening)",
      "High-intensity: 40–80 mg once daily",
    ],
    sideEffects: [
      { effect: "Muscle aches (myalgia)", severity: "common" },
      { effect: "Headache", severity: "common" },
      { effect: "Nausea", severity: "common" },
      { effect: "Liver enzyme elevation", severity: "serious" },
      { effect: "Rhabdomyolysis (rare severe muscle breakdown)", severity: "rare" },
      { effect: "New-onset diabetes (slight increase in risk)", severity: "serious" },
    ],
    contraindications: [
      "Active liver disease",
      "Pregnancy and breastfeeding",
      "Allergy to statins",
    ],
    interactions: [
      {
        drugName: "Clarithromycin or certain antifungals",
        severity: "severe",
        description: "Inhibit atorvastatin metabolism, dramatically increasing statin levels and myopathy risk.",
      },
      {
        drugName: "Niacin or fibrates",
        severity: "moderate",
        description: "Increased risk of muscle problems (myopathy).",
      },
    ],
    pregnancyCategory: "X",
    pregnancyNote:
      "CONTRAINDICATED in pregnancy — cholesterol is essential for fetal development. Discontinue immediately if pregnant.",
    breastfeedingNote: "Contraindicated; may harm the nursing infant.",
    whenToCallDoctor: [
      "Unexplained muscle pain, weakness, or tenderness",
      "Dark or tea-colored urine (sign of rhabdomyolysis)",
      "Signs of liver problems: jaundice, severe abdominal pain",
    ],
    lastReviewed: "2025-02-05",
    source: "FDA Drug Label / ACC/AHA Guidelines",
    otcOrRx: "Rx",
    pillColors: ["white"],
    pillShapes: ["oval"],
    imprintExamples: ["PD 155 10", "PD 156 20", "LIPITOR 40"],
  },
  {
    id: "levothyroxine",
    name: "Levothyroxine",
    genericName: "levothyroxine sodium",
    brandNames: ["Synthroid", "Levoxyl", "Tirosint"],
    category: "Chronic Conditions",
    activeIngredient: "Levothyroxine sodium (T4)",
    description:
      "A synthetic thyroid hormone used to treat hypothyroidism and thyroid-related conditions.",
    uses: [
      "Hypothyroidism (underactive thyroid)",
      "Thyroid cancer (suppression of TSH after surgery)",
      "Goiter (thyroid enlargement)",
      "Myxedema coma (emergency IV form)",
    ],
    mechanism:
      "Provides exogenous thyroxine (T4), which is converted peripherally to the active T3, regulating metabolism, heart rate, body temperature, and numerous organ functions.",
    dosageForms: ["tablet"],
    commonDoses: [
      "Hypothyroidism: typically 1.6 mcg/kg/day; individualized by TSH levels",
      "Starting dose in elderly: 25–50 mcg/day, titrated slowly",
    ],
    sideEffects: [
      { effect: "Heart palpitations or rapid heartbeat (if dose too high)", severity: "serious" },
      { effect: "Insomnia or nervousness (over-replacement)", severity: "common" },
      { effect: "Weight changes", severity: "common" },
      { effect: "Bone loss with long-term over-replacement", severity: "serious" },
      { effect: "Heat intolerance", severity: "common" },
    ],
    contraindications: [
      "Uncorrected adrenal insufficiency (may trigger adrenal crisis)",
      "Recent heart attack (use caution)",
      "Untreated thyrotoxicosis",
    ],
    interactions: [
      {
        drugName: "Calcium supplements or antacids",
        severity: "moderate",
        description: "Reduce levothyroxine absorption; take levothyroxine 4 hours apart.",
      },
      {
        drugName: "Warfarin",
        severity: "moderate",
        description: "Levothyroxine increases sensitivity to warfarin; INR must be monitored.",
      },
    ],
    pregnancyCategory: "A",
    pregnancyNote:
      "Essential during pregnancy — thyroid hormone requirements increase. Dose adjustment is typically needed in the first trimester. Do not stop taking without consulting your doctor.",
    breastfeedingNote:
      "Safe during breastfeeding at therapeutic doses; essential for the mother's health.",
    whenToCallDoctor: [
      "Heart palpitations, chest pain, or shortness of breath",
      "Significant weight change",
      "Extreme fatigue, cold intolerance (under-treatment)",
      "Missed doses or change in brand of medication",
    ],
    lastReviewed: "2025-03-12",
    source: "FDA Drug Label / ATA Guidelines",
    otcOrRx: "Rx",
    pillColors: ["white", "orange", "yellow", "blue", "pink", "purple", "green"],
    pillShapes: ["round"],
    imprintExamples: ["SYNTHROID 50", "SYNTHROID 100", "L50"],
  },
];
