const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');

const { MessageMedia } = require('whatsapp-web.js');

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3010;

let latestQr = null;
let qrBase64 = null;
let isReady = false;
let connectionStatus = 'initializing';

// ── WhatsApp Client ──────────────────────────────────
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: '/wpp-auth' }),
  puppeteer: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    headless: true,
  }
});

client.on('qr', async (qr) => {
  console.log('\n\n===========================================');
  console.log('📱 QR CODE GERADO! Acesse http://localhost:3010/qr para escanear');
  console.log('===========================================\n');
  latestQr = qr;
  connectionStatus = 'qr_ready';
  
  // Gerar QR como imagem base64
  try {
    qrBase64 = await qrcode.toDataURL(qr);
    console.log('✅ QR code convertido para imagem base64');
  } catch (err) {
    console.error('❌ Erro ao converter QR:', err.message);
  }
});

client.on('ready', () => {
  console.log('\n✅ WhatsApp conectado e pronto!');
  isReady = true;
  connectionStatus = 'connected';
  latestQr = null;
  qrBase64 = null;
});

client.on('authenticated', () => {
  console.log('🔐 Autenticado no WhatsApp!');
  connectionStatus = 'authenticated';
});

client.on('auth_failure', (msg) => {
  console.error('❌ Falha na autenticação:', msg);
  connectionStatus = 'auth_failed';
});

client.on('disconnected', (reason) => {
  console.log('🔌 WhatsApp desconectado:', reason);
  isReady = false;
  connectionStatus = 'disconnected';
});

// ── Handler de Mensagens Entrantes → Agente Pixel ─────
const APP_WEBHOOK_URL = process.env.APP_WEBHOOK_URL || 'http://app:3002';

// Tipos de mídia suportados
const MEDIA_TYPES = ['ptt', 'audio', 'image', 'sticker', 'video', 'document'];

client.on('message', async (msg) => {
  // Ignorar mensagens de grupos
  if (msg.from.endsWith('@g.us')) return;
  // Ignorar mensagens do próprio bot
  if (msg.fromMe) return;

  const from = msg.from;
  const body = msg.body || '';
  const isMedia = MEDIA_TYPES.includes(msg.type);
  const isText = msg.type === 'chat' || msg.type === 'text';

  // Se não é texto nem mídia, ignorar
  if (!isText && !isMedia) return;

  try {
    let data;

    if (isMedia) {
      // ── MÍDIA: download e encaminha para /api/whatsapp/media ──
      console.log(`📩 Mídia (${msg.type}) de ${from}${body ? `: "${body.substring(0, 40)}"` : ''}`);

      let mediaData = null;
      let mimetype = '';
      let filename = '';

      try {
        const media = await msg.downloadMedia();
        if (media) {
          mediaData = media.data;      // base64
          mimetype = media.mimetype;
          filename = media.filename || `media_${Date.now()}`;
        }
      } catch (dlErr) {
        console.error(`❌ Erro ao baixar mídia: ${dlErr.message}`);
      }

      // Mapear tipo wpp-web.js → tipo do media-processor
      const typeMap = {
        ptt: 'audio',
        audio: 'audio',
        image: 'image',
        sticker: 'image',
        video: 'video',
        document: 'document',
      };

      const res = await fetch(`${APP_WEBHOOK_URL}/api/whatsapp/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          body,
          media: mediaData ? {
            type: typeMap[msg.type] || msg.type,
            data: mediaData,
            mimetype,
            filename,
          } : null,
        }),
      });

      if (!res.ok) {
        console.error(`❌ App retornou erro: ${res.status}`);
        return;
      }

      data = await res.json();

    } else {
      // ── TEXTO: encaminha para /api/whatsapp/message ──
      console.log(`📩 Mensagem de ${from}: "${body.substring(0, 60)}"`);

      const res = await fetch(`${APP_WEBHOOK_URL}/api/whatsapp/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, body }),
      });

      if (!res.ok) {
        console.error(`❌ App retornou erro: ${res.status}`);
        return;
      }

      data = await res.json();
    }

    // Enviar resposta
    if (data && data.reply) {
      await client.sendMessage(from, data.reply);
      console.log(`✅ Resposta enviada para ${from}`);
    }
  } catch (err) {
    console.error('❌ Erro ao processar mensagem:', err.message);
  }
});


console.log('🚀 Iniciando cliente WhatsApp...');
client.initialize();

// ── REST API ─────────────────────────────────────────

// Status endpoint
app.get('/status', (req, res) => {
  res.json({ status: connectionStatus, ready: isReady });
});

// QR Code HTML page
app.get('/qr', (req, res) => {
  if (isReady) {
    res.send(`<html><body style="background:#000;color:#0f0;text-align:center;padding:50px;font-family:sans-serif">
      <h1>✅ WhatsApp já está conectado!</h1>
      <p>Não é necessário escanear o QR code.</p>
    </body></html>`);
    return;
  }
  if (!qrBase64) {
    res.send(`<html>
    <head><meta http-equiv="refresh" content="3"></head>
    <body style="background:#0d1117;color:#cdd9e5;text-align:center;padding:50px;font-family:sans-serif">
      <h1>⏳ Aguardando QR Code...</h1>
      <p>Esta página vai atualizar automaticamente.</p>
      <p>Status: <strong>${connectionStatus}</strong></p>
    </body></html>`);
    return;
  }
  res.send(`<html>
  <head>
    <title>Pixel Obra — WhatsApp QR Code</title>
    <meta http-equiv="refresh" content="20">
    <style>
      body { background: #0d1117; color: #cdd9e5; text-align: center; 
             padding: 40px; font-family: 'Segoe UI', sans-serif; }
      h1 { color: #25d366; }
      img { border: 4px solid #25d366; border-radius: 12px; padding: 20px; 
            background: white; max-width: 300px; }
      p { color: #8b949e; margin: 8px 0; }
    </style>
  </head>
  <body>
    <h1>📱 Pixel Obra — WhatsApp</h1>
    <p>Escaneie o QR code com <strong>WhatsApp → Configurações → Dispositivos vinculados</strong></p>
    <br>
    <img src="${qrBase64}" alt="QR Code">
    <br><br>
    <p>Status: <strong style="color:#f0c27f">${connectionStatus}</strong></p>
    <p style="font-size:12px">Esta página atualiza automaticamente a cada 20 segundos</p>
  </body>
  </html>`);
});

// Helper: resolve chatId robusto (fix "No LID for user")
async function resolveChatId(number) {
  const sanitized = number.replace(/\D/g, '');

  // 1. Tentar getNumberId — retorna o ID registrado no WhatsApp (com LID)
  try {
    const numberId = await client.getNumberId(sanitized);
    if (numberId && numberId._serialized) {
      console.log(`📇 Número ${sanitized} resolvido → ${numberId._serialized}`);
      return numberId._serialized;
    }
  } catch (e) {
    console.warn(`⚠️ getNumberId falhou para ${sanitized}: ${e.message}`);
  }

  // 2. Fallback: formato @c.us padrão
  return sanitized + '@c.us';
}

// Send message endpoint
app.post('/send', async (req, res) => {
  if (!isReady) {
    return res.status(503).json({ error: 'WhatsApp não está conectado', status: connectionStatus });
  }
  const { number, text } = req.body;
  if (!number || !text) {
    return res.status(400).json({ error: 'number e text são obrigatórios' });
  }

  const MAX_RETRIES = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const chatId = await resolveChatId(number);
      await client.sendMessage(chatId, text);
      console.log(`✅ Mensagem enviada para ${number} (tentativa ${attempt})`);
      return res.json({ success: true });
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Tentativa ${attempt}/${MAX_RETRIES} falhou para ${number}: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        // Pequena pausa antes de retry
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }

  console.error('❌ Erro ao enviar mensagem (todas tentativas):', lastError.message);
  res.status(500).json({ error: lastError.message });
});

// Send media endpoint (audio, images, documents)
app.post('/send-media', async (req, res) => {
  if (!isReady) {
    return res.status(503).json({ error: 'WhatsApp não está conectado', status: connectionStatus });
  }
  const { number, media, filename, mimetype, caption } = req.body;
  if (!number || !media) {
    return res.status(400).json({ error: 'number e media (base64) são obrigatórios' });
  }
  try {
    const chatId = await resolveChatId(number);
    const mediaObj = new MessageMedia(
      mimetype || 'application/octet-stream',
      media,
      filename || 'file'
    );
    await client.sendMessage(chatId, mediaObj, {
      caption: caption || '',
      sendAudioAsVoice: mimetype && mimetype.startsWith('audio/'),
    });
    console.log(`✅ Mídia enviada para ${number}: ${filename || 'arquivo'}`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erro ao enviar mídia:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 API disponível em http://localhost:${PORT}`);
  console.log(`📱 Para escanear o QR: http://localhost:${PORT}/qr`);
});
