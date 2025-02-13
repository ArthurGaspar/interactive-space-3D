function initSolarSystem() {
    const container = document.getElementById('scene-container');
    container.style.display = 'block';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        logarithmicDepthBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.physicallyCorrectLights = true;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 2, 5);
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(-10000, 0, 0);
    scene.add(directionalLight);

    function focusOnPosition(x, y, z, zoom) {
        const offset = zoom || 200;
        camera.position.set(
            x + offset,
            y + offset * 0.3,
            z + offset
        );
        controls.target.set(x, y, z);
        controls.update();
        // test: focusOnPosition(AU * 8.58, 0, 0) focus on saturn, for example
    }

    /* PLACEHOLDER
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    // */

    /* PLACEHOLDER
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // */

    const loader = new THREE.GLTFLoader();

    function loadModel(path, scale, position) {
        loader.load(
            path, // .gltf or .glb 
            function(gltf) {
                const model = gltf.scene;

                console.log('Full model structure:', JSON.stringify(model.toJSON(), null, 2));

                /* placeholder yellow box
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                
                const boxHelper = new THREE.Box3Helper(box, 0xffff00);
                scene.add(boxHelper);
                // */

                model.traverse((child) => {
                    if (child.isMesh) {
                        console.log('Found mesh:', child.name);
                        console.log('Original material:', child.material);
                        
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // geometry log (delete)
                        console.log('Geometry vertices:', child.geometry.attributes.position.count);
                        console.log('Geometry type:', child.geometry.type);
                        console.log('Geometry attributes:', Object.keys(child.geometry.attributes));
                        
                        child.geometry.computeVertexNormals();
                        child.geometry.computeBoundingSphere();
                        child.geometry.computeBoundingBox();
                    }
                });
                model.scale.set(scale, scale, scale);
                model.position.set(position.x, position.y, position.z);
                scene.add(model);
                console.log('Model loaded:', model);
            },
            function(xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function(error) {
                console.error('An error occurred loading the model:', error);
            }
        );
    }

    const AU = 1000;
    loadModel('public/neptune.glb', 5, { x: AU * 29.07, y: 0, z: 0 });
    loadModel('public/uranus.glb', 5, { x: AU * 18.22, y: 0, z: 0 });
    loadModel('public/saturn.glb', 5, { x: AU * 8.58, y: 0, z: 0 });
    loadModel('public/jupiter.glb', 5, { x: AU * 4.20, y: 0, z: 0 });
    loadModel('public/mars.glb', 5, { x: AU * 0.52, y: 0, z: 0 });
    loadModel('public/moon.glb', 5, { x: 0, y: AU * 0.01, z: 0 });
    loadModel('public/earth.glb', 5, { x: 0, y: 0, z: 0 });
    loadModel('public/venus.glb', 5, { x: AU * -0.28, y: 0, z: 0});
    loadModel('public/mercury.glb', 5, { x: AU * -0.61, y: 0, z: 0 });
    loadModel('public/sun.glb', 5, { x: AU * -1, y: 0, z: AU });

    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const planetPositions = {
        sun: { position: { x: AU * -1, y: 0, z: AU }, zoom: 100 },
        mercury: { position: { x: AU * -0.61, y: 0, z: 0 }, zoom: 1 },
        venus: { position: { x: AU * -0.28, y: 0, z: 0 }, zoom: 1 },
        earth: { position: { x: 0, y: 0, z: 0 }, zoom: 1 },
        moon: { position: { x: 0, y: AU * 0.01, z: 0 }, zoom: 1 },
        mars: { position: { x: AU * 0.52, y: 0, z: 0 }, zoom: 1 },
        jupiter: { position: { x: AU * 4.20, y: 0, z: 0 }, zoom: 10 },
        saturn: { position: { x: AU * 8.58, y: 0, z: 0 }, zoom: 10 },
        uranus: { position: { x: AU * 18.22, y: 0, z: 0 }, zoom: 10 },
        neptune: { position: { x: AU * 29.07, y: 0, z: 0 }, zoom: 10 }
    };
    
    window.focusOnPlanet = (planetName) => {
        const config = planetPositions[planetName];
        if (config) {
            const { position, zoom } = config;
            focusOnPosition(position.x, position.y, position.z, zoom);
        }
    };
    
    window.exitScene = () => {
        document.getElementById('scene-container').style.display = 'none';
        document.getElementById('main').style.display = 'block';
    };

    animate();
}