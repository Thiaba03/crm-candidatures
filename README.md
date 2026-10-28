# CRM – Suivi de candidatures (React + Vite)

## Lancer le projet
```
npm install
npm run dev
```
Puis ouvre l'adresse affichée (http://localhost:5173).

## Ce que fait l'app
- Deux onglets : Stages et Alternances
- Statuts : À postuler, Postulé, Relancé, Entretien, Accepté, Refusé
- Ajout manuel, modification, suppression
- Colle le texte d'une offre : la candidature est ajoutée automatiquement
- Données enregistrées dans le navigateur (localStorage)

## Analyse automatique des offres
Dans `src/analyseOffre.js` :
- sans configuration, une analyse locale simple lit le titre, le lieu, la référence, le début et la durée ;
- pour une analyse plus précise, crée un petit backend qui appelle l'API d'un LLM, puis mets son URL dans `.env` :
  `VITE_ANALYSE_URL=http://localhost:3001/analyse`
  Le backend reçoit `{ text }` et renvoie `{ type, company, role, place, start, ref }`.
  Ne mets jamais une clé d'API dans le code front.
