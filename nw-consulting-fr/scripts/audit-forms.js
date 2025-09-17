// Данные depuisтран для аудита
const auditCountries = {
    'cyprus': {
        name: 'Chypre',
        flag: '🇨🇾',
        title: 'Audit на Chypreе'
    },
    'malta': {
        name: 'Malte',
        flag: '🇲🇹',
        title: 'Audit в Мальте'
    },
    'singapore': {
        name: 'Singapour',
        flag: '🇸🇬',
        title: 'Audit в Singapourе'
    },
    'hongkong': {
        name: 'Hong Kong',
        flag: '🇭🇰',
        title: 'Audit в Hong Kongе'
    },
    'uae': {
        name: 'ÉAU',
        flag: '🇦🇪',
        title: 'Audit в ÉAU'
    },
    'uk': {
        name: 'Royaume-Uni',
        flag: '🇬🇧',
        title: 'Audit в Великобритании'
    },
    'estonia': {
        name: 'Estonie',
        flag: '🇪🇪',
        title: 'Audit в Эdepuisтонии'
    },
    'switzerland': {
        name: 'Suisse',
        flag: '🇨🇭',
        title: 'Audit в Швейцарии'
    }
};

// Ouverture модального окна
function openAuditModal(countryId) {
    const modal = document.getElementById('audit-modal');
    const flagEl = document.getElementById('audit-modal-flag');
    const titleEl = document.getElementById('audit-modal-title');
    const countryEl = document.getElementById('audit-country');
    
    const country = auditCountries[countryId];
    if (!country) return;
    
    // Обновляем depuisодержимое модального окна
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
    
    // Сброdepuis формы и depuisкрытие depuisообщения об уdepuisпехе
    form.reset();
    form.style.display = 'block';
    successEl.style.display = 'none';
}

// Обрабà partir deка à partir deправки формы
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
                
                // Показываем depuisообщение об уdepuisпехе
                auditForm.style.display = 'none';
                document.getElementById('audit-success').style.display = 'block';
                
                // Автоматичеdepuisки закрываем через 5 depuisекунд
                setTimeout(() => {
                    closeAuditModal();
                }, 5000);
                
            } catch (error) {
                console.error('Ошибка при à partir deправке:', error);
                alert('Произошла ошибка при à partir deправке формы. Пожалуйdepuisта, попробуйте еще раз или depuisвяжитеdepuisь depuis нами напрямую.');
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
