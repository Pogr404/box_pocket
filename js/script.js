// Ждем, пока вся HTML-структура страницы будет готова
document.addEventListener('DOMContentLoaded', () => {
    // --- КОД ДЛЯ ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Функция для применения темы
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    };

    // Проверяем, есть ли сохраненная тема в localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Слушаем клик по кнопке
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Сохраняем выбор
    });


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

// --- ОСТАЛЬНЫЕ ФУНКЦИИ (УВЕДОМЛЕНИЯ, ФОРМА И Т.Д.) ---
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
function buildWebsite(data) {
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
    document.getElementById('hero-section').style.backgroundImage = `url(images/${data.hero.backgroundImage})`;
    document.getElementById('hero-headline').textContent = data.hero.headline;
    document.getElementById('hero-cta').textContent = data.hero.callToAction;
    document.getElementById('collection-title').textContent = data.collection.title;
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.innerHTML = ''; 
    data.collection.items.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="images/${item.image}" alt="${item.name}"><div class="item-info"><h3>${item.name}</h3><p>${item.description}</p></div>`;
        galleryContainer.appendChild(galleryItem);
    });
    document.getElementById('about-title').textContent = data.about.title;
    document.getElementById('about-text').textContent = data.about.text;
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
}