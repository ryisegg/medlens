export interface ZhDrugEntry {
  genericZh: string;
  brandZh?: string;
  categoryZh?: string;
}

export const ZH_DRUG_NAMES: Record<string, ZhDrugEntry> = {
  "ibuprofen":              { genericZh: "布洛芬",         brandZh: "艾德维尔、美林",       categoryZh: "止痛抗炎药" },
  "acetaminophen":          { genericZh: "对乙酰氨基酚",   brandZh: "泰诺",                 categoryZh: "止痛退烧药" },
  "aspirin":                { genericZh: "阿司匹林",       brandZh: "拜阿司匹灵",           categoryZh: "止痛抗炎药" },
  "diphenhydramine":        { genericZh: "苯海拉明",       brandZh: "苯那君",               categoryZh: "抗组胺药" },
  "loratadine":             { genericZh: "氯雷他定",       brandZh: "开瑞坦",               categoryZh: "抗过敏药" },
  "cetirizine":             { genericZh: "西替利嗪",       brandZh: "仙特明",               categoryZh: "抗过敏药" },
  "fexofenadine":           { genericZh: "非索非那定",     brandZh: "爱力同",               categoryZh: "抗过敏药" },
  "pseudoephedrine":        { genericZh: "伪麻黄碱",       brandZh: "速达菲",               categoryZh: "减充血剂" },
  "dextromethorphan":       { genericZh: "右美沙芬",       brandZh: "德路斯",               categoryZh: "止咳药" },
  "guaifenesin":            { genericZh: "愈创甘油醚",     brandZh: "穆奇尼克斯",           categoryZh: "祛痰药" },
  "omeprazole":             { genericZh: "奥美拉唑",       brandZh: "普利乐",               categoryZh: "质子泵抑制剂" },
  "ranitidine":             { genericZh: "雷尼替丁",       brandZh: "善胃得",               categoryZh: "H2受体拮抗剂" },
  "famotidine":             { genericZh: "法莫替丁",       brandZh: "佩普西德",             categoryZh: "H2受体拮抗剂" },
  "loperamide":             { genericZh: "洛哌丁胺",       brandZh: "易蒙停",               categoryZh: "止泻药" },
  "bismuth subsalicylate":  { genericZh: "次水杨酸铋",     brandZh: "百宝顺",               categoryZh: "胃肠道药" },
  "hydrocortisone":         { genericZh: "氢化可的松",     brandZh: "可的松乳膏",           categoryZh: "局部类固醇" },
  "clotrimazole":           { genericZh: "克霉唑",         brandZh: "凯妮汀",               categoryZh: "抗真菌药" },
  "miconazole":             { genericZh: "咪康唑",         brandZh: "达克宁",               categoryZh: "抗真菌药" },
  "melatonin":              { genericZh: "褪黑素",                                          categoryZh: "助眠补充剂" },
  "vitamin d":              { genericZh: "维生素D",        brandZh: "D3",                   categoryZh: "维生素补充剂" },
  "vitamin d3":             { genericZh: "维生素D3",                                        categoryZh: "维生素补充剂" },
  "metformin":              { genericZh: "二甲双胍",       brandZh: "格华止",               categoryZh: "降糖药" },
  "lisinopril":             { genericZh: "赖诺普利",       brandZh: "捷赐瑞",               categoryZh: "降压药" },
  "atorvastatin":           { genericZh: "阿托伐他汀",     brandZh: "立普妥",               categoryZh: "降脂药" },
  "simvastatin":            { genericZh: "辛伐他汀",       brandZh: "舒降之",               categoryZh: "降脂药" },
  "levothyroxine":          { genericZh: "左甲状腺素",     brandZh: "优甲乐",               categoryZh: "甲状腺药" },
  "amlodipine":             { genericZh: "氨氯地平",       brandZh: "络活喜",               categoryZh: "降压药" },
  "metoprolol":             { genericZh: "美托洛尔",       brandZh: "倍他乐克",             categoryZh: "β受体阻滞剂" },
  "losartan":               { genericZh: "氯沙坦",         brandZh: "科素亚",               categoryZh: "降压药" },
  "albuterol":              { genericZh: "沙丁胺醇",       brandZh: "万托林",               categoryZh: "支气管扩张剂" },
  "fluticasone":            { genericZh: "氟替卡松",       brandZh: "辅舒酮",               categoryZh: "吸入性皮质激素" },
  "montelukast":            { genericZh: "孟鲁司特",       brandZh: "顺尔宁",               categoryZh: "白三烯受体拮抗剂" },
  "sertraline":             { genericZh: "舍曲林",         brandZh: "左洛复",               categoryZh: "抗抑郁药" },
  "fluoxetine":             { genericZh: "氟西汀",         brandZh: "百优解",               categoryZh: "抗抑郁药" },
  "escitalopram":           { genericZh: "艾司西酞普兰",   brandZh: "来士普",               categoryZh: "抗抑郁药" },
  "alprazolam":             { genericZh: "阿普唑仑",       brandZh: "赞安诺",               categoryZh: "抗焦虑药" },
  "gabapentin":             { genericZh: "加巴喷丁",       brandZh: "诺瓦加",               categoryZh: "抗癫痫/神经痛药" },
  "amoxicillin":            { genericZh: "阿莫西林",       brandZh: "安莫西",               categoryZh: "抗生素" },
  "azithromycin":           { genericZh: "阿奇霉素",       brandZh: "希舒美",               categoryZh: "抗生素" },
  "ciprofloxacin":          { genericZh: "环丙沙星",       brandZh: "拜复乐",               categoryZh: "抗生素" },
  "doxycycline":            { genericZh: "多西环素",       brandZh: "强力霉素",             categoryZh: "抗生素" },
  "prednisone":             { genericZh: "泼尼松",         brandZh: "强的松",               categoryZh: "类固醇" },
  "warfarin":               { genericZh: "华法林",         brandZh: "可迈丁",               categoryZh: "抗凝血药" },
  "clopidogrel":            { genericZh: "氯吡格雷",       brandZh: "波立维",               categoryZh: "抗血小板药" },
  "pantoprazole":           { genericZh: "泮托拉唑",       brandZh: "泮妥",                 categoryZh: "质子泵抑制剂" },
  "furosemide":             { genericZh: "呋塞米",         brandZh: "速尿",                 categoryZh: "利尿剂" },
  "hydrochlorothiazide":    { genericZh: "氢氯噻嗪",       brandZh: "双氢克尿噻",           categoryZh: "利尿剂" },
  "naproxen":               { genericZh: "萘普生",         brandZh: "消痛灵",               categoryZh: "止痛抗炎药" },
  "tramadol":               { genericZh: "曲马多",         brandZh: "舒敏",                 categoryZh: "阿片类镇痛药" },
  "oxycodone":              { genericZh: "羟考酮",         brandZh: "奥施康定",             categoryZh: "阿片类镇痛药" },
  "codeine":                { genericZh: "可待因",                                          categoryZh: "阿片类镇痛药" },
  "morphine":               { genericZh: "吗啡",                                            categoryZh: "阿片类镇痛药" },
  "insulin":                { genericZh: "胰岛素",                                          categoryZh: "降糖药" },
  "glipizide":              { genericZh: "格列吡嗪",       brandZh: "瑞易宁",               categoryZh: "降糖药" },
  "calcium carbonate":      { genericZh: "碳酸钙",         brandZh: "钙尔奇",               categoryZh: "钙补充剂" },
  "folic acid":             { genericZh: "叶酸",                                            categoryZh: "维生素补充剂" },
  "iron":                   { genericZh: "铁",                                              categoryZh: "矿物质补充剂" },
  "zinc":                   { genericZh: "锌",                                              categoryZh: "矿物质补充剂" },
  "vitamin c":              { genericZh: "维生素C",                                         categoryZh: "维生素补充剂" },
  "vitamin b12":            { genericZh: "维生素B12",                                       categoryZh: "维生素补充剂" },
  "omega-3":                { genericZh: "ω-3脂肪酸",      brandZh: "鱼油",                 categoryZh: "营养补充剂" },
  "glucosamine":            { genericZh: "氨基葡萄糖",                                      categoryZh: "关节补充剂" },
  "probiotics":             { genericZh: "益生菌",                                          categoryZh: "消化道补充剂" },
};

export function lookupZhDrug(name: string): ZhDrugEntry | null {
  const key = name.toLowerCase().trim();
  if (ZH_DRUG_NAMES[key]) return ZH_DRUG_NAMES[key];
  for (const [k, v] of Object.entries(ZH_DRUG_NAMES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}
