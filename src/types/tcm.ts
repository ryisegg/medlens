export type TCMNature = '热' | '温' | '平' | '凉' | '寒';
export type TCMFlavor = '甘' | '苦' | '辛' | '酸' | '咸' | '涩' | '淡';
export type TCMMeridian = '心' | '肝' | '脾' | '肺' | '肾' | '胃' | '大肠' | '小肠' | '膀胱' | '胆' | '三焦' | '心包';

export type TCMCategory =
  | '解表药' | '清热药' | '泻下药' | '祛风湿药' | '化湿药' | '利水渗湿药'
  | '温里药' | '理气药' | '消食药' | '止血药' | '活血化瘀药'
  | '化痰止咳药' | '安神药' | '平肝息风药'
  | '补气药' | '补阳药' | '补血药' | '补阴药' | '收涩药';

export interface TCMInteraction {
  name: string;
  nameZh: string;
  type: 'western' | 'food';
  severity: 'mild' | 'moderate' | 'severe';
  note: string;
  noteZh: string;
}

export interface TCMHerb {
  id: string;
  nameZh: string;
  namePinyin: string;
  nameEn: string;
  nameLatin: string;
  aliases: string[];
  category: TCMCategory;
  properties: {
    nature: TCMNature;
    flavor: TCMFlavor[];
    meridians: TCMMeridian[];
  };
  functions: string[];
  indications: string[];
  dosage: string;
  contraindications: string[];
  interactions: TCMInteraction[];
  commonFormulas: string[];
  modernResearch: string;
  notes: string;
}
