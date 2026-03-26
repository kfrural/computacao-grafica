import * as THREE from 'three';

export const initChallenge = (container: HTMLElement) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Cone com 4 faces vira uma pirâmide
    const geometry = new THREE.ConeGeometry(1, 2, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
    const pyramid = new THREE.Mesh(geometry, material);
    scene.add(pyramid);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        
        // Transformação de Escala pulsante
        const scale = 1 + Math.sin(Date.now() * 0.005) * 0.5;
        pyramid.scale.set(scale, scale, scale);
        pyramid.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
    animate();
};
