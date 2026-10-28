import { useEffect, useState } from "react";
import { SEED, STATUTS } from "./seed.js";
import { analyseOffre } from "./analyseOffre.js";

const KEY = "crm-candidatures-v1";
const VIDE = { company: "", role: "", place: "", start: "", status: "À postuler", applied: "", ref: "", notes: "" };

function useCandidatures() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || SEED; } catch { return SEED; }
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* stockage indisponible */ }
  }, [data]);
  return [data, setData];
}

export default function App() {
  const [data, setData] = useCandidatures();
  const [tab, setTab] = useState("stage");
  const [filtre, setFiltre] = useState("");
  const [form, setForm] = useState(null); // null = fermé, sinon l'objet édité
  const [texte, setTexte] = useState("");
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);

  const mine = data.filter((d) => d.type === tab);
  const visibles = mine.filter((d) => !filtre || d.status === filtre);

  const changerStatut = (id, status) =>
    setData((prev) => prev.map((d) =>
      d.id === id ? { ...d, status, applied: status === "Postulé" && !d.applied ? new Date().toISOString().slice(0, 10) : d.applied } : d));

  const supprimer = (id) => window.confirm("Supprimer cette candidature ?") && setData((prev) => prev.filter((d) => d.id !== id));

  const enregistrer = (e) => {
    e.preventDefault();
    setData((prev) => form.id
      ? prev.map((d) => (d.id === form.id ? form : d))
      : [{ ...form, id: "n" + Date.now(), type: tab }, ...prev]);
    setForm(null);
  };

  const analyserEtAjouter = async () => {
    if (!texte.trim()) return;
    setChargement(true);
    setMessage("");
    try {
      const r = await analyseOffre(texte);
      const type = r.type === "alt" || /alt/i.test(r.type || "") ? "alt" : "stage";
      setData((prev) => [{
        id: "n" + Date.now(), type, status: "À postuler", applied: "", notes: "",
        company: r.company || "À préciser", role: r.role || "", place: r.place || "", start: r.start || "", ref: r.ref || "",
      }, ...prev]);
      setTab(type);
      setFiltre("");
      setTexte("");
      setMessage(`✅ Ajouté : ${r.company || "À préciser"} – ${r.role || ""}`);
    } catch {
      setMessage("Je n’ai pas pu analyser l’offre : utilise « Ajouter » pour remplir à la main.");
    }
    setChargement(false);
  };

  const champ = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <main>
      <h1>Suivi de candidatures</h1>
      <p className="sub">Stages et alternances en Data · mets à jour le statut au fil de tes candidatures</p>

      <div className="tabs">
        {[["stage", "Stages"], ["alt", "Alternances"]].map(([t, label]) => (
          <button key={t} className={"tab" + (t === tab ? " on" : "")} onClick={() => { setTab(t); setFiltre(""); setForm(null); }}>
            {label} ({data.filter((d) => d.type === t).length})
          </button>
        ))}
      </div>

      <div className="bar">
        <button className={"chip" + (!filtre ? " on" : "")} onClick={() => setFiltre("")}>Tous ({mine.length})</button>
        {STATUTS.map((s, i) => (
          <button key={s} className={"chip" + (filtre === s ? " on" : "")} style={{ background: `var(--s${i})` }} onClick={() => setFiltre(s)}>
            {s} ({mine.filter((d) => d.status === s).length})
          </button>
        ))}
        <button className="btn push" onClick={() => setForm({ ...VIDE })}>+ Ajouter</button>
      </div>

      <section className="card">
        <label>Colle ici le texte d’une offre : elle est ajoutée automatiquement à ta liste</label>
        <textarea rows={4} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Titre du poste, entreprise, lieu, missions…" />
        <button className="btn" disabled={chargement} onClick={analyserEtAjouter}>{chargement ? "Analyse en cours…" : "Analyser et ajouter"}</button>
        <span className="msg">{message}</span>
      </section>

      {form && (
        <form className="card grid" onSubmit={enregistrer}>
          <div><label>Entreprise</label><input required {...champ("company")} /></div>
          <div><label>Poste</label><input required {...champ("role")} /></div>
          <div><label>Lieu</label><input {...champ("place")} /></div>
          <div><label>Début / durée</label><input {...champ("start")} /></div>
          <div><label>Statut</label><select {...champ("status")}>{STATUTS.map((s) => <option key={s}>{s}</option>)}</select></div>
          <div><label>Date de candidature</label><input type="date" {...champ("applied")} /></div>
          <div className="full"><label>Référence / lien de l’offre</label><input {...champ("ref")} /></div>
          <div className="full"><label>Notes (CV, lettre, relance, contact…)</label><textarea rows={2} {...champ("notes")} /></div>
          <div className="full acts">
            <button className="btn" type="submit">Enregistrer</button>
            <button className="lnk" type="button" onClick={() => setForm(null)}>Annuler</button>
          </div>
        </form>
      )}

      {visibles.length === 0 && (
        <div className="empty">{tab === "alt" ? "Aucune alternance pour l’instant. Clique sur « Ajouter » pour en suivre une." : "Aucune candidature dans cette vue."}</div>
      )}

      {visibles.map((d) => (
        <article className="card" key={d.id}>
          <div className="top">
            <div>
              <div className="co">{d.company}</div>
              <div className="role">{d.role}</div>
            </div>
            <select className="st" style={{ background: `var(--s${STATUTS.indexOf(d.status)})` }} value={d.status} onChange={(e) => changerStatut(d.id, e.target.value)}>
              {STATUTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="meta">
            {d.place && <span>📍 {d.place}</span>}
            {d.start && <span>🗓 {d.start}</span>}
            {d.ref && <span>🔖 {d.ref}</span>}
            {d.applied && <span>✉️ Candidature le {d.applied.split("-").reverse().join("/")}</span>}
          </div>
          {d.notes && <div className="note">{d.notes}</div>}
          <div className="acts">
            <button className="lnk" onClick={() => setForm(d)}>Modifier</button>
            <button className="lnk" onClick={() => supprimer(d.id)}>Supprimer</button>
          </div>
        </article>
      ))}
    </main>
  );
}
