import * as THREE from 'three';

export const initExercise3 = (container: HTMLElement) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const paddleGeom = new THREE.BoxGeometry(0.2, 1.5, 0.1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const p1 = new THREE.Mesh(paddleGeom, mat);
    p1.position.x = -4;
    const p2 = new THREE.Mesh(paddleGeom, mat);
    p2.position.x = 4;
    
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));

    scene.add(p1, p2, ball);
    camera.position.z = 5;

    // Controles do jogador
    const keys: { [key: string]: boolean } = {};
    window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

    let ballVelX = 0.08;
    let ballVelY = 0.05;
    const ballSpeed = 0.08;
    const maxBallSpeed = 0.15;
    const paddleSpeed = 0.15;

    function animate() {
        requestAnimationFrame(animate);

        // Controle do jogador 1 (esquerda) - W e S
        if (keys['w'] && p1.position.y < 3) p1.position.y += paddleSpeed;
        if (keys['s'] && p1.position.y > -3) p1.position.y -= paddleSpeed;

        // Controle do jogador 2 (direita) - Setas para cima/baixo
        if (keys['arrowup'] && p2.position.y < 3) p2.position.y += paddleSpeed;
        if (keys['arrowdown'] && p2.position.y > -3) p2.position.y -= paddleSpeed;

        // Movimento da bola
        ball.position.x += ballVelX;
        ball.position.y += ballVelY;

        // Colisão nas paredes verticais (Y)
        if (ball.position.y > 4 || ball.position.y < -4) {
            ballVelY *= -1;
        }

        // Colisão com raquete 1
        if (ball.position.x < -3.8 && ball.position.x > -4.2 &&
            ball.position.y > p1.position.y - 0.8 && ball.position.y < p1.position.y + 0.8) {
            ballVelX = Math.abs(ballVelX);
            ballVelY += (ball.position.y - p1.position.y) * 0.2;
            // Limita a velocidade
            const speed = Math.sqrt(ballVelX * ballVelX + ballVelY * ballVelY);
            if (speed > maxBallSpeed) {
                ballVelX = (ballVelX / speed) * maxBallSpeed;
                ballVelY = (ballVelY / speed) * maxBallSpeed;
            }
        }

        // Colisão com raquete 2
        if (ball.position.x > 3.8 && ball.position.x < 4.2 &&
            ball.position.y > p2.position.y - 0.8 && ball.position.y < p2.position.y + 0.8) {
            ballVelX = -Math.abs(ballVelX);
            ballVelY += (ball.position.y - p2.position.y) * 0.2;
            // Limita a velocidade
            const speed = Math.sqrt(ballVelX * ballVelX + ballVelY * ballVelY);
            if (speed > maxBallSpeed) {
                ballVelX = (ballVelX / speed) * maxBallSpeed;
                ballVelY = (ballVelY / speed) * maxBallSpeed;
            }
        }

        // Reset se sair da tela
        if (Math.abs(ball.position.x) > 5) {
            ball.position.set(0, 0, 0);
            ballVelX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
            ballVelY = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        }

        renderer.render(scene, camera);
    }
    animate();
};
