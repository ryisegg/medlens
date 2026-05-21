import type { TCMMeridian } from "../types/tcm";

// ── Meridians (12) ────────────────────────────────────────────────────────
export const TCM_MERIDIAN_EN: Record<TCMMeridian, string> = {
  "心":   "Heart",
  "肝":   "Liver",
  "脾":   "Spleen",
  "肺":   "Lung",
  "肾":   "Kidney",
  "胃":   "Stomach",
  "大肠": "Large Intestine",
  "小肠": "Small Intestine",
  "膀胱": "Bladder",
  "胆":   "Gallbladder",
  "三焦": "Triple Burner",
  "心包": "Pericardium",
};

// ── Common TCM Functions (功效) ────────────────────────────────────────────
export const TCM_FUNCTION_EN: Record<string, string> = {
  // Qi/Blood/Yin/Yang tonification
  "补气":       "Tonify Qi",
  "大补元气":   "Strongly Tonify Original Qi",
  "补气升阳":   "Tonify Qi, Lift Yang",
  "补气健脾":   "Tonify Qi, Strengthen Spleen",
  "补脾益肺":   "Tonify Spleen, Benefit Lung",
  "补脾止泻":   "Tonify Spleen, Stop Diarrhea",
  "健脾":       "Strengthen Spleen",
  "健脾止泻":   "Strengthen Spleen, Stop Diarrhea",
  "健脾益胃":   "Strengthen Spleen, Benefit Stomach",
  "益气":       "Benefit Qi",
  "益气固表":   "Benefit Qi, Stabilize Exterior",
  "益气养阴":   "Benefit Qi, Nourish Yin",
  "补血":       "Tonify Blood",
  "养血":       "Nourish Blood",
  "活血":       "Invigorate Blood",
  "补血滋阴":   "Tonify Blood, Nourish Yin",
  "补阴":       "Tonify Yin",
  "滋阴":       "Nourish Yin",
  "滋阴润肺":   "Nourish Yin, Moisten Lung",
  "养阴清肺":   "Nourish Yin, Clear Lung Heat",
  "养阴润燥":   "Nourish Yin, Moisten Dryness",
  "补阳":       "Tonify Yang",
  "补肾阳":     "Tonify Kidney Yang",
  "补肾壮阳":   "Tonify Kidney, Strengthen Yang",
  "补火助阳":   "Supplement Fire, Assist Yang",
  "回阳救逆":   "Restore Yang, Rescue from Collapse",
  "复脉固脱":   "Restore Pulse, Stabilize Collapse",
  "升阳":       "Lift Yang",

  // Heat clearing
  "清热":       "Clear Heat",
  "清热解毒":   "Clear Heat, Resolve Toxicity",
  "清热燥湿":   "Clear Heat, Dry Dampness",
  "清热泻火":   "Clear Heat, Drain Fire",
  "清热凉血":   "Clear Heat, Cool Blood",
  "清热利湿":   "Clear Heat, Drain Dampness",
  "清热明目":   "Clear Heat, Brighten Eyes",
  "凉血":       "Cool Blood",
  "凉血止血":   "Cool Blood, Stop Bleeding",
  "泻火":       "Drain Fire",
  "泻火除烦":   "Drain Fire, Eliminate Irritability",
  "退虚热":     "Reduce Deficient Heat",

  // Exterior releasing
  "解表":       "Release Exterior",
  "解表散寒":   "Release Exterior, Dispel Cold",
  "疏散风热":   "Disperse Wind-Heat",
  "祛风解表":   "Dispel Wind, Release Exterior",
  "发汗解表":   "Induce Sweating, Release Exterior",
  "宣肺":       "Diffuse Lung Qi",
  "宣肺平喘":   "Diffuse Lung, Calm Wheezing",
  "宣肺化痰":   "Diffuse Lung, Resolve Phlegm",
  "宣肺透疹":   "Diffuse Lung, Vent Rashes",
  "升阳举陷":   "Lift Yang, Raise Sunken Qi",

  // Blood/Stasis
  "活血化瘀":   "Invigorate Blood, Resolve Stasis",
  "活血止痛":   "Invigorate Blood, Stop Pain",
  "活血通经":   "Invigorate Blood, Unblock Channels",
  "化瘀":       "Resolve Blood Stasis",
  "祛瘀止痛":   "Dispel Stasis, Stop Pain",
  "逐瘀通经":   "Expel Stasis, Unblock Channels",
  "散瘀":       "Disperse Stasis",
  "散瘀止痛":   "Disperse Stasis, Stop Pain",

  // Qi regulating
  "理气":       "Regulate Qi",
  "行气":       "Move Qi",
  "理气和胃":   "Regulate Qi, Harmonize Stomach",
  "理气止痛":   "Regulate Qi, Stop Pain",
  "疏肝":       "Soothe Liver",
  "疏肝理气":   "Soothe Liver, Regulate Qi",
  "疏肝解郁":   "Soothe Liver, Resolve Constraint",
  "降逆":       "Direct Qi Downward",
  "降逆止呕":   "Direct Qi Downward, Stop Vomiting",
  "降气":       "Direct Qi Downward",

  // Phlegm/Cough
  "化痰":       "Resolve Phlegm",
  "化痰止咳":   "Resolve Phlegm, Stop Cough",
  "止咳":       "Stop Cough",
  "止咳平喘":   "Stop Cough, Calm Wheezing",
  "清肺化痰":   "Clear Lung Heat, Resolve Phlegm",
  "润肺止咳":   "Moisten Lung, Stop Cough",
  "燥湿化痰":   "Dry Dampness, Resolve Phlegm",

  // Dampness
  "利水":       "Promote Urination",
  "利水消肿":   "Promote Urination, Reduce Swelling",
  "利水渗湿":   "Promote Urination, Drain Dampness",
  "利湿":       "Drain Dampness",
  "利湿退黄":   "Drain Dampness, Reduce Jaundice",
  "燥湿":       "Dry Dampness",
  "化湿":       "Transform Dampness",
  "芳香化湿":   "Aromatically Transform Dampness",
  "祛湿":       "Dispel Dampness",
  "渗湿":       "Drain Dampness",

  // Calming spirit
  "安神":       "Calm Spirit",
  "养心安神":   "Nourish Heart, Calm Spirit",
  "重镇安神":   "Heavily Anchor and Calm Spirit",
  "安神益智":   "Calm Spirit, Sharpen Mind",
  "宁心安神":   "Quiet Heart, Calm Spirit",

  // Wind/Liver
  "平肝":       "Calm Liver",
  "平肝息风":   "Calm Liver, Extinguish Wind",
  "平肝潜阳":   "Calm Liver, Subdue Yang",
  "息风":       "Extinguish Wind",
  "息风止痉":   "Extinguish Wind, Stop Spasms",

  // Interior warming
  "温里":       "Warm the Interior",
  "温中":       "Warm the Middle",
  "温中散寒":   "Warm the Middle, Dispel Cold",
  "温经":       "Warm Channels",
  "温经止血":   "Warm Channels, Stop Bleeding",
  "散寒":       "Dispel Cold",
  "散寒止痛":   "Dispel Cold, Stop Pain",

  // Astringents/Stop bleeding
  "收涩":       "Astringe and Restrain",
  "止血":       "Stop Bleeding",
  "止汗":       "Stop Sweating",
  "敛肺":       "Astringe Lung Qi",
  "敛肺止咳":   "Astringe Lung, Stop Cough",
  "涩肠":       "Bind the Intestines",
  "涩肠止泻":   "Bind Intestines, Stop Diarrhea",
  "固表":       "Stabilize Exterior",
  "固表止汗":   "Stabilize Exterior, Stop Sweating",
  "固精":       "Stabilize Essence",

  // Digestive
  "消食":       "Reduce Food Stagnation",
  "消食化积":   "Reduce Food Stagnation, Disperse Accumulation",
  "消积":       "Disperse Accumulation",

  // Purgative
  "泻下":       "Purgative",
  "润肠":       "Moisten Intestines",
  "润肠通便":   "Moisten Intestines, Unblock Bowels",
  "通便":       "Unblock Bowels",
  "泻下攻积":   "Purge Accumulation",

  // Misc
  "祛风":       "Dispel Wind",
  "祛风湿":     "Dispel Wind-Damp",
  "祛风通络":   "Dispel Wind, Unblock Channels",
  "强筋骨":     "Strengthen Sinews and Bones",
  "通经":       "Unblock Channels",
  "通络":       "Unblock Collaterals",
  "止痛":       "Stop Pain",
  "解毒":       "Resolve Toxicity",
  "排脓":       "Expel Pus",
  "消肿":       "Reduce Swelling",
  "消肿散结":   "Reduce Swelling, Dissipate Nodules",
  "明目":       "Brighten Eyes",
  "生津":       "Generate Fluids",
  "生津止渴":   "Generate Fluids, Quench Thirst",
  "生津养血":   "Generate Fluids, Nourish Blood",
  "安胎":       "Calm Fetus",
  "回乳":       "Reduce Lactation",
  "纳气":       "Grasp the Qi",
  "纳气平喘":   "Grasp Qi, Calm Wheezing",
  "引火归元":   "Lead Fire Back to its Source",
  "调经":       "Regulate Menses",
  "调经止痛":   "Regulate Menses, Stop Pain",
  "通鼻窍":     "Unblock the Nose",
  "利咽":       "Benefit the Throat",
  "解郁":       "Resolve Constraint",
  "开窍":       "Open the Orifices",
  "祛痰开窍":   "Resolve Phlegm, Open Orifices",
  "交通心肾":   "Communicate Heart and Kidney",
  "缓急止痛":   "Relax Spasms, Stop Pain",
  "和中":       "Harmonize the Middle",
  "和胃":       "Harmonize Stomach",
  "和中止呕":   "Harmonize Middle, Stop Vomiting",
  "调和诸药":   "Harmonize Other Herbs",
  "化浊降脂":   "Resolve Turbidity, Reduce Lipids",
};

// ── Common TCM Indications (主治) ──────────────────────────────────────────
export const TCM_INDICATION_EN: Record<string, string> = {
  // Constitutional
  "体虚欲脱":   "Severe constitutional collapse",
  "脾虚食少":   "Spleen deficiency with poor appetite",
  "气虚乏力":   "Qi deficiency with fatigue",
  "气血不足":   "Qi and blood deficiency",
  "血虚萎黄":   "Blood deficiency with sallow complexion",
  "中气下陷":   "Sinking of middle qi",
  "脾虚泄泻":   "Spleen deficiency diarrhea",
  "脾虚久泻":   "Chronic diarrhea from spleen deficiency",

  // Common cold patterns
  "风寒感冒":   "Wind-cold common cold",
  "风热感冒":   "Wind-heat common cold",
  "外感表证":   "Exterior pattern from external invasion",
  "外感风寒":   "External wind-cold invasion",

  // Heat patterns
  "湿热黄疸":   "Damp-heat jaundice",
  "湿热泻痢":   "Damp-heat diarrhea/dysentery",
  "热病心烦":   "Heat disease with irritability",
  "目赤肿痛":   "Red, swollen, painful eyes",
  "咽喉肿痛":   "Sore throat",
  "痈肿疮毒":   "Sores, carbuncles, and toxic swellings",
  "痈肿疔疮":   "Boils, carbuncles, and toxic sores",
  "热毒疮肿":   "Toxic heat sores and swellings",
  "血热吐衄":   "Heat in blood with vomiting/nosebleed",
  "血热妄行":   "Reckless movement of hot blood",

  // Yin/Blood deficiency
  "阴虚火旺":   "Yin deficiency with effulgent fire",
  "阴虚燥咳":   "Dry cough from yin deficiency",
  "肺阴虚":     "Lung yin deficiency",
  "胃阴虚":     "Stomach yin deficiency",
  "肝肾阴虚":   "Liver-kidney yin deficiency",
  "骨蒸潮热":   "Steaming bone tidal fever",
  "津伤口渴":   "Fluid damage with thirst",
  "内热消渴":   "Internal heat wasting-thirst (diabetes)",
  "肠燥便秘":   "Constipation from intestinal dryness",

  // Yang/Cold patterns
  "肾阳虚衰":   "Kidney yang decline",
  "腰膝酸软":   "Lumbar/knee weakness and soreness",
  "阳痿遗精":   "Impotence and seminal emission",
  "肢冷脉微":   "Cold limbs with feeble pulse",
  "脘腹冷痛":   "Cold abdominal pain",
  "宫冷不孕":   "Infertility from cold uterus",
  "亡阳欲脱":   "Yang collapse",

  // Cough/Phlegm
  "肺热燥咳":   "Lung heat with dry cough",
  "痰热咳喘":   "Phlegm-heat cough and wheezing",
  "肺虚喘咳":   "Lung deficiency wheezing/cough",
  "咳嗽痰多":   "Cough with copious phlegm",
  "干咳少痰":   "Dry cough with scant phlegm",

  // Digestive
  "胃脘胀满":   "Epigastric distension",
  "脘腹胀痛":   "Epigastric/abdominal distension and pain",
  "食积不消":   "Undigested food stagnation",
  "饮食积滞":   "Food and drink stagnation",
  "呕吐泄泻":   "Vomiting and diarrhea",
  "大便秘结":   "Constipation",
  "腹胀泄泻":   "Abdominal distension with diarrhea",

  // Gynecology
  "月经不调":   "Menstrual irregularities",
  "经闭痛经":   "Amenorrhea with painful menstruation",
  "崩漏":       "Excessive uterine bleeding",
  "崩漏下血":   "Uterine bleeding",
  "胎动不安":   "Restless fetus",

  // Cardiovascular/Stasis
  "胸痹心痛":   "Chest blockage with cardiac pain",
  "心悸怔忡":   "Palpitations",
  "瘀血肿块":   "Blood stasis masses",
  "跌打损伤":   "Traumatic injuries",
  "跌打肿痛":   "Traumatic injury swelling and pain",

  // Sleep/Mind
  "失眠多梦":   "Insomnia with excessive dreaming",
  "虚烦失眠":   "Deficient irritability with insomnia",
  "心烦不眠":   "Vexation and insomnia",
  "心悸失眠":   "Palpitations and insomnia",
  "健忘惊悸":   "Forgetfulness with palpitations",

  // Wind/Liver
  "肝风内动":   "Internal stirring of liver wind",
  "肝火头痛":   "Liver fire headache",
  "肝阳上亢":   "Ascendant liver yang",
  "头痛眩晕":   "Headache and dizziness",
  "惊痫抽搐":   "Convulsions and seizures",

  // Urinary
  "小便不利":   "Difficult urination",
  "水肿":       "Edema",
  "热淋涩痛":   "Hot painful strangury",
  "尿频遗尿":   "Frequent urination, enuresis",

  // Rheumatic
  "风湿痹痛":   "Wind-damp painful obstruction",
  "风寒湿痹":   "Wind-cold-damp obstruction",
  "肢体麻木":   "Numbness of the limbs",
  "腰膝冷痛":   "Cold pain in the lower back and knees",

  // Skin
  "风疹瘙痒":   "Wind rash with itching",
  "湿疮瘙痒":   "Damp sores with itching",
  "麻疹不透":   "Incomplete eruption of measles",

  // Bleeding
  "吐血咯血":   "Hematemesis and hemoptysis",
  "便血尿血":   "Bloody stool and urine",
};

// ── Helpers ────────────────────────────────────────────────────────────────

const SEPARATORS = /[，、；,]/;

/** Translate a TCM function string. Best-effort: lookup, then split-and-lookup, then fallback to original. */
export function translateTCMFunction(zh: string): string {
  if (!zh) return zh;
  const exact = TCM_FUNCTION_EN[zh.trim()];
  if (exact) return exact;
  // Try splitting on common separators
  const parts = zh.split(SEPARATORS).map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    const translated = parts.map((p) => TCM_FUNCTION_EN[p] ?? p);
    // Only return joined if at least half matched
    const matched = translated.filter((t, i) => t !== parts[i]).length;
    if (matched / parts.length >= 0.5) return translated.join(", ");
  }
  return zh;
}

export function translateTCMIndication(zh: string): string {
  if (!zh) return zh;
  const exact = TCM_INDICATION_EN[zh.trim()];
  if (exact) return exact;
  const parts = zh.split(SEPARATORS).map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    const translated = parts.map((p) => TCM_INDICATION_EN[p] ?? p);
    const matched = translated.filter((t, i) => t !== parts[i]).length;
    if (matched / parts.length >= 0.5) return translated.join("; ");
  }
  return zh;
}

export function translateMeridian(m: TCMMeridian): string {
  return TCM_MERIDIAN_EN[m] ?? m;
}
