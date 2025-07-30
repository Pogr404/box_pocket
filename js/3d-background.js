// Проверяем, что все нужные компоненты Three.js загружены
if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {

    // 1. Настройка сцены, камеры и рендерера
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg-canvas'),
        alpha: true // Делаем фон рендерера прозрачным
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(5);

    // 2. Настройка освещения
    const pointLight = new THREE.PointLight(0xffffff, 2, 100); // Увеличиваем интенсивность света
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Увеличиваем интенсивность фонового света
    scene.add(pointLight, ambientLight);

    // Переменная для хранения нашей модели
    let boxModel;

    // 3. Загрузка 3D-модели
    const loader = new THREE.GLTFLoader();
    loader.load(
        'model/korobka.glb', // Путь к вашей модели
        function (gltf) {
            boxModel = gltf.scene;
            boxModel.scale.set(1.5, 1.5, 1.5); // Немного увеличим модель
            scene.add(boxModel);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    // 4. Создание анимационного цикла
    function animate() {
        requestAnimationFrame(animate);

        // Медленно вращаем модель, если она уже загрузилась
        if (boxModel) {
            boxModel.rotation.x += 0.001;
            boxModel.rotation.y += 0.001;
        }

        renderer.render(scene, camera);
    }

    animate();

    // 5. Адаптация под размер окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

}// Проверяем, что все нужные компоненты Three.js загружены
if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {

    // 1. Настройка сцены, камеры и рендерера
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg-canvas'),
        alpha: true // Делаем фон рендерера прозрачным
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(5);

    // 2. Настройка освещения
    const pointLight = new THREE.PointLight(0xffffff, 2, 100); // Увеличиваем интенсивность света
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Увеличиваем интенсивность фонового света
    scene.add(pointLight, ambientLight);

    // Переменная для хранения нашей модели
    let boxModel;

    // 3. Загрузка 3D-модели
    const loader = new THREE.GLTFLoader();
    loader.load(
        'model/korobka.glb', // Путь к вашей модели
        function (gltf) {
            boxModel = gltf.scene;
            boxModel.scale.set(1.5, 1.5, 1.5); // Немного увеличим модель
            scene.add(boxModel);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    // 4. Создание анимационного цикла
    function animate() {
        requestAnimationFrame(animate);

        // Медленно вращаем модель, если она уже загрузилась
        if (boxModel) {
            boxModel.rotation.x += 0.001;
            boxModel.rotation.y += 0.001;
        }

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