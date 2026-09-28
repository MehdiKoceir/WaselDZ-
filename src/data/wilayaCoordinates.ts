export interface WilayaGeoPoint {
  code: string;
  name: string;
  arabicName: string;
  region: 'centre' | 'est' | 'ouest' | 'sud';
  // SVG coordinates on 950x650 canvas
  x: number;
  y: number;
  lat: number;
  lng: number;
  isHub?: boolean;
}

export const DEPOT_CENTRAL: WilayaGeoPoint = {
  code: '16',
  name: 'Alger Centre (Hub Principal)',
  arabicName: 'الجزائر العاصمة',
  region: 'centre',
  x: 470,
  y: 135,
  lat: 36.7538,
  lng: 3.0588,
  isHub: true
};

export const WILAYA_GEO_MAP: Record<string, WilayaGeoPoint> = {
  '16': { code: '16', name: 'Alger', arabicName: 'الجزائر', region: 'centre', x: 470, y: 135, lat: 36.7538, lng: 3.0588, isHub: true },
  '09': { code: '09', name: 'Blida', arabicName: 'البليدة', region: 'centre', x: 458, y: 165, lat: 36.4700, lng: 2.8300 },
  '35': { code: '35', name: 'Boumerdès', arabicName: 'بومرداس', region: 'centre', x: 505, y: 145, lat: 36.7600, lng: 3.4700 },
  '42': { code: '42', name: 'Tipaza', arabicName: 'تيبازة', region: 'centre', x: 425, y: 150, lat: 36.5900, lng: 2.4400 },
  '15': { code: '15', name: 'Tizi Ouzou', arabicName: 'تيزي وزو', region: 'centre', x: 540, y: 152, lat: 36.7119, lng: 4.0458 },
  '02': { code: '02', name: 'Chlef', arabicName: 'الشلف', region: 'centre', x: 360, y: 172, lat: 36.1653, lng: 1.3344 },
  '44': { code: '44', name: 'Aïn Defla', arabicName: 'عين الدفلى', region: 'centre', x: 405, y: 180, lat: 36.2642, lng: 1.9678 },
  '26': { code: '26', name: 'Médéa', arabicName: 'المدية', region: 'centre', x: 460, y: 200, lat: 36.2642, lng: 2.7539 },
  '17': { code: '17', name: 'Djelfa', arabicName: 'الجلفة', region: 'centre', x: 445, y: 300, lat: 34.6728, lng: 3.2630 },
  '28': { code: '28', name: "M'Sila", arabicName: 'المسيلة', region: 'centre', x: 520, y: 245, lat: 35.7058, lng: 4.5419 },

  // OUEST
  '31': { code: '31', name: 'Oran', arabicName: 'وهران', region: 'ouest', x: 240, y: 180, lat: 35.6987, lng: -0.6349, isHub: true },
  '27': { code: '27', name: 'Mostaganem', arabicName: 'مستغانم', region: 'ouest', x: 295, y: 170, lat: 35.9312, lng: 0.0892 },
  '29': { code: '29', name: 'Mascara', arabicName: 'معسكر', region: 'ouest', x: 275, y: 215, lat: 35.3969, lng: 0.1403 },
  '22': { code: '22', name: 'Sidi Bel Abbès', arabicName: 'سيدي بلعباس', region: 'ouest', x: 220, y: 225, lat: 35.1899, lng: -0.6308 },
  '13': { code: '13', name: 'Tlemcen', arabicName: 'تلمسان', region: 'ouest', x: 160, y: 245, lat: 34.8783, lng: -1.3150, isHub: true },
  '14': { code: '14', name: 'Tiaret', arabicName: 'تيارت', region: 'ouest', x: 345, y: 240, lat: 35.3710, lng: 1.3170 },
  '46': { code: '46', name: 'Aïn Témouchent', arabicName: 'عين تموشنت', region: 'ouest', x: 190, y: 205, lat: 35.2975, lng: -1.1404 },
  '20': { code: '20', name: 'Saïda', arabicName: 'سعيدة', region: 'ouest', x: 260, y: 275, lat: 34.8303, lng: 0.1517 },

  // EST
  '25': { code: '25', name: 'Constantine', arabicName: 'قسنطينة', region: 'est', x: 700, y: 180, lat: 36.3650, lng: 6.6147, isHub: true },
  '19': { code: '19', name: 'Sétif', arabicName: 'سطيف', region: 'est', x: 620, y: 195, lat: 36.1911, lng: 5.4137, isHub: true },
  '23': { code: '23', name: 'Annaba', arabicName: 'عنابة', region: 'est', x: 770, y: 140, lat: 36.9000, lng: 7.7667, isHub: true },
  '06': { code: '06', name: 'Béjaïa', arabicName: 'بجاية', region: 'est', x: 590, y: 150, lat: 36.7511, lng: 5.0567 },
  '18': { code: '18', name: 'Jijel', arabicName: 'جيجل', region: 'est', x: 650, y: 148, lat: 36.8206, lng: 5.7667 },
  '21': { code: '21', name: 'Skikda', arabicName: 'سكيكدة', region: 'est', x: 715, y: 145, lat: 36.8762, lng: 6.9092 },
  '05': { code: '05', name: 'Batna', arabicName: 'باتنة', region: 'est', x: 685, y: 245, lat: 35.5560, lng: 6.1741 },
  '34': { code: '34', name: 'Bordj Bou Arréridj', arabicName: 'برج بوعريريج', region: 'est', x: 565, y: 200, lat: 36.0732, lng: 4.7611 },
  '07': { code: '07', name: 'Biskra', arabicName: 'بسكرة', region: 'est', x: 645, y: 300, lat: 34.8504, lng: 5.7281 },
  '41': { code: '41', name: 'Souk Ahras', arabicName: 'سوق أهراس', region: 'est', x: 785, y: 195, lat: 36.2864, lng: 7.9511 },
  '36': { code: '36', name: 'El Tarf', arabicName: 'الطارف', region: 'est', x: 805, y: 148, lat: 36.7672, lng: 8.3138 },
  '40': { code: '40', name: 'Khenchela', arabicName: 'خنشلة', region: 'est', x: 725, y: 265, lat: 35.4358, lng: 7.1433 },
  '12': { code: '12', name: 'Tébessa', arabicName: 'تبسة', region: 'est', x: 790, y: 260, lat: 35.4042, lng: 8.1242 },
  '43': { code: '43', name: 'Mila', arabicName: 'ميلة', region: 'est', x: 670, y: 185, lat: 36.4503, lng: 6.2644 },
  '04': { code: '04', name: 'Oum El Bouaghi', arabicName: 'أم البواقي', region: 'est', x: 730, y: 220, lat: 35.8756, lng: 7.1136 },

  // SUD
  '47': { code: '47', name: 'Ghardaïa', arabicName: 'غرداية', region: 'sud', x: 485, y: 430, lat: 32.4909, lng: 3.6736, isHub: true },
  '30': { code: '30', name: 'Ouargla', arabicName: 'ورقلة', region: 'sud', x: 615, y: 450, lat: 31.9539, lng: 5.3340, isHub: true },
  '39': { code: '39', name: 'El Oued', arabicName: 'الوادي', region: 'sud', x: 710, y: 380, lat: 33.3683, lng: 6.8675 },
  '08': { code: '08', name: 'Béchar', arabicName: 'بشار', region: 'sud', x: 140, y: 410, lat: 31.6167, lng: -2.2167 },
  '03': { code: '03', name: 'Laghouat', arabicName: 'الأغواط', region: 'sud', x: 430, y: 360, lat: 33.8000, lng: 2.8651 },
  '32': { code: '32', name: 'El Bayadh', arabicName: 'البيض', region: 'sud', x: 310, y: 345, lat: 33.6832, lng: 1.0193 },
  '45': { code: '45', name: 'Naâma', arabicName: 'النعامة', region: 'sud', x: 200, y: 335, lat: 33.2667, lng: -0.3167 },
  '01': { code: '01', name: 'Adrar', arabicName: 'أدرار', region: 'sud', x: 290, y: 550, lat: 27.8743, lng: -0.2939 },
  '11': { code: '11', name: 'Tamanrasset', arabicName: 'تمنراست', region: 'sud', x: 570, y: 615, lat: 22.7850, lng: 5.5228 },
};

/**
 * Extracts Wilaya code from string e.g. "16 - Alger" or "Blida"
 */
export function getWilayaGeo(wilayaStr: string): WilayaGeoPoint {
  if (!wilayaStr) return WILAYA_GEO_MAP['16'];

  // Check code match "16", "09", etc.
  const codeMatch = wilayaStr.match(/^(\d{2})/);
  if (codeMatch && WILAYA_GEO_MAP[codeMatch[1]]) {
    return WILAYA_GEO_MAP[codeMatch[1]];
  }

  // Check name match
  const lower = wilayaStr.toLowerCase();
  for (const point of Object.values(WILAYA_GEO_MAP)) {
    if (lower.includes(point.name.toLowerCase()) || lower.includes(point.code)) {
      return point;
    }
  }

  return WILAYA_GEO_MAP['16']; // Default to Alger
}
