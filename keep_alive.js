// ── Keep-Alive pour Render (évite le sleep après 15min d'inactivité) ──
// Ce fichier ping l'app toutes les 10 minutes pour la maintenir éveillée.
// Render endort les apps gratuites si elles reçoivent 0 requête pendant 15min.

const APP_URL = process.env.APP_URL;

if (APP_URL) {
  setInterval(async () => {
    try {
      await fetch(`${APP_URL}/health`);
      console.log('[KeepAlive] Ping OK —', new Date().toLocaleTimeString());
    } catch (e) {
      console.log('[KeepAlive] Ping failed:', e.message);
    }
  }, 10 * 60 * 1000); // toutes les 10 minutes
  console.log('[KeepAlive] Activé — pings toutes les 10min');
} else {
  console.log('[KeepAlive] APP_URL non défini, désactivé');
}
