const lang = (document.documentElement.getAttribute('lang') || 'ru').toLowerCase();
const isEnglish = lang.startsWith('en');
const isFrench = lang.startsWith('fr');

let auditCountries = {
    'cyprus': {
        name: isEnglish ? 'Cyprus' : isFrench ? 'Chypre' : 'Кипр',
        flag: '🇨🇾',
        title: isEnglish ? 'Audit in Cyprus' : isFrench ? 'Audit à Chypre' : 'Аудит на Кипре'
    },
    'malta': {
        name: isEnglish ? 'Malta' : isFrench ? 'Malte' : 'Мальта',
        flag: '🇲🇹',
        title: isEnglish ? 'Audit in Malta' : isFrench ? 'Audit à Malte' : 'Аудит в Мальте'
    },
    'singapore': {
        name: isEnglish ? 'Singapore' : isFrench ? 'Singapour' : 'Сингапур',
        flag: '🇸🇬',
        title: isEnglish ? 'Audit in Singapore' : isFrench ? 'Audit à Singapour' : 'Аудит в Сингапуре'
    },
    'hongkong': {
        name: isEnglish ? 'Hong Kong' : isFrench ? 'Hong Kong' : 'Гонконг',
        flag: '🇭🇰',
        title: isEnglish ? 'Audit in Hong Kong' : isFrench ? 'Audit à Hong Kong' : 'Аудит в Гонконге'
    },
    'uae': {
        name: isEnglish ? 'UAE' : isFrench ? 'EAU' : 'ОАЭ',
        flag: '🇦🇪',
        title: isEnglish ? 'Audit in the UAE' : isFrench ? 'Audit aux EAU' : 'Аудит в ОАЭ'
    },
    'uk': {
        name: isEnglish ? 'United Kingdom' : isFrench ? 'Royaume-Uni' : 'Великобритания',
        flag: '🇬🇧',
        title: isEnglish ? 'Audit in the UK' : isFrench ? 'Audit au Royaume-Uni' : 'Аудит в Великобритании'
    },
    'estonia': {
        name: isEnglish ? 'Estonia' : isFrench ? 'Estonie' : 'Эстония',
        flag: '🇪🇪',
        title: isEnglish ? 'Audit in Estonia' : isFrench ? 'Audit en Estonie' : 'Аудит в Эстонии'
    },
    'switzerland': {
        name: isEnglish ? 'Switzerland' : isFrench ? 'Suisse' : 'Швейцария',
        flag: '🇨🇭',
        title: isEnglish ? 'Audit in Switzerland' : isFrench ? 'Audit en Suisse' : 'Аудит в Швейцарии'
    }
};

function formatAuditTitle(name) {
    if (!name) return isEnglish ? 'Audit' : isFrench ? 'Audit' : 'Аудит';
    if (isEnglish) return `Audit in ${name}`;
    if (isFrench) return `Audit en ${name}`;
    return `Аудит в ${name}`;
}

window.setAuditModalData = function(countries) {
    if (!Array.isArray(countries)) return;
    const mapped = {};

    countries.forEach(country => {
        if (!country) return;
        const id = country.id || (country.name ? country.name.toLowerCase().replace(/\s+/g, '-') : '');
        if (!id) return;
        mapped[id] = {
            name: country.name || country.title || '',
            flag: country.flag || '🏳️',
            title: country.modalTitle || formatAuditTitle(country.name || country.title)
        };
    });

    if (Object.keys(mapped).length > 0) {
        auditCountries = mapped;
    }
};

if (typeof window.getAuditCountries === 'function') {
    window.setAuditModalData(window.getAuditCountries());
}

// Открытие модального окна
function openAuditModal(countryId) {
    const modal = document.getElementById('audit-modal');
    const flagEl = document.getElementById('audit-modal-flag');
    const titleEl = document.getElementById('audit-modal-title');
    const countryEl = document.getElementById('audit-country');
    const country = auditCountries[countryId] || auditCountries[Object.keys(auditCountries).find(key => key === countryId)];
    if (!country) {
        console.warn('Не найдена страна для модального окна аудита', countryId);
        return;
    }
    
    // Обновляем содержимое модального окна
    flagEl.textContent = country.flag || '🏳️';
    titleEl.textContent = country.title || formatAuditTitle(country.name);
    countryEl.value = country.name || '';
    
    // Показываем модальное окно
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeAuditModal() {
    const modal = document.getElementById('audit-modal');
    const form = document.getElementById('audit-form');
    const successEl = document.getElementById('audit-success');
    
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Сброс формы и скрытие сообщения об успехе
    form.reset();
    form.style.display = 'block';
    successEl.style.display = 'none';
}

// Обработка отправки формы
document.addEventListener('DOMContentLoaded', function() {
    const auditForm = document.getElementById('audit-form');
    const modal = document.getElementById('audit-modal');
    
    if (auditForm) {
        auditForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(auditForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company') || 'Не указано',
                message: formData.get('message') || 'Без комментариев',
                country: formData.get('country')
            };
            
            try {
                // Отправляем в Telegram
                await window.sendAuditToTelegram(data);
                
                // Показываем сообщение об успехе
                auditForm.style.display = 'none';
                document.getElementById('audit-success').style.display = 'block';
                
                // Автоматически закрываем через 5 секунд
                setTimeout(() => {
                    closeAuditModal();
                }, 5000);
                
            } catch (error) {
                console.error('Ошибка при отправке:', error);
                alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
            }
        });
    }
    
    // Закрытие по клику вне модального окна
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAuditModal();
            }
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeAuditModal();
        }
    });
});
