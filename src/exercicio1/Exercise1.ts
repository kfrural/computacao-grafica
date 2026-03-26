import * as THREE from 'three';

export const initExercise1 = (container: HTMLElement) => {
    // 1. Configuração Básica e Cena
    const scene = new THREE.Scene();
    
    // Usaremos PerspectiveCamera para profundidade 3D
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Antialias para bordas suaves
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Melhoria em telas retina
    container.appendChild(renderer.domElement);

    // 2. Luzes (Essencial para sombreamento e volume)
    // Uma luz ambiente suave para clarear as sombras
    const ambientLight = new THREE.AmbientLight(0x404040, 2); 
    scene.add(ambientLight);

    // Uma luz direcional simulando o sol para criar sombras e realces
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5); // Posicionada acima e à direita
    scene.add(directionalLight);

    // 3. Helpers e Eixos (Centralizados como na imagem)
    const axesHelper = new THREE.AxesHelper(5);
    // As cores padrão são: X (vermelho), Y (verde), Z (azul)
    scene.add(axesHelper);

    // 4. Objetos (Usando MeshStandardMaterial para responder à luz)

    // a. Plane (O grande plano verde inclinado ao fundo)
    // A imagem mostra um plano bem grande e inclinado.
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
    );
    // Posicionamento e Rotação para alinhar com a imagem
    plane.position.set(3, 3, -1); // Levemente para trás e para cima
    plane.rotation.y = -Math.PI / 4; // Rotacionado 45 graus para "entrar" na cena
    scene.add(plane);

    // b. Box (O cubo azul à esquerda)
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    // Posicionamento exato baseado na imagem
    box.position.set(-2, 1.5, 0); 
    scene.add(box);

    // c. Sphere (A esfera rosa central)
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 64, 64), // Mais segmentos para suavidade
        new THREE.MeshStandardMaterial({ color: 0xff69b4 })
    );
    // Posicionamento central, levemente elevado
    sphere.position.set(0, 0.8, 0);
    scene.add(sphere);

    // 5. Câmera (Perspectiva Elevada e Inclinada)
    // A câmera está posicionada no alto e olhando para a origem (0,0,0)
    camera.position.set(4, 3, 6); 
    camera.lookAt(0, 0, 0); // Focar no ponto onde os eixos se cruzam

    // 6. Ciclo de Renderização
    function animate() {
        requestAnimationFrame(animate);
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

    // Retornar função de limpeza (opcional, mas boa prática)
    return () => {
        window.removeEventListener('resize', onWindowResize);
        // Desalocar geometrias/materiais/texturas para evitar vazamentos de memória
        renderer.dispose();
        plane.geometry.dispose();
        (plane.material as THREE.Material).dispose();
        box.geometry.dispose();
        (box.material as THREE.Material).dispose();
        sphere.geometry.dispose();
        (sphere.material as THREE.Material).dispose();
    };
};
