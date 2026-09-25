export interface WilayaInfo {
  code: string;
  name: string;
  arabicName: string;
  zone: 'centre' | 'est' | 'ouest' | 'sud';
  defaultFee: number;
  communes: string[];
}

export const ALGERIAN_WILAYAS: WilayaInfo[] = [
  { code: '16', name: 'Alger', arabicName: 'الجزائر', zone: 'centre', defaultFee: 400, communes: ['Alger Centre', 'Bab El Oued', 'Hydra', 'Ben Aknoun', 'El Biar', 'Kouba', 'Hussein Dey', 'Bir Mourad Raïs', 'Rouiba', 'Dar El Beïda', 'Zéralda', 'Cheraga'] },
  { code: '09', name: 'Blida', arabicName: 'البليدة', zone: 'centre', defaultFee: 500, communes: ['Blida', 'Boufarik', 'Ouled Yaïch', 'Larbaâ', 'Bougara', 'Beni Mered', 'Meftah'] },
  { code: '35', name: 'Boumerdès', arabicName: 'بومرداس', zone: 'centre', defaultFee: 500, communes: ['Boumerdès', 'Boudouaou', 'Zemmouri', 'Khemis El Khechna', 'Dellys', 'Thenia'] },
  { code: '42', name: 'Tipaza', arabicName: 'تيبازة', zone: 'centre', defaultFee: 550, communes: ['Tipaza', 'Kolea', 'Cherchell', 'Bou Ismaïl', 'Hadjout', 'Fouka'] },
  { code: '31', name: 'Oran', arabicName: 'وهران', zone: 'ouest', defaultFee: 650, communes: ['Oran', 'Bir El Djir', 'Es Senia', 'Arzew', 'Ain El Turk', 'Boutlelis'] },
  { code: '25', name: 'Constantine', arabicName: 'قسنطينة', zone: 'est', defaultFee: 700, communes: ['Constantine', 'El Khroub', 'Ain Smara', 'Hamma Bouziane', 'Didouche Mourad'] },
  { code: '19', name: 'Sétif', arabicName: 'سطيف', zone: 'est', defaultFee: 650, communes: ['Sétif', 'El Eulma', 'Ain Oulmene', 'Ain Arnat', 'Bougaa'] },
  { code: '02', name: 'Chlef', arabicName: 'الشلف', zone: 'centre', defaultFee: 600, communes: ['Chlef', 'Ténès', 'Oued Fodda', 'Boukadir', 'Ain Merane'] },
  { code: '15', name: 'Tizi Ouzou', arabicName: 'تيزي وزو', zone: 'centre', defaultFee: 600, communes: ['Tizi Ouzou', 'Azazga', 'Draa Ben Khedda', 'Boghni', 'Larbaa Nath Irathen'] },
  { code: '06', name: 'Béjaïa', arabicName: 'بجاية', zone: 'est', defaultFee: 650, communes: ['Béjaïa', 'Amizour', 'Akbou', 'El Kseur', 'Sidi Aïch'] },
  { code: '13', name: 'Tlemcen', arabicName: 'تلمسان', zone: 'ouest', defaultFee: 750, communes: ['Tlemcen', 'Mansourah', 'Maghnia', 'Remchi', 'Ghazaouet'] },
  { code: '23', name: 'Annaba', arabicName: 'عنابة', zone: 'est', defaultFee: 750, communes: ['Annaba', 'El Bouni', 'Sidi Amar', 'El Hadjar', 'Berrahal'] },
  { code: '05', name: 'Batna', arabicName: 'باتنة', zone: 'est', defaultFee: 700, communes: ['Batna', 'Barika', 'Ain Touta', 'Merouana', 'Arris'] },
  { code: '22', name: 'Sidi Bel Abbès', arabicName: 'سيدي بلعباس', zone: 'ouest', defaultFee: 700, communes: ['Sidi Bel Abbès', 'Telagh', 'Ben Badis', 'Sfisef'] },
  { code: '27', name: 'Mostaganem', arabicName: 'مستغانم', zone: 'ouest', defaultFee: 650, communes: ['Mostaganem', 'Ain Nouissy', 'Hassi Mameche', 'Sidi Ali'] },
  { code: '17', name: 'Djelfa', arabicName: 'الجلفة', zone: 'centre', defaultFee: 750, communes: ['Djelfa', 'Ain Oussera', 'Messaad', 'Hassi Bahbah'] },
  { code: '28', name: 'M\'Sila', arabicName: 'المسيلة', zone: 'centre', defaultFee: 700, communes: ['M\'Sila', 'Bou Saâda', 'Sidi Aissa', 'Magra'] },
  { code: '30', name: 'Ouargla', arabicName: 'ورقلة', zone: 'sud', defaultFee: 950, communes: ['Ouargla', 'Hassi Messaoud', 'Touggourt', 'Rouissat'] },
  { code: '47', name: 'Ghardaïa', arabicName: 'غرداية', zone: 'sud', defaultFee: 900, communes: ['Ghardaïa', 'Metlili', 'El Guerara', 'Bounoura', 'Beni Isguen'] },
  { code: '07', name: 'Biskra', arabicName: 'بسكرة', zone: 'est', defaultFee: 800, communes: ['Biskra', 'Tolga', 'Sidi Okba', 'Ouled Djellal'] },
  { code: '14', name: 'Tiaret', arabicName: 'تيارت', zone: 'ouest', defaultFee: 700, communes: ['Tiaret', 'Sougueur', 'Frenda', 'Ksar Chellala'] },
  { code: '18', name: 'Jijel', arabicName: 'جيجل', zone: 'est', defaultFee: 700, communes: ['Jijel', 'Taher', 'El Milia', 'El Aouana'] },
  { code: '21', name: 'Skikda', arabicName: 'سكيكدة', zone: 'est', defaultFee: 700, communes: ['Skikda', 'El Harrouch', 'Azzaba', 'Collo'] },
  { code: '29', name: 'Mascara', arabicName: 'معسكر', zone: 'ouest', defaultFee: 700, communes: ['Mascara', 'Sig', 'Tighennif', 'Mohammadia'] },
  { code: '34', name: 'Bordj Bou Arréridj', arabicName: 'برج بوعريريج', zone: 'est', defaultFee: 650, communes: ['Bordj Bou Arréridj', 'Ras El Oued', 'Mansoura'] },
  { code: '44', name: 'Aïn Defla', arabicName: 'عين الدفلى', zone: 'centre', defaultFee: 600, communes: ['Aïn Defla', 'Khemis Miliana', 'Miliana', 'El Attaf'] }
];

export const STATUS_LABELS: Record<string, { label: string; bg: string; text: string; border: string; desc: string }> = {
  new: { label: 'Nouvelle', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', desc: 'Commande enregistrée, en attente de confirmation' },
  confirmed: { label: 'Confirmée', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', desc: 'Client contacté et commande validée' },
  preparing: { label: 'En préparation', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', desc: 'Articles en cours de colisage' },
  assigned: { label: 'Assignée livreur', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', desc: 'Colis confié au livreur désigné' },
  out_for_delivery: { label: 'En cours de livraison', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', desc: 'Le livreur est en route vers le client' },
  delivered: { label: 'Livrée avec succès', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', desc: 'Colis remis et paiement encaissé' },
  cancelled: { label: 'Annulée', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', desc: 'Annulée par le client ou le vendeur' },
  failed: { label: 'Échouée', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', desc: 'Client injoignable ou absent' },
  returned: { label: 'Retournée', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', desc: 'Colis retourné à l\'entrepôt / boutique' },
};

export const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Paiement à la livraison (Cash)',
  baridimob: 'BaridiMob (CCP)',
  cib: 'Carte CIB / Edahabia',
  prepaid: 'Paiement d\'avance en magasin',
};

export const formatDZD = (amount: number): string => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0,
  }).format(amount).replace('DZD', 'DA');
};
