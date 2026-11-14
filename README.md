# Site des Rataffias

Le site public de la troupe, modifiable sans toucher au code grâce à une interface d'administration.

- **Le site** est hébergé gratuitement par GitHub Pages.
- **L'administration** se fait sur [app.pagescms.org](https://app.pagescms.org) : des formulaires pour chaque rubrique, avec envoi d'images.
- Chaque modification enregistrée republie le site automatiquement en 1 à 2 minutes.

---

## Mise en place (une seule fois, environ 15 minutes)

### 1. Créer un compte GitHub
Sur [github.com/signup](https://github.com/signup), avec l'adresse de la compagnie (cielesrataffias@gmail.com) de préférence. Le nom d'utilisateur choisi apparaîtra dans l'adresse du site (ex. `lesrataffias` → `lesrataffias.github.io`).

### 2. Créer le dépôt et y déposer les fichiers
1. En haut à droite : **+** → **New repository**.
2. Nom : `lesrataffias.github.io` (en remplaçant `lesrataffias` par ton nom d'utilisateur, l'adresse du site sera alors la plus courte). Laisser **Public**. Cliquer **Create repository**.
3. Sur la page qui s'affiche, cliquer le lien **uploading an existing file**.
4. Dézipper le dossier reçu, puis glisser **tout son contenu** dans la fenêtre (les dossiers `content`, `media`, `assets`, `.github`, et les fichiers `build.js`, `apercu-local.bat`, `.pages.yml`, `README.md`, `.gitignore`).
   ⚠️ Les fichiers dont le nom commence par un point (`.github`, `.pages.yml`) sont parfois masqués sur Mac/Windows : afficher les fichiers cachés avant de glisser (Mac : `Cmd + Maj + .`).
5. Cliquer **Commit changes**.
6. Vérifier que `.pages.yml` et le dossier `.github` apparaissent bien dans la liste des fichiers. Si l'un manque : **Add file → Create new file**, taper son chemin exact (`.pages.yml` ou `.github/workflows/deploy.yml`), coller son contenu (ouvert avec un éditeur de texte), puis **Commit changes**.

### 3. Activer la publication
1. Dans le dépôt : **Settings** → **Pages** (menu de gauche).
2. Sous **Build and deployment** → **Source**, choisir **GitHub Actions**.
3. Aller dans l'onglet **Actions** : si la publication n'a pas démarré, ouvrir **Publier le site** → **Run workflow**.
4. Au bout d'une minute ou deux, le site est en ligne à l'adresse indiquée dans **Settings → Pages**.

### 4. Brancher l'administration
1. Aller sur [app.pagescms.org](https://app.pagescms.org) → **Sign in with GitHub**.
2. Accepter l'installation de l'application GitHub « Pages CMS » sur ton compte (tu peux la limiter au seul dépôt du site).
3. Ouvrir le dépôt : les rubriques apparaissent dans le menu de gauche.

---

## Au quotidien

1. Ouvrir [app.pagescms.org](https://app.pagescms.org).
2. Choisir une rubrique : *Spectacle à l'affiche*, *Représentations*, *Répertoire*, *Presse*…
3. Modifier, ajouter (bouton **+**) ou supprimer des éléments ; glisser pour réordonner.
4. Cliquer **Save** : le site se met à jour tout seul en 1 à 2 minutes.

**Petites astuces de mise en forme** (dans les textes longs) :
- `**mot**` → **gras**, `*mot*` → *italique*
- une ligne vide → nouveau paragraphe

**Images** : préférer des JPG de moins de 1 Mo (affiches ~ 800 px de large, portraits carrés ~ 400 px).

---

## Plus tard (facultatif)

- **Nom de domaine** (ex. `lesrataffias.fr`) : à acheter chez un registrar (OVH, Gandi…), puis à indiquer dans **Settings → Pages → Custom domain**.
- **Donner accès à quelqu'un d'autre** : dans Pages CMS, menu **Collaborators**.

## Pour les curieux

- `content/*.json` : tous les textes du site (c'est ce que modifie l'administration).
- `media/` : les images.
- `build.js` : fabrique la page à partir des textes (lancé automatiquement par GitHub).

## Tester sur son ordinateur (facultatif)

1. Installer Node.js (version LTS) depuis [nodejs.org](https://nodejs.org), ou dans PowerShell : `winget install OpenJS.NodeJS.LTS`.
2. Double-cliquer sur `apercu-local.bat` (ou taper `node build.js` dans le dossier) : le site est fabriqué dans `_site/` et s'ouvre dans le navigateur.
3. Pour tester une modification : changer un texte dans `content/*.json`, enregistrer, relancer.
- `.pages.yml` : décrit les formulaires de l'administration.
