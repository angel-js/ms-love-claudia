// ============================================
//  💌 LoveMessages — Scriptable iOS
// ============================================

const CONFIG = {
  BASE_URL: "https://ms-love-claudia-production.up.railway.app",
  MY_NAME: "claudia",
  PARTNER: "angel",
  API_KEY: "88Uoi1TPOqy0QAJxiSye_xXK4z6KpiQOY5pqIJX6rvo",
};

const COLORS = {
  bg:         new Color("#0d0d1a"),
  card:       new Color("#1a1a2e"),
  accent:     new Color("#ff6b9d"),
  accentSoft: new Color("#ff6b9d22"),
  text:       new Color("#f0e6ff"),
  muted:      new Color("#8888aa"),
  green:      new Color("#06D6A0"),
  border:     new Color("#2a2a4a"),
};

// ════════════════════════════════════════════
//  API CALLS
// ════════════════════════════════════════════

async function fetchMessages() {
  const url = `${CONFIG.BASE_URL}/messages/${CONFIG.MY_NAME}`;
  const req = new Request(url);
  req.method = "GET";
  req.headers = { "X-API-Key": CONFIG.API_KEY };
  try {
    const res = await req.loadJSON();
    return Array.isArray(res) ? res : [];
  } catch (e) {
    return [];
  }
}

async function fetchLatestMessage() {
  const url = `${CONFIG.BASE_URL}/messages/${CONFIG.MY_NAME}/latest`;
  const req = new Request(url);
  req.method = "GET";
  req.headers = { "X-API-Key": CONFIG.API_KEY };
  try {
    const res = await req.loadJSON();
    if (Array.isArray(res)) return res[res.length - 1] ?? null;
    return res;
  } catch (e) {
    const all = await fetchMessages();
    return all.length > 0 ? all[all.length - 1] : null;
  }
}

async function sendMessage(text) {
  const url = `${CONFIG.BASE_URL}/messages/`;
  const req = new Request(url);
  req.method = "POST";
  req.headers = {
    "Content-Type": "application/json",
    "X-API-Key": CONFIG.API_KEY,
  };
  req.body = JSON.stringify({
    sender: CONFIG.MY_NAME,
    receiver: CONFIG.PARTNER,
    message: text,
    include_counter: true,
  });
  try {
    const res = await req.loadJSON();
    return { ok: true, data: res };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ════════════════════════════════════════════
//  UI — MODO INTERACTIVO
// ════════════════════════════════════════════

async function runInteractive() {
  const alert0 = new Alert();
  alert0.title = "💌Messages";
  alert0.message = `Hola ${capitalize(CONFIG.MY_NAME)} 👋\n¿Qué quieres hacer?`;
  alert0.addAction("📨 Ver último mensaje");
  alert0.addAction("📜 Ver todos los mensajes");
  alert0.addAction("✍️ Enviar mensaje");
  alert0.addCancelAction("Cerrar");

  const choice = await alert0.presentAlert();
  if (choice === 0) await showLatest();
  else if (choice === 1) await showAll();
  else if (choice === 2) await composeSend();
}

async function showLatest() {
  const msg = await fetchLatestMessage();
  if (!msg) {
    await simpleAlert("📭 Sin mensajes", "Aún no hay mensajes de " + capitalize(CONFIG.PARTNER));
    return;
  }
  const counter = msg.counter;
  const body = counter
    ? `"${msg.message}"\n\n❤️ ${counter.text}\n⏱ ${counter.days}d ${counter.hours}h ${counter.minutes}m`
    : `"${msg.message}"`;

  const a = new Alert();
  a.title = `Mensaje de ${capitalize(msg.sender)} 💌`;
  a.message = body;
  a.addAction("💬 Responder");
  a.addCancelAction("Cerrar");
  const r = await a.presentAlert();
  if (r === 0) await composeSend();
}

async function showAll() {
  const msgs = await fetchMessages();
  if (msgs.length === 0) {
    await simpleAlert("📭 Sin mensajes", "No hay mensajes todavía.");
    return;
  }
  const recent = msgs.slice(-5).reverse();
  const lines = recent.map((m, i) => {
    const from = capitalize(m.sender);
    return `${i + 1}. ${from}: "${m.message}"`;
  }).join("\n\n");

  const a = new Alert();
  a.title = `📜 Últimos mensajes (${msgs.length} total)`;
  a.message = lines;
  a.addAction("✍️ Enviar uno nuevo");
  a.addCancelAction("Cerrar");
  const r = await a.presentAlert();
  if (r === 0) await composeSend();
}

async function composeSend() {
  const a = new Alert();
  a.title = `✍️ Mensaje para ${capitalize(CONFIG.PARTNER)}`;
  a.message = "Escribe lo que sientes 💕";
  a.addTextField("Tu mensaje aquí…");
  a.addAction("💌 Enviar");
  a.addCancelAction("Cancelar");
  const r = await a.presentAlert();
  if (r !== 0) return;
  const text = a.textFieldValue(0).trim();
  if (!text) {
    await simpleAlert("⚠️ Vacío", "Escribe algo antes de enviar.");
    return;
  }
  const result = await sendMessage(text);
  if (result.ok) {
    await simpleAlert("✅ Enviado", `Tu mensaje llegó a ${capitalize(CONFIG.PARTNER)} 💌`);
  } else {
    await simpleAlert("❌ Error", `No se pudo enviar:\n${result.error}`);
  }
}

// ════════════════════════════════════════════
//  WIDGET
// ════════════════════════════════════════════

async function buildWidget(size = "medium") {
  const msg = await fetchLatestMessage();
  const w = new ListWidget();
  w.backgroundColor = COLORS.bg;
  w.setPadding(14, 16, 14, 16);
  w.url = "scriptable:///run/" + encodeURIComponent(Script.name());

  const header = w.addStack();
  header.layoutHorizontally();
  header.centerAlignContent();
  const title = header.addText("💌Clau mi princesa");
  title.textColor = COLORS.accent;
  title.font = Font.boldSystemFont(13);
  header.addSpacer();

  if (msg?.counter) {
    const days = header.addText(`❤️ ${msg.counter.days}d`);
    days.textColor = COLORS.muted;
    days.font = Font.systemFont(11);
  }

  w.addSpacer(8);

  if (!msg) {
    const empty = w.addText("Sin mensajes aún 📭");
    empty.textColor = COLORS.muted;
    empty.font = Font.italicSystemFont(13);
  } else {
    const chip = w.addStack();
    chip.setPadding(3, 8, 3, 8);
    chip.cornerRadius = 8;
    chip.backgroundColor = COLORS.accentSoft;
    const senderTxt = chip.addText(`De ${capitalize(msg.sender)}`);
    senderTxt.textColor = COLORS.accent;
    senderTxt.font = Font.boldSystemFont(10);

    w.addSpacer(6);

    const msgText = w.addText(`"${msg.message}"`);
    msgText.textColor = COLORS.text;
    msgText.font = Font.systemFont(14);
    msgText.numberOfLines = 3;

    if (msg.counter && size !== "small") {
      w.addSpacer(8);
      const counterTxt = w.addText(msg.counter.text);
      counterTxt.textColor = COLORS.muted;
      counterTxt.font = Font.italicSystemFont(11);
    }
  }

  w.addSpacer();

  const footer = w.addText("Toca para abrir ✨");
  footer.textColor = COLORS.muted;
  footer.font = Font.systemFont(9);

  w.refreshAfterDate = new Date(Date.now() + 1000 * 60 * 15);

  return w;
}

// ════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function simpleAlert(title, message) {
  const a = new Alert();
  a.title = title;
  a.message = message;
  a.addAction("OK");
  await a.presentAlert();
}

// ════════════════════════════════════════════
//  ENTRY POINT
// ════════════════════════════════════════════

if (config.runsInWidget) {
  const size = config.widgetFamily ?? "medium";
  const widget = await buildWidget(size);
  Script.setWidget(widget);
} else {
  await runInteractive();
}