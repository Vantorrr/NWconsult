// Данные стран для аудита
const auditCountries = {
    'cyprus': {
        name: 'Кипр',
        flag: '🇨🇾',
        title: 'Аудит на Кипре'
    },
    'malta': {
        name: 'Мальта',
        flag: '🇲🇹',
        title: 'Аудит в Мальте'
    },
    'singapore': {
        name: 'Сингапур',
        flag: '🇸🇬',
        title: 'Аудит в Сингапуре'
    },
    'hongkong': {
        name: 'Гонконг',
        flag: '🇭🇰',
        title: 'Аудит в Гонконге'
    },
    'uae': {
        name: 'ОАЭ',
        flag: '🇦🇪',
        title: 'Аудит в ОАЭ'
    },
    'uk': {
        name: 'Великобритания',
        flag: '🇬🇧',
        title: 'Аудит в Великобритании'
    },
    'estonia': {
        name: 'Эстония',
        flag: '🇪🇪',
        title: 'Аудит в Эстонии'
    },
    'switzerland': {
        name: 'Швейцария',
        flag: '🇨🇭',
        title: 'Аудит в Швейцарии'
    }
};

// Открытие модального окна
function openAuditModal(countryId) {
    const modal = document.getElementById('audit-modal');
    const flagEl = document.getElementById('audit-modal-flag');
    const titleEl = document.getElementById('audit-modal-title');
    const countryEl = document.getElementById('audit-country');
    
    const country = auditCountries[countryId];
    if (!country) return;
    
    // Обновляем содержимое модального окна
    flagEl.textContent = country.flag;
    titleEl.textContent = country.title;
    countryEl.value = country.name;
    
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
