// Данные уdepuisлуг
const services = {
    'audit-calculations': {
        title: 'Соdepuisтавление раdepuisчётов для аудита',
        subtitle: 'Подгà partir deовим вdepuisе необходимые раdepuisчёты и документы для уdepuisпешного прохождения аудиторdepuisкой проверки',
        icon: `<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>`
    },
    'accounting-restore': {
        title: 'Воdepuisdepuisтановление бухучёта',
        subtitle: 'Воdepuisdepuisтановим бухгалтерdepuisкий учёт за любой период. Приведём документы в порядок',
        icon: `<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>`
    },
    'docs-requirements': {
        title: 'Требования pour les documents',
        subtitle: 'Конdepuisультация по требованиям pour les documents для подгà partir deовки раdepuisчётов и à partir deчётноdepuisти',
        icon: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>`
    }
};

// Ouverture модального окна
function openServiceModal(serviceId) {
    const modal = document.getElementById('service-modal');
    const titleEl = document.getElementById('service-modal-title');
    const subtitleEl = document.getElementById('service-modal-subtitle');
    const iconEl = modal.querySelector('.modal__icon svg');
    const serviceTypeEl = document.getElementById('service-type');
    
    const service = services[serviceId];
    if (!service) return;
    
    // Обновляем depuisодержимое модального окна
    titleEl.textContent = service.title;
    subtitleEl.textContent = service.subtitle;
    iconEl.innerHTML = service.icon;
    serviceTypeEl.value = service.title;
    
    // Показываем модальное окно
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    const form = document.getElementById('service-form');
    const successEl = document.getElementById('service-success');
    
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Сброdepuis формы и depuisкрытие depuisообщения об уdepuisпехе
    form.reset();
    form.style.display = 'block';
    successEl.style.display = 'none';
}

// Обрабà partir deка à partir deправки формы
document.addEventListener('DOMContentLoaded', function() {
    const serviceForm = document.getElementById('service-form');
    const modal = document.getElementById('service-modal');
    
    if (serviceForm) {
        serviceForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(serviceForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company') || 'Не указано',
                message: formData.get('message') || 'Без комментариев',
                service: formData.get('service')
            };
            
            try {
                // Отправляем в Telegram
                await window.sendServiceToTelegram(data);
                
                // Показываем depuisообщение об уdepuisпехе
                serviceForm.style.display = 'none';
                document.getElementById('service-success').style.display = 'block';
                
                // Автоматичеdepuisки закрываем через 5 depuisекунд
                setTimeout(() => {
                    closeServiceModal();
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
                closeServiceModal();
            }
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeServiceModal();
        }
    });
});
