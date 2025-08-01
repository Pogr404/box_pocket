// Ждем, пока вся HTML-структура страницы будет готова
document.addEventListener('DOMContentLoaded', () => {
    // --- КОД ДЛЯ ПЕРЕКЛЮЧЕНИЯ ТЕМ ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themes = ['light', 'dark', 'glass'];
    const applyTheme = (theme) => {
        body.classList.remove('dark-mode', 'glass-mode');
        if (theme === 'dark') { body.classList.add('dark-mode'); } 
        else if (theme === 'glass') { body.classList.add('glass-mode'); }
    };
    let currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);
    themeToggle.addEventListener('click', () => {
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        currentTheme = newTheme;
    });

    // --- КОД ДЛЯ СВОРАЧИВАНИЯ ШАПКИ (Intersection Observer) ---
    const header = document.querySelector('header');
    const trigger = document.createElement('div');
    trigger.style.position = 'absolute';
    trigger.style.top = '50px';
    header.after(trigger);
    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }, { threshold: [0] });
    observer.observe(trigger);

    // --- КОД ДЛЯ ГИРОСКОПИЧЕСКОГО ПАРАЛЛАКСА ---
    function initGyroParallax() {
        const bg = document.querySelector('.hero-background');
        if (!bg) return;
        const handleOrientation = (event) => {
            const beta = event.beta; const gamma = event.gamma;
            const moveX = Math.max(-20, Math.min(20, gamma / 2));
            const moveY = Math.max(-20, Math.min(20, beta / 3));
            requestAnimationFrame(() => { bg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`; });
        };
        if (window.DeviceOrientationEvent) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                const permissionButton = document.getElementById('gyro-permission-button');
                permissionButton.style.display = 'inline-block';
                permissionButton.addEventListener('click', () => {
                    DeviceOrientationEvent.requestPermission()
                        .then(permissionState => { if (permissionState === 'granted') { window.addEventListener('deviceorientation', handleOrientation); permissionButton.style.display = 'none'; } })
                        .catch(console.error);
                });
            } else { window.addEventListener('deviceorientation', handleOrientation); }
        }
    }
    initGyroParallax();

    // --- КОД ДЛЯ ЭФФЕКТА ПАДАЮЩИХ КОРОБОЧЕК ---
    let canCreateParticle = true;
    document.addEventListener('mousemove', function(e) {
        if (!canCreateParticle) return;
        canCreateParticle = false;
        createParticle(e.clientX, e.clientY);
        setTimeout(() => { canCreateParticle = true; }, 50);
    });
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle-box';
        const offsetX = (Math.random() - 0.5) * 20; const offsetY = (Math.random() - 0.5) * 20;
        particle.style.left = `${x + offsetX}px`; particle.style.top = `${y + offsetY}px`;
        const randomScale = Math.random() * 0.5 + 0.5;
        particle.style.transform = `scale(${randomScale})`;
        particle.style.animationDuration = `${Math.random() * 1 + 1}s`;
        document.body.appendChild(particle);
        particle.addEventListener('animationend', () => { particle.remove(); });
    }

    // --- ЗАГРУЗКА ДАННЫХ ИЗ CONFIG.JSON ---
    const configPath = 'config.json';
    fetch(configPath)
        .then(response => { if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); } return response.json(); })
        .then(data => { buildWebsite(data); })
        .catch(error => { console.error("Could not load config file:", error); document.body.innerHTML = '<h1 style="text-align:center; margin-top: 50px;">Ошибка загрузки конфигурации сайта.</h1>'; });
});


// --- ФУНКЦИИ УВЕДОМЛЕНИЙ И ОТПРАВКИ ФОРМЫ ---
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<div class="icon"></div><span>${message}</span>`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.add('show'); }, 100);
    setTimeout(() => { notification.classList.remove('show'); setTimeout(() => { document.body.removeChild(notification); }, 500); }, 4000);
}
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('button');
    const originalButtonText = button.textContent;
    const serviceID = 'service_iyq10xz';
    const templateID = 'template_leob7ri';
    const publicKey = 'jJ6WclhTKvXEfYgyb';
    button.textContent = 'Отправка...'; button.disabled = true;
    emailjs.sendForm(serviceID, templateID, form, publicKey)
        .then(() => { showNotification('Запрос принят, спасибо!'); form.reset(); }, 
              (err) => { showNotification('Произошла ошибка. Попробуйте снова.', 'error'); console.error('EmailJS error:', JSON.stringify(err)); })
        .finally(() => { button.textContent = originalButtonText; button.disabled = false; });
}

// --- НОВАЯ УМНАЯ ФУНКЦИЯ ДЛЯ ПУТЕЙ К КАРТИНКАМ ---
function normalizeImagePath(path) {
    if (!path) return 'images/placeholder.png';
    // Убираем возможный слэш в начале
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Если папки 'images' нет, добавляем ее
    if (!cleanPath.startsWith('images/')) {
        cleanPath = `images/${cleanPath}`;
    }
    return cleanPath;
}

// --- ОСНОВНАЯ ФУНКЦИЯ ПОСТРОЕНИЯ САЙТА ---
function buildWebsite(data) {
    // Заполнение шапки, футера и прочих секций
    document.title = data.header.logoText;
    document.getElementById('logo-text').textContent = data.header.logoText;
    document.getElementById('slogan-text').textContent = data.header.slogan;
    const headerPhone = document.getElementById('header-phone');
    headerPhone.textContent = data.header.phone;
    headerPhone.href = `tel:${data.header.phone.replace(/\s/g, '')}`;
    const headerEmail = document.getElementById('header-email');
    headerEmail.textContent = data.header.email;
    headerEmail.href = `mailto:${data.header.email}`;
    const footerPhone = document.getElementById('footer-phone');
    footerPhone.textContent = data.header.phone;
    footerPhone.href = `tel:${data.header.phone.replace(/\s/g, '')}`;
    const footerEmail = document.getElementById('footer-email');
    footerEmail.textContent = data.header.email;
    footerEmail.href = `mailto:${data.header.email}`;
    document.getElementById('hero-section').style.backgroundImage = `url(${normalizeImagePath(data.hero.backgroundImage)})`;
    document.getElementById('hero-headline').textContent = data.hero.headline;
    document.getElementById('hero-cta').textContent = data.hero.callToAction;
    document.getElementById('collection-title').textContent = data.collection.title;
    document.getElementById('about-title').textContent = data.about.title;
    document.getElementById('about-text').textContent = data.about.text;
    if (data.model) {
        document.getElementById('model-title').textContent = data.model.title;
        document.getElementById('model-text').textContent = data.model.text;
    }
    document.getElementById('contact-title').textContent = data.contact.title;
    const contactPhone = document.getElementById('contact-phone');
    contactPhone.textContent = `Телефон: ${data.header.phone}`;
    contactPhone.href = `tel:${data.header.phone.replace(/\s/g, '')}`;
    const contactEmail = document.getElementById('contact-email');
    contactEmail.textContent = `Email: ${data.header.email}`;
    contactEmail.href = `mailto:${data.header.email}`;
    document.getElementById('contact-address').textContent = `Адрес: ${data.contact.address}`;
    document.getElementById('form-button').textContent = data.contact.formButtonText;
    document.getElementById('copyright-text').textContent = data.footer.copyright;
    const socialContainer = document.getElementById('social-icons-container');
    socialContainer.innerHTML = `<a href="${data.footer.social.instagram_url}" target="_blank">Instagram</a><a href="${data.footer.social.pinterest_url}" target="_blank">Pinterest</a><a href="${data.footer.social.facebook_url}" target="_blank">Facebook</a>`;
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleFormSubmit);

    // --- ЛОГИКА ДЛЯ ИНТЕРАКТИВНОЙ ГАЛЕРЕИ (МОДАЛЬНОЕ ОКНО) ---
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = ''; 
    data.collection.items.forEach((item, index) => {
        if (!item.id) { item.id = `temp_${index}`; }
        
        let firstImage = 'images/placeholder.png'; 
        if (item.images && Array.isArray(item.images) && item.images.length > 0) {
            firstImage = normalizeImagePath(item.images[0]); // Используем новую функцию
        }
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        galleryItem.innerHTML = `
            <img src="${firstImage}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
            </div>
        `;
        galleryContainer.appendChild(galleryItem);
        galleryItem.addEventListener('click', () => openModal(item));
    });
}


// --- ФУНКЦИИ ДЛЯ МОДАЛЬНОГО ОКНА (ИСПРАВЛЕНО) ---
const modalContainer = document.getElementById('modal-container');
const modalContent = modalContainer.querySelector('.modal-content');

function openModal(itemData) {
    let characteristicsHTML = '';
    if (itemData.characteristics && Object.keys(itemData.characteristics).length > 0) {
        characteristicsHTML += '<div class="modal-characteristics"><h3>Характеристики</h3><ul>';
        for (const [key, value] of Object.entries(itemData.characteristics)) {
            characteristicsHTML += `<li><strong>${key}</strong> <span>${value}</span></li>`;
        }
        characteristicsHTML += '</ul></div>';
    }

    const has3DModel = itemData.model_glb;
    const hasImages = itemData.images && Array.isArray(itemData.images) && itemData.images.length > 0;
    
    // По умолчанию всегда показываем ПЕРВОЕ ФОТО
    const firstImage = hasImages ? normalizeImagePath(itemData.images[0]) : 'images/placeholder.png';
    let mainViewerHTML = `<img class="modal-main-image" src="${firstImage}" alt="Главное фото товара">`;

    // Создаем превью (thumbnails)
    let thumbnailsHTML = '';
    if (hasImages) {
        itemData.images.forEach((imgSrc, index) => {
            const fullImgSrc = normalizeImagePath(imgSrc);
            thumbnailsHTML += `<img src="${fullImgSrc}" class="${index === 0 ? 'active' : ''}" data-type="image" alt="Миниатюра товара">`;
        });
    }
    if (has3DModel) {
        thumbnailsHTML += `<div class="thumb-3d" data-type="3d">3D</div>`;
    }

    modalContent.innerHTML = `
        <button class="modal-close">&times;</button>
        <div class="modal-body">
            <div class="modal-gallery">
                <div id="main-viewer-container">${mainViewerHTML}</div>
                <div class="modal-thumbnails">${thumbnailsHTML}</div>
            </div>
            <div class="modal-details">
                <h2>${itemData.name}</h2>
                <p>${itemData.description}</p>
                ${characteristicsHTML}
            </div>
        </div>
    `;
    
    modalContainer.classList.add('visible');

    modalContainer.querySelector('.modal-close').addEventListener('click', closeModal);
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) { closeModal(); }
    });

    const mainViewerContainer = modalContent.querySelector('#main-viewer-container');
    const allThumbnails = modalContent.querySelectorAll('.modal-thumbnails > *');

    allThumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            allThumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            if (thumb.dataset.type === '3d') {
                mainViewerContainer.innerHTML = `
                    <model-viewer class="modal-main-image" 
                        src="${normalizeImagePath(itemData.model_glb)}"
                        auto-rotate
                        alt="3D модель ${itemData.name}">
                    </model-viewer>`;
            } else {
                mainViewerContainer.innerHTML = `<img class="modal-main-image" src="${thumb.src}" alt="Фото товара">`;
            }
        });
    });
}

function closeModal() {
    modalContainer.classList.remove('visible');
    setTimeout(() => { modalContent.innerHTML = ''; }, 400);
}