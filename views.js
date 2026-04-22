// views.js — PêchePro
const CSS = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&display=swap');
:root {
  --bg: #0a0a0a;
  --surface: #111111;
  --surface2: #1a1a1a;
  --border: #222222;
  --accent: #00ff87;
  --accent2: #00cc6a;
  --text: #f0f0f0;
  --muted: #666;
  --white: #fff;
  --red: #ff4444;
  --gold: #ffd700;
  --shadow: 0 4px 24px rgba(0,255,135,0.08);
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
::selection{background:var(--accent);color:#000}
.banner{background:var(--accent);color:#000;text-align:center;padding:.5rem;font-size:.85rem;font-weight:600;letter-spacing:.05em}
nav{background:rgba(10,10,10,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:0 2rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;height:64px}
.nav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.4rem;color:var(--white);text-decoration:none;display:flex;align-items:center;gap:.5rem}
.nav-logo span{color:var(--accent)}
.nav-links{display:flex;align-items:center;gap:.25rem}
.nav-links a{color:var(--muted);text-decoration:none;padding:.5rem .9rem;border-radius:8px;font-size:.875rem;font-weight:500;transition:all .2s}
.nav-links a:hover{color:var(--text);background:var(--surface2)}
.nav-cart{background:var(--accent)!important;color:#000!important;font-weight:600!important;border-radius:8px!important}
.nav-cart:hover{background:var(--accent2)!important;color:#000!important}
.cart-badge{background:#000;color:var(--accent);border-radius:50%;padding:0 5px;font-size:.7rem;margin-left:4px;font-weight:700}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;padding:.65rem 1.4rem;border-radius:10px;font-weight:600;font-size:.875rem;cursor:pointer;text-decoration:none;border:none;transition:all .2s;font-family:'Inter',sans-serif;white-space:nowrap}
.btn-accent{background:var(--accent);color:#000}
.btn-accent:hover{background:var(--accent2);transform:translateY(-1px)}
.btn-outline{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn-outline:hover{border-color:var(--accent);color:var(--accent)}
.btn-danger{background:#1a0000;color:var(--red);border:1px solid #330000}
.btn-danger:hover{background:#330000}
.btn-ghost{background:var(--surface2);color:var(--text);border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--accent)}
.btn-sm{padding:.4rem .9rem;font-size:.8rem}
.btn-full{width:100%}
.flash{padding:.75rem 1rem;border-radius:10px;margin:.75rem 0;font-size:.875rem;font-weight:500}
.flash-success{background:rgba(0,255,135,.1);color:var(--accent);border:1px solid rgba(0,255,135,.2)}
.flash-error{background:rgba(255,68,68,.1);color:var(--red);border:1px solid rgba(255,68,68,.2)}
.hero{min-height:92vh;display:flex;align-items:center;position:relative;overflow:hidden;background:var(--bg)}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 60% 50%,rgba(0,255,135,.06) 0%,transparent 70%)}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse at center,black 30%,transparent 80%)}
.hero-content{max-width:1200px;margin:0 auto;padding:4rem 2rem;position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
.hero-tag{display:inline-flex;align-items:center;gap:.4rem;background:rgba(0,255,135,.1);color:var(--accent);border:1px solid rgba(0,255,135,.2);padding:.35rem .9rem;border-radius:50px;font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem}
.hero h1{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2.5rem,5vw,4rem);line-height:1.05;color:var(--white);margin-bottom:1.25rem}
.hero h1 .accent{color:var(--accent)}
.hero p{color:var(--muted);font-size:1.05rem;line-height:1.7;margin-bottom:2rem;max-width:480px}
.hero-btns{display:flex;gap:.75rem;flex-wrap:wrap}
.hero-visual{display:flex;flex-direction:column;gap:1rem}
.hero-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.25rem;display:flex;align-items:center;gap:1rem;transition:all .3s}
.hero-card:hover{border-color:var(--accent);transform:translateX(4px)}
.hero-card .icon{font-size:2rem;width:48px;text-align:center}
.hero-card h4{font-weight:600;font-size:.9rem;margin-bottom:.15rem}
.hero-card p{font-size:.8rem;color:var(--muted)}
.hero-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1rem}
.hero-stat{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1rem;text-align:center}
.hero-stat h3{font-family:'Syne',sans-serif;font-size:1.5rem;color:var(--accent);font-weight:800}
.hero-stat p{font-size:.75rem;color:var(--muted);margin-top:.2rem}
.section{padding:5rem 2rem}
.container{max-width:1200px;margin:0 auto}
.section-label{display:inline-block;color:var(--accent);font-size:.75rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;margin-bottom:.75rem}
.section-title{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--white);margin-bottom:.5rem}
.section-sub{color:var(--muted);margin-bottom:2.5rem;font-size:.95rem}
.cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.cat-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.75rem 1.25rem;text-align:center;text-decoration:none;transition:all .25s;position:relative;overflow:hidden}
.cat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,255,135,.05),transparent);opacity:0;transition:.3s}
.cat-card:hover{border-color:var(--accent);transform:translateY(-4px)}
.cat-card:hover::before{opacity:1}
.cat-icon{font-size:2.5rem;margin-bottom:.75rem;display:block}
.cat-card h3{font-size:.9rem;font-weight:600;color:var(--text)}
.cat-card p{font-size:.75rem;color:var(--muted);margin-top:.25rem}
.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}
.product-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .25s;display:flex;flex-direction:column}
.product-card:hover{border-color:var(--accent);transform:translateY(-3px);box-shadow:var(--shadow)}
.product-img{height:180px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:3.5rem;overflow:hidden;position:relative}
.product-img img{width:100%;height:100%;object-fit:cover}
.product-badge{position:absolute;top:.6rem;left:.6rem;background:var(--accent);color:#000;padding:.2rem .6rem;border-radius:50px;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.product-body{padding:1.1rem;flex:1;display:flex;flex-direction:column;gap:.4rem}
.product-cat{font-size:.7rem;color:var(--accent);font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.product-name{font-weight:600;font-size:.9rem;color:var(--white);line-height:1.3}
.product-desc{font-size:.8rem;color:var(--muted);line-height:1.5;flex:1}
.product-footer{display:flex;align-items:center;justify-content:space-between;margin-top:.5rem;padding-top:.75rem;border-top:1px solid var(--border)}
.product-price{font-family:'Syne',sans-serif;font-size:1.2rem;color:var(--accent);font-weight:800}
.product-stock{font-size:.7rem;color:var(--muted)}
.product-stock.low{color:var(--red)}
.catalog-header{background:var(--surface);border-bottom:1px solid var(--border);padding:2.5rem 2rem}
.catalog-header h1{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--white)}
.catalog-header p{color:var(--muted);margin-top:.3rem;font-size:.9rem}
.filters{background:var(--surface);border-bottom:1px solid var(--border);padding:1rem 2rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
.filter-btn{padding:.4rem 1rem;border-radius:8px;border:1px solid var(--border);background:transparent;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;font-size:.8rem;color:var(--muted);transition:all .2s;text-decoration:none;display:inline-block}
.filter-btn.active,.filter-btn:hover{background:var(--accent);color:#000;border-color:var(--accent)}
.search-box{margin-left:auto;display:flex;gap:.5rem}
.search-box input{padding:.45rem .9rem;border:1px solid var(--border);border-radius:8px;font-family:'Inter',sans-serif;font-size:.85rem;outline:none;background:var(--surface2);color:var(--text)}
.search-box input:focus{border-color:var(--accent)}
.product-detail{display:grid;grid-template-columns:1fr 1fr;gap:4rem;padding:4rem 2rem;max-width:1200px;margin:0 auto}
.product-detail-img{background:var(--surface);border:1px solid var(--border);border-radius:20px;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:7rem;overflow:hidden}
.product-detail-img img{width:100%;height:100%;object-fit:cover}
.product-detail-info{display:flex;flex-direction:column;gap:1.25rem}
.category-tag{color:var(--accent);font-weight:700;text-transform:uppercase;font-size:.75rem;letter-spacing:.1em}
.product-detail-info h1{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--white);line-height:1.15}
.detail-price{font-family:'Syne',sans-serif;font-size:2.2rem;color:var(--accent);font-weight:800}
.detail-desc{color:var(--muted);line-height:1.8;font-size:.95rem}
.qty-control{display:flex;align-items:center;gap:.75rem}
.qty-btn{width:36px;height:36px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.qty-btn:hover{border-color:var(--accent);color:var(--accent)}
.qty-input{width:60px;text-align:center;font-size:1rem;font-weight:600;padding:.4rem;border:1px solid var(--border);border-radius:8px;font-family:'Inter',sans-serif;background:var(--surface2);color:var(--text)}
.cart-layout{display:grid;grid-template-columns:1fr 360px;gap:1.5rem;max-width:1200px;margin:0 auto;padding:3rem 2rem}
.cart-items{display:flex;flex-direction:column;gap:.75rem}
.cart-item{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.1rem;display:flex;align-items:center;gap:1.25rem;transition:border-color .2s}
.cart-item-img{width:72px;height:72px;border-radius:10px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:2rem;overflow:hidden;flex-shrink:0;border:1px solid var(--border)}
.cart-item-img img{width:100%;height:100%;object-fit:cover}
.cart-item-info{flex:1}
.cart-item-info h4{font-weight:600;font-size:.9rem;color:var(--white);margin-bottom:.2rem}
.cart-item-info p{color:var(--muted);font-size:.8rem}
.cart-item-price{font-family:'Syne',sans-serif;font-size:1.1rem;color:var(--accent);font-weight:800;white-space:nowrap}
.cart-summary{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.5rem;height:fit-content;position:sticky;top:80px}
.cart-summary h3{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--white);margin-bottom:1.25rem}
.summary-line{display:flex;justify-content:space-between;margin-bottom:.6rem;font-size:.875rem;color:var(--muted)}
.summary-total{display:flex;justify-content:space-between;padding-top:.75rem;border-top:1px solid var(--border);margin-top:.75rem;font-weight:700;font-size:1.1rem;color:var(--white)}
.promo-box{background:var(--surface2);border-radius:10px;padding:.9rem;margin-top:.9rem;border:1px solid var(--border)}
.promo-box input{width:100%;padding:.55rem .9rem;border:1px solid var(--border);border-radius:8px;font-family:'Inter',sans-serif;font-size:.85rem;margin-bottom:.5rem;outline:none;background:var(--bg);color:var(--text)}
.promo-box input:focus{border-color:var(--accent)}
.promo-applied{background:rgba(0,255,135,.1);color:var(--accent);border:1px solid rgba(0,255,135,.2);padding:.5rem .9rem;border-radius:8px;font-size:.8rem;font-weight:600;display:flex;justify-content:space-between;align-items:center}
.cart-empty{text-align:center;padding:5rem 2rem}
.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:2rem;position:relative}
.auth-page::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,255,135,.04),transparent 70%)}
.auth-box{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:2.5rem;width:100%;max-width:420px;position:relative;z-index:1}
.auth-box h1{font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:var(--white);margin-bottom:.3rem}
.auth-box p{color:var(--muted);margin-bottom:1.75rem;font-size:.875rem}
.form-group{margin-bottom:1rem}
.form-group label{display:block;font-weight:600;font-size:.8rem;color:var(--muted);margin-bottom:.35rem;text-transform:uppercase;letter-spacing:.05em}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:.7rem 1rem;border:1px solid var(--border);border-radius:10px;font-family:'Inter',sans-serif;font-size:.9rem;outline:none;transition:border .2s;background:var(--surface2);color:var(--text)}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--accent)}
.form-group textarea{resize:vertical;min-height:90px}
.form-link{text-align:center;margin-top:1.25rem;font-size:.875rem;color:var(--muted)}
.form-link a{color:var(--accent);font-weight:600;text-decoration:none}
.review-card{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:1rem;margin-bottom:.6rem}
.review-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem}
.review-author{font-weight:600;font-size:.875rem;color:var(--white)}
.stars{color:var(--gold);font-size:.9rem;letter-spacing:.1em}
.success-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:2rem}
.success-box{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:3rem;max-width:480px;width:100%;text-align:center}
.success-icon{font-size:4rem;margin-bottom:1rem;animation:pop .5s ease}
@keyframes pop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
.success-box h1{font-family:'Syne',sans-serif;color:var(--white);font-size:1.8rem;font-weight:800;margin-bottom:.5rem}
.success-box p{color:var(--muted);margin-bottom:1.5rem;line-height:1.7;font-size:.9rem}
.order-details{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:1.1rem;margin-bottom:1.5rem;text-align:left}
.order-line{display:flex;justify-content:space-between;font-size:.875rem;margin-bottom:.35rem;color:var(--muted)}
.order-line strong{color:var(--text)}
.admin-layout{display:flex;min-height:100vh;background:var(--bg)}
.admin-sidebar{width:240px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:50;overflow-y:auto}
.admin-logo{padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.6rem}
.admin-logo h2{font-family:'Syne',sans-serif;color:var(--white);font-size:1rem;font-weight:800}
.admin-logo span{background:var(--accent);color:#000;padding:.15rem .5rem;border-radius:4px;font-size:.65rem;font-weight:700;letter-spacing:.08em}
.admin-nav{padding:.75rem 0;flex:1;display:flex;flex-direction:column}
.admin-nav-section{padding:.4rem 1.25rem;color:var(--muted);font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;margin-top:.5rem;display:block;width:100%}
.admin-nav a{display:flex;align-items:center;gap:.65rem;padding:.6rem 1.25rem;color:var(--muted);text-decoration:none;font-size:.83rem;font-weight:500;transition:all .15s;border-left:2px solid transparent;margin:.1rem 0;width:100%}
.admin-nav a:hover,.admin-nav a.active{color:var(--white);background:rgba(255,255,255,.04);border-left-color:var(--accent)}
.admin-nav a.active{color:var(--accent)}
.admin-nav a .icon{font-size:1rem;width:18px;text-align:center}
.admin-main{margin-left:240px;flex:1;display:flex;flex-direction:column}
.admin-topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:.9rem 1.75rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:40}
.admin-topbar h1{font-size:.95rem;font-weight:600;color:var(--white)}
.admin-content{padding:1.75rem;flex:1}
.admin-avatar{width:32px;height:32px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#000;font-weight:700;font-size:.85rem}
.stats-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:1rem;margin-bottom:1.75rem}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.25rem;position:relative;overflow:hidden;transition:border-color .2s}
.stat-card:hover{border-color:var(--accent)}
.stat-card .stat-icon{font-size:1.5rem;margin-bottom:.6rem;opacity:.8}
.stat-card .stat-value{font-family:'Syne',sans-serif;font-size:1.75rem;color:var(--white);font-weight:800;line-height:1}
.stat-card .stat-label{color:var(--muted);font-size:.75rem;margin-top:.3rem}
.stat-card .stat-accent{position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--accent)}
.admin-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:1.25rem}
.admin-card-header{padding:1rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.admin-card-header h3{font-weight:600;color:var(--white);font-size:.9rem;display:flex;align-items:center;gap:.5rem}
table{width:100%;border-collapse:collapse}
th{background:var(--surface2);padding:.6rem 1rem;text-align:left;font-size:.7rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid var(--border)}
td{padding:.75rem 1rem;border-bottom:1px solid var(--border);font-size:.85rem;vertical-align:middle;color:var(--muted)}
td strong{color:var(--text)}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.01)}
.badge{display:inline-flex;align-items:center;padding:.2rem .65rem;border-radius:50px;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
.badge-pending{background:rgba(255,165,0,.1);color:orange;border:1px solid rgba(255,165,0,.2)}
.badge-paid{background:rgba(0,255,135,.1);color:var(--accent);border:1px solid rgba(0,255,135,.2)}
.badge-shipped{background:rgba(0,150,255,.1);color:#0096ff;border:1px solid rgba(0,150,255,.2)}
.badge-cancelled{background:rgba(255,68,68,.1);color:var(--red);border:1px solid rgba(255,68,68,.2)}
.badge-admin{background:rgba(255,215,0,.1);color:var(--gold);border:1px solid rgba(255,215,0,.2)}
.badge-user{background:var(--surface2);color:var(--muted);border:1px solid var(--border)}
.badge-open{background:rgba(255,68,68,.1);color:var(--red);border:1px solid rgba(255,68,68,.2)}
.badge-active{background:rgba(0,255,135,.1);color:var(--accent);border:1px solid rgba(0,255,135,.2)}
.badge-inactive{background:var(--surface2);color:var(--muted);border:1px solid var(--border)}

.chat-widget{position:fixed;bottom:1.5rem;right:1.5rem;z-index:999;font-family:'Inter',sans-serif}
.chat-btn{width:56px;height:56px;border-radius:50%;background:var(--accent);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.5rem;box-shadow:0 4px 20px rgba(0,255,135,.4);transition:all .25s}
.chat-btn:hover{transform:scale(1.1)}
.chat-bubble{position:absolute;bottom:70px;right:0;width:320px;background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.4);display:none;flex-direction:column}
.chat-bubble.open{display:flex}
.chat-head{background:var(--accent);padding:.9rem 1.1rem;display:flex;align-items:center;gap:.6rem}
.chat-head h4{font-size:.85rem;font-weight:700;color:#000;margin:0}
.chat-head p{font-size:.72rem;color:rgba(0,0,0,.6);margin:0}
.chat-msgs{flex:1;overflow-y:auto;padding:.9rem;display:flex;flex-direction:column;gap:.6rem;max-height:260px;min-height:120px}
.chat-msg{padding:.6rem .85rem;border-radius:12px;font-size:.82rem;line-height:1.5;max-width:85%}
.chat-msg.bot{background:var(--surface2);border:1px solid var(--border);color:var(--text);align-self:flex-start;border-bottom-left-radius:4px}
.chat-msg.user{background:var(--accent);color:#000;align-self:flex-end;border-bottom-right-radius:4px}
.chat-typing{display:flex;gap:.25rem;padding:.4rem .6rem}
.chat-typing span{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:blink 1.2s infinite}
.chat-typing span:nth-child(2){animation-delay:.2s}
.chat-typing span:nth-child(3){animation-delay:.4s}
@keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}
.chat-input-row{display:flex;gap:.5rem;padding:.75rem;border-top:1px solid var(--border)}
.chat-input-row input{flex:1;padding:.5rem .75rem;border:1px solid var(--border);border-radius:8px;background:var(--surface2);color:var(--text);font-family:'Inter',sans-serif;font-size:.82rem;outline:none}
.chat-input-row input:focus{border-color:var(--accent)}
.chat-input-row button{background:var(--accent);border:none;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}
footer{background:var(--surface);border-top:1px solid var(--border);padding:3rem 2rem 1.5rem}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;max-width:1200px;margin:0 auto}
.footer-brand h3{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--white);margin-bottom:.6rem}
.footer-brand h3 span{color:var(--accent)}
.footer-brand p{color:var(--muted);font-size:.85rem;line-height:1.7}
.footer-col h4{color:var(--muted);font-weight:700;margin-bottom:.9rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em}
.footer-col a{display:block;color:var(--muted);text-decoration:none;margin-bottom:.4rem;font-size:.85rem;transition:color .2s}
.footer-col a:hover{color:var(--accent)}
.footer-bottom{max-width:1200px;margin:2rem auto 0;padding-top:1.25rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted)}
@media(max-width:900px){.cat-grid{grid-template-columns:repeat(2,1fr)}.stats-grid{grid-template-columns:repeat(2,1fr)}.cart-layout{grid-template-columns:1fr}.product-detail{grid-template-columns:1fr;gap:2rem}.hero-content{grid-template-columns:1fr}.hero-visual{display:none}.footer-grid{grid-template-columns:1fr}}
@media(max-width:600px){.hero h1{font-size:2rem}.admin-sidebar{width:200px}.admin-main{margin-left:200px}}
</style>`;

function layout(title, body, user, count, content) {
  const isAdmin = user && user.role === 'admin';
  const cartCount = count || 0;
  const banner = content && content.banner_active === '1' ? `<div class="banner">${content.banner_text || ''}</div>` : '';
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} — PêchePro</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎣</text></svg>">
  ${CSS}
</head>
<body>
  ${banner}
  <nav>
    <a href="/" class="nav-logo">🎣 Pêche<span>Pro</span></a>
    <div class="nav-links">
      <a href="/catalogue">Catalogue</a>
      <a href="/blog">Blog</a><a href="/forum">Forum</a><a href="/demandes">💡 Demandes</a><a href="/leaderboard">🏆</a><a href="/premium">⭐ Premium</a>
      ${user ? `<a href="/compte">Mon compte</a><a href="/tickets">Support</a>` : `<a href="/login">Connexion</a><a href="/register">S'inscrire</a>`}
      ${isAdmin ? `<a href="/admin" style="color:var(--accent)!important">Admin</a>` : ''}
      <a href="/panier" class="nav-cart">🛒 Panier${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}</a>
    </div>
  </nav>
  ${body}
  <footer>
    <div class="footer-grid">
      <div class="footer-brand"><h3>🎣 Pêche<span>Pro</span></h3><p>Le matériel de pêche pour la nouvelle génération. Qualité pro, prix justes.</p></div>
      <div class="footer-col"><h4>Boutique</h4><a href="/catalogue">Tout voir</a><a href="/catalogue?cat=Cannes">Cannes</a><a href="/catalogue?cat=Moulinets">Moulinets</a><a href="/catalogue?cat=Leurres">Leurres</a></div>
      <div class="footer-col"><h4>Mon compte</h4><a href="/login">Connexion</a><a href="/register">Inscription</a><a href="/tickets">Support</a></div>
    </div>
    <div style="max-width:1200px;margin:2rem auto 0;padding:1.5rem 0;border-top:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
        <div><h4 style="color:var(--white);font-size:.875rem;font-weight:700;margin-bottom:.25rem">📧 Newsletter</h4><p style="color:var(--muted);font-size:.8rem">Promos exclusives et nouveautés</p></div>
        <form method="POST" action="/newsletter" style="display:flex;gap:.5rem;margin-left:auto">
          <input type="email" name="email" placeholder="ton@email.com" style="padding:.55rem 1rem;border:1px solid var(--border);border-radius:8px;background:var(--surface2);color:var(--text);font-family:'Inter',sans-serif;font-size:.85rem;outline:none">
          <button type="submit" class="btn btn-accent btn-sm">S'inscrire</button>
        </form>
      </div>
    </div>
    <div class="footer-bottom"><span>© 2024 PêchePro — Fait avec passion 🎣</span><span>Paiement sécurisé Stripe 🔒</span></div>
  </footer>
  <div class="chat-widget">
    <div class="chat-bubble" id="chatBubble">
      <div class="chat-head">
        <div style="width:32px;height:32px;border-radius:50%;background:#000;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">🎣</div>
        <div><h4>Support PêchePro</h4><p>On répond en général sous 1h</p></div>
        <button onclick="toggleChat()" style="margin-left:auto;background:none;border:none;cursor:pointer;font-size:1.1rem;color:#000">✕</button>
      </div>
      <div class="chat-msgs" id="chatMsgs">
        <div class="chat-msg bot">Bonjour ! 👋 Comment puis-je t'aider aujourd'hui ?</div>
      </div>
      <div class="chat-input-row">
        <input type="text" id="chatInput" placeholder="Ton message..." onkeydown="if(event.key==='Enter')sendChat()">
        <button onclick="sendChat()">→</button>
      </div>
    </div>
    <button class="chat-btn" onclick="toggleChat()" id="chatToggle" title="Support">💬</button>
  </div>
  <script>
    function toggleChat(){
      const b=document.getElementById('chatBubble');
      b.classList.toggle('open');
      if(b.classList.contains('open')) document.getElementById('chatInput').focus();
    }
    function sendChat(){
      const inp=document.getElementById('chatInput');
      const msg=inp.value.trim();
      if(!msg) return;
      const msgs=document.getElementById('chatMsgs');
      msgs.innerHTML+='<div class="chat-msg user">'+msg+'</div>';
      inp.value='';
      msgs.scrollTop=msgs.scrollHeight;
      // Typing indicator
      const typing=document.createElement('div');
      typing.className='chat-msg bot';
      typing.innerHTML='<div class="chat-typing"><span></span><span></span><span></span></div>';
      msgs.appendChild(typing);
      msgs.scrollTop=msgs.scrollHeight;
      // Auto-reply
      setTimeout(()=>{
        typing.remove();
        const replies={
          'livraison':'La livraison standard est gratuite dès 0 CHF. Express +4.99 CHF, livraison nuit +9.99 CHF. 📦',
          'retour':'Tu as 14 jours pour retourner un article non utilisé. Contacte-nous par ticket. ✅',
          'paiement':'On accepte toutes les cartes via Stripe. Paiement 100% sécurisé. 🔒',
          'point':'Tu gagnes 1 point par CHF dépensé. 100 points = 5 CHF de réduction. 🌟',
          'stock':'Si un produit est en rupture, tu peux activer l'alerte stock sur sa page. 🔔',
          'commande':'Tu peux suivre ta commande dans ton espace "Mon compte". 📋',
        };
        let rep='Pour toute question précise, crée un ticket dans ton espace support — notre équipe répond sous 1h ! 💪';
        for(const [k,r] of Object.entries(replies)){
          if(msg.toLowerCase().includes(k)){rep=r;break;}
        }
        msgs.innerHTML+='<div class="chat-msg bot">'+rep+'</div>';
        msgs.scrollTop=msgs.scrollHeight;
      },1000);
    }
  </script>
</body></html>`;
}

function flash(req) {
  const msgs = req.session.flash || [];
  req.session.flash = [];
  if (!msgs.length) return '';
  return msgs.map(m => `<div class="flash flash-${m.type}">${m.msg}</div>`).join('');
}
function getCartCount(req) {
  return Object.values(req.session.cart || {}).reduce((s, q) => s + q, 0);
}
function catEmoji(cat) {
  return { 'Cannes': '🎣', 'Moulinets': '🌀', 'Leurres': '🐟', 'Accessoires': '🎒' }[cat] || '🎣';
}
function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}
function productCard(p) {
  return `<div class="product-card">
    <div class="product-img">
      <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <span style="display:none;font-size:3.5rem;width:100%;height:100%;align-items:center;justify-content:center;background:var(--surface2)">${catEmoji(p.category)}</span>
      ${p.featured ? '<span class="product-badge">🔥 Top</span>' : ''}
    </div>
    <div class="product-body">
      <div class="product-cat">${p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${(p.description || '').substring(0, 75)}${(p.description || '').length > 75 ? '…' : ''}</div>
      <div class="product-footer">
        <span class="product-price">${p.price.toFixed(2)} CHF</span>
        <span class="product-stock ${p.stock < 5 ? 'low' : ''}">${p.stock > 0 ? `${p.stock} dispo` : 'Rupture'}</span>
      </div>
      <a href="/produit/${p.id}" class="btn btn-outline btn-full" style="margin-top:.75rem;font-size:.8rem">Voir →</a>
    </div>
  </div>`;
}

function adminLayout(title, content, activeKey) {
  const nav = [
    { section: 'Vue d\'ensemble' },
    { href: '/admin', icon: '◉', label: 'Dashboard', key: 'dashboard' },
    { section: 'Boutique' },
    { href: '/admin/commandes', icon: '📦', label: 'Commandes', key: 'commandes' },
    { href: '/admin/produits', icon: '🛒', label: 'Produits', key: 'produits' },
    { href: '/admin/produits/nouveau', icon: '+', label: 'Ajouter produit', key: 'nouveau' },
    { href: '/admin/promos', icon: '🎟', label: 'Codes promo', key: 'promos' },
    { section: 'Communauté' },
    { href: '/admin/utilisateurs', icon: '👥', label: 'Utilisateurs', key: 'users' },
    { href: '/admin/tickets', icon: '💬', label: 'Support tickets', key: 'tickets' },
    { href: '/admin/avis', icon: '⭐', label: 'Avis clients', key: 'avis' },
    { section: 'Paramètres' },
    { href: '/admin/contenu', icon: '✏️', label: 'Contenu & Bannière', key: 'contenu' },
    { href: '/admin/newsletter', icon: '📧', label: 'Newsletter', key: 'newsletter' },
    { href: '/admin/blog', icon: '📝', label: 'Blog', key: 'blog' },
    { section: 'Gestion interne' },
    { href: '/admin/fournisseurs', icon: '🏭', label: 'Fournisseurs', key: 'fournisseurs' },
    { href: '/admin/stocks', icon: '📦', label: 'Stocks', key: 'stocks' },
    { href: '/admin/finances', icon: '💰', label: 'Finances & Marges', key: 'finances' },
    { href: '/', icon: '↗', label: 'Voir le site', key: '' },
    { href: '/logout', icon: '→', label: 'Déconnexion', key: '' },
  ];
  const navHTML = nav.map(n => {
    if (n.section) return `<div class="admin-nav-section">${n.section}</div>`;
    return `<a href="${n.href}" class="${activeKey === n.key ? 'active' : ''}"><span class="icon">${n.icon}</span>${n.label}</a>`;
  }).join('');
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Admin PêchePro</title>${CSS}
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head><body>
<div class="admin-layout">
  <aside class="admin-sidebar">
    <div class="admin-logo"><span style="font-size:1.2rem">🎣</span><h2>PêchePro</h2><span>ADMIN</span></div>
    <nav class="admin-nav">${navHTML}</nav>
  </aside>
  <div class="admin-main">
    <div class="admin-topbar"><h1>${title}</h1><div style="display:flex;align-items:center;gap:.75rem"><span style="font-size:.8rem;color:var(--muted)">Admin</span><div class="admin-avatar">A</div></div></div>
    <div class="admin-content">${content}</div>
  </div>
</div></body></html>`;
}

// ── HOME : (req, user, products, content, flashSales) ──
exports.home = (req, user, products, content, flashSales) => {
  const featured = products.filter(p => p.featured);
  const flashItems = flashSales || [];
  const flashBanner = flashItems.length ? `
    <section style="background:linear-gradient(135deg,#ff4444,#ff8800);padding:1.5rem 2rem;text-align:center">
      <div class="container">
        <p style="font-weight:800;font-size:1.1rem;color:#fff;margin-bottom:.75rem">⚡ FLASH SALE — Offres limitées !</p>
        <div class="products-grid" style="max-width:900px;margin:0 auto">
          ${flashItems.slice(0,4).map(p => productCard(p)).join('')}
        </div>
      </div>
    </section>` : '';
  const body = `
    <style>
      .hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 40%}
      .hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.35) 60%,rgba(0,0,0,.55) 100%)}
      .hero-overlay2{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,10,1) 0%,transparent 30%)}
      .reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
      .reveal.visible{opacity:1;transform:none}
      .reveal-delay-1{transition-delay:.15s}
      .reveal-delay-2{transition-delay:.3s}
      .reveal-delay-3{transition-delay:.45s}
      .reveal-delay-4{transition-delay:.6s}
      .hero-badge{display:inline-flex;align-items:center;gap:.4rem;background:rgba(0,255,135,.12);color:var(--accent);border:1px solid rgba(0,255,135,.25);padding:.35rem .9rem;border-radius:50px;font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;backdrop-filter:blur(8px)}
      .hero-feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-top:2rem}
      .hero-feat{background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:.85rem 1rem;display:flex;align-items:center;gap:.75rem;transition:all .25s}
      .hero-feat:hover{background:rgba(0,255,135,.08);border-color:rgba(0,255,135,.3)}
      .hero-feat .fi{font-size:1.4rem}
      .hero-feat h4{font-size:.82rem;font-weight:600;color:#fff;margin-bottom:.1rem}
      .hero-feat p{font-size:.72rem;color:rgba(255,255,255,.5);margin:0}
      .stat-pill{background:rgba(255,255,255,.07);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:.75rem 1.25rem;text-align:center}
      .stat-pill h3{font-family:'Syne',sans-serif;font-size:1.6rem;color:var(--accent);font-weight:800;line-height:1}
      .stat-pill p{font-size:.7rem;color:rgba(255,255,255,.5);margin-top:.2rem}
      @media(max-width:768px){.hero-feature-grid{grid-template-columns:1fr}}
    </style>
    <div class="hero" style="min-height:100vh;overflow:hidden">
      <img class="hero-img" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85&auto=format&fit=crop" alt="Lac de pêche" onerror="this.style.display='none'">
      <div class="hero-overlay"></div>
      <div class="hero-overlay2"></div>
      <div class="hero-content" style="position:relative;z-index:2;align-items:center">
        <div>
          <div class="hero-badge reveal">🎣 Matériel expert 2024</div>
          <h1 class="reveal reveal-delay-1" style="margin-top:1rem;font-size:clamp(2.8rem,5.5vw,4.2rem);text-shadow:0 2px 20px rgba(0,0,0,.4)">${content.hero_title || 'La pêche,<br>une <span class="accent">passion</span>'}</h1>
          <p class="reveal reveal-delay-2" style="color:rgba(255,255,255,.7);font-size:1.05rem;line-height:1.7;margin-bottom:2rem;max-width:480px;text-shadow:0 1px 8px rgba(0,0,0,.5)">${content.hero_subtitle || 'Du matos de qualité pro pour les pêcheurs de la nouvelle génération.'}</p>
          <div class="hero-btns reveal reveal-delay-3">
            <a href="/catalogue" class="btn btn-accent" style="padding:.9rem 2rem;font-size:1rem;box-shadow:0 0 24px rgba(0,255,135,.3)">${content.hero_cta || 'Explorer le catalogue →'}</a>
            <a href="/register" class="btn btn-outline" style="padding:.9rem 2rem;font-size:1rem;background:rgba(255,255,255,.06);backdrop-filter:blur(8px);border-color:rgba(255,255,255,.2);color:#fff">Créer un compte</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-top:2.5rem" class="reveal reveal-delay-4">
            <div class="stat-pill"><h3>500+</h3><p>Références</p></div>
            <div class="stat-pill"><h3>12k+</h3><p>Clients</p></div>
            <div class="stat-pill"><h3>4.9★</h3><p>Note moy.</p></div>
          </div>
        </div>
        <div class="hero-visual reveal reveal-delay-2">
          <div class="hero-feature-grid">
            <div class="hero-feat"><div class="fi">🎣</div><div><h4>Cannes premium</h4><p>Carbone haute modulus</p></div></div>
            <div class="hero-feat"><div class="fi">🌀</div><div><h4>Moulinets top</h4><p>Shimano, Daiwa & co</p></div></div>
            <div class="hero-feat"><div class="fi">🐟</div><div><h4>Leurres efficaces</h4><p>Testés sur le terrain</p></div></div>
            <div class="hero-feat"><div class="fi">⚡</div><div><h4>Livraison rapide</h4><p>Expédié sous 24h</p></div></div>
            <div class="hero-feat"><div class="fi">🎁</div><div><h4>Points fidélité</h4><p>1 CHF = 1 point</p></div></div>
            <div class="hero-feat"><div class="fi">🔒</div><div><h4>Paiement sécurisé</h4><p>Stripe SSL</p></div></div>
          </div>
        </div>
      </div>
    </div>
    <script>
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
      }, {threshold:0.1});
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    </script>
    ${flashBanner}
    <section class="section"><div class="container">
      <span class="section-label">Catégories</span><h2 class="section-title">Tout ce qu'il faut</h2><p class="section-sub">Du matos pour tous les styles de pêche</p>
      <div class="cat-grid">
        <a href="/catalogue?cat=Cannes" class="cat-card"><span class="cat-icon">🎣</span><h3>Cannes</h3><p>Spinning, télescopique, coup</p></a>
        <a href="/catalogue?cat=Moulinets" class="cat-card"><span class="cat-icon">🌀</span><h3>Moulinets</h3><p>Shimano, Daiwa, Mitchell</p></a>
        <a href="/catalogue?cat=Leurres" class="cat-card"><span class="cat-icon">🐟</span><h3>Leurres</h3><p>Shads, poppers, swimbaits</p></a>
        <a href="/catalogue?cat=Accessoires" class="cat-card"><span class="cat-icon">🎒</span><h3>Accessoires</h3><p>Tout le reste</p></a>
      </div>
    </div></section>
    <section class="section" style="background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)"><div class="container">
      <span class="section-label">Populaires</span><h2 class="section-title">🔥 Les favoris</h2><p class="section-sub">Ce que les pêcheurs commandent le plus</p>
      <div class="products-grid">${featured.map(p => productCard(p)).join('')}</div>
      <div style="text-align:center;margin-top:2.5rem"><a href="/catalogue" class="btn btn-accent" style="padding:.8rem 2rem">Voir tout le catalogue →</a></div>
    </div></section>
    <section class="section"><div class="container" style="max-width:800px;text-align:center">
      <span class="section-label">Notre mission</span>
      <h2 class="section-title">${content.about_text || 'Du matos pro, sans prise de tête'}</h2>
      <p style="color:var(--muted);margin:1rem 0 2rem;line-height:1.8">On sélectionne le meilleur matériel pour que tu passes plus de temps à pêcher qu'à chercher.</p>
      <a href="/catalogue" class="btn btn-outline">Explorer →</a>
    </div></section>`;
  return layout('Accueil', body, user, getCartCount(req), content);
};

// ── CATALOGUE : (req, user, products, cat, search, min, max, sort, wishlist) ──
exports.catalogue = (req, user, products, cat, search, min, max, sort, wishlist) => {
  const cats = ['Cannes', 'Moulinets', 'Leurres', 'Accessoires'];
  const wl = wishlist || [];
  const body = `
    <div class="catalog-header"><div class="container"><h1>Catalogue</h1><p>${products.length} produit${products.length > 1 ? 's' : ''} ${cat ? `dans "${cat}"` : 'disponibles'}</p></div></div>
    <div class="filters">
      <a href="/catalogue" class="filter-btn ${!cat ? 'active' : ''}">Tout</a>
      ${cats.map(c => `<a href="/catalogue?cat=${c}${sort?'&sort='+sort:''}" class="filter-btn ${cat === c ? 'active' : ''}">${c}</a>`).join('')}
      <select onchange="location.href='/catalogue?'+(new URLSearchParams({...Object.fromEntries(new URLSearchParams(location.search)),sort:this.value})).toString()" style="padding:.4rem .8rem;border:1px solid var(--border);border-radius:8px;background:var(--surface2);color:var(--text);font-family:'Inter',sans-serif;font-size:.8rem;margin-left:.5rem">
        <option value="" ${!sort?'selected':''}>Tri par défaut</option>
        <option value="price_asc" ${sort==='price_asc'?'selected':''}>Prix croissant</option>
        <option value="price_desc" ${sort==='price_desc'?'selected':''}>Prix décroissant</option>
        <option value="newest" ${sort==='newest'?'selected':''}>Nouveautés</option>
      </select>
      <form class="search-box" method="GET" action="/catalogue">
        ${cat ? `<input type="hidden" name="cat" value="${cat}">` : ''}
        ${sort ? `<input type="hidden" name="sort" value="${sort}">` : ''}
        <input type="text" name="search" placeholder="Rechercher..." value="${search || ''}">
        <button type="submit" class="btn btn-accent btn-sm">🔍</button>
      </form>
    </div>
    <section class="section"><div class="container">
      ${products.length ? `<div class="products-grid">${products.map(p => {
        const inWl = wl.includes(p.id);
        return `<div class="product-card">
          <div class="product-img">
            <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <span style="display:none;font-size:3.5rem;width:100%;height:100%;align-items:center;justify-content:center;background:var(--surface2)">${catEmoji(p.category)}</span>
            ${p.featured ? '<span class="product-badge">🔥 Top</span>' : ''}
          </div>
          <div class="product-body">
            <div class="product-cat">${p.category}</div>
            <div class="product-name">${p.name}</div>
            <div class="product-desc">${(p.description || '').substring(0, 75)}${(p.description || '').length > 75 ? '…' : ''}</div>
            <div class="product-footer">
              <span class="product-price">${p.price.toFixed(2)} CHF</span>
              <span class="product-stock ${p.stock < 5 ? 'low' : ''}">${p.stock > 0 ? `${p.stock} dispo` : 'Rupture'}</span>
            </div>
            <div style="display:flex;gap:.5rem;margin-top:.75rem">
              <a href="/produit/${p.id}" class="btn btn-outline btn-full" style="font-size:.8rem">Voir →</a>
              ${user ? `<form method="POST" action="/wishlist/toggle" style="flex-shrink:0"><input type="hidden" name="product_id" value="${p.id}"><button type="submit" class="btn btn-ghost btn-sm" style="color:${inWl?'var(--red)':'var(--muted)'}">${inWl?'❤️':'🤍'}</button></form>` : ''}
            </div>
          </div>
        </div>`;
      }).join('')}</div>` : `<div style="text-align:center;padding:5rem;color:var(--muted)"><p style="font-size:3rem;margin-bottom:1rem">🎣</p><p>Aucun produit trouvé</p></div>`}
    </div></section>`;
  return layout('Catalogue', body, user, getCartCount(req));
};

// ── PRODUCT : (req, user, p, reviews, avgRating, related, inWishlist, alertExists) ──
exports.product = (req, user, p, reviews, avgRating, related, inWishlist, alertExists) => {
  const reviewsHTML = reviews && reviews.length
    ? reviews.map(r => `<div class="review-card"><div class="review-header"><span class="review-author">${r.user_name}</span><span class="stars">${stars(r.rating)}</span></div><p style="font-size:.85rem;color:var(--muted);margin-top:.3rem">${r.comment || ''}</p><small style="color:var(--muted);font-size:.75rem">${new Date(r.created_at).toLocaleDateString('fr-FR')}</small></div>`).join('')
    : '<p style="color:var(--muted);font-size:.875rem">Aucun avis pour le moment.</p>';
  const relatedHTML = related && related.length ? `
    <section class="section" style="border-top:1px solid var(--border)"><div class="container">
      <h2 class="section-title" style="font-size:1.3rem;margin-bottom:1.25rem">Produits similaires</h2>
      <div class="products-grid">${related.map(r => productCard(r)).join('')}</div>
    </div></section>` : '';
  const body = `
    <div style="background:var(--surface);border-bottom:1px solid var(--border);padding:.75rem 2rem">
      <div style="max-width:1200px;margin:0 auto;font-size:.8rem;color:var(--muted)">
        <a href="/" style="color:var(--muted);text-decoration:none">Accueil</a> → <a href="/catalogue" style="color:var(--muted);text-decoration:none">Catalogue</a> → <span style="color:var(--text)">${p.name}</span>
      </div>
    </div>
    <div class="product-detail">
      <div class="product-detail-img">
        <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <span style="display:none;font-size:7rem;width:100%;height:100%;align-items:center;justify-content:center">${catEmoji(p.category)}</span>
      </div>
      <div class="product-detail-info">
        <span class="category-tag">${p.category}</span>
        <h1>${p.name}</h1>
        ${avgRating ? `<div class="stars" style="font-size:1.1rem">${stars(Math.round(avgRating))} <span style="color:var(--muted);font-size:.85rem">${avgRating}/5 · ${reviews.length} avis</span></div>` : ''}
        <div class="detail-price">${p.price.toFixed(2)} CHF</div>
        <p class="detail-desc">${p.description || ''}</p>
        <p style="color:${p.stock > 5 ? 'var(--accent)' : p.stock > 0 ? 'orange' : 'var(--red)'};font-weight:600;font-size:.875rem">${p.stock > 0 ? `✓ En stock — ${p.stock} disponibles` : '✗ Rupture de stock'}</p>
        ${p.stock > 0 ? `
        <form action="/panier/ajouter" method="POST">
          <input type="hidden" name="product_id" value="${p.id}">
          <div style="margin-bottom:1rem">
            <label style="display:block;font-size:.75rem;color:var(--muted);margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.05em;font-weight:700">Quantité</label>
            <div class="qty-control">
              <button type="button" class="qty-btn" onclick="const i=this.nextElementSibling;i.value=Math.max(1,+i.value-1)">−</button>
              <input type="number" name="qty" value="1" min="1" max="${p.stock}" class="qty-input">
              <button type="button" class="qty-btn" onclick="const i=this.previousElementSibling;i.value=Math.min(${p.stock},+i.value+1)">+</button>
            </div>
          </div>
          <button type="submit" class="btn btn-accent btn-full" style="padding:1rem;font-size:1rem">🛒 Ajouter au panier</button>
        </form>` : `
        <button class="btn btn-outline btn-full" disabled style="opacity:.4;cursor:not-allowed">Rupture de stock</button>
        ${user && !alertExists ? `<form method="POST" action="/alerte-stock" style="margin-top:.5rem"><input type="hidden" name="product_id" value="${p.id}"><button type="submit" class="btn btn-ghost btn-full" style="font-size:.8rem">🔔 M'alerter quand dispo</button></form>` : user && alertExists ? '<p style="color:var(--accent);font-size:.8rem;margin-top:.5rem">🔔 Alerte activée !</p>' : ''}`}
        ${user ? `
        <form method="POST" action="/wishlist/toggle" style="margin-top:.5rem">
          <input type="hidden" name="product_id" value="${p.id}">
          <button type="submit" class="btn btn-outline btn-full" style="font-size:.85rem">${inWishlist ? '❤️ Retirer de la wishlist' : '🤍 Ajouter à la wishlist'}</button>
        </form>` : ''}
        <a href="/catalogue" style="color:var(--muted);font-size:.8rem;text-decoration:none;display:inline-block;margin-top:.5rem">← Retour au catalogue</a>
      </div>
    </div>
    <section class="section" style="background:var(--surface);border-top:1px solid var(--border)">
      <div class="container" style="max-width:900px">
        <h2 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem">Avis clients</h2>
        <div style="margin-bottom:2rem">${reviewsHTML}</div>
        ${user ? `
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:1.5rem">
          <h3 style="font-weight:700;font-size:.9rem;color:var(--white);margin-bottom:1rem;text-transform:uppercase;letter-spacing:.05em">Laisser un avis</h3>
          ${flash(req)}
          <form method="POST" action="/produit/${p.id}/avis">
            <div class="form-group"><label>Note</label><select name="rating">${[5,4,3,2,1].map(n => `<option value="${n}">${stars(n)} (${n}/5)</option>`).join('')}</select></div>
            <div class="form-group"><label>Commentaire</label><textarea name="comment" placeholder="Ton avis sur le produit..."></textarea></div>
            <button type="submit" class="btn btn-accent">Envoyer mon avis</button>
          </form>
        </div>` : `<div style="text-align:center;padding:1.5rem;color:var(--muted)"><a href="/login" class="btn btn-outline">Connecte-toi pour laisser un avis</a></div>`}
      </div>
    </section>
    ${relatedHTML}`;
  return layout(p.name, body, user, getCartCount(req));
};

// ── PANIER ──
exports.panier = (req, user, items) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const promo = req.session.promo || null;
  let discount = 0;
  if (promo) { discount = promo.type === 'percent' ? subtotal * promo.value / 100 : promo.value; discount = Math.min(discount, subtotal); }
  const total = subtotal - discount;
  const body = items.length ? `
    <div class="cart-layout">
      <div>
        <h2 style="font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:var(--white);margin-bottom:1.25rem">Mon panier <span style="color:var(--muted);font-size:1rem;font-family:'Inter',sans-serif;font-weight:400">(${items.reduce((s,i)=>s+i.qty,0)} articles)</span></h2>
        ${flash(req)}
        <div class="cart-items">
          ${items.map(i => `
            <div class="cart-item">
              <div class="cart-item-img"><img src="${i.image}" alt="${i.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="display:none;font-size:2rem;width:100%;height:100%;align-items:center;justify-content:center">${catEmoji(i.category)}</span></div>
              <div class="cart-item-info"><h4>${i.name}</h4><p>${i.price.toFixed(2)} CHF / unité</p></div>
              <form action="/panier/update" method="POST" style="display:flex;align-items:center;gap:.4rem">
                <input type="hidden" name="product_id" value="${i.id}">
                <input type="number" name="qty" value="${i.qty}" min="1" max="99" style="width:55px;padding:.3rem;border:1px solid var(--border);border-radius:8px;text-align:center;font-family:'Inter',sans-serif;background:var(--surface2);color:var(--text);font-size:.85rem">
                <button type="submit" class="btn btn-ghost btn-sm">✓</button>
              </form>
              <div class="cart-item-price">${(i.price * i.qty).toFixed(2)} CHF</div>
              <form action="/panier/supprimer" method="POST"><input type="hidden" name="product_id" value="${i.id}"><button type="submit" class="btn btn-danger btn-sm">✕</button></form>
            </div>`).join('')}
        </div>
      </div>
      <div class="cart-summary">
        <h3>Résumé</h3>
        <div class="summary-line"><span>Sous-total</span><span>${subtotal.toFixed(2)} CHF</span></div>
        ${discount > 0 ? `<div class="summary-line" style="color:var(--accent)"><span>Réduction (${promo.code})</span><span>-${discount.toFixed(2)} CHF</span></div>` : ''}
        <div class="summary-line"><span>Livraison</span><span style="color:var(--accent)">Gratuite</span></div>
        <div class="summary-total"><span>Total</span><span>${total.toFixed(2)} CHF</span></div>
        <div class="promo-box">
          ${promo ? `<div class="promo-applied"><span>🎟 ${promo.code} appliqué !</span><form method="POST" action="/panier/promo/supprimer" style="margin:0"><button type="submit" style="background:none;border:none;cursor:pointer;color:var(--red);font-weight:700;font-size:1rem">×</button></form></div>`
          : `<form method="POST" action="/panier/promo"><input type="text" name="code" placeholder="Code promo..."><button type="submit" class="btn btn-outline btn-sm btn-full">Appliquer</button></form>`}
        </div>
        <a href="/checkout" class="btn btn-accent btn-full" style="margin-top:1rem;padding:1rem;font-size:.95rem">Payer maintenant 🔒</a>
        <p style="text-align:center;font-size:.72rem;color:var(--muted);margin-top:.6rem">Paiement sécurisé · Stripe</p>
      </div>
    </div>` : `
    <div class="cart-empty">
      <div style="font-size:4rem;margin-bottom:1rem;opacity:.3">🛒</div>
      <h2 style="font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:var(--white);margin-bottom:.5rem">Panier vide</h2>
      <p style="color:var(--muted);margin-bottom:1.75rem;font-size:.9rem">Tu n'as rien dans ton panier pour l'instant</p>
      <a href="/catalogue" class="btn btn-accent">Explorer le catalogue →</a>
    </div>`;
  return layout('Panier', `<div style="padding:2rem 2rem 0">${flash(req)}</div>${body}`, user, getCartCount(req));
};

exports.login = (req) => layout('Connexion', `
  <div class="auth-page"><div class="auth-box">
    <a href="/" style="color:var(--muted);font-size:.8rem;text-decoration:none;display:block;margin-bottom:1.5rem">← Retour</a>
    <h1>Content de te revoir 👋</h1><p>Connecte-toi à ton compte PêchePro</p>
    ${flash(req)}
    <form method="POST" action="/login">
      <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="toi@exemple.com"></div>
      <div class="form-group"><label>Mot de passe</label><input type="password" name="password" required placeholder="••••••••"></div>
      <button type="submit" class="btn btn-accent btn-full" style="padding:1rem;margin-top:.5rem">Se connecter →</button>
    </form>
    <div class="form-link">Pas encore de compte ? <a href="/register">S'inscrire</a></div>
    <div class="form-link" style="margin-top:.5rem"><a href="/forgot-password" style="color:var(--muted);font-size:.8rem">Mot de passe oublié ?</a></div>
  </div></div>`);

exports.register = (req) => layout('Inscription', `
  <div class="auth-page"><div class="auth-box">
    <a href="/" style="color:var(--muted);font-size:.8rem;text-decoration:none;display:block;margin-bottom:1.5rem">← Retour</a>
    <h1>Rejoins PêchePro 🎣</h1><p>Crée ton compte et accède à tout le matos</p>
    ${flash(req)}
    <form method="POST" action="/register">
      <div class="form-group"><label>Prénom & nom</label><input type="text" name="name" required placeholder="Jean Dupont"></div>
      <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="toi@exemple.com"></div>
      <div class="form-group"><label>Mot de passe</label><input type="password" name="password" required placeholder="Min. 6 caractères" minlength="6"></div>
      <div class="form-group"><label>Code de parrainage (optionnel)</label><input type="text" name="referral" placeholder="PECHEXXXX"></div>
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:1rem"><input type="checkbox" name="newsletter" id="nl" style="accent-color:var(--accent)"><label for="nl" style="font-size:.85rem;color:var(--muted);text-transform:none;letter-spacing:0">S'inscrire à la newsletter</label></div>
      <button type="submit" class="btn btn-accent btn-full" style="padding:1rem;margin-top:.5rem">Créer mon compte →</button>
    </form>
    <div class="form-link">Déjà un compte ? <a href="/login">Se connecter</a></div>
  </div></div>`);

// ── COMPTE : (req, user, orders, tickets, addresses, wishlistCount) ──
exports.compte = (req, user, orders, tickets, addresses, wishlistCount) => {
  const totalDepense = orders.reduce((s, o) => s + o.total, 0);
  const ticketsOuverts = tickets.filter(t => t.status === 'ouvert').length;
  return layout('Mon compte', `
  <section class="section">
    <div class="container" style="max-width:860px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem">
        <div>
          <h1 style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:var(--white)">Salut ${user.name.split(' ')[0]} 👋</h1>
          <p style="color:var(--muted);font-size:.875rem;margin-top:.2rem">${user.email}</p>
        </div>
        <a href="/logout" class="btn btn-outline btn-sm">Déconnexion</a>
      </div>
      ${flash(req)}

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.25rem;text-align:center">
          <p style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--accent)">${orders.length}</p>
          <p style="color:var(--muted);font-size:.8rem;margin-top:.2rem">Commande${orders.length>1?'s':''}</p>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.25rem;text-align:center">
          <p style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--accent)">${totalDepense.toFixed(0)} CHF</p>
          <p style="color:var(--muted);font-size:.8rem;margin-top:.2rem">Total dépensé</p>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.25rem;text-align:center">
          <p style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--accent)">${user.points || 0}</p>
          <p style="color:var(--muted);font-size:.8rem;margin-top:.2rem">Points fidélité</p>
        </div>
        <div style="background:var(--surface);border:1px solid ${ticketsOuverts>0?'var(--red)':'var(--border)'};border-radius:14px;padding:1.25rem;text-align:center">
          <p style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:${ticketsOuverts>0?'var(--red)':'var(--accent)'}">${ticketsOuverts}</p>
          <p style="color:var(--muted);font-size:.8rem;margin-top:.2rem">Tickets ouverts</p>
        </div>
      </div>

      <!-- Commandes -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:1rem">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
          <h3 style="font-weight:600;font-size:.9rem;color:var(--white)">📦 Mes commandes</h3>
          <a href="/catalogue" class="btn btn-accent btn-sm">+ Commander</a>
        </div>
        ${orders.length ? `<table>
          <tr><th>#</th><th>Date</th><th>Total</th><th>Statut</th><th>Actions</th></tr>
          ${orders.map(o => `<tr>
            <td><strong>#${o.id}</strong></td>
            <td>${new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
            <td><strong style="color:var(--accent)">${o.total.toFixed(2)} CHF</strong></td>
            <td><span class="badge badge-${o.status === 'payé' ? 'paid' : o.status === 'expédié' ? 'shipped' : o.status === 'annulé' ? 'cancelled' : 'pending'}">${o.status}</span></td>
            <td style="display:flex;gap:.4rem"><a href="/facture/${o.id}" class="btn btn-outline btn-sm" target="_blank">📄 Facture</a><a href="/commande/${o.id}" class="btn btn-ghost btn-sm">🚚 Suivi</a></td>
          </tr>`).join('')}
        </table>` : `<div style="padding:2rem;text-align:center;color:var(--muted);font-size:.875rem">Aucune commande pour l'instant — <a href="/catalogue" style="color:var(--accent)">explorer le catalogue</a></div>`}
      </div>

      <!-- Points + Parrainage -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.25rem">
          <h3 style="font-weight:700;font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:1rem">⭐ Points fidélité</h3>
          <p style="font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:800;color:var(--accent)">${user.points || 0}</p>
          <p style="color:var(--muted);font-size:.8rem;margin-top:.2rem">points disponibles</p>
          <p style="font-size:.75rem;color:var(--muted);margin-top:.5rem">100 pts = 5 CHF de réduction au panier</p>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.25rem">
          <h3 style="font-weight:700;font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.75rem">🎁 Mon code parrainage</h3>
          <div style="background:var(--surface2);border:1px solid var(--accent);border-radius:8px;padding:.75rem;text-align:center;cursor:pointer" onclick="navigator.clipboard.writeText('${user.referral_code || ''}');this.querySelector('span').textContent='Copié ✓'">
            <code style="font-family:'Syne',sans-serif;font-size:1.2rem;color:var(--accent);letter-spacing:.15em">${user.referral_code || '—'}</code>
            <br><span style="font-size:.72rem;color:var(--muted);margin-top:.3rem;display:block">Cliquer pour copier</span>
          </div>
          <p style="font-size:.75rem;color:var(--muted);margin-top:.5rem">+50 pts pour toi à chaque ami parrainé</p>
        </div>
      </div>

      <!-- Adresses -->
      ${addresses && addresses.length ? `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:1rem">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border)"><h3 style="font-weight:600;font-size:.9rem;color:var(--white)">📍 Mes adresses</h3></div>
        <div style="padding:1rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem">
          ${addresses.map(a => `
          <div style="background:var(--surface2);border:1px solid ${a.is_default ? 'var(--accent)' : 'var(--border)'};border-radius:10px;padding:1rem;font-size:.85rem">
            <div style="display:flex;justify-content:space-between;margin-bottom:.5rem"><strong style="color:var(--white)">${a.label}</strong>${a.is_default ? '<span class="badge badge-paid" style="font-size:.65rem">Défaut</span>' : ''}</div>
            <p style="color:var(--muted)">${a.firstname || ''} ${a.lastname || ''}</p>
            <p style="color:var(--muted)">${a.address || ''}</p>
            <p style="color:var(--muted)">${a.zip || ''} ${a.city || ''}, ${a.country || ''}</p>
            <form method="POST" action="/compte/adresse/${a.id}/supprimer" style="margin-top:.5rem"><button type="submit" class="btn btn-danger btn-sm" style="font-size:.72rem">Supprimer</button></form>
          </div>`).join('')}
        </div>
      </div>` : ''}

      <!-- Actions -->
      <div style="display:flex;gap:.75rem;margin-top:1rem;flex-wrap:wrap">
        <a href="/wishlist" class="btn btn-outline">❤️ Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}</a>
        <a href="/tickets" class="btn btn-outline">💬 Support</a>
        <a href="/parrainage" class="btn btn-outline">🎁 Parrainage</a>
        <a href="/logout" class="btn btn-outline">Déconnexion</a>
      </div>
    </div>
  </section>`, user, getCartCount(req));
};

// ── CHECKOUT : (req, user, items, promo, discount, total, addresses, userData, pointsDiscount) ──
exports.checkout = (req, user, items, promo, discount, total, addresses, userData, pointsDiscount) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const pd = pointsDiscount || 0;
  return layout('Finaliser la commande', `
  <section class="section">
    <div class="container" style="max-width:960px">
      <h1 style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:var(--white);margin-bottom:2rem">🚚 Finaliser la commande</h1>
      ${flash(req)}
      <form method="POST" action="/checkout">
        <div style="display:grid;grid-template-columns:1fr 360px;gap:1.5rem">
          <div>
            <div class="admin-card" style="margin-bottom:1.25rem">
              <div class="admin-card-header"><h3>📦 Informations de livraison</h3></div>
              <div style="padding:1.5rem;display:grid;grid-template-columns:1fr 1fr;gap:1rem">
                <div class="form-group"><label>Prénom *</label><input name="firstname" required placeholder="Jean" value="${user.name.split(' ')[0] || ''}"></div>
                <div class="form-group"><label>Nom *</label><input name="lastname" required placeholder="Dupont" value="${user.name.split(' ').slice(1).join(' ') || ''}"></div>
                <div class="form-group" style="grid-column:1/-1"><label>Email *</label><input type="email" name="email" required value="${user.email}"></div>
                <div class="form-group" style="grid-column:1/-1"><label>Téléphone *</label><input type="tel" name="phone" required placeholder="06 12 34 56 78"></div>
                ${addresses && addresses.length ? `
                <div class="form-group" style="grid-column:1/-1">
                  <label>Utiliser une adresse sauvegardée</label>
                  <select onchange="if(this.value){const a=JSON.parse(this.value);document.querySelector('[name=address]').value=a.address;document.querySelector('[name=zip]').value=a.zip;document.querySelector('[name=city]').value=a.city;}">
                    <option value="">— Saisir manuellement —</option>
                    ${addresses.map(a=>`<option value='${JSON.stringify({address:a.address,zip:a.zip,city:a.city})}'>${a.label}: ${a.address}, ${a.city}</option>`).join('')}
                  </select>
                </div>` : ''}
                <div class="form-group" style="grid-column:1/-1"><label>Adresse *</label><input name="address" required placeholder="12 rue de la Pêche"></div>
                <div class="form-group"><label>Code postal *</label><input name="zip" required placeholder="1200" maxlength="10"></div>
                <div class="form-group"><label>Ville *</label><input name="city" required placeholder="Genève"></div>
                <div class="form-group" style="grid-column:1/-1"><label>Pays</label>
                  <select name="country">
                    <option value="Suisse" selected>Suisse 🇨🇭</option>
                    <option value="France">France 🇫🇷</option>
                    <option value="Belgique">Belgique 🇧🇪</option>
                    <option value="Luxembourg">Luxembourg 🇱🇺</option>
                  </select>
                </div>
                <div class="form-group" style="grid-column:1/-1"><label>Note de livraison (optionnel)</label><textarea name="delivery_note" placeholder="Instructions spéciales, digicode..." style="min-height:60px"></textarea></div>
              </div>
            </div>
            <div class="admin-card" style="margin-bottom:1.25rem">
              <div class="admin-card-header"><h3>🚚 Mode de livraison</h3></div>
              <div style="padding:1.25rem;display:flex;flex-direction:column;gap:.6rem">
                <label style="display:flex;align-items:center;gap:1rem;background:var(--surface2);border:1px solid var(--accent);border-radius:10px;padding:1rem;cursor:pointer">
                  <input type="radio" name="shipping" value="standard" checked style="accent-color:var(--accent)">
                  <div style="flex:1"><div style="font-weight:600;font-size:.9rem;color:var(--white)">Livraison standard</div><div style="font-size:.8rem;color:var(--muted)">3-5 jours ouvrés</div></div>
                  <span style="font-weight:700;color:var(--accent)">Gratuit</span>
                </label>
                <label style="display:flex;align-items:center;gap:1rem;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:1rem;cursor:pointer">
                  <input type="radio" name="shipping" value="express" style="accent-color:var(--accent)">
                  <div style="flex:1"><div style="font-weight:600;font-size:.9rem;color:var(--white)">Livraison express</div><div style="font-size:.8rem;color:var(--muted)">1-2 jours ouvrés</div></div>
                  <span style="font-weight:700;color:var(--text)">+4.99 CHF</span>
                </label>
                <label style="display:flex;align-items:center;gap:1rem;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:1rem;cursor:pointer">
                  <input type="radio" name="shipping" value="overnight" style="accent-color:var(--accent)">
                  <div style="flex:1"><div style="font-weight:600;font-size:.9rem;color:var(--white)">Livraison nuit</div><div style="font-size:.8rem;color:var(--muted)">Demain avant 13h</div></div>
                  <span style="font-weight:700;color:var(--text)">+9.99 CHF</span>
                </label>
              </div>
            </div>
            <button type="submit" class="btn btn-accent btn-full" style="padding:1rem;font-size:1rem">Payer maintenant 🔒</button>
            <p style="text-align:center;font-size:.72rem;color:var(--muted);margin-top:.5rem">Paiement sécurisé · Stripe</p>
          </div>
          <div>
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.25rem;position:sticky;top:80px">
              <h3 style="font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:var(--white);margin-bottom:1.25rem">Résumé</h3>
              ${items.map(i => `
              <div style="display:flex;align-items:center;gap:.75rem;padding:.5rem 0;border-bottom:1px solid var(--border)">
                <div style="width:40px;height:40px;border-radius:8px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${catEmoji(i.category)}</div>
                <div style="flex:1"><p style="font-size:.8rem;font-weight:600;color:var(--white)">${i.name}</p><p style="font-size:.75rem;color:var(--muted)">x${i.qty}</p></div>
                <span style="font-size:.85rem;font-weight:700;color:var(--accent)">${(i.price*i.qty).toFixed(2)} CHF</span>
              </div>`).join('')}
              <div style="margin-top:1rem">
                <div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--muted);margin-bottom:.4rem"><span>Sous-total</span><span>${subtotal.toFixed(2)} CHF</span></div>
                ${discount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--accent);margin-bottom:.4rem"><span>Code ${promo ? promo.code : ''}</span><span>-${discount.toFixed(2)} CHF</span></div>` : ''}
                ${pd > 0 ? `<div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--accent);margin-bottom:.4rem"><span>Points fidélité</span><span>-${pd.toFixed(2)} CHF</span></div>` : ''}
                <div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--muted);margin-bottom:.4rem"><span>Livraison</span><span id="shippingCost" style="color:var(--accent)">Gratuit</span></div>
                <hr style="border:none;border-top:1px solid var(--border);margin:.75rem 0">
                <div style="display:flex;justify-content:space-between;font-weight:700;font-size:1.1rem;color:var(--white)"><span>Total</span><span id="totalDisplay" style="color:var(--accent)">${total.toFixed(2)} CHF</span></div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
  <script>
    const baseTotal = ${total};
    const costs = {standard:0,express:4.99,overnight:9.99};
    document.querySelectorAll('input[name="shipping"]').forEach(r => {
      r.addEventListener('change', () => {
        const c = costs[r.value]||0;
        document.getElementById('shippingCost').textContent = c>0 ? c.toFixed(2)+' CHF' : 'Gratuit';
        document.getElementById('shippingCost').style.color = c>0 ? 'var(--text)' : 'var(--accent)';
        document.getElementById('totalDisplay').textContent = (baseTotal+c).toFixed(2)+' CHF';
      });
    });
  </script>`, user, getCartCount(req));
};

// ── SUCCESS ──
exports.success = (req, user, order, items) => layout('Commande confirmée', `
  <div class="success-page"><div class="success-box">
    <div class="success-icon">✅</div>
    <h1>C'est parti !</h1>
    <p>Ta commande #${order.id} est confirmée. On s'occupe du reste.</p>
    <div class="order-details">
      <div class="order-line"><span>Commande</span><strong>#${order.id}</strong></div>
      <div class="order-line"><span>Client</span><strong>${order.name}</strong></div>
      <hr style="border:none;border-top:1px solid var(--border);margin:.6rem 0">
      ${items.map(i => `<div class="order-line"><span>${i.name} ×${i.quantity}</span><strong>${(i.price*i.quantity).toFixed(2)} CHF</strong></div>`).join('')}
      ${order.discount > 0 ? `<div class="order-line" style="color:var(--accent)"><span>Réduction</span><strong>-${order.discount.toFixed(2)} CHF</strong></div>` : ''}
      <hr style="border:none;border-top:1px solid var(--border);margin:.6rem 0">
      <div class="order-line"><strong>Total</strong><strong style="color:var(--accent)">${order.total.toFixed(2)} CHF</strong></div>
      ${order.points_earned > 0 ? `<div class="order-line" style="color:var(--accent);margin-top:.5rem"><span>🌟 Points gagnés</span><strong>+${order.points_earned} pts</strong></div>` : ''}
    </div>
    <div style="display:flex;gap:.75rem;justify-content:center">
      <a href="/facture/${order.id}" class="btn btn-outline" target="_blank">📄 Facture</a>
      <a href="/compte" class="btn btn-accent">Mon compte →</a>
    </div>
  </div></div>`, user, 0);

// ── SUIVI COMMANDE : alias de orderTracking ──
exports.suiviCommande = (req, user, order, items) => {
  const steps = [{key:'en_attente',label:'Commande reçue',icon:'📋'},{key:'payé',label:'Paiement confirmé',icon:'✅'},{key:'expédié',label:'En livraison',icon:'🚚'},{key:'livré',label:'Livré',icon:'📦'}];
  const currentStep = steps.findIndex(s => s.key === order.status);
  return layout(`Suivi #${order.id}`, `
  <section class="section"><div class="container" style="max-width:800px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem">
      <h1 style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:var(--white)">Suivi commande #${order.id}</h1>
      <a href="/compte" class="btn btn-outline btn-sm">← Mon compte</a>
    </div>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:2rem;margin-bottom:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;position:relative">
        <div style="position:absolute;top:20px;left:10%;right:10%;height:2px;background:var(--border);z-index:0"></div>
        <div style="position:absolute;top:20px;left:10%;height:2px;width:${Math.min(Math.max(currentStep,0)/(steps.length-1)*80,80)}%;background:var(--accent);z-index:1"></div>
        ${steps.map((s,i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:.5rem;position:relative;z-index:2"><div style="width:40px;height:40px;border-radius:50%;background:${i<=currentStep?'var(--accent)':'var(--surface2)'};border:2px solid ${i<=currentStep?'var(--accent)':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:1.1rem">${s.icon}</div><span style="font-size:.72rem;color:${i<=currentStep?'var(--accent)':'var(--muted)'};font-weight:${i<=currentStep?'700':'400'};text-align:center">${s.label}</span></div>`).join('')}
      </div>
    </div>
    ${order.tracking_number ? `<div style="background:rgba(0,255,135,.05);border:1px solid rgba(0,255,135,.2);border-radius:14px;padding:1.25rem;margin-bottom:1.5rem;text-align:center"><p style="color:var(--muted);font-size:.8rem;margin-bottom:.3rem">Numéro de suivi</p><h2 style="font-family:'Syne',sans-serif;color:var(--accent);font-size:1.5rem;letter-spacing:.1em">${order.tracking_number}</h2></div>` : ''}
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden">
      <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border)"><h3 style="font-weight:600;font-size:.9rem;color:var(--white)">Articles</h3></div>
      <table><tr><th>Produit</th><th>Quantité</th><th>Prix</th></tr>${items.map(i=>`<tr><td><strong>${i.name}</strong></td><td>${i.quantity}</td><td>${(i.price*i.quantity).toFixed(2)} CHF</td></tr>`).join('')}<tr><td colspan="2" style="text-align:right;font-weight:700;color:var(--white)">Total</td><td style="font-weight:800;color:var(--accent)">${order.total.toFixed(2)} CHF</td></tr></table>
    </div>
  </div></section>`, user, getCartCount(req));
};

// ── WISHLIST ──
exports.wishlist = (req, user, items) => layout('Ma wishlist', `
  <section class="section"><div class="container" style="max-width:1000px">
    <h1 style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:var(--white);margin-bottom:2rem">❤️ Ma wishlist</h1>
    ${items.length ? `<div class="products-grid">${items.map(p => productCard(p)).join('')}</div>` : `<div style="text-align:center;padding:4rem;color:var(--muted)"><p style="font-size:3rem;margin-bottom:1rem">❤️</p><p>Aucun produit dans ta wishlist</p><a href="/catalogue" class="btn btn-accent" style="margin-top:1rem">Explorer →</a></div>`}
  </div></section>`, user, getCartCount(req));

// ── PARRAINAGE : (req, user, userData, referrals, pointsHistory) ──
exports.parrainage = (req, user, userData, referrals, pointsHistory) => layout('Parrainage', `
  <section class="section"><div class="container" style="max-width:800px">
    <h1 style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:var(--white);margin-bottom:2rem">🎁 Mon parrainage</h1>
    ${flash(req)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2rem">
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.5rem;text-align:center">
        <h3 style="font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:1rem">Mon code</h3>
        <div style="background:var(--surface2);border:2px solid var(--accent);border-radius:10px;padding:1rem;cursor:pointer" onclick="navigator.clipboard.writeText('${userData.referral_code||''}');this.querySelector('span').textContent='Copié ✓'">
          <code style="font-family:'Syne',sans-serif;font-size:1.5rem;color:var(--accent);letter-spacing:.2em">${userData.referral_code || '—'}</code>
          <br><span style="font-size:.75rem;color:var(--muted);margin-top:.3rem;display:block">Cliquer pour copier</span>
        </div>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.5rem">
        <h3 style="font-size:.8rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:1rem">Stats</h3>
        <p style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--accent)">${referrals.length}</p>
        <p style="color:var(--muted);font-size:.85rem">ami${referrals.length > 1 ? 's' : ''} parrainé${referrals.length > 1 ? 's' : ''}</p>
        <p style="color:var(--muted);font-size:.85rem;margin-top:.5rem">= <strong style="color:var(--accent)">${referrals.length * 50} pts</strong> gagnés</p>
      </div>
    </div>
    ${referrals.length ? `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:1rem">
      <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border)"><h3 style="font-weight:600;font-size:.9rem;color:var(--white)">Amis parrainés</h3></div>
      <table><tr><th>Nom</th><th>Inscrit le</th></tr>${referrals.map(r=>`<tr><td><strong>${r.name}</strong></td><td style="color:var(--muted);font-size:.8rem">${new Date(r.created_at).toLocaleDateString('fr-FR')}</td></tr>`).join('')}</table>
    </div>` : ''}
    ${pointsHistory && pointsHistory.length ? `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden">
      <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border)"><h3 style="font-weight:600;font-size:.9rem;color:var(--white)">Historique des points</h3></div>
      <table><tr><th>Date</th><th>Raison</th><th>Points</th></tr>${pointsHistory.map(h=>`<tr><td style="font-size:.8rem;color:var(--muted)">${new Date(h.created_at).toLocaleDateString('fr-FR')}</td><td style="font-size:.85rem">${h.reason||'—'}</td><td><strong style="color:${h.points>0?'var(--accent)':'var(--red)'}">${h.points>0?'+':''}${h.points}</strong></td></tr>`).join('')}</table>
    </div>` : ''}
    <div style="margin-top:1rem"><a href="/compte" class="btn btn-outline">← Mon compte</a></div>
  </div></section>`, user, getCartCount(req));

// ── FACTURE ──
exports.facture = (order, items) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Facture #${order.id}</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:2rem;color:#111}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:3rem;padding-bottom:2rem;border-bottom:3px solid #00ff87}.logo{font-size:1.8rem;font-weight:900;color:#111}.logo span{color:#00ff87}.invoice-title{text-align:right}.invoice-title h1{font-size:2.5rem;color:#111;margin:0}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:2rem}.info-box h3{font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:#666;margin-bottom:.75rem}table{width:100%;border-collapse:collapse;margin:2rem 0}th{background:#111;color:#fff;padding:.75rem 1rem;text-align:left;font-size:.8rem}td{padding:.75rem 1rem;border-bottom:1px solid #eee}.totals{margin-left:auto;width:300px}.total-line{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid #eee}.total-final{display:flex;justify-content:space-between;padding:1rem 0;font-weight:700;font-size:1.2rem;border-top:3px solid #00ff87;margin-top:.5rem}@media print{.no-print{display:none}}</style>
</head><body>
  <div class="header"><div class="logo">🎣 Pêche<span>Pro</span></div><div class="invoice-title"><h1>FACTURE</h1><p>N° ${String(order.id).padStart(5,'0')}</p><p>${new Date(order.created_at).toLocaleDateString('fr-FR')}</p></div></div>
  <div class="info-grid"><div class="info-box"><h3>Vendeur</h3><p><strong>PêchePro</strong></p><p>contact@pechepro.fr</p></div><div class="info-box"><h3>Client</h3><p><strong>${order.name}</strong></p><p>${order.email}</p></div></div>
  <table><tr><th>Produit</th><th>Prix unitaire</th><th>Quantité</th><th>Total</th></tr>${items.map(i=>`<tr><td>${i.name}</td><td>${i.price.toFixed(2)} CHF</td><td>${i.quantity}</td><td>${(i.price*i.quantity).toFixed(2)} CHF</td></tr>`).join('')}</table>
  <div class="totals">
    ${order.discount>0?`<div class="total-line"><span>Réduction (${order.promo_code||''})</span><span>-${order.discount.toFixed(2)} CHF</span></div>`:''}
    <div class="total-line"><span>Sous-total HT</span><span>${(order.total/1.077).toFixed(2)} CHF</span></div>
    <div class="total-line"><span>TVA 7.7%</span><span>${(order.total-order.total/1.077).toFixed(2)} CHF</span></div>
    <div class="total-final"><span>Total TTC</span><span>${order.total.toFixed(2)} CHF</span></div>
  </div>
  <div class="no-print" style="text-align:center;margin-top:2rem"><button onclick="window.print()" style="padding:.8rem 2rem;background:#111;color:#fff;border:none;border-radius:8px;cursor:pointer">🖨 Imprimer / PDF</button></div>
</body></html>`;

// ── TICKETS ──
function ticketSidebar(tickets, activeId, showForm) {
  const ticketsList = tickets.map(t => {
    const isActive = t.id === activeId;
    const statusClass = t.status === 'ouvert' ? 'open' : t.status === 'résolu' ? 'paid' : 'shipped';
    return `<a href="/tickets/${t.id}" style="display:block;padding:.85rem 1rem;border-bottom:1px solid var(--border);text-decoration:none;background:${isActive?'rgba(0,255,135,.05)':'transparent'};border-left:2px solid ${isActive?'var(--accent)':'transparent'}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.25rem">
        <span style="font-size:.8rem;font-weight:600;color:${isActive?'var(--accent)':'var(--white)'}">Ticket #${t.id}</span>
        <span class="badge badge-${statusClass}" style="font-size:.6rem">${t.status}</span>
      </div>
      <div style="font-size:.78rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.subject}</div>
      ${t.admin_reply ? '<div style="font-size:.72rem;color:var(--accent);margin-top:.2rem">✓ Réponse reçue</div>' : ''}
    </a>`;
  }).join('');
  return `<div style="display:flex;flex-direction:column;gap:.75rem">
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden">
      <button onclick="var f=document.querySelector('.tf');f.style.display=f.style.display==='none'?'block':'none'" style="width:100%;padding:1rem 1.25rem;background:none;border:none;color:var(--white);font-family:'Inter',sans-serif;font-weight:700;font-size:.8rem;cursor:pointer;text-align:left;display:flex;justify-content:space-between;align-items:center;text-transform:uppercase;letter-spacing:.08em">
        + Nouveau ticket <span style="color:var(--accent)">▼</span>
      </button>
      <div class="tf" style="display:${showForm?'block':'none'};padding:1rem;border-top:1px solid var(--border)">
        <form method="POST" action="/tickets">
          <div class="form-group"><label>Sujet</label><input name="subject" required placeholder="Mon problème..."></div>
          <div class="form-group"><label>Message</label><textarea name="message" required placeholder="Décris en détail..." style="min-height:80px"></textarea></div>
          <button type="submit" class="btn btn-accent btn-full" style="font-size:.8rem">Envoyer →</button>
        </form>
      </div>
    </div>
    ${tickets.length ? `<div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden">
      <div style="padding:.65rem 1rem;border-bottom:1px solid var(--border)"><span style="font-size:.7rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.08em">Mes tickets (${tickets.length})</span></div>
      ${ticketsList}
    </div>` : ''}
  </div>`;
}

exports.tickets = (req, user, tickets) => layout('Support', `
  <section class="section"><div class="container" style="max-width:960px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.75rem">
      <div><h1 style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:var(--white)">💬 Support</h1><p style="color:var(--muted);font-size:.875rem;margin-top:.2rem">Un problème ? On répond vite.</p></div>
      <a href="/compte" class="btn btn-outline btn-sm">← Mon compte</a>
    </div>
    ${flash(req)}
    <div style="display:grid;grid-template-columns:260px 1fr;gap:1.25rem;min-height:500px">
      ${ticketSidebar(tickets, null, true)}
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:1rem;opacity:.2">💬</div>
        <p style="color:var(--muted);font-size:.875rem">Sélectionne un ticket ou crée-en un nouveau</p>
      </div>
    </div>
  </div></section>`, user, getCartCount(req));

exports.ticketChat = (req, user, ticket, tickets) => {
  const statusClass = ticket.status === 'ouvert' ? 'open' : ticket.status === 'résolu' ? 'paid' : 'shipped';
  const adminMsg = ticket.admin_reply ? `
    <div style="display:flex;gap:.75rem;align-items:flex-start;flex-direction:row-reverse">
      <div style="width:30px;height:30px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:#000;flex-shrink:0">S</div>
      <div style="flex:1">
        <div style="font-size:.75rem;font-weight:700;color:var(--accent);margin-bottom:.3rem;text-align:right">Support PêchePro</div>
        <div style="background:rgba(0,255,135,.08);border:1px solid rgba(0,255,135,.15);border-radius:12px 0 12px 12px;padding:.75rem 1rem;font-size:.875rem;line-height:1.6;color:var(--text);text-align:right">${ticket.admin_reply.replace(/\n/g,'<br>')}</div>
      </div>
    </div>` : '<div style="text-align:center;padding:1rem;color:var(--muted);font-size:.8rem">⏳ En attente de réponse...</div>';
  const inputZone = ticket.status !== 'résolu' ? `
    <div style="padding:.9rem 1.25rem;border-top:1px solid var(--border)">
      <form method="POST" action="/tickets/${ticket.id}/reply" style="display:flex;gap:.6rem;align-items:flex-end">
        <textarea name="message" placeholder="Ajouter un message..." required style="flex:1;padding:.65rem .9rem;border:1px solid var(--border);border-radius:10px;font-family:'Inter',sans-serif;font-size:.875rem;outline:none;background:var(--surface2);color:var(--text);resize:none;height:44px"></textarea>
        <button type="submit" class="btn btn-accent" style="height:44px;padding:.6rem 1rem">→</button>
      </form>
    </div>` : '<div style="padding:.9rem;border-top:1px solid var(--border);text-align:center;font-size:.8rem;color:var(--muted)">✅ Ticket résolu</div>';
  return layout(`Ticket #${ticket.id}`, `
  <section class="section"><div class="container" style="max-width:960px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.75rem">
      <div><h1 style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:var(--white)">💬 Support</h1></div>
      <a href="/compte" class="btn btn-outline btn-sm">← Mon compte</a>
    </div>
    ${flash(req)}
    <div style="display:grid;grid-template-columns:260px 1fr;gap:1.25rem;min-height:500px">
      ${ticketSidebar(tickets, ticket.id, false)}
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;display:flex;flex-direction:column">
        <div style="padding:.9rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div><h3 style="font-weight:700;font-size:.9rem;color:var(--white)">${ticket.subject}</h3><p style="font-size:.72rem;color:var(--muted);margin-top:.1rem">Ticket #${ticket.id} · ${new Date(ticket.created_at).toLocaleDateString('fr-FR')}</p></div>
          <span class="badge badge-${statusClass}">${ticket.status}</span>
        </div>
        <div style="flex:1;padding:1.25rem;display:flex;flex-direction:column;gap:1rem;overflow-y:auto;min-height:300px;max-height:420px">
          <div style="display:flex;gap:.75rem;align-items:flex-start">
            <div style="width:30px;height:30px;border-radius:50%;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:var(--accent);flex-shrink:0">${ticket.user_name[0].toUpperCase()}</div>
            <div style="flex:1">
              <div style="font-size:.75rem;font-weight:700;color:var(--text);margin-bottom:.3rem">${ticket.user_name}</div>
              <div style="background:var(--surface2);border:1px solid var(--border);border-radius:0 12px 12px 12px;padding:.75rem 1rem;font-size:.875rem;line-height:1.6;color:var(--text)">${ticket.message.replace(/\n/g,'<br>')}</div>
            </div>
          </div>
          ${adminMsg}
        </div>
        ${inputZone}
      </div>
    </div>
  </div></section>`, user, getCartCount(req));
};


exports.forgotPassword = (req) => layout('Mot de passe oublié', `
  <div class="auth-page"><div class="auth-box">
    <a href="/login" style="color:var(--muted);font-size:.8rem;text-decoration:none;display:block;margin-bottom:1.5rem">← Retour</a>
    <h1>Mot de passe oublié 🔑</h1>
    <p>Entre ton email et ton nom complet pour vérifier ton identité.</p>
    ${flash(req)}
    <form method="POST" action="/forgot-password">
      <div class="form-group"><label>Email du compte</label><input type="email" name="email" required placeholder="toi@exemple.com"></div>
      <div class="form-group"><label>Ton nom complet</label><input type="text" name="name_confirm" required placeholder="Jean Dupont"></div>
      <div class="form-group"><label>Nouveau mot de passe</label><input type="password" name="new_password" required placeholder="Min. 6 caractères" minlength="6"></div>
      <div class="form-group"><label>Confirmer</label><input type="password" name="confirm_password" required placeholder="••••••••"></div>
      <button type="submit" class="btn btn-accent btn-full" style="padding:1rem;margin-top:.5rem">Changer le mot de passe →</button>
    </form>
    <div class="form-link"><a href="/login">Se connecter</a> · <a href="/register">Créer un compte</a></div>
  </div></div>`);


// ── ADMIN LOGIN ──
exports.adminLogin = (error) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Admin</title>${CSS}</head>
<body style="background:var(--bg)">
<div class="auth-page"><div class="auth-box">
  <div style="text-align:center;margin-bottom:1.75rem">
    <div style="font-size:2.5rem;margin-bottom:.5rem">⚙️</div>
    <h1 style="font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800">Admin PêchePro</h1>
    <p style="color:var(--muted);font-size:.875rem;margin-top:.3rem">Accès réservé</p>
  </div>
  ${error ? `<div class="flash flash-error">${error}</div>` : ''}
  <form method="POST" action="/admin/login">
    <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="admin@admin.com"></div>
    <div class="form-group"><label>Mot de passe</label><input type="password" name="password" required placeholder="••••••••"></div>
    <button type="submit" class="btn btn-accent btn-full" style="padding:1rem;margin-top:.5rem">Accéder →</button>
  </form>
</div></div></body></html>`;

// ── ADMIN DASHBOARD ──
exports.adminDashboard = (stats, recentOrders, topProducts, topClients, revenueByCategory) => {
  const chartData = JSON.stringify(stats.revenueByDay || []);
  const catData = JSON.stringify(revenueByCategory || []);
  const content = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">📦</div><div class="stat-value">${stats.totalOrders}</div><div class="stat-label">Commandes</div><div class="stat-accent"></div></div>
      <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value">${Number(stats.totalRevenue).toFixed(0)} CHF</div><div class="stat-label">Chiffre d'affaires</div><div class="stat-accent"></div></div>
      <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value">${stats.totalUsers}</div><div class="stat-label">Utilisateurs</div><div class="stat-accent"></div></div>
      <div class="stat-card"><div class="stat-icon">🛒</div><div class="stat-value">${stats.totalProducts}</div><div class="stat-label">Produits</div><div class="stat-accent"></div></div>
      <div class="stat-card"><div class="stat-icon">💬</div><div class="stat-value">${stats.openTickets}</div><div class="stat-label">Tickets ouverts</div><div class="stat-accent"></div></div>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.25rem;margin-bottom:1.25rem">
      <div class="admin-card"><div class="admin-card-header"><h3>📈 Revenus — 7 derniers jours</h3></div><div style="padding:1.25rem"><canvas id="revenueChart" height="90"></canvas></div></div>
      <div class="admin-card"><div class="admin-card-header"><h3>🍩 CA par catégorie</h3></div><div style="padding:1.25rem"><canvas id="catChart" height="180"></canvas></div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem">
      <div class="admin-card">
        <div class="admin-card-header"><h3>🏆 Top produits</h3><a href="/admin/produits" class="btn btn-outline btn-sm">Gérer</a></div>
        <div style="padding:.5rem 0">${topProducts.map((p,i)=>`<div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 1.25rem;border-bottom:1px solid var(--border)"><span style="font-weight:800;color:var(--muted);font-size:.75rem;width:18px">${i+1}</span><span style="flex:1;font-size:.85rem;color:var(--text)">${p.name}</span><span style="font-weight:700;color:var(--accent);font-size:.8rem">${p.total_sold||0} ventes</span></div>`).join('')}</div>
      </div>
      <div class="admin-card">
        <div class="admin-card-header"><h3>👑 Meilleurs clients</h3><a href="/admin/utilisateurs" class="btn btn-outline btn-sm">Voir tous</a></div>
        <div style="padding:.5rem 0">${(topClients||[]).map((c,i)=>`<div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 1.25rem;border-bottom:1px solid var(--border)"><span style="font-weight:800;color:var(--muted);font-size:.75rem;width:18px">${i+1}</span><div style="flex:1"><p style="font-size:.85rem;color:var(--text)">${c.name}</p><p style="font-size:.72rem;color:var(--muted)">${c.nb_orders} commande${c.nb_orders>1?'s':''}</p></div><span style="font-weight:700;color:var(--gold);font-size:.8rem">${Number(c.total_spent).toFixed(0)} CHF</span></div>`).join('')}</div>
      </div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>📋 Commandes récentes</h3><a href="/admin/commandes" class="btn btn-outline btn-sm">Voir tout</a></div>
      <table>
        <tr><th>#</th><th>Client</th><th>Total</th><th>Statut</th><th>Date</th><th></th></tr>
        ${recentOrders.map(o=>`<tr><td><strong>#${o.id}</strong></td><td><strong>${o.name}</strong><br><span style="font-size:.75rem">${o.email}</span></td><td><strong style="color:var(--accent)">${o.total.toFixed(2)} CHF</strong></td><td><span class="badge badge-${o.status==='payé'?'paid':o.status==='expédié'?'shipped':o.status==='annulé'?'cancelled':'pending'}">${o.status}</span></td><td>${new Date(o.created_at).toLocaleDateString('fr-FR')}</td><td><a href="/admin/commandes/${o.id}" class="btn btn-outline btn-sm">→</a></td></tr>`).join('')}
      </table>
    </div>
    <script>
      Chart.defaults.color='#666';Chart.defaults.borderColor='#222';
      const raw=${chartData};
      new Chart(document.getElementById('revenueChart').getContext('2d'),{type:'line',data:{labels:raw.map(d=>d.date),datasets:[{data:raw.map(d=>d.total),borderColor:'#00ff87',backgroundColor:'rgba(0,255,135,0.06)',borderWidth:2,fill:true,tension:0.4,pointBackgroundColor:'#00ff87',pointRadius:4}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:'#1a1a1a'}},x:{grid:{display:false}}}}});
      const cats=${catData};
      new Chart(document.getElementById('catChart').getContext('2d'),{type:'doughnut',data:{labels:cats.map(c=>c.category),datasets:[{data:cats.map(c=>c.revenue),backgroundColor:['#00ff87','#ffd700','#0096ff','#ff4444'],borderWidth:0}]},options:{plugins:{legend:{position:'bottom',labels:{font:{size:11}}}},cutout:'65%'}});
    </script>`;
  return adminLayout('Dashboard', content, 'dashboard');
};

exports.adminCommandes = (orders, flash_msg, activeStatus) => {
  const content = `
    ${flash_msg ? `<div class="flash flash-success">${flash_msg}</div>` : ''}
    <div style="display:flex;gap:.4rem;margin-bottom:1.25rem;flex-wrap:wrap">
      <a href="/admin/commandes" class="filter-btn ${!activeStatus?'active':''}">Toutes</a>
      ${['en_attente','payé','expédié','annulé'].map(s=>`<a href="/admin/commandes?status=${s}" class="filter-btn ${activeStatus===s?'active':''}">${s}</a>`).join('')}
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>📦 Commandes</h3><span style="color:var(--muted);font-size:.8rem">${orders.length} résultats</span></div>
      <table>
        <tr><th>#</th><th>Client</th><th>Total</th><th>Promo</th><th>Statut</th><th>Date</th><th></th></tr>
        ${orders.map(o=>`<tr><td><strong>#${o.id}</strong></td><td><strong>${o.name}</strong><br><span style="font-size:.75rem">${o.email}</span></td><td><strong style="color:var(--accent)">${o.total.toFixed(2)} CHF</strong></td><td>${o.promo_code?`<span class="badge badge-paid">${o.promo_code}</span>`:'<span style="color:var(--muted)">—</span>'}</td><td><span class="badge badge-${o.status==='payé'?'paid':o.status==='expédié'?'shipped':o.status==='annulé'?'cancelled':'pending'}">${o.status}</span></td><td style="font-size:.8rem">${new Date(o.created_at).toLocaleDateString('fr-FR')}</td><td style="display:flex;gap:.4rem"><a href="/admin/commandes/${o.id}" class="btn btn-outline btn-sm">Détails</a><a href="/facture/${o.id}" class="btn btn-ghost btn-sm" target="_blank">📄</a></td></tr>`).join('')}
      </table>
    </div>`;
  return adminLayout('Commandes', content, 'commandes');
};

exports.adminCommande = (order, items, flash_msg) => {
  const content = `
    ${flash_msg?`<div class="flash flash-success">${flash_msg}</div>`:''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem">
      <div class="admin-card">
        <div class="admin-card-header"><h3>👤 Client</h3></div>
        <div style="padding:1.25rem;display:flex;flex-direction:column;gap:.6rem">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted);font-size:.85rem">Nom</span><strong>${order.name}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted);font-size:.85rem">Email</span><strong>${order.email}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted);font-size:.85rem">Date</span><strong>${new Date(order.created_at).toLocaleString('fr-FR')}</strong></div>
          ${order.promo_code?`<div style="display:flex;justify-content:space-between"><span style="color:var(--muted);font-size:.85rem">Code promo</span><span class="badge badge-paid">${order.promo_code} (-${order.discount.toFixed(2)} CHF)</span></div>`:''}
          ${order.notes?`<div style="background:var(--surface2);border-radius:8px;padding:.75rem;font-size:.85rem;margin-top:.3rem;color:var(--muted)">${order.notes}</div>`:''}
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-header"><h3>⚡ Changer le statut</h3></div>
        <div style="padding:1.25rem">
          <form method="POST" action="/admin/commandes/${order.id}/statut">
            <div class="form-group"><label>Statut actuel : <span class="badge badge-${order.status==='payé'?'paid':order.status==='expédié'?'shipped':order.status==='annulé'?'cancelled':'pending'}">${order.status}</span></label><select name="status">${['en_attente','payé','expédié','annulé'].map(s=>`<option value="${s}" ${order.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
            <div class="form-group"><label>Numéro de suivi</label><input name="tracking_number" value="${order.tracking_number||''}" placeholder="Ex: 1Z999AA10123456784"></div>
            <div class="form-group"><label>Notes internes</label><textarea name="notes" rows="3">${order.notes||''}</textarea></div>
            <button type="submit" class="btn btn-accent">Mettre à jour</button>
          </form>
        </div>
      </div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>🛒 Articles commandés</h3><strong style="color:var(--accent)">${order.total.toFixed(2)} CHF total</strong></div>
      <table>
        <tr><th>Produit</th><th>Prix unit.</th><th>Quantité</th><th>Sous-total</th></tr>
        ${items.map(i=>`<tr><td><strong>${i.name}</strong></td><td>${i.price.toFixed(2)} CHF</td><td>${i.quantity}</td><td><strong style="color:var(--accent)">${(i.price*i.quantity).toFixed(2)} CHF</strong></td></tr>`).join('')}
        ${order.discount>0?`<tr><td colspan="3" style="text-align:right;color:var(--accent)">Réduction</td><td style="color:var(--accent)">-${order.discount.toFixed(2)} CHF</td></tr>`:''}
        <tr><td colspan="3" style="text-align:right;font-weight:700;color:var(--white)">Total</td><td style="font-weight:800;color:var(--accent);font-family:'Syne',sans-serif;font-size:1.1rem">${order.total.toFixed(2)} CHF</td></tr>
      </table>
    </div>
    <div style="display:flex;gap:.75rem;margin-top:.5rem">
      <a href="/admin/commandes" class="btn btn-outline">← Retour</a>
      <a href="/facture/${order.id}" class="btn btn-accent" target="_blank">📄 Voir facture</a>
    </div>`;
  return adminLayout(`Commande #${order.id}`, content, 'commandes');
};

exports.adminProduits = (products, flash_msg) => {
  const content = `
    ${flash_msg?`<div class="flash flash-success">${flash_msg}</div>`:''}
    <div style="display:flex;justify-content:flex-end;margin-bottom:1rem"><a href="/admin/produits/nouveau" class="btn btn-accent">+ Nouveau produit</a></div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>🛒 Produits</h3><span style="color:var(--muted);font-size:.8rem">${products.length} produits</span></div>
      <table>
        <tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Statut</th><th></th></tr>
        ${products.map(p=>`<tr><td><strong>${p.name}</strong></td><td><span style="font-size:.75rem;color:var(--accent)">${p.category}</span></td><td><strong style="color:var(--accent)">${p.price.toFixed(2)} CHF</strong>${p.original_price>0?`<br><span style="font-size:.72rem;color:var(--muted);text-decoration:line-through">${p.original_price.toFixed(2)}</span>`:''}</td><td><span style="color:${p.stock<5?'var(--red)':p.stock<10?'orange':'var(--accent)'}"><strong>${p.stock}</strong></span></td><td><span class="badge badge-${p.active===0?'inactive':'active'}">${p.active===0?'Désactivé':'Actif'}</span>${p.featured?'<span class="badge badge-paid" style="margin-left:.25rem">🔥</span>':''}</td><td style="display:flex;gap:.4rem"><a href="/admin/produits/${p.id}/edit" class="btn btn-outline btn-sm">✏️</a><form method="POST" action="/admin/produits/${p.id}/toggle" style="display:inline"><button type="submit" class="btn btn-sm" style="background:${p.active===0?'rgba(0,255,135,.1)':'rgba(255,68,68,.1)'};color:${p.active===0?'var(--accent)':'var(--red)'};border:1px solid ${p.active===0?'rgba(0,255,135,.2)':'rgba(255,68,68,.2)'}">${p.active===0?'Activer':'Désactiver'}</button></form><form method="POST" action="/admin/produits/${p.id}/supprimer" onsubmit="return confirm('Supprimer ?')"><button type="submit" class="btn btn-danger btn-sm">🗑</button></form></td></tr>`).join('')}
      </table>
    </div>`;
  return adminLayout('Produits', content, 'produits');
};

exports.adminProduitForm = (product, flash_msg) => {
  const isEdit = !!product;
  const cats = ['Cannes','Moulinets','Leurres','Accessoires'];
  const content = `
    ${flash_msg?`<div class="flash flash-error">${flash_msg}</div>`:''}
    <div class="admin-card" style="max-width:680px">
      <div class="admin-card-header"><h3>${isEdit?'✏️ Modifier':'➕ Nouveau'} produit</h3></div>
      <div style="padding:1.5rem">
        <form method="POST" action="${isEdit?`/admin/produits/${product.id}/edit`:'/admin/produits/nouveau'}" enctype="multipart/form-data">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group" style="grid-column:1/-1"><label>Nom du produit *</label><input name="name" required value="${isEdit?product.name:''}"></div>
            <div class="form-group"><label>Catégorie *</label><select name="category">${cats.map(c=>`<option value="${c}" ${isEdit&&product.category===c?'selected':''}>${c}</option>`).join('')}</select></div>
            <div class="form-group"><label>Prix (CHF) *</label><input type="number" name="price" step="0.01" min="0" required value="${isEdit?product.price:''}"></div>
            <div class="form-group"><label>Stock *</label><input type="number" name="stock" min="0" required value="${isEdit?product.stock:'0'}"></div>
            <div class="form-group"><label>Vedette ?</label><select name="featured"><option value="0" ${isEdit&&!product.featured?'selected':''}>Non</option><option value="1" ${isEdit&&product.featured?'selected':''}>Oui 🔥</option></select></div>
            <div class="form-group"><label>Statut</label><select name="active"><option value="1" ${!isEdit||product.active?'selected':''}>Actif</option><option value="0" ${isEdit&&!product.active?'selected':''}>Inactif</option></select></div>
            <div class="form-group" style="grid-column:1/-1"><label>Flash sale</label><select name="flash_sale"><option value="">Non</option><option value="1" ${isEdit&&product.flash_sale?'selected':''}>Oui ⚡</option></select></div>
            <div class="form-group" style="grid-column:1/-1"><label>Fin flash sale (optionnel)</label><input type="datetime-local" name="flash_sale_end" value="${isEdit&&product.flash_end?product.flash_end.replace(' ','T').substring(0,16):''}"></div>
            <div class="form-group" style="grid-column:1/-1"><label>Description</label><textarea name="description">${isEdit?(product.description||''):''}</textarea></div>
            <div class="form-group" style="grid-column:1/-1">
              ${isEdit&&product.image?`<div style="margin-bottom:.75rem"><img src="${product.image}" style="width:90px;height:90px;object-fit:cover;border-radius:10px;border:1px solid var(--border)" onerror="this.style.display='none'"></div>`:''}
              <label>URL de l'image</label><input name="image_url" placeholder="https://..." value="${isEdit?(product.image||''):''}">
              <div style="margin-top:.5rem"><label style="font-size:.75rem;color:var(--muted)">Ou uploader (première = image principale)</label><input type="file" name="images" accept="image/*" multiple style="display:block;margin-top:.3rem;font-size:.8rem;color:var(--muted)"></div>
            </div>
          </div>
          <div style="display:flex;gap:.75rem;margin-top:1.25rem">
            <button type="submit" class="btn btn-accent">${isEdit?'💾 Enregistrer':'➕ Créer'}</button>
            <a href="/admin/produits" class="btn btn-outline">Annuler</a>
          </div>
        </form>
      </div>
    </div>`;
  return adminLayout(isEdit?'Modifier produit':'Nouveau produit', content, isEdit?'produits':'nouveau');
};

exports.adminUsers = (users, flash_msg) => {
  const now = new Date();
  const content = `
    ${flash_msg?`<div class="flash flash-success">${flash_msg}</div>`:''}
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>👥 Membres inscrits</h3>
        <span style="color:var(--muted);font-size:.8rem">${users.length} comptes</span>
      </div>
      <div style="padding:1rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem">
        ${users.map(u => {
          const lastSeen = u.last_seen ? new Date(u.last_seen) : null;
          const isOnline = lastSeen && (now - lastSeen) < 5 * 60 * 1000;
          return `<div style="background:var(--surface2);border:1px solid ${u.role==='admin'?'var(--gold)':'var(--border)'};border-radius:12px;padding:1.25rem">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem">
              <div style="width:42px;height:42px;border-radius:50%;background:${u.role==='admin'?'var(--gold)':'var(--accent)'};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1rem;color:#000;flex-shrink:0">${u.name[0].toUpperCase()}</div>
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:.4rem">
                  <strong style="color:var(--white);font-size:.9rem">${u.name}</strong>
                  <span style="width:7px;height:7px;background:${isOnline?'var(--accent)':'var(--border)'};border-radius:50%;flex-shrink:0" title="${isOnline?'En ligne':'Hors ligne'}"></span>
                </div>
                <div style="font-size:.75rem;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.email}</div>
              </div>
              <span class="badge badge-${u.role==='admin'?'admin':'user'}">${u.role}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:1rem;font-size:.8rem">
              <div style="background:var(--surface);border-radius:8px;padding:.5rem;text-align:center">
                <div style="color:var(--accent);font-weight:800">${u.points||0}</div>
                <div style="color:var(--muted);font-size:.7rem">points</div>
              </div>
              <div style="background:var(--surface);border-radius:8px;padding:.5rem;text-align:center">
                <div style="color:var(--text);font-weight:600;font-size:.72rem">${lastSeen?lastSeen.toLocaleDateString('fr-FR'):'Jamais'}</div>
                <div style="color:var(--muted);font-size:.7rem">dernière co.</div>
              </div>
            </div>
            ${u.role!=='admin'?`
            <div style="display:flex;flex-direction:column;gap:.5rem">
              <form method="POST" action="/admin/users/${u.id}/role" style="display:flex;gap:.4rem">
                <select name="role" style="flex:1;padding:.4rem .6rem;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);font-size:.8rem;font-family:'Inter',sans-serif">
                  <option value="user" ${u.role==='user'?'selected':''}>Membre</option>
                  <option value="admin" ${u.role==='admin'?'selected':''}>Admin</option>
                </select>
                <button type="submit" class="btn btn-ghost btn-sm">Changer rôle</button>
              </form>
              <form method="POST" action="/admin/users/${u.id}/points" style="display:flex;gap:.4rem">
                <input type="number" name="points" placeholder="±points" style="flex:1;padding:.4rem .6rem;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);font-size:.8rem;font-family:'Inter',sans-serif">
                <input type="text" name="reason" placeholder="Raison" style="flex:1;padding:.4rem .6rem;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);font-size:.8rem;font-family:'Inter',sans-serif">
                <button type="submit" class="btn btn-ghost btn-sm">+pts</button>
              </form>
              <details style="background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden">
                <summary style="padding:.5rem .75rem;cursor:pointer;font-size:.8rem;color:var(--muted);font-weight:600;list-style:none">🔑 Changer le mot de passe</summary>
                <form method="POST" action="/admin/users/${u.id}/password" style="padding:.75rem;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:.5rem">
                  <input type="password" name="new_password" required placeholder="Nouveau mot de passe (min. 6 car.)" minlength="6" style="width:100%;padding:.5rem .75rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);font-size:.85rem;font-family:'Inter',sans-serif">
                  <button type="submit" class="btn btn-accent btn-sm">Confirmer</button>
                </form>
              </details>
              <form method="POST" action="/admin/users/${u.id}/supprimer" onsubmit="return confirm('Supprimer définitivement ${u.name} ?')">
                <button type="submit" class="btn btn-danger btn-sm btn-full">🗑 Supprimer ce compte</button>
              </form>
            </div>`:`<div style="text-align:center;padding:.5rem;color:var(--gold);font-size:.8rem">⚙️ Compte administrateur protégé</div>`}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  return adminLayout('Utilisateurs', content, 'users');
};

exports.adminNewsletter = (subscribers, flash_msg) => {
  const content = `
    ${flash_msg?`<div class="flash flash-success">${flash_msg}</div>`:''}
    <div class="admin-card">
      <div class="admin-card-header"><h3>📧 Newsletter</h3><span style="color:var(--muted);font-size:.8rem">${subscribers.length} abonnés</span></div>
      <div style="padding:1.25rem;border-bottom:1px solid var(--border)">
        <p style="font-size:.85rem;color:var(--muted);margin-bottom:.75rem">Emails pour export Brevo :</p>
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:1rem;font-size:.8rem;font-family:monospace;color:var(--accent);max-height:150px;overflow-y:auto">${subscribers.map(s=>s.email).join('\n')}</div>
      </div>
      <div style="padding:1.25rem;border-bottom:1px solid var(--border)">
        <h4 style="font-weight:600;font-size:.85rem;color:var(--white);margin-bottom:1rem">Envoyer une newsletter</h4>
        <form method="POST" action="/admin/newsletter/envoyer">
          <div class="form-group"><label>Sujet</label><input name="subject" required placeholder="Nos dernières offres..."></div>
          <div class="form-group"><label>Message</label><textarea name="message" required placeholder="Contenu de la newsletter..." style="min-height:120px"></textarea></div>
          <button type="submit" class="btn btn-accent" onclick="return confirm('Envoyer à ${subscribers.length} abonnés ?')">📤 Envoyer à ${subscribers.length} abonnés</button>
        </form>
      </div>
      <table><tr><th>Email</th><th>Inscrit le</th><th>Statut</th></tr>${subscribers.map(s=>`<tr><td>${s.email}</td><td style="font-size:.8rem;color:var(--muted)">${new Date(s.created_at).toLocaleDateString('fr-FR')}</td><td><span class="badge badge-${s.active?'paid':'inactive'}">${s.active?'Actif':'Désabonné'}</span></td></tr>`).join('')}</table>
    </div>`;
  return adminLayout('Newsletter', content, 'newsletter');
};

exports.adminTickets = (tickets, flash_msg, activeStatus) => {
  const content = `
    ${flash_msg?`<div class="flash flash-success">${flash_msg}</div>`:''}
    <div style="display:flex;gap:.4rem;margin-bottom:1.25rem;flex-wrap:wrap">
      <a href="/admin/tickets" class="filter-btn ${!activeStatus?'active':''}">Tous</a>
      ${['ouvert','en_cours','résolu'].map(s=>`<a href="/admin/tickets?status=${s}" class="filter-btn ${activeStatus===s?'active':''}">${s}</a>`).join('')}
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>💬 Tickets support</h3><span style="color:var(--muted);font-size:.8rem">${tickets.length} ticket${tickets.length>1?'s':''}</span></div>
      <table>
        <tr><th>#</th><th>Client</th><th>Sujet</th><th>Statut</th><th>Date</th><th></th></tr>
        ${tickets.map(t=>`<tr><td><strong>#${t.id}</strong></td><td><strong>${t.user_name}</strong><br><span style="font-size:.75rem">${t.user_email}</span></td><td style="max-width:220px"><span style="color:var(--text)">${t.subject}</span></td><td><span class="badge badge-${t.status==='ouvert'?'open':t.status==='résolu'?'paid':'shipped'}">${t.status}</span></td><td style="font-size:.8rem">${new Date(t.created_at).toLocaleDateString('fr-FR')}</td><td><a href="/admin/tickets/${t.id}" class="btn btn-outline btn-sm">Répondre →</a></td></tr>`).join('')}
      </table>
    </div>`;
  return adminLayout('Tickets support', content, 'tickets');
};

exports.adminTicket = (ticket, flash_msg) => {
  const content = `
    ${flash_msg?`<div class="flash flash-success">${flash_msg}</div>`:''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem">
      <div class="admin-card">
        <div class="admin-card-header"><h3>💬 Message de ${ticket.user_name}</h3></div>
        <div style="padding:1.25rem"><p style="font-size:.8rem;color:var(--muted);margin-bottom:.75rem">${ticket.user_email} · ${new Date(ticket.created_at).toLocaleString('fr-FR')}</p><div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:1rem;line-height:1.7;font-size:.875rem">${ticket.message.replace(/\n/g,'<br>')}</div></div>
      </div>
      <div class="admin-card">
        <div class="admin-card-header"><h3>✍️ Répondre</h3></div>
        <div style="padding:1.25rem">
          <form method="POST" action="/admin/tickets/${ticket.id}/reply">
            <div class="form-group"><label>Statut</label><select name="status">${['ouvert','en_cours','résolu'].map(s=>`<option value="${s}" ${ticket.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
            <div class="form-group"><label>Ta réponse</label><textarea name="reply" rows="6" placeholder="Réponds au client...">${ticket.admin_reply||''}</textarea></div>
            <button type="submit" class="btn btn-accent">Envoyer →</button>
          </form>
        </div>
      </div>
    </div>
    <a href="/admin/tickets" class="btn btn-outline">← Retour</a>`;
  return adminLayout(`Ticket #${ticket.id}`, content, 'tickets');
};

exports.adminPromos = (promos, flash_msg, products, saleData) => {
  const content = `
    ${flash_msg?`<div class="flash flash-success">${flash_msg}</div>`:''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem">
      <div class="admin-card">
        <div class="admin-card-header"><h3>🔥 Solde tout le site</h3></div>
        <div style="padding:1.25rem">
          <form method="POST" action="/admin/sale/global">
            <div class="form-group"><label>Réduction sur TOUS les produits (%)</label><input type="number" name="percent" min="0" max="90" step="1" placeholder="Ex: 20"></div>
            <div style="display:flex;gap:.5rem">
              <button type="submit" class="btn btn-accent">Appliquer →</button>
              <button type="submit" name="reset" value="1" class="btn btn-danger">Annuler soldes</button>
            </div>
          </form>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-header"><h3>🎯 Solde par catégorie</h3></div>
        <div style="padding:1.25rem">
          <form method="POST" action="/admin/sale/category">
            <div class="form-group"><label>Catégorie</label><select name="category"><option value="Cannes">Cannes</option><option value="Moulinets">Moulinets</option><option value="Leurres">Leurres</option><option value="Accessoires">Accessoires</option></select></div>
            <div class="form-group"><label>Réduction (%)</label><input type="number" name="percent" min="1" max="90" step="1" required placeholder="30"></div>
            <button type="submit" class="btn btn-accent">Appliquer →</button>
          </form>
        </div>
      </div>
    </div>
    <div class="admin-card" style="margin-bottom:1.25rem">
      <div class="admin-card-header"><h3>🏷️ Prix par article</h3></div>
      <div style="padding:1.25rem">
        <form method="POST" action="/admin/sale/product">
          <div style="display:grid;grid-template-columns:2fr 1fr auto;gap:.75rem;align-items:end">
            <div class="form-group" style="margin:0"><label>Produit</label><select name="product_id">${(products||[]).map(p=>`<option value="${p.id}">${p.name} (${p.price.toFixed(2)} CHF)</option>`).join('')}</select></div>
            <div class="form-group" style="margin:0"><label>Nouveau prix (CHF)</label><input type="number" name="new_price" step="0.01" min="0" required placeholder="49.99"></div>
            <button type="submit" class="btn btn-accent">Appliquer</button>
          </div>
        </form>
      </div>
    </div>
    <div class="admin-card" style="margin-bottom:1.25rem">
      <div class="admin-card-header"><h3>🎟 Créer un code promo</h3></div>
      <div style="padding:1.25rem">
        <form method="POST" action="/admin/promos/nouveau">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:.75rem;align-items:end">
            <div class="form-group" style="margin:0"><label>Code *</label><input name="code" required placeholder="PECHE20" style="text-transform:uppercase"></div>
            <div class="form-group" style="margin:0"><label>Type</label><select name="type"><option value="percent">% remise</option><option value="fixed">CHF fixe</option></select></div>
            <div class="form-group" style="margin:0"><label>Valeur *</label><input type="number" name="value" step="0.01" min="0" required placeholder="20"></div>
            <div class="form-group" style="margin:0"><label>Utilisations (-1=∞)</label><input type="number" name="uses_left" value="-1"></div>
          </div>
          <button type="submit" class="btn btn-accent" style="margin-top:.75rem">Créer →</button>
        </form>
      </div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>Codes promo</h3><span style="color:var(--muted);font-size:.8rem">${promos.length} codes</span></div>
      <table>
        <tr><th>Code</th><th>Type</th><th>Réduction</th><th>Utilisations</th><th>Statut</th><th></th></tr>
        ${promos.map(p=>`<tr><td><strong style="font-family:'Syne',sans-serif;letter-spacing:.05em">${p.code}</strong></td><td style="font-size:.8rem">${p.type==='percent'?'Pourcentage':'Montant fixe'}</td><td><strong style="color:var(--accent)">${p.value}${p.type==='percent'?'%':' CHF'}</strong></td><td>${p.uses_left===-1||p.uses_left==-1?'<span style="color:var(--muted)">∞</span>':`<strong>${p.uses_left}</strong>`}</td><td><span class="badge badge-${p.active?'active':'inactive'}">${p.active?'Actif':'Inactif'}</span></td><td style="display:flex;gap:.4rem"><form method="POST" action="/admin/promos/${p.id}/toggle"><button type="submit" class="btn btn-ghost btn-sm">${p.active?'Désactiver':'Activer'}</button></form><form method="POST" action="/admin/promos/${p.id}/supprimer" onsubmit="return confirm('Supprimer ?')"><button type="submit" class="btn btn-danger btn-sm">🗑</button></form></td></tr>`).join('')}
      </table>
    </div>`;
  return adminLayout('Codes promo', content, 'promos');
};

exports.adminAvis = (reviews, flash_msg) => {
  const content = `
    ${flash_msg?`<div class="flash flash-success">${flash_msg}</div>`:''}
    <div class="admin-card">
      <div class="admin-card-header"><h3>⭐ Avis clients</h3><span style="color:var(--muted);font-size:.8rem">${reviews.length} avis</span></div>
      <table>
        <tr><th>Client</th><th>Produit</th><th>Note</th><th>Commentaire</th><th>Statut</th><th></th></tr>
        ${reviews.map(r=>`<tr><td><strong>${r.user_name}</strong></td><td style="font-size:.8rem;color:var(--muted);max-width:140px">${r.product_name||'—'}</td><td><span style="color:var(--gold)">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span></td><td style="font-size:.8rem;color:var(--muted);max-width:180px">${r.comment||'—'}</td><td><span class="badge badge-${r.approved?'paid':'pending'}">${r.approved?'Approuvé':'En attente'}</span></td><td style="display:flex;gap:.4rem">${!r.approved?`<form method="POST" action="/admin/avis/${r.id}/approuver"><button type="submit" class="btn btn-accent btn-sm">✓</button></form>`:''}<form method="POST" action="/admin/avis/${r.id}/supprimer" onsubmit="return confirm('Supprimer ?')"><button type="submit" class="btn btn-danger btn-sm">🗑</button></form></td></tr>`).join('')}
      </table>
    </div>`;
  return adminLayout('Avis clients', content, 'avis');
};

exports.adminContenu = (content_data, flash_msg) => {
  const get = key => (content_data && content_data[key]) || '';
  const content = `
    ${flash_msg?`<div class="flash flash-success">${flash_msg}</div>`:''}
    <div class="admin-card" style="max-width:680px">
      <div class="admin-card-header"><h3>✏️ Contenu & Bannière</h3></div>
      <div style="padding:1.5rem">
        <form method="POST" action="/admin/contenu">
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:1.1rem;margin-bottom:1.25rem">
            <h4 style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:1rem">📢 Bannière</h4>
            <div class="form-group"><label>Texte</label><input name="banner_text" value="${get('banner_text')}" placeholder="🎣 Livraison gratuite dès 50 CHF !"></div>
            <div class="form-group"><label>Afficher</label><select name="banner_active"><option value="1" ${get('banner_active')==='1'?'selected':''}>Oui</option><option value="0" ${get('banner_active')!=='1'?'selected':''}>Non</option></select></div>
          </div>
          <div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:1.1rem">
            <h4 style="font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:1rem">🏠 Accueil</h4>
            <div class="form-group"><label>Titre hero</label><input name="hero_title" value="${get('hero_title')}"></div>
            <div class="form-group"><label>Sous-titre</label><input name="hero_subtitle" value="${get('hero_subtitle')}"></div>
            <div class="form-group"><label>Texte bouton CTA</label><input name="hero_cta" value="${get('hero_cta')}"></div>
            <div class="form-group"><label>Section "Notre mission"</label><textarea name="about_text">${get('about_text')}</textarea></div>
          </div>
          <button type="submit" class="btn btn-accent" style="margin-top:1.25rem">💾 Sauvegarder</button>
        </form>
      </div>
    </div>`;
  return adminLayout('Contenu & Bannière', content, 'contenu');
};

// ── LEADERBOARD ──
exports.leaderboard = (req, user, top) => layout('Leaderboard', `
  <section class="section"><div class="container" style="max-width:860px">
    <div style="text-align:center;margin-bottom:3rem">
      <span class="section-label">Communauté</span>
      <h1 class="section-title" style="font-size:2.5rem">🏆 Classement</h1>
      <p style="color:var(--muted)">Les pêcheurs les plus actifs de la communauté</p>
    </div>
    ${flash(req)}
    <div style="display:flex;flex-direction:column;gap:.75rem">
      ${top.map((u,i) => {
        const medals = ['🥇','🥈','🥉'];
        const medal = i < 3 ? medals[i] : `#${i+1}`;
        const isMe = user && user.id === u.id;
        const tier = u.points >= 1000 ? {label:'Gold',color:'#ffd700'} : u.points >= 400 ? {label:'Silver',color:'#aaa'} : {label:'Bronze',color:'#cd7f32'};
        return `<div style="background:var(--surface);border:1px solid ${isMe?'var(--accent)':'var(--border)'};border-radius:14px;padding:1.1rem 1.5rem;display:flex;align-items:center;gap:1.25rem;transition:.2s${i<3?';box-shadow:0 2px 20px rgba(0,255,135,.06)':''}">
          <div style="font-size:${i<3?'1.8':'1.1'}rem;width:40px;text-align:center;flex-shrink:0">${medal}</div>
          <div style="width:40px;height:40px;border-radius:50%;background:var(--surface2);border:2px solid ${tier.color};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.95rem;color:${tier.color};flex-shrink:0">${u.name[0].toUpperCase()}</div>
          <div style="flex:1">
            <div style="font-weight:600;color:var(--white);font-size:.9rem">${u.name}${isMe?' <span style="color:var(--accent);font-size:.75rem">(toi)</span>':''}</div>
            <div style="font-size:.75rem;color:var(--muted)">${u.nb_orders} commande${u.nb_orders>1?'s':''} · ${Number(u.total_spent).toFixed(0)} CHF dépensés</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--accent)">${u.points}</div>
            <div style="font-size:.7rem;color:${tier.color};font-weight:600">${tier.label}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div style="margin-top:2rem;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.5rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;text-align:center">
      <div><div style="font-size:1.5rem">🥉</div><div style="font-weight:700;color:#cd7f32;font-size:.85rem">Bronze</div><div style="font-size:.75rem;color:var(--muted)">0 – 399 pts</div></div>
      <div><div style="font-size:1.5rem">🥈</div><div style="font-weight:700;color:#aaa;font-size:.85rem">Silver</div><div style="font-size:.75rem;color:var(--muted)">400 – 999 pts</div></div>
      <div><div style="font-size:1.5rem">🥇</div><div style="font-weight:700;color:#ffd700;font-size:.85rem">Gold</div><div style="font-size:.75rem;color:var(--muted)">1000+ pts</div></div>
    </div>
  </div></section>`, user, getCartCount(req));

// ── BLOG ──
exports.blog = (req, user, posts) => layout('Blog', `
  <div style="background:var(--surface);border-bottom:1px solid var(--border);padding:3rem 2rem;text-align:center">
    <span class="section-label">Conseils & actus</span>
    <h1 style="font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:800;color:var(--white);margin:.5rem 0">Blog PêchePro</h1>
    <p style="color:var(--muted)">Techniques, spots, matériel — tout ce qu'il faut savoir</p>
  </div>
  <section class="section"><div class="container">
    ${posts.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem">
      ${posts.map(p => `<a href="/blog/${p.id}" style="text-decoration:none">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .25s;height:100%">
          ${p.image_url ? `<div style="height:180px;overflow:hidden"><img src="${p.image_url}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.style.display='none'"></div>` : `<div style="height:120px;background:linear-gradient(135deg,var(--surface2),var(--surface));display:flex;align-items:center;justify-content:center;font-size:3rem">🎣</div>`}
          <div style="padding:1.25rem">
            <div style="font-size:.72rem;color:var(--accent);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.5rem">${new Date(p.created_at).toLocaleDateString('fr-FR')}</div>
            <h2 style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:var(--white);margin-bottom:.5rem;line-height:1.3">${p.title}</h2>
            <p style="color:var(--muted);font-size:.85rem;line-height:1.6">${p.excerpt || p.content.substring(0,120)}...</p>
            <span style="display:inline-block;margin-top:.75rem;color:var(--accent);font-size:.82rem;font-weight:600">Lire l'article →</span>
          </div>
        </div>
      </a>`).join('')}
    </div>` : `<div style="text-align:center;padding:4rem;color:var(--muted)"><p style="font-size:3rem;margin-bottom:1rem">📝</p><p>Aucun article pour l'instant</p></div>`}
  </div></section>`, user, getCartCount(req));

exports.blogPost = (req, user, post) => layout(post.title, `
  <div style="max-width:780px;margin:0 auto;padding:3rem 2rem">
    <a href="/blog" style="color:var(--muted);font-size:.85rem;text-decoration:none;display:inline-block;margin-bottom:1.5rem">← Retour au blog</a>
    ${post.image_url ? `<img src="${post.image_url}" style="width:100%;height:320px;object-fit:cover;border-radius:16px;margin-bottom:2rem" onerror="this.style.display='none'">` : ''}
    <span style="font-size:.75rem;color:var(--accent);font-weight:700;text-transform:uppercase;letter-spacing:.08em">${new Date(post.created_at).toLocaleDateString('fr-FR')} · ${post.author}</span>
    <h1 style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--white);margin:1rem 0 1.5rem;line-height:1.2">${post.title}</h1>
    <div style="color:var(--muted);line-height:1.9;font-size:.95rem;white-space:pre-wrap">${post.content}</div>
    <div style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border);display:flex;gap:.75rem">
      <a href="/blog" class="btn btn-outline">← Tous les articles</a>
      <a href="/catalogue" class="btn btn-accent">Voir le catalogue →</a>
    </div>
  </div>`, user, getCartCount(req));

// ── FORUM ──
exports.forum = (req, user, threads) => layout('Forum', `
  <div style="background:var(--surface);border-bottom:1px solid var(--border);padding:3rem 2rem">
    <div style="max-width:960px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
      <div>
        <span class="section-label">Communauté</span>
        <h1 style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--white);margin:.3rem 0">Forum des pêcheurs</h1>
        <p style="color:var(--muted);font-size:.9rem">Partage tes spots, conseils et prises !</p>
      </div>
      ${user ? '<button onclick="document.getElementById(\'newThread\').style.display=document.getElementById(\'newThread\').style.display===\'none\'?\'block\':\'none\'" class="btn btn-accent">+ Nouveau sujet</button>' : '<a href="/login" class="btn btn-outline">Connecte-toi pour participer</a>'}
    </div>
    ${user ? `<div id="newThread" style="display:none;max-width:960px;margin:1.5rem auto 0;background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:1.5rem">
      <form method="POST" action="/forum">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:.75rem">
          <div class="form-group" style="margin:0"><label>Titre *</label><input name="title" required placeholder="Ton sujet..."></div>
          <div class="form-group" style="margin:0"><label>Catégorie</label><select name="category"><option>Général</option><option>Spots</option><option>Matériel</option><option>Technique</option><option>Prises</option></select></div>
        </div>
        <div class="form-group"><label>Message *</label><textarea name="content" required placeholder="Décris ton sujet..." style="min-height:100px"></textarea></div>
        <button type="submit" class="btn btn-accent">Publier →</button>
      </form>
    </div>` : ''}
  </div>
  <section class="section"><div class="container" style="max-width:960px">
    ${flash(req)}
    ${threads.length ? `<div style="display:flex;flex-direction:column;gap:.6rem">
      ${threads.map(t => `<a href="/forum/${t.id}" style="text-decoration:none">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.1rem 1.5rem;display:flex;align-items:center;gap:1.25rem;transition:.2s">
          <div style="width:42px;height:42px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.95rem;color:#000;flex-shrink:0">${t.author_name[0].toUpperCase()}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;color:var(--white);font-size:.9rem;margin-bottom:.2rem">${t.title}</div>
            <div style="font-size:.75rem;color:var(--muted)">par ${t.author_name} · ${new Date(t.created_at).toLocaleDateString('fr-FR')}</div>
          </div>
          <div style="display:flex;align-items:center;gap:1rem;flex-shrink:0">
            <span style="background:var(--surface2);border:1px solid var(--border);border-radius:50px;padding:.2rem .7rem;font-size:.72rem;color:var(--accent)">${t.category}</span>
            <span style="font-size:.8rem;color:var(--muted)">💬 ${t.reply_count}</span>
          </div>
        </div>
      </a>`).join('')}
    </div>` : `<div style="text-align:center;padding:4rem;color:var(--muted)"><p style="font-size:3rem;margin-bottom:1rem">💬</p><p>Aucun sujet pour l'instant — sois le premier !</p></div>`}
  </div></section>`, user, getCartCount(req));

exports.forumThread = (req, user, thread, replies) => layout(thread.title, `
  <section class="section"><div class="container" style="max-width:860px">
    <a href="/forum" style="color:var(--muted);font-size:.85rem;text-decoration:none;display:inline-block;margin-bottom:1.5rem">← Forum</a>
    <div style="background:var(--surface);border:1px solid var(--accent);border-radius:14px;padding:1.5rem;margin-bottom:1.5rem">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem">
        <div style="width:40px;height:40px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;color:#000">${thread.author_name[0].toUpperCase()}</div>
        <div><div style="font-weight:600;color:var(--white)">${thread.author_name}</div><div style="font-size:.75rem;color:var(--muted)">${new Date(thread.created_at).toLocaleString('fr-FR')} · ${thread.category}</div></div>
      </div>
      <h1 style="font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:var(--white);margin-bottom:1rem">${thread.title}</h1>
      <p style="color:var(--muted);line-height:1.8;white-space:pre-wrap">${thread.content}</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:.75rem;margin-bottom:1.5rem">
      ${replies.map(r => `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.1rem 1.5rem;display:flex;gap:.85rem">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--accent);flex-shrink:0">${r.author_name[0].toUpperCase()}</div>
        <div style="flex:1"><div style="font-size:.8rem;font-weight:600;color:var(--text);margin-bottom:.4rem">${r.author_name} · ${new Date(r.created_at).toLocaleString('fr-FR')}</div><p style="color:var(--muted);line-height:1.7;font-size:.875rem;white-space:pre-wrap">${r.content}</p></div>
      </div>`).join('')}
    </div>
    ${user ? `<div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.25rem">
      <form method="POST" action="/forum/${thread.id}/reply">
        <div class="form-group"><label>Ta réponse</label><textarea name="content" required placeholder="Ajoute ta réponse..." style="min-height:100px"></textarea></div>
        <button type="submit" class="btn btn-accent">Répondre →</button>
      </form>
    </div>` : `<div style="text-align:center;padding:1.5rem;color:var(--muted)"><a href="/login" class="btn btn-outline">Connecte-toi pour répondre</a></div>`}
  </div></section>`, user, getCartCount(req));

// ── PREMIUM ──
exports.premium = (req, user, userData) => layout('Premium', `
  <section class="section">
    <div class="container" style="max-width:900px">
      <div style="text-align:center;margin-bottom:3rem">
        <span class="section-label">Adhésion</span>
        <h1 style="font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:800;color:var(--white);margin:.5rem 0">🌟 PêchePro Premium</h1>
        <p style="color:var(--muted);font-size:1rem">L'expérience ultime pour les pêcheurs sérieux</p>
      </div>
      ${flash(req)}
      ${userData && userData.premium ? `<div style="background:rgba(0,255,135,.06);border:2px solid var(--accent);border-radius:20px;padding:2.5rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:1rem">🌟</div>
        <h2 style="font-family:'Syne',sans-serif;color:var(--accent);font-size:1.5rem;font-weight:800">Tu es membre Premium !</h2>
        <p style="color:var(--muted);margin-top:.5rem">Actif jusqu'au ${userData.premium_until ? new Date(userData.premium_until).toLocaleDateString('fr-FR') : '?'}</p>
        <a href="/compte" class="btn btn-accent" style="margin-top:1.5rem">Mon compte →</a>
      </div>` : `<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:2rem">
          <h3 style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:var(--muted);margin-bottom:1.5rem">Gratuit</h3>
          <div style="font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:800;color:var(--white);margin-bottom:1.5rem">0 CHF</div>
          ${['Accès au catalogue','Points fidélité (1 CHF = 1 pt)','Support par ticket','Livraison standard'].map(f=>`<div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.6rem;font-size:.875rem;color:var(--muted)"><span style="color:var(--muted)">✓</span>${f}</div>`).join('')}
        </div>
        <div style="background:linear-gradient(135deg,rgba(0,255,135,.06),rgba(0,255,135,.02));border:2px solid var(--accent);border-radius:16px;padding:2rem;position:relative">
          <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--accent);color:#000;padding:.2rem 1rem;border-radius:50px;font-size:.75rem;font-weight:700">RECOMMANDÉ</div>
          <h3 style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:var(--accent);margin-bottom:1.5rem">Premium 🌟</h3>
          <div style="font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:800;color:var(--white);margin-bottom:.25rem">9.90 <span style="font-size:1rem;color:var(--muted)">CHF/mois</span></div>
          <div style="font-size:.8rem;color:var(--muted);margin-bottom:1.5rem">Résiliable à tout moment</div>
          ${['Livraison express GRATUITE','Réduction -10% sur tout','Points x2 (1 CHF = 2 pts)','Accès en avant-première','+200 pts de bienvenue','Support prioritaire'].map(f=>`<div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.6rem;font-size:.875rem;color:var(--text)"><span style="color:var(--accent)">✓</span>${f}</div>`).join('')}
          ${user ? `<form method="POST" action="/premium/souscrire"><button type="submit" class="btn btn-accent btn-full" style="margin-top:1rem;padding:1rem;font-size:1rem">Rejoindre Premium →</button></form>` : `<a href="/login" class="btn btn-accent btn-full" style="margin-top:1rem;padding:1rem;font-size:1rem;text-align:center">Se connecter pour souscrire</a>`}
        </div>
      </div>`}
    </div>
  </section>`, user, getCartCount(req));

// ── ADMIN BLOG ──
exports.adminBlog = (posts, flash_msg) => {
  const content = `
    ${flash_msg ? `<div class="flash flash-success">${flash_msg}</div>` : ''}
    <div class="admin-card" style="margin-bottom:1.25rem">
      <div class="admin-card-header"><h3>✍️ Nouvel article</h3></div>
      <div style="padding:1.5rem">
        <form method="POST" action="/admin/blog/nouveau">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group" style="grid-column:1/-1"><label>Titre *</label><input name="title" required placeholder="Titre de l'article"></div>
            <div class="form-group"><label>Image URL</label><input name="image_url" placeholder="https://..."></div>
            <div class="form-group"><label>Publié ?</label><select name="published"><option value="0">Brouillon</option><option value="1">Publié</option></select></div>
            <div class="form-group" style="grid-column:1/-1"><label>Résumé court</label><input name="excerpt" placeholder="2-3 phrases de présentation..."></div>
            <div class="form-group" style="grid-column:1/-1"><label>Contenu *</label><textarea name="content" required style="min-height:200px" placeholder="Contenu de l'article..."></textarea></div>
          </div>
          <button type="submit" class="btn btn-accent" style="margin-top:.5rem">Publier →</button>
        </form>
      </div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>📝 Articles</h3><span style="color:var(--muted);font-size:.8rem">${posts.length} articles</span></div>
      <table>
        <tr><th>Titre</th><th>Statut</th><th>Date</th><th></th></tr>
        ${posts.map(p => `<tr>
          <td><strong>${p.title}</strong>${p.excerpt ? `<br><span style="font-size:.75rem;color:var(--muted)">${p.excerpt.substring(0,60)}...</span>` : ''}</td>
          <td><span class="badge badge-${p.published ? 'paid' : 'pending'}">${p.published ? 'Publié' : 'Brouillon'}</span></td>
          <td style="font-size:.8rem;color:var(--muted)">${new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
          <td style="display:flex;gap:.4rem">
            <a href="/blog/${p.id}" class="btn btn-outline btn-sm" target="_blank">Voir</a>
            <form method="POST" action="/admin/blog/${p.id}/toggle"><button type="submit" class="btn btn-ghost btn-sm">${p.published ? 'Masquer' : 'Publier'}</button></form>
            <form method="POST" action="/admin/blog/${p.id}/supprimer" onsubmit="return confirm('Supprimer ?')"><button type="submit" class="btn btn-danger btn-sm">🗑</button></form>
          </td>
        </tr>`).join('')}
      </table>
    </div>`;
  return adminLayout('Blog', content, 'blog');
};

// ── DEMANDES PRODUITS ──
exports.demandesProduits = (req, user, requests) => layout('Demandes produits', `
  <div style="background:var(--surface);border-bottom:1px solid var(--border);padding:3rem 2rem">
    <div style="max-width:960px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
      <div>
        <span class="section-label">Communauté</span>
        <h1 style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:var(--white);margin:.3rem 0">💡 Demandes produits</h1>
        <p style="color:var(--muted);font-size:.9rem">Tu ne trouves pas ce que tu cherches ? Propose-le, la communauté vote !</p>
      </div>
      ${user ? '<button onclick="document.getElementById(\'newReq\').style.display=document.getElementById(\'newReq\').style.display===\'none\'?\'block\':\'none\'" class="btn btn-accent">+ Faire une demande</button>' : '<a href="/login" class="btn btn-outline">Connecte-toi pour proposer</a>'}
    </div>
    ${user ? `<div id="newReq" style="display:none;max-width:960px;margin:1.5rem auto 0;background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:1.5rem">
      <form method="POST" action="/demandes">
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:.75rem;margin-bottom:.75rem">
          <div class="form-group" style="margin:0"><label>Quel produit souhaites-tu ? *</label><input name="title" required placeholder="Ex: Canne télescopique 4m carbone..."></div>
          <div class="form-group" style="margin:0"><label>Catégorie</label><select name="category"><option>Cannes</option><option>Moulinets</option><option>Leurres</option><option>Accessoires</option><option>Autre</option></select></div>
        </div>
        <div class="form-group"><label>Description (optionnel)</label><textarea name="description" placeholder="Modèle précis, marque, utilisation..." style="min-height:80px"></textarea></div>
        <button type="submit" class="btn btn-accent">Envoyer ma demande →</button>
      </form>
    </div>` : ''}
  </div>
  <section class="section"><div class="container" style="max-width:960px">
    ${flash(req)}
    ${requests.length ? `<div style="display:flex;flex-direction:column;gap:.75rem">
      ${requests.map(r => {
        const statusColors = {en_attente:'var(--muted)',en_cours:'#0096ff',disponible:'var(--accent)',refusé:'var(--red)'};
        const statusLabels = {en_attente:'En attente',en_cours:'En cours',disponible:'Disponible !',refusé:'Refusé'};
        return `<div style="background:var(--surface);border:1px solid ${r.status==='disponible'?'var(--accent)':r.status==='en_cours'?'rgba(0,150,255,.3)':'var(--border)'};border-radius:14px;padding:1.25rem 1.5rem;display:flex;align-items:center;gap:1.5rem">
          <form method="POST" action="/demandes/${r.id}/vote" style="flex-shrink:0;text-align:center">
            <button type="submit" style="background:${r.user_voted?'rgba(0,255,135,.15)':'var(--surface2)'};border:1px solid ${r.user_voted?'var(--accent)':'var(--border)'};border-radius:10px;padding:.5rem .75rem;cursor:${user?'pointer':'not-allowed'};color:${r.user_voted?'var(--accent)':'var(--muted)'};font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;display:flex;flex-direction:column;align-items:center;gap:.1rem;min-width:52px" ${user?'':'disabled'}>
              <span style="font-size:.9rem">${r.user_voted?'▲':'△'}</span>
              <span style="font-size:1rem">${r.vote_count}</span>
            </button>
          </form>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.3rem;flex-wrap:wrap">
              <h3 style="font-weight:700;color:var(--white);font-size:.95rem;margin:0">${r.title}</h3>
              <span style="background:var(--surface2);border:1px solid var(--border);border-radius:50px;padding:.15rem .6rem;font-size:.7rem;color:var(--accent)">${r.category}</span>
              <span style="font-size:.72rem;font-weight:600;color:${statusColors[r.status]||'var(--muted)'}">${statusLabels[r.status]||r.status}</span>
            </div>
            ${r.description ? `<p style="color:var(--muted);font-size:.82rem;margin:.2rem 0">${r.description}</p>` : ''}
            ${r.admin_note ? `<p style="color:var(--accent);font-size:.8rem;margin-top:.3rem">💬 Admin : ${r.admin_note}</p>` : ''}
            <div style="font-size:.72rem;color:var(--muted);margin-top:.3rem">Proposé par ${r.author_name} · ${new Date(r.created_at).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>`;
      }).join('')}
    </div>` : `<div style="text-align:center;padding:4rem;color:var(--muted)"><p style="font-size:3rem;margin-bottom:1rem">💡</p><p>Aucune demande pour l'instant — sois le premier !</p></div>`}
  </div></section>`, user, getCartCount(req));

// ── ADMIN FOURNISSEURS ──
exports.adminFournisseurs = (suppliers, products, flash_msg) => {
  const content = `
    ${flash_msg ? `<div class="flash flash-success">${flash_msg}</div>` : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem">
      <div class="admin-card">
        <div class="admin-card-header"><h3>🏭 Nouveau fournisseur</h3></div>
        <div style="padding:1.25rem">
          <form method="POST" action="/admin/fournisseurs/nouveau">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
              <div class="form-group" style="grid-column:1/-1"><label>Nom *</label><input name="name" required placeholder="Ex: Shimano France"></div>
              <div class="form-group"><label>Contact</label><input name="contact_name" placeholder="Prénom Nom"></div>
              <div class="form-group"><label>Email</label><input type="email" name="email" placeholder="contact@..."></div>
              <div class="form-group"><label>Téléphone</label><input name="phone" placeholder="+33 ..."></div>
              <div class="form-group"><label>Site web</label><input name="website" placeholder="https://..."></div>
              <div class="form-group"><label>Pays</label><input name="country" value="France"></div>
              <div class="form-group"><label>Délai livraison (jours)</label><input type="number" name="delivery_days" value="7" min="1"></div>
              <div class="form-group"><label>Conditions paiement</label><input name="payment_terms" placeholder="Ex: 30j net"></div>
              <div class="form-group" style="grid-column:1/-1"><label>Adresse</label><input name="address" placeholder="Rue, ville, CP"></div>
              <div class="form-group" style="grid-column:1/-1"><label>Notes internes</label><textarea name="notes" style="min-height:70px" placeholder="Infos importantes..."></textarea></div>
            </div>
            <button type="submit" class="btn btn-accent" style="margin-top:.5rem">Ajouter →</button>
          </form>
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card-header"><h3>🔗 Lier produit ↔ fournisseur</h3></div>
        <div style="padding:1.25rem">
          <form method="POST" action="/admin/fournisseurs/lier">
            <div class="form-group"><label>Fournisseur</label><select name="supplier_id">${suppliers.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Produit</label><select name="product_id">${products.map(p=>`<option value="${p.id}">${p.name} (vente: ${p.price.toFixed(2)} CHF)</option>`).join('')}</select></div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem">
              <div class="form-group" style="margin:0"><label>Prix achat (CHF)</label><input type="number" name="purchase_price" step="0.01" min="0" placeholder="0.00"></div>
              <div class="form-group" style="margin:0"><label>Qté min.</label><input type="number" name="min_order" value="1" min="1"></div>
              <div class="form-group" style="margin:0"><label>Délai (j)</label><input type="number" name="lead_time" value="7" min="1"></div>
            </div>
            <button type="submit" class="btn btn-accent btn-full" style="margin-top:.75rem">Lier →</button>
          </form>
        </div>
      </div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>Liste des fournisseurs</h3><span style="color:var(--muted);font-size:.8rem">${suppliers.length} fournisseurs</span></div>
      ${suppliers.length ? `<div style="padding:1rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
        ${suppliers.map(s => `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:1.25rem">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem">
            <div>
              <h4 style="font-weight:700;color:var(--white);font-size:.9rem">${s.name}</h4>
              <div style="font-size:.75rem;color:var(--muted)">${s.country} · ${s.delivery_days}j délai</div>
            </div>
            <span style="font-size:.75rem;color:var(--accent);font-weight:600">${s.product_count} produit${s.product_count>1?'s':''}</span>
          </div>
          ${s.contact_name ? `<div style="font-size:.8rem;color:var(--muted);margin-bottom:.2rem">👤 ${s.contact_name}</div>` : ''}
          ${s.email ? `<div style="font-size:.8rem;color:var(--muted);margin-bottom:.2rem">📧 <a href="mailto:${s.email}" style="color:var(--accent)">${s.email}</a></div>` : ''}
          ${s.phone ? `<div style="font-size:.8rem;color:var(--muted);margin-bottom:.2rem">📞 ${s.phone}</div>` : ''}
          ${s.website ? `<div style="font-size:.8rem;color:var(--muted);margin-bottom:.2rem">🌐 <a href="${s.website}" target="_blank" style="color:var(--accent)">${s.website}</a></div>` : ''}
          ${s.payment_terms ? `<div style="font-size:.8rem;color:var(--muted);margin-bottom:.75rem">💳 ${s.payment_terms}</div>` : '<div style="margin-bottom:.75rem"></div>'}
          ${s.notes ? `<div style="background:var(--surface);border-radius:8px;padding:.5rem .75rem;font-size:.78rem;color:var(--muted);margin-bottom:.75rem">${s.notes}</div>` : ''}
          <form method="POST" action="/admin/fournisseurs/${s.id}/supprimer" onsubmit="return confirm('Supprimer ce fournisseur ?')">
            <button type="submit" class="btn btn-danger btn-sm btn-full">Supprimer</button>
          </form>
        </div>`).join('')}
      </div>` : `<div style="padding:2rem;text-align:center;color:var(--muted)">Aucun fournisseur — ajoutez-en un ci-dessus</div>`}
    </div>`;
  return adminLayout('Fournisseurs', content, 'fournisseurs');
};

// ── ADMIN STOCKS ──
exports.adminStocks = (products, flash_msg) => {
  const lowStock = products.filter(p => p.stock <= (p.reorder_threshold || 5));
  const content = `
    ${flash_msg ? `<div class="flash flash-success">${flash_msg}</div>` : ''}
    ${lowStock.length ? `<div style="background:rgba(255,68,68,.08);border:1px solid rgba(255,68,68,.2);border-radius:12px;padding:1rem 1.25rem;margin-bottom:1.25rem;display:flex;align-items:center;gap:.75rem">
      <span style="font-size:1.2rem">⚠️</span>
      <div><strong style="color:var(--red)">${lowStock.length} produit${lowStock.length>1?'s':''} en stock critique</strong>
      <div style="font-size:.8rem;color:var(--muted);margin-top:.2rem">${lowStock.map(p=>p.name).join(', ')}</div></div>
    </div>` : `<div style="background:rgba(0,255,135,.06);border:1px solid rgba(0,255,135,.15);border-radius:12px;padding:.85rem 1.25rem;margin-bottom:1.25rem;font-size:.875rem;color:var(--accent)">✅ Tous les stocks sont OK</div>`}
    <div class="admin-card">
      <div class="admin-card-header"><h3>📦 Gestion des stocks</h3><span style="color:var(--muted);font-size:.8rem">${products.length} produits</span></div>
      <table>
        <tr><th>Produit</th><th>Stock actuel</th><th>Seuil alerte</th><th>Fournisseur</th><th>Marge</th><th>Modifier</th></tr>
        ${products.map(p => {
          const margin = p.purchase_price > 0 ? ((p.price - p.purchase_price) / p.price * 100).toFixed(0) : null;
          const isLow = p.stock <= (p.reorder_threshold || 5);
          return `<tr>
            <td><strong>${p.name}</strong><br><span style="font-size:.72rem;color:var(--accent)">${p.category}</span></td>
            <td><strong style="color:${isLow?'var(--red)':p.stock<10?'orange':'var(--accent)'};font-size:1.1rem">${p.stock}</strong>${isLow?'<br><span style="font-size:.7rem;color:var(--red)">⚠️ Commander</span>':''}</td>
            <td style="color:var(--muted)">${p.reorder_threshold||5}</td>
            <td style="font-size:.8rem;color:var(--muted)">${p.supplier_name||'—'}</td>
            <td>${margin ? `<span style="color:${margin>30?'var(--accent)':margin>15?'orange':'var(--red)'};font-weight:700">${margin}%</span>` : '—'}</td>
            <td>
              <details>
                <summary style="cursor:pointer;font-size:.78rem;color:var(--muted);list-style:none">✏️ Modifier</summary>
                <form method="POST" action="/admin/stocks/${p.id}/update" style="margin-top:.5rem;display:flex;gap:.4rem;align-items:center;flex-wrap:wrap">
                  <input type="number" name="stock" value="${p.stock}" min="0" style="width:70px;padding:.3rem .5rem;border:1px solid var(--border);border-radius:6px;background:var(--surface2);color:var(--text);font-size:.8rem">
                  <input type="number" name="reorder_threshold" value="${p.reorder_threshold||5}" min="0" placeholder="Seuil" style="width:60px;padding:.3rem .5rem;border:1px solid var(--border);border-radius:6px;background:var(--surface2);color:var(--text);font-size:.8rem">
                  <button type="submit" class="btn btn-accent btn-sm">✓</button>
                </form>
              </details>
            </td>
          </tr>`;
        }).join('')}
      </table>
    </div>`;
  return adminLayout('Stocks', content, 'stocks');
};

// ── ADMIN FINANCES ──
exports.adminFinances = (stats, requests, flash_msg) => {
  const totalProfit = stats.topProducts.reduce((s,p) => s + (p.profit||0), 0);
  const totalCOGS = stats.topProducts.reduce((s,p) => s + ((p.sold||0) * (p.purchase_price||0)), 0);
  const margin = stats.revenue > 0 ? (totalProfit / stats.revenue * 100).toFixed(1) : 0;
  const content = `
    ${flash_msg ? `<div class="flash flash-success">${flash_msg}</div>` : ''}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem">
      <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value">${Number(stats.revenue).toFixed(0)} CHF</div><div class="stat-label">Chiffre d'affaires</div><div class="stat-accent"></div></div>
      <div class="stat-card"><div class="stat-icon">📈</div><div class="stat-value">${Number(totalProfit).toFixed(0)} CHF</div><div class="stat-label">Bénéfice estimé</div><div class="stat-accent"></div></div>
      <div class="stat-card"><div class="stat-icon">🎯</div><div class="stat-value">${margin}%</div><div class="stat-label">Marge moyenne</div><div class="stat-accent"></div></div>
      <div class="stat-card"><div class="stat-icon">🛒</div><div class="stat-value">${Number(stats.avgOrder).toFixed(0)} CHF</div><div class="stat-label">Panier moyen</div><div class="stat-accent"></div></div>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.25rem;margin-bottom:1.25rem">
      <div class="admin-card">
        <div class="admin-card-header"><h3>📅 CA par mois</h3></div>
        <table>
          <tr><th>Mois</th><th>CA</th><th>Commandes</th></tr>
          ${stats.revenueByMonth.map(m => `<tr>
            <td><strong>${m.month}</strong></td>
            <td><strong style="color:var(--accent)">${Number(m.revenue).toFixed(2)} CHF</strong></td>
            <td style="color:var(--muted)">${m.orders}</td>
          </tr>`).join('')}
        </table>
      </div>
      <div class="admin-card">
        <div class="admin-card-header"><h3>💡 Demandes membres</h3></div>
        <div style="padding:.5rem 0;max-height:400px;overflow-y:auto">
          ${requests.map(r => `<div style="padding:.75rem 1.25rem;border-bottom:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.4rem">
              <div style="font-size:.85rem;font-weight:600;color:var(--white);flex:1">${r.title}</div>
              <span style="background:rgba(0,255,135,.1);color:var(--accent);border:1px solid rgba(0,255,135,.2);border-radius:50px;padding:.1rem .5rem;font-size:.7rem;font-weight:700;flex-shrink:0;margin-left:.5rem">▲ ${r.vote_count}</span>
            </div>
            <div style="font-size:.72rem;color:var(--muted);margin-bottom:.5rem">${r.author_name} · ${r.category}</div>
            <form method="POST" action="/admin/demandes/${r.id}/statut" style="display:flex;gap:.4rem;align-items:center;flex-wrap:wrap">
              <select name="status" style="flex:1;padding:.3rem .5rem;border:1px solid var(--border);border-radius:6px;background:var(--surface2);color:var(--text);font-size:.75rem;font-family:'Inter',sans-serif">
                <option value="en_attente" ${r.status==='en_attente'?'selected':''}>En attente</option>
                <option value="en_cours" ${r.status==='en_cours'?'selected':''}>En cours</option>
                <option value="disponible" ${r.status==='disponible'?'selected':''}>Disponible !</option>
                <option value="refusé" ${r.status==='refusé'?'selected':''}>Refusé</option>
              </select>
              <input name="admin_note" placeholder="Note..." value="${r.admin_note||''}" style="flex:2;padding:.3rem .5rem;border:1px solid var(--border);border-radius:6px;background:var(--surface2);color:var(--text);font-size:.75rem;font-family:'Inter',sans-serif">
              <button type="submit" class="btn btn-accent btn-sm">✓</button>
            </form>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="admin-card">
      <div class="admin-card-header"><h3>📊 Marges par produit</h3></div>
      <table>
        <tr><th>Produit</th><th>Prix vente</th><th>Prix achat</th><th>Marge</th><th>Vendus</th><th>CA</th><th>Bénéfice</th></tr>
        ${stats.topProducts.map(p => {
          const m = p.purchase_price > 0 ? ((p.price - p.purchase_price) / p.price * 100).toFixed(0) : null;
          return `<tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.price.toFixed(2)} CHF</td>
            <td style="color:var(--muted)">${p.purchase_price > 0 ? p.purchase_price.toFixed(2)+' CHF' : '—'}</td>
            <td>${m ? `<span style="color:${m>30?'var(--accent)':m>15?'orange':'var(--red)'};font-weight:700">${m}%</span>` : '—'}</td>
            <td style="color:var(--muted)">${p.sold||0}</td>
            <td><strong style="color:var(--accent)">${Number(p.revenue||0).toFixed(0)} CHF</strong></td>
            <td>${p.profit > 0 ? `<strong style="color:var(--accent)">${Number(p.profit).toFixed(0)} CHF</strong>` : `<span style="color:var(--muted)">—</span>`}</td>
          </tr>`;
        }).join('')}
      </table>
    </div>`;
  return adminLayout('Finances & Marges', content, 'finances');
};