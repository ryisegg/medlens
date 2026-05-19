import type { DrugCategory } from "../types";

export const DRUG_CATEGORY_ZH: Record<DrugCategory, string> = {
  "Pain Relief":        "止痛",
  "Allergy":            "抗过敏",
  "Cold & Flu":         "感冒流感",
  "Digestive Health":   "消化",
  "Skin":               "皮肤",
  "Sleep":              "睡眠",
  "Vitamins":           "维生素",
  "Chronic Conditions": "慢性病",
};

// Drug name EN → ZH translations
export const DRUG_NAME_ZH: Record<string, string> = {
  ibuprofen: "布洛芬",
  acetaminophen: "对乙酰氨基酚",
  aspirin: "阿司匹林",
  loratadine: "氯雷他定",
  cetirizine: "西替利嗪",
  fexofenadine: "非索非那定",
  diphenhydramine: "苯海拉明",
  pseudoephedrine: "伪麻黄碱",
  dextromethorphan: "右美沙芬",
  guaifenesin: "愈创甘油醚",
  amoxicillin: "阿莫西林",
  omeprazole: "奥美拉唑",
  famotidine: "法莫替丁",
  ranitidine: "雷尼替丁",
  loperamide: "洛哌丁胺",
  "bismuth subsalicylate": "次水杨酸铋",
  "bismuth-subsalicylate": "次水杨酸铋",
  metformin: "二甲双胍",
  atorvastatin: "阿托伐他汀",
  lisinopril: "赖诺普利",
  amlodipine: "氨氯地平",
  simvastatin: "辛伐他汀",
  losartan: "氯沙坦",
  azithromycin: "阿奇霉素",
  prednisone: "泼尼松",
  albuterol: "沙丁胺醇",
  gabapentin: "加巴喷丁",
  sertraline: "舍曲林",
  fluoxetine: "氟西汀",
  pantoprazole: "泮托拉唑",
  naproxen: "萘普生",
  melatonin: "褪黑素",
  "vitamin d3": "维生素D3",
  "vitamin d": "维生素D",
  levothyroxine: "左甲状腺素",
  hydrocortisone: "氢化可的松",
  clotrimazole: "克霉唑",
  warfarin: "华法林",
  metoprolol: "美托洛尔",
  clopidogrel: "氯吡格雷",
  furosemide: "呋塞米",
  escitalopram: "艾司西酞普兰",
  alprazolam: "阿普唑仑",
  tramadol: "曲马多",
  oxycodone: "羟考酮",
};

// Symptom category name EN → ZH
export const SYMPTOM_CATEGORY_ZH: Record<string, string> = {
  "Pain Relievers (NSAIDs)": "非甾体抗炎药 (NSAIDs)",
  "Acetaminophen": "对乙酰氨基酚",
  "Fever Reducers": "退烧药",
  "Cough Suppressants": "止咳药",
  "Expectorants": "祛痰药",
  "Decongestants": "减充血剂",
  "Non-Drowsy Antihistamines": "非嗜睡抗组胺药",
  "Sedating Antihistamines": "镇静抗组胺药",
  "Proton Pump Inhibitors (PPIs)": "质子泵抑制剂 (PPIs)",
  "H2 Blockers": "H2受体拮抗剂",
  "Anti-Diarrheal": "止泻药",
  "Bismuth-Based Digestive Relief": "铋制剂消化药",
  "Sleep Aids": "助眠药",
  "Topical Corticosteroids": "局部皮质激素",
  "Antifungal Creams": "抗真菌乳膏",
  "Pain Relievers for Throat": "咽喉止痛药",
  "NSAIDs / Pain Relievers": "非甾体抗炎药 / 止痛药",
  "NSAIDs for Back Pain": "用于背痛的非甾体抗炎药",
  "Muscle Relaxants (Rx)": "肌肉松弛剂（处方药）",
  "Osmotic Laxatives": "渗透性泻药",
  "Fiber Supplements": "纤维素补充剂",
  "NSAIDs for Joint Pain": "用于关节痛的非甾体抗炎药",
  "Glucosamine / Chondroitin": "氨基葡萄糖 / 软骨素",
  "Artificial Tears / Lubricating Eye Drops": "人工泪液 / 润眼液",
  "OTC Antihistamine Eye Drops": "非处方抗组胺滴眼液",
  "NSAIDs for Menstrual Pain": "用于经期疼痛的非甾体抗炎药",
  "OTC Pain Relievers for Dental Pain": "牙痛非处方止痛药",
  "Topical Oral Anesthetics": "口腔局部麻醉药",
  "General Wellness Note": "健康提示",
  "Iron / B12 Deficiency Check": "铁 / 维生素B12缺乏排查",
  "Vitamin D Supplementation": "维生素D补充",
};

// ZH symptom keywords → EN equivalents for matching
const ZH_SYMPTOM_TO_EN: Record<string, string[]> = {
  "头痛": ["headache"],
  "头疼": ["headache"],
  "偏头痛": ["migraine", "headache"],
  "发烧": ["fever"],
  "发热": ["fever"],
  "高烧": ["fever"],
  "体温高": ["high temperature", "fever"],
  "咳嗽": ["cough"],
  "干咳": ["dry cough", "cough"],
  "咳痰": ["productive cough", "cough"],
  "喉咙痛": ["sore throat"],
  "咽痛": ["sore throat"],
  "咽喉痛": ["sore throat"],
  "咽炎": ["sore throat", "pharyngitis"],
  "过敏": ["allergy"],
  "过敏症": ["allergy"],
  "花粉症": ["hay fever", "allergy"],
  "流鼻涕": ["runny nose"],
  "鼻塞": ["stuffy nose", "congestion"],
  "鼻子不通": ["stuffy nose", "congestion"],
  "鼻窦": ["sinus"],
  "胃痛": ["stomach pain", "stomach ache"],
  "腹痛": ["stomach pain"],
  "胃酸": ["heartburn", "acid reflux"],
  "胃灼热": ["heartburn"],
  "反酸": ["acid reflux"],
  "消化不良": ["indigestion"],
  "腹泻": ["diarrhea"],
  "拉肚子": ["diarrhea"],
  "恶心": ["nausea"],
  "想吐": ["nausea"],
  "呕吐": ["nausea", "vomiting"],
  "失眠": ["insomnia", "trouble sleeping"],
  "睡不着": ["insomnia", "can't sleep"],
  "睡眠差": ["sleep problems"],
  "皮疹": ["rash"],
  "皮肤痒": ["itchy skin"],
  "瘙痒": ["itchy skin", "itch"],
  "荨麻疹": ["hives"],
  "肌肉痛": ["muscle pain", "body ache"],
  "全身酸痛": ["body ache", "muscle pain"],
  "身体酸痛": ["body ache"],
  "背痛": ["back pain"],
  "腰痛": ["lower back", "back pain"],
  "关节痛": ["joint pain"],
  "关节炎": ["arthritis", "joint pain"],
  "便秘": ["constipation"],
  "眼睛不适": ["eye irritation"],
  "眼干": ["dry eye"],
  "眼痒": ["itchy eye"],
  "眼红": ["red eye"],
  "经期疼痛": ["period pain", "menstrual cramp"],
  "痛经": ["period pain", "menstrual cramp"],
  "生理期痛": ["period pain"],
  "牙痛": ["toothache"],
  "牙疼": ["toothache"],
  "焦虑": ["anxiety"],
  "紧张": ["anxiety"],
  "压力大": ["stress", "anxiety"],
  "疲劳": ["fatigue"],
  "乏力": ["fatigue"],
  "没精神": ["fatigue"],
  "疲惫": ["fatigue"],
};

export function normalizeSymptomInput(input: string): string {
  let result = input;
  for (const [zhKw, enEquivs] of Object.entries(ZH_SYMPTOM_TO_EN)) {
    if (result.includes(zhKw)) {
      result = result.replace(zhKw, enEquivs[0]);
    }
  }
  return result;
}

export function translateDrugName(name: string, language: string): string {
  if (language !== "zh") return name;
  const key = name.toLowerCase().trim();
  if (DRUG_NAME_ZH[key]) return `${DRUG_NAME_ZH[key]} (${name})`;
  for (const [k, v] of Object.entries(DRUG_NAME_ZH)) {
    if (key.includes(k) || k.includes(key)) return `${v} (${name})`;
  }
  return name;
}

export function translateDrugNameOnly(name: string): string {
  const key = name.toLowerCase().trim();
  if (DRUG_NAME_ZH[key]) return DRUG_NAME_ZH[key];
  for (const [k, v] of Object.entries(DRUG_NAME_ZH)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return name;
}

export function translateCategory(categoryName: string): string {
  return SYMPTOM_CATEGORY_ZH[categoryName] ?? categoryName;
}
