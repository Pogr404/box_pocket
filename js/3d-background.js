// Проверяем, что Three.js загружен
if (typeof THREE !== 'undefined') {

    // 1. Настройка сцены, камеры и рендерера
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg-canvas'),
        alpha: true // Прозрачный фон
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Отодвигаем камеру дальше, чтобы объект был меньше
    camera.position.setZ(10); 

    // 2. Создаем простой куб (вместо сложной модели)
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa,
        roughness: 0.5 
    });
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    // 3. Настройка освещения
    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(10, 10, 10);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(pointLight, ambientLight);

    // 4. Анимационный цикл
    function animate() {
        requestAnimationFrame(animate);

        // Медленно вращаем куб
        box.rotation.x += 0.001;
        box.rotation.y += 0.001;

        renderer.render(scene, camera);
    }
    animate();

    // 5. Адаптация под размер окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}