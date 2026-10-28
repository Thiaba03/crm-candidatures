export const STATUTS = ["À postuler", "Postulé", "Relancé", "Entretien", "Accepté", "Refusé"];

const base = [
  ["ANS (Agence du Numérique en Santé)", "Stage Data – fiabilisation des données FINESS", "", "Janvier 2027 · 6 mois", "", "CV et lettre prêts"],
  ["Entreprise de défense (non nommée)", "Stage – données météo et environnements climatiques", "Le Plessis-Robinson (92)", "Février 2027 · 6 mois", "Réf. R38425", "CV et lettre prêts"],
  ["Thales", "Stage IA et Cloud – Automation Platform and Cloud", "Toulouse", "6 mois", "", "CV et lettre prêts"],
  ["EssilorLuxottica", "Stage Ingénieur / Data Scientist – procédés de fabrication", "Créteil", "Janvier 2027 · 6 mois", "", "CV et lettre prêts"],
  ["Isea (groupe AXA)", "Stage Data Analyst / BI", "", "6 mois", "", "CV prêt · lettre à écrire"],
  ["ArianeGroup", "Stage dév. logiciel Data et IA – surveillance de l’espace (Helix)", "Les Mureaux", "Mars 2027 · 6 mois", "", "CV et lettre prêts"],
  ["Thales", "Stage IA et optimisation – planification de missions", "Élancourt", "6 mois", "", "CV et lettre prêts"],
  ["ASNR", "Stage analyse de données – activités nucléaires médicales non déclarées", "Marseille", "À partir du 3 mai 2027", "Réf. 2026-1750", "CV et lettre prêts"],
  ["Alstom", "Stage modélisation et simulation – maintenance ferroviaire", "Saint-Ouen-sur-Seine", "2e semestre 2026-2027 · 6 mois", "Req ID 531622", "CV et lettre prêts (PDF)"],
];

export const SEED = base.map(([company, role, place, start, ref, notes], i) => ({
  id: "s" + i, type: "stage", company, role, place, start, ref, notes, status: "À postuler", applied: "",
}));
