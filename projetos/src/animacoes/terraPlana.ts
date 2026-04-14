import * as THREE from 'three';

const createFlatEarthTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.Texture();

  const center = canvas.width / 2;
  const radius = 470;

  // fundo oceano
  ctx.fillStyle = '#2b6cb0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // disco principal
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.clip();

  // leve variação do oceano
  for (let i = 0; i < 1200; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 1 + Math.random() * 3;
    ctx.fillStyle = `rgba(255,255,255,${0.01 + Math.random() * 0.03})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // continentes simplificados
  const continents = [
    [
      [380, 250], [470, 220], [580, 270], [650, 360], [610, 460], [500, 500], [400, 430], [350, 330]
    ],
    [
      [250, 430], [320, 400], [380, 460], [390, 560], [340, 660], [270, 620], [220, 530]
    ],
    [
      [620, 520], [710, 500], [790, 560], [790, 660], [720, 720], [630, 680], [590, 600]
    ],
    [
      [430, 670], [500, 650], [560, 690], [540, 760], [470, 790], [410, 750]
    ]
  ];

  ctx.fillStyle = '#5e9e4d';
  for (const points of continents) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  // áreas secas
  ctx.fillStyle = 'rgba(181, 140, 73, 0.55)';
  ctx.beginPath();
  ctx.ellipse(530, 340, 70, 35, 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(320, 520, 45, 28, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // calota central clara só para destacar melhor a superfície
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(center, center, radius - 5, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

export const createTerraPlanaAnimation = (scene: THREE.Scene) => {
  const items: Array<THREE.Object3D | THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];

  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambient);
  items.push(ambient);

  const sunLight = new THREE.PointLight(0xfff1a8, 2.2, 100);
  scene.add(sunLight);
  items.push(sunLight);

  // terra plana no centro
  const earthGroup = new THREE.Object3D();
  scene.add(earthGroup);
  items.push(earthGroup);

  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.7, 1.7, 0.22, 64),
    new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.85,
      metalness: 0.02
    })
  );
  earthGroup.add(disc);
  items.push(disc, disc.geometry, disc.material);

  const topSurface = new THREE.Mesh(
    new THREE.CircleGeometry(1.68, 64),
    new THREE.MeshStandardMaterial({
      map: createFlatEarthTexture(),
      roughness: 0.95,
      metalness: 0.02
    })
  );
  topSurface.rotation.x = -Math.PI / 2;
  topSurface.position.y = 0.111;
  earthGroup.add(topSurface);
  items.push(topSurface, topSurface.geometry, topSurface.material);

  const topMaterial = topSurface.material as THREE.MeshStandardMaterial;
  if (topMaterial.map) items.push(topMaterial.map);

  // sol orbitando a terra plana
  const sunPivot = new THREE.Object3D();
  scene.add(sunPivot);
  items.push(sunPivot);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      emissive: 0xff9500,
      emissiveIntensity: 1.3,
      roughness: 0.35
    })
  );
  sun.position.set(5.8, 0, 0);
  sunPivot.add(sun);
  items.push(sun, sun.geometry, sun.material);

  return {
    update: (elapsedTime: number) => {
      // terra parada no centro, girando sobre si
      earthGroup.rotation.y = elapsedTime * 0.8;

      // sol orbitando
      sunPivot.rotation.y = elapsedTime * 0.6;

      // rotação do próprio sol
      sun.rotation.y += 0.03;

      // luz acompanha o sol
      sunLight.position.copy(sun.getWorldPosition(new THREE.Vector3()));
    },
    dispose: () => {
      for (const item of items) {
        if (item instanceof THREE.Object3D && item.parent) {
          item.parent.remove(item);
        }
        if (item instanceof THREE.BufferGeometry) item.dispose();
        if (item instanceof THREE.Material) item.dispose();
        if (item instanceof THREE.Texture) item.dispose();
      }
    }
  };
};