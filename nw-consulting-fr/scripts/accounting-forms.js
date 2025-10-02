// Données des services
const services = {
    'audit-calculations': {
        title: 'Préparation des calculs pour l\'audit',
        subtitle: 'Nous préparerons tous les calculs nécessaires et les documents pour réussir l\'audit',
        icon: `<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>`
    },
    'accounting-restore': {
        title: 'Restauration de la comptabilité',
        subtitle: 'Nous restaurerons la comptabilité pour toute période. Nous remettrons les documents en ordre',
        icon: `<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>`
    },
    'docs-requirements': {
        title: 'Exigences pour les documents',
        subtitle: 'Consultation sur les exigences relatives aux documents pour la préparation des calculs et des rapports',
        icon: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>`
    }
};

// Ouverture de la modal
function openServiceModal(serviceId) {
    const modal = document.getElementById('service-modal');
    const titleEl = document.getElementById('service-modal-title');
    const subtitleEl = document.getElementById('service-modal-subtitle');
    const iconEl = modal.querySelector('.modal__icon svg');
    const serviceTypeEl = document.getElementById('service-type');
    
    const service = services[serviceId];
    if (!service) return;
    
    // Mise à jour du contenu de la modal
    titleEl.textContent = service.title;
    subtitleEl.textContent = service.subtitle;
    iconEl.innerHTML = service.icon;
    serviceTypeEl.value = service.title;
    
    // Affichage de la modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Fermeture de la modal
function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    const form = document.getElementById('service-form');
    const successEl = document.getElementById('service-success');
    
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Reset du formulaire et masquage du message de succès
    form.reset();
    form.style.display = 'block';
    successEl.style.display = 'none';
}

// Gestion de la soumission du formulaire
document.addEventListener('DOMContentLoaded', function() {
    const serviceForm = document.getElementById('service-form');
    const modal = document.getElementById('service-modal');
    
    if (serviceForm) {
        serviceForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(serviceForm);
            const data = {
                source: 'Services',
                type: 'service',
                language: document.documentElement.lang || 'fr',
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company'),
                service: formData.get('service'),
                message: formData.get('message')
            };
            
            try {
                const response = await fetch('https://nwconsulting.ru/proxy.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Affichage du message de succès
                    serviceForm.style.display = 'none';
                    document.getElementById('service-success').style.display = 'block';
                    
                    // Fermeture automatique après 3 secondes
                    setTimeout(() => {
                        closeServiceModal();
                    }, 3000);
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur s\'est produite lors de l\'envoi du formulaire. Veuillez réessayer ou nous contacter directement.');
            }
        });
    }
    
    // Fermeture par clic en dehors
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeServiceModal();
            }
        });
    }
    
    // Fermeture par Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeServiceModal();
        }
    });
});
