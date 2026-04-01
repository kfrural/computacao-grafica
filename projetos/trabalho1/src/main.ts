import * as THREE from 'three';
import './style.css';
import { createTerraEsfericaAnimation } from './animations/terraEsferica';
import { createTerraPlanaAnimation } from './animations/terraPlana';

type SceneController = {
  update: (elapsedTime: number) => void;
  dispose: () => void;
};

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('Elemento #app nao encontrado.');
}

const toolbar = document.createElement('div');
toolbar.className = 'toolbar';
const btnTerra = document.createElement('button');
btnTerra.textContent = 'Animacao 1: Terra';
const btnTerraPlana = document.createElement('button');
btnTerraPlana.textContent = 'Animacao 2: Terra Plana';
toolbar.append(btnTerra, btnTerraPlana);
document.body.appendChild(toolbar);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 5.2, 13.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
app.appendChild(renderer.domElement);

const stars = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 })
);
const pointsCount = 800;
const positions = new Float32Array(pointsCount * 3);
for (let i = 0; i < pointsCount; i += 1) {
  const radius = 38 + Math.random() * 18;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = radius * Math.cos(phi);
  positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
}
stars.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
scene.add(stars);

let controller: SceneController | null = null;

const activate = (kind: 'terra' | 'plana') => {
  controller?.dispose();

  if (kind === 'terra') {
    controller = createTerraEsfericaAnimation(scene);
    btnTerra.classList.add('active');
    btnTerraPlana.classList.remove('active');
  } else {
    controller = createTerraPlanaAnimation(scene);
    btnTerraPlana.classList.add('active');
    btnTerra.classList.remove('active');
  }
};

btnTerra.addEventListener('click', () => activate('terra'));
btnTerraPlana.addEventListener('click', () => activate('plana'));

activate('terra');

const clock = new THREE.Clock();
const animate = () => {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  controller?.update(elapsed);
  renderer.render(scene, camera);
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
