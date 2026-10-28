// Analyse le texte d'une offre et renvoie { type, company, role, place, start, ref }.
//
// Option 1 (recommandée) : un petit backend à toi qui appelle l'API d'un LLM.
//   Définis VITE_ANALYSE_URL dans un fichier .env, ex. VITE_ANALYSE_URL=http://localhost:3001/analyse
//   Le backend reçoit { text } et renvoie le JSON ci-dessus. Ne mets JAMAIS une clé d'API dans le code front.
// Option 2 : sans backend, une analyse locale simple (ci-dessous), moins précise.

const API_URL = import.meta.env.VITE_ANALYSE_URL || "";

export async function analyseOffre(text) {
  if (API_URL) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Erreur de l'API d'analyse");
    return res.json();
  }
  return analyseLocale(text);
}

function premier(text, regex) {
  const m = text.match(regex);
  return m ? m[1].trim().split("\n")[0].slice(0, 120) : "";
}

function analyseLocale(text) {
  const lignes = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const role = (lignes.find((l) => /stage|alternance|apprenti|ing[ée]nieur|analyst|data/i.test(l)) || lignes[0] || "").slice(0, 90);
  const company =
    premier(text, /(?:Entreprise|Soci[ée]t[ée])\s*:\s*(.+)/i) ||
    premier(text, /Chez\s+([A-ZÀ-Ý][\w&.\- ]{1,40})/);
  const place = premier(text, /(?:Lieu|Localisation|Poste bas[ée] [àa])\s*:?\s*(.+)/i);
  const ref = premier(text, /(?:R[ée]f(?:[ée]rence)?\.?|Req ID)\s*:?\s*([A-Z0-9-]{4,})/i);
  const debut = premier(text, /(?:Date de d[ée]but|D[ée]but|Prise de poste|P[ée]riode de d[ée]marrage souhait[ée]e|Disponibilit[ée] du poste)\s*:?\s*(.+)/i);
  const duree = text.match(/(\d+)\s*mois/i);
  const start = [debut, duree ? `${duree[1]} mois` : ""].filter(Boolean).join(" · ");
  const type = /alternance|apprentissage|contrat pro/i.test(text) && !/\bstage\b/i.test(role) ? "alt" : "stage";
  if (!role) throw new Error("Offre illisible");
  return { type, company, role, place, start, ref };
}
