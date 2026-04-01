import * as THREE from 'three';

export const initExercise1 = (container: HTMLElement) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Eixos cruzando a cena (X vermelho, Y verde, Z azul)
    const axesHelper = new THREE.AxesHelper(8);
    scene.add(axesHelper);

    // Quadrado verde no plano XY (linhas verde e vermelha)
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(3.8, 3.8),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
    );
    plane.position.set(3.5, 2.8, 0);
    plane.rotation.set(0, 0, 0);
    scene.add(plane);

    // Cubo azul no plano YZ (linhas verde e azul): x = 0
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );
    box.position.set(0, 1.8, 2.2);
    box.rotation.set(0.25, -0.55, 0.18);
    scene.add(box);

    // Esfera rosa exatamente na origem
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0xff66b6 })
    );
    sphere.position.set(0, 0, 0);
    scene.add(sphere);

    // Câmera com foco na origem
    camera.position.set(4.4, 3.1, 7);
    camera.lookAt(0, 0, 0);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
        window.removeEventListener('resize', onWindowResize);
        renderer.dispose();
        plane.geometry.dispose();
        (plane.material as THREE.Material).dispose();
        box.geometry.dispose();
        (box.material as THREE.Material).dispose();
        sphere.geometry.dispose();
        (sphere.material as THREE.Material).dispose();
    };
};
