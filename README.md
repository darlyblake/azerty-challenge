# AZERTY Challenge

Application web de pratique de la frappe au clavier AZERTY, pensée d'abord pour les ordinateurs. Elle fonctionne sans compte, garde l'historique sur l'appareil et peut être installée comme PWA.

## Fonctionnalités

- Exercices de mots et textes en français.
- Trois niveaux : débutant, intermédiaire et avancé.
- Durée configurable : 30 secondes, 1 minute ou 2 minutes.
- Calcul de la vitesse (mots par minute), de la précision et des erreurs.
- Illustration du clavier AZERTY et repérage visuel de la dernière touche.
- Historique local des sessions.
- Installation PWA et cache hors connexion.
- HTML, CSS et JavaScript natifs, sans étape de compilation ni serveur.

## Lancer en local

Ouvre simplement `index.html` dans un navigateur pour tester l'entraînement. Pour tester correctement le service worker et l'installation PWA, sers le dossier via HTTP/HTTPS, par exemple avec l'extension **Live Server** de VS Code ou :

```bash
python3 -m http.server 8000
```

Puis ouvre `http://localhost:8000`.

## Déployer sur GitHub Pages

1. Dans le dépôt GitHub, ouvre **Settings → Pages**.
2. Dans **Build and deployment**, choisis **Deploy from a branch**.
3. Choisis la branche `main` et le dossier `/ (root)), puis clique sur **Save**.
4. Attends la fin du déploiement. L'adresse attendue est `https://darlyblake.github.io/azerty-challenge/`.

Le site doit être servi en HTTPS pour l'installation PWA et le fonctionnement du service worker. Aucun backend ni compte utilisateur n'est nécessaire.

## Confidentialité

Les résultats sont enregistrés dans le `localStorage` du navigateur. Ils ne sont pas envoyés à un serveur. Effacer les données du navigateur peut supprimer cet historique.

## Structure

- `index.html` : structure de l'interface
- `styles.css` : design responsive
- `app.js` : exercices, chronomètre, statistiques et historique
- `manifest.webmanifest` : configuration PWA
- `sw.js` : cache hors connexion
- `assets/icon.svg` : icône de l'application
