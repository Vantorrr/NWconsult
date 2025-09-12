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
      // Успех/ошибку отследить нельзя надёжно, поэтому завершаем в любом случае
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true);
      img.referrerPolicy = 'no-referrer';
      img.src = url + `&t=${Date.now()}`; // cache buster
      // На всякий случай ограничим ожидание
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
  
  return `🏢 <b>НОВАЯ ЗАЯВКА НА РЕГИСТРАЦИЮ</b>

📍 <b>Страна:</b> ${data.country}
👤 <b>Клиент:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
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
  
  return `🏦 <b>НОВАЯ ЗАЯВКА НА ОТКРЫТИЕ СЧЕТА</b>

🏛 <b>Банк:</b> ${data.bank}
👤 <b>Клиент:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
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
  
  return `📞 <b>НОВАЯ ЗАЯВКА С САЙТА</b>

👤 <b>Клиент:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
${data.phone ? `📱 <b>Телефон:</b> ${data.phone}` : ''}
${data.message ? `💬 <b>Сообщение:</b> ${data.message}` : ''}

🕐 <i>${timestamp}</i>`;
}

// Export functions
window.sendRegistrationToTelegram = async (formData) => {
  const data = Object.fromEntries(formData);
  const message = formatRegistrationMessage(data);
  return await sendToTelegram(message);
};

window.sendBankToTelegram = async (formData) => {
  const data = Object.fromEntries(formData);
  const message = formatBankMessage(data);
  return await sendToTelegram(message);
};

window.sendContactToTelegram = async (formData) => {
  const data = Object.fromEntries(formData);
  const message = formatContactMessage(data);
  return await sendToTelegram(message);
};
