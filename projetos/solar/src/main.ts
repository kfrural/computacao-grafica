import * as THREE from 'three';
import './style.css';

type PlanetConfig = {
  name: string;
  size: number;
  distance: number;
  color: number;
  orbitSpeed: number;
  rotationSpeed: number;
};

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('Elemento #app nao encontrado.');
}

const info = document.createElement('div');
info.className = 'ui';
info.innerHTML = 'Sistema Solar (simples)<br/>Arraste para girar a camera';
document.body.appendChild(info);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 14, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
app.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xfff2c1, 2.4, 180);
scene.add(sunLight);

const stars = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.12 })
);
const starCount = 1200;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i += 1) {
  const r = 70 + Math.random() * 50;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = r * Math.cos(phi);
  starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
stars.geometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
scene.add(stars);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2.2, 48, 48),
  new THREE.MeshStandardMaterial({ color: 0xffb300, emissive: 0xff7a00, emissiveIntensity: 1.1 })
);
scene.add(sun);

const planetConfigs: PlanetConfig[] = [
  { name: 'Mercurio', size: 0.32, distance: 4.1, color: 0x9f948a, orbitSpeed: 1.6, rotationSpeed: 0.02 },
  { name: 'Venus', size: 0.55, distance: 5.9, color: 0xd6b783, orbitSpeed: 1.15, rotationSpeed: 0.014 },
  { name: 'Terra', size: 0.58, distance: 8.1, color: 0x2f7cff, orbitSpeed: 1.0, rotationSpeed: 0.025 },
  { name: 'Marte', size: 0.43, distance: 10.2, color: 0xc05b3a, orbitSpeed: 0.82, rotationSpeed: 0.02 },
  { name: 'Jupiter', size: 1.25, distance: 13.6, color: 0xd0aa7b, orbitSpeed: 0.45, rotationSpeed: 0.03 },
  { name: 'Saturno', size: 1.05, distance: 17.2, color: 0xd7c08b, orbitSpeed: 0.34, rotationSpeed: 0.028 },
  { name: 'Urano', size: 0.82, distance: 20.7, color: 0x7bc9d3, orbitSpeed: 0.25, rotationSpeed: 0.022 },
  { name: 'Netuno', size: 0.8, distance: 24.1, color: 0x4d6dff, orbitSpeed: 0.2, rotationSpeed: 0.02 }
];

type PlanetRuntime = {
  config: PlanetConfig;
  pivot: THREE.Object3D;
  mesh: THREE.Mesh;
};

const planets: PlanetRuntime[] = [];

planetConfigs.forEach((config) => {
  const pivot = new THREE.Object3D();
  scene.add(pivot);

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(config.size, 24, 24),
    new THREE.MeshStandardMaterial({ color: config.color })
  );
  planet.position.x = config.distance;
  pivot.add(planet);

  const orbit = new THREE.Mesh(
    new THREE.RingGeometry(config.distance - 0.02, config.distance + 0.02, 128),
    new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide })
  );
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  if (config.name === 'Saturno') {
    const saturnRing = new THREE.Mesh(
      new THREE.RingGeometry(config.size * 1.35, config.size * 2.15, 64),
      new THREE.MeshBasicMaterial({ color: 0xb89a68, side: THREE.DoubleSide })
    );
    saturnRing.rotation.x = Math.PI / 2.6;
    planet.add(saturnRing);
  }

  planets.push({ config, pivot, mesh: planet });
});

let isDragging = false;
let lastX = 0;
let lastY = 0;
let azimuth = 0;
let polar = 1.0;
let radius = 29;

const updateCamera = () => {
  const x = radius * Math.sin(polar) * Math.sin(azimuth);
  const y = radius * Math.cos(polar);
  const z = radius * Math.sin(polar) * Math.cos(azimuth);
  camera.position.set(x, y, z);
  camera.lookAt(0, 0, 0);
};

renderer.domElement.addEventListener('pointerdown', (event: PointerEvent) => {
  isDragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
});

window.addEventListener('pointerup', () => {
  isDragging = false;
});

window.addEventListener('pointermove', (event: PointerEvent) => {
  if (!isDragging) return;
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  lastX = event.clientX;
  lastY = event.clientY;

  azimuth -= dx * 0.004;
  polar = Math.min(Math.PI - 0.15, Math.max(0.2, polar + dy * 0.004));
  updateCamera();
});

window.addEventListener('wheel', (event: WheelEvent) => {
  const zoom = event.deltaY * 0.01;
  radius = THREE.MathUtils.clamp(radius + zoom, 18, 45);
  updateCamera();
});

const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  sun.rotation.y += 0.0025;
  sun.material.emissiveIntensity = 1.02 + Math.sin(t * 2.2) * 0.16;

  planets.forEach(({ config, pivot, mesh }) => {
    pivot.rotation.y = t * config.orbitSpeed * 0.25;
    mesh.rotation.y += config.rotationSpeed;
  });

  renderer.render(scene, camera);
};

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
