# 🎨 Déploiement sur Render — Guide Complet

Render est simple et fiable. Gratuit mais **s'endort après 15 min sans visite** → le keep-alive inclus dans ce projet règle le problème automatiquement.

---

## ✅ Pré-requis
- Un compte GitHub (gratuit)
- Un compte Render (gratuit) → render.com

---

## 🚀 Étapes de déploiement

### 1. Mettre le projet sur GitHub
1. Va sur **github.com** → bouton vert **"New"**
2. Nom du repo : `pechepro`
3. **Ne coche rien**
4. Clique **"Create repository"**
5. Dans le dossier du projet, ouvre un terminal :
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/TON_PSEUDO/pechepro.git
git push -u origin main
```

### 2. Créer le service sur Render
1. Va sur **dashboard.render.com** → **"New +"** → **"Web Service"**
2. Connecte GitHub et sélectionne le repo `pechepro`
3. Configure ainsi :

| Champ | Valeur |
|-------|--------|
| **Name** | pechepro |
| **Region** | Frankfurt (EU) |
| **Branch** | main |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Plan** | **Free** |

4. Clique **"Create Web Service"**

### 3. Configurer les variables d'environnement
Dans Render → ton service → onglet **"Environment"** → **"Add Environment Variable"** :

| Variable | Valeur |
|----------|--------|
| `SESSION_SECRET` | Une longue chaîne aléatoire |
| `STRIPE_SECRET_KEY` | Ta clé Stripe |
| `APP_URL` | L'URL de ton app (ex: `https://pechepro.onrender.com`) |

> ⚠️ **Important** : L'URL `APP_URL` est visible tout en haut de la page de ton service dans Render. Elle finit par `.onrender.com`. Le keep-alive en a besoin pour pinger l'app automatiquement.

### 4. Premier déploiement
Render va automatiquement lancer `npm install` puis `node index.js`.  
Attends 2-3 minutes, puis visite ton URL !

- Site : `https://pechepro.onrender.com`  
- Admin : `/admin` → `admin@admin.com` / `admin123`

---

## 🔄 Mettre à jour le site
Un `git push` suffit, Render redéploie automatiquement.

---

## 💡 À propos du Keep-Alive
Le fichier `keep_alive.js` est automatiquement inclus. Il ping ton app toutes les 10 minutes pour éviter le sleep. Tu n'as rien à faire de plus, juste bien mettre `APP_URL` dans les variables.

---

## ❓ Problèmes courants
| Problème | Solution |
|----------|----------|
| "Your service is sleeping" | Attends ~30sec, c'est le démarrage à froid. Avec keep-alive ça arrive moins |
| Port déjà utilisé | Render attribue `PORT=10000` automatiquement, ne le change pas |
| Build échoue sur better-sqlite3 | Render compile les modules natifs, c'est normal que le build prenne 3-4 min |
