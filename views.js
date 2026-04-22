// views.js — Design Premium pour THE BIG ONE
const CSS = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Inter:wght@300;400;600&display=swap');

:root {
  --bg: #050505;
  --surface: #121212;
  --primary: #d4af37;    /* Or / Gold */
  --primary-light: #f1d592;
  --text: #ffffff;
  --muted: #888888;
  --border: #222222;
  --accent: #ff3e3e;
}

* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }

/* Navigation */
nav { 
  background: rgba(5, 5, 5, 0.95); 
  padding: 1.5rem 5%; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px);
}
.logo { font-family: 'Syncopate', sans-serif; font-weight: 700; font-size: 1.8rem; color: var(--primary); text-decoration: none; letter-spacing: -1px; }
.nav-links { display: flex; gap: 2rem; align-items: center; }
.nav-links a { text-decoration: none; color: var(--text); font-weight: 400; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; }
.nav-links a:hover { color: var(--primary); }

/* Hero */
.hero { 
  height: 80vh;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  background: radial-gradient(circle at center, #1a1a1a 0%, #050505 100%);
  text-align: center; border-bottom: 1px solid var(--border);
}
.hero h1 { font-family: 'Syncopate', sans-serif; font-size: clamp(3rem, 10vw, 6rem); margin-bottom: 1rem; color: var(--primary); line-height: 1; }
.hero p { color: var(--muted); font-size: 1.2rem; max-width: 600px; margin-bottom: 2rem; }

/* Grid */
.container { padding: 5rem 5%; }
.grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
  gap: 3rem; 
}
.card { 
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: 0px; /* Look carré plus luxe */
  transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative; overflow: hidden;
}
.card:hover { border-color: var(--primary); transform: translateY(-10px); }
.card-img { width: 100%; height: 350px; object-fit: cover; filter: grayscale(20%); transition: 0.5s; }
.card:hover .card-img { filter: grayscale(0%); transform: scale(1.05); }
.card-content { padding: 1.5rem; background: var(--surface); }
.card-title { font-family: 'Syncopate', sans-serif; font-size: 1rem; margin-bottom: 0.5rem; color: var(--text); }
.card-price { font-size: 1.2rem; font-weight: 600; color: var(--primary); }

/* Buttons */
.btn { 
  padding: 1rem 2rem; border: 1px solid var(--primary); background: transparent; 
  color: var(--primary); text-decoration: none; font-family: 'Syncopate', sans-serif; font-size: 0.8rem;
  transition: 0.3s; cursor: pointer; display: inline-block;
}
.btn:hover { background: var(--primary); color: #000; }
.btn-full { background: var(--primary); color: #000; width: 100%; text-align: center; }

footer { padding: 5rem 5%; border-top: 1px solid var(--border); text-align: center; color: var(--muted); font-size: 0.8rem; letter-spacing: 2px; }
</style>
`;

const layout = (title, content, user = null) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${title} | THE BIG ONE</title>
    ${CSS}
</head>
<body>
    <nav>
        <a href="/" class="logo">THE BIG ONE</a>
        <div class="nav-links">
            <a href="/">Shop</a>
            ${user ? `
                <a href="/profil">Compte</a>
                ${user.role === 'admin' ? '<a href="/admin" style="color:var(--primary)">Panel</a>' : ''}
                <a href="/logout">Quitter</a>
            ` : '<a href="/login">Entrer</a>'}
        </div>
    </nav>
    ${content}
    <footer>
        <p>THE BIG ONE &copy; 2024 — NO LIMITS.</p>
    </footer>
</body>
</html>
`;

module.exports = {
  home: (products, content, user) => layout('Store', `
    <section class="hero">
        <p style="text-transform: uppercase; letter-spacing: 5px; margin-bottom: 10px;">Équipement de légende</p>
        <h1>THE BIG ONE</h1>
        <p>Ne vous contentez pas du petit. Visez le record.</p>
        <a href="#shop" class="btn">Explorer la collection</a>
    </section>
    <div class="container" id="shop">
        <div class="grid">
            ${products.map(p => `
                <div class="card">
                    <img src="${p.image || 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=600'}" class="card-img">
                    <div class="card-content">
                        <h3 class="card-title">${p.name}</h3>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem">
                            <span class="card-price">${p.price} CHF</span>
                            <a href="/product/${p.id}" class="btn" style="padding: 0.5rem 1rem;">Détails</a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
  `, user),

  login: () => layout('Authentification', `
    <div style="max-width: 450px; margin: 10vh auto; padding: 3rem; background:var(--surface); border: 1px solid var(--border)">
        <h2 style="font-family:'Syncopate'; color:var(--primary); margin-bottom:2rem; text-align:center">ACCÈS MEMBRE</h2>
        <form action="/login" method="POST" style="display:flex; flex-direction:column; gap:1.5rem">
            <input type="email" name="email" placeholder="EMAIL" style="background:transparent; border:none; border-bottom:1px solid var(--border); padding:1rem; color:white; outline:none" required>
            <input type="password" name="password" placeholder="MOT DE PASSE" style="background:transparent; border:none; border-bottom:1px solid var(--border); padding:1rem; color:white; outline:none" required>
            <button type="submit" class="btn btn-full">SE CONNECTER</button>
        </form>
        <div style="margin-top:2rem; text-align:center">
            <a href="/register" style="color:var(--muted); text-decoration:none; font-size:0.8rem">CRÉER UN COMPTE</a>
        </div>
    </div>
  `),
  
  // Tu peux continuer avec les autres fonctions (register, profile, etc.)
};