// Telegram Bot Integration for NW Consulting
const TELEGRAM_CONFIG = {
  botToken: '8305644339:AAHqJlKhxQKxXGpG0IYmvhGx2gmNYZ_ERzY',
  chatId: '-1002931666420'
};

// Send message to Telegram using GET via Image beacon (works without CORS)
async function sendToTelegram(message) {
  return new Promise((resolve) => {
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage` +
        `?chat_id=${encodeURIComponent(TELEGRAM_CONFIG.chatId)}` +
        `&parse_mode=HTML` +
        `&disable_web_page_preview=true` +
        `&text=${encodeURIComponent(message)}`;

      const img = new Image();
      // Уdepuisпех/ошибку à partir dedepuisледить нельзя надёжно, поэтому завершаем в любом depuisлучае
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true);
      img.referrerPolicy = 'no-referrer';
      img.src = url + `&t=${Date.now()}`; // cache buster
      // На вdepuisякий depuisлучай ограничим ожидание
      setTimeout(() => resolve(true), 1500);
    } catch (e) {
      console.error('Telegram send error', e);
      resolve(false);
    }
  });
}

// Format registration request
function formatRegistrationMessage(data) {
  const timestamp = new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'short'
  });
  
  const isFrench = data.language === 'fr';
  
  if (isFrench) {
    return `🏢 <b>NOUVELLE DEMANDE D'ENREGISTREMENT</b>

📍 <b>Pays:</b> ${data.country}
👤 <b>Client:</b> ${data.name}
📧 <b>E-mail:</b> ${data.email}
📱 <b>Téléphone:</b> ${data.phone}
${data.message ? `💬 <b>Message:</b> ${data.message}` : ''}

🌐 <b>Langue:</b> Français
🕐 <i>${timestamp}</i>`;
  }
  
  return `🏢 <b>НОВАЯ ЗАЯВКА НА РЕГИСТРАЦИЮ</b>

📍 <b>Страна:</b> ${data.country}
👤 <b>Клиент:</b> ${data.name}
📧 <b>E-mail:</b> ${data.email}
📱 <b>Телефон:</b> ${data.phone}
${data.message ? `💬 <b>Сообщение:</b> ${data.message}` : ''}

🕐 <i>${timestamp}</i>`;
}

// Format bank account request
function formatBankMessage(data) {
  const timestamp = new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'short'
  });
  
  const isFrench = data.language === 'fr';
  
  if (isFrench) {
    return `🏦 <b>NOUVELLE DEMANDE D'OUVERTURE DE COMPTE</b>

🏛 <b>Banque:</b> ${data.bank}
👤 <b>Client:</b> ${data.name}
📧 <b>E-mail:</b> ${data.email}
📱 <b>Téléphone:</b> ${data.phone}
${data.company ? `🏢 <b>Société:</b> ${data.company}` : ''}
${data.message ? `💬 <b>Message:</b> ${data.message}` : ''}

🌐 <b>Langue:</b> Français
🕐 <i>${timestamp}</i>`;
  }
  
  return `🏦 <b>НОВАЯ ЗАЯВКА НА ОТКРЫТИЕ СЧЕТА</b>

🏛 <b>Банк:</b> ${data.bank}
👤 <b>Клиент:</b> ${data.name}
📧 <b>E-mail:</b> ${data.email}
📱 <b>Телефон:</b> ${data.phone}
${data.company ? `🏢 <b>Компания:</b> ${data.company}` : ''}
${data.message ? `💬 <b>Сообщение:</b> ${data.message}` : ''}

🕐 <i>${timestamp}</i>`;
}

// Format general contact request
function formatContactMessage(data) {
  const timestamp = new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'short'
  });
  
  const isFrench = data.language === 'fr';
  
  if (isFrench) {
    return `📞 <b>NOUVELLE DEMANDE DU SITE</b>

👤 <b>Client:</b> ${data.name}
📧 <b>E-mail:</b> ${data.email}
${data.phone ? `📱 <b>Téléphone:</b> ${data.phone}` : ''}
${data.message ? `💬 <b>Message:</b> ${data.message}` : ''}

🌐 <b>Langue:</b> Français
🕐 <i>${timestamp}</i>`;
  }
  
  return `📞 <b>НОВАЯ ЗАЯВКА С САЙТА</b>

👤 <b>Клиент:</b> ${data.name}
📧 <b>E-mail:</b> ${data.email}
${data.phone ? `📱 <b>Телефон:</b> ${data.phone}` : ''}
${data.message ? `💬 <b>Сообщение:</b> ${data.message}` : ''}

🕐 <i>${timestamp}</i>`;
}

// Format service request
function formatServiceMessage(data) {
  const timestamp = new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'short'
  });
  
  const isFrench = data.language === 'fr';
  
  if (isFrench) {
    return `📊 <b>NOUVELLE DEMANDE DE SERVICE</b>

🔧 <b>Service:</b> ${data.service}
👤 <b>Client:</b> ${data.name}
📧 <b>E-mail:</b> ${data.email}
📱 <b>Téléphone:</b> ${data.phone}
${data.company && data.company !== 'Не указано' ? `🏢 <b>Société:</b> ${data.company}` : ''}
${data.message && data.message !== 'Без комментариев' ? `💬 <b>Message:</b> ${data.message}` : ''}

🌐 <b>Langue:</b> Français
🕐 <i>${timestamp}</i>`;
  }
  
  return `📊 <b>НОВАЯ ЗАЯВКА НА УСЛУГУ</b>

🔧 <b>Услуга:</b> ${data.service}
👤 <b>Клиент:</b> ${data.name}
📧 <b>E-mail:</b> ${data.email}
📱 <b>Телефон:</b> ${data.phone}
${data.company && data.company !== 'Не указано' ? `🏢 <b>Компания:</b> ${data.company}` : ''}
${data.message && data.message !== 'Без комментариев' ? `💬 <b>Сообщение:</b> ${data.message}` : ''}

🕐 <i>${timestamp}</i>`;
}

// Export functions
window.sendRegistrationToTelegram = async (formData) => {
  const data = Object.fromEntries(formData);
  // Add language from HTML tag
  data.language = document.documentElement.lang || 'ru';
  const message = formatRegistrationMessage(data);
  return await sendToTelegram(message);
};

window.sendBankToTelegram = async (formData) => {
  const data = Object.fromEntries(formData);
  // Add language from HTML tag
  data.language = document.documentElement.lang || 'ru';
  const message = formatBankMessage(data);
  return await sendToTelegram(message);
};

window.sendContactToTelegram = async (formData) => {
  const data = Object.fromEntries(formData);
  // Add language from HTML tag
  data.language = document.documentElement.lang || 'ru';
  const message = formatContactMessage(data);
  return await sendToTelegram(message);
};

window.sendServiceToTelegram = async (data) => {
  // Add language from HTML tag
  data.language = document.documentElement.lang || 'ru';
  const message = formatServiceMessage(data);
  return await sendToTelegram(message);
};

// Format audit request
function formatAuditMessage(data) {
  const timestamp = new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'short'
  });
  
  return `🔍 <b>НОВАЯ ЗАЯВКА НА АУДИТ</b>

🌍 <b>Pays:</b> ${data.country}
👤 <b>Клиент:</b> ${data.name}
📧 <b>E-mail:</b> ${data.email}
📱 <b>Téléphone:</b> ${data.phone}
${data.company && data.company !== 'Не указано' ? `🏢 <b>Société:</b> ${data.company}` : ''}
${data.message && data.message !== 'Без комментариев' ? `💬 <b>Message:</b> ${data.message}` : ''}

🕐 <i>${timestamp}</i>`;
}

window.sendAuditToTelegram = async (data) => {
  // Add language from HTML tag
  data.language = document.documentElement.lang || 'ru';
  const message = formatAuditMessage(data);
  return await sendToTelegram(message);
};
