import * as THREE from 'three';

export const initExercise2 = (container: HTMLElement) => {
    // 1. Configuração Básica
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 2. Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 3. Objeto (Cubo Verde com Volume)
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.7, 0.7), // Tamanho levemente maior
        new THREE.MeshStandardMaterial({ color: 0x00ff00 }) // Material que reage à luz
    );
    scene.add(cube);

    // 4. Configuração da Câmera
    camera.position.set(0, 0, 7); // Câmera reta, olhando para o centro

    // 5. Variáveis de Animação
    let angle = 0;
    const orbitRadius = 3; // Raio da trajetória circular
    const orbitSpeed = 0.015; // Velocidade de translação
    const rotationSpeed = 0.04; // Velocidade de auto-rotação

    // 6. Ciclo de Animação
    function animate() {
        requestAnimationFrame(animate);

        // a. Atualizar o ângulo para translação
        angle += orbitSpeed;

        // b. Calcular a Translação (Movimento Circular em torno do centro (0,0))
        // Usamos cosseno para X e seno para Y para criar um círculo perfeito no plano XY
        cube.position.x = Math.cos(angle) * orbitRadius;
        cube.position.y = Math.sin(angle) * orbitRadius;
        cube.position.z = 0; // Manter no mesmo plano

        // c. Calcular a Rotação Própria (Girar sobre o próprio eixo)
        // Isso dá a sensação de que o cubo está "rolando" ou girando enquanto orbita
        cube.rotation.x += rotationSpeed;
        cube.rotation.y += rotationSpeed * 0.8; // Rotações em eixos diferentes
        cube.rotation.z += rotationSpeed * 0.5;

        // d. Renderizar a cena
        renderer.render(scene, camera);
    }
    animate();

    // 7. Lidar com Redimensionamento da Janela
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Retornar função de limpeza
    return () => {
        window.removeEventListener('resize', onWindowResize);
        renderer.dispose();
        cube.geometry.dispose();
        (cube.material as THREE.Material).dispose();
    };
};
