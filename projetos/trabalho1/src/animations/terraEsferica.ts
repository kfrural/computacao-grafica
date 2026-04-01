import * as THREE from 'three';

const createEarthTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  // Oceano base
  ctx.fillStyle = '#1b4ea8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Variacao sutil do oceano
  const oceanNoise = 1100;
  for (let i = 0; i < oceanNoise; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 0.8 + Math.random() * 2;
    ctx.fillStyle = `rgba(120,180,255,${0.02 + Math.random() * 0.03})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Continentes simplificados
  const continents = [
    [
      [180, 120], [260, 80], [360, 90], [430, 160], [410, 230], [320, 260], [230, 220]
    ],
    [
      [520, 140], [620, 110], [700, 150], [760, 230], [730, 320], [650, 350], [560, 300], [500, 220]
    ],
    [
      [830, 170], [900, 150], [970, 190], [970, 260], [930, 320], [860, 330], [810, 260]
    ],
    [
      [620, 390], [700, 360], [780, 390], [760, 450], [680, 470], [610, 440]
    ]
  ];

  ctx.fillStyle = '#5ea14a';
  for (const points of continents) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Regioes desertas/montanhosas
  ctx.fillStyle = 'rgba(173,134,77,0.55)';
  ctx.beginPath();
  ctx.ellipse(690, 220, 75, 45, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(355, 165, 58, 36, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Calotas polares
  ctx.fillStyle = 'rgba(235,245,255,0.9)';
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, 40, 390, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height - 40, 390, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  return texture;
};

const createCloudTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 160; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const rx = 20 + Math.random() * 50;
    const ry = 8 + Math.random() * 24;
    ctx.fillStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.18})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  return texture;
};

export const createTerraEsfericaAnimation = (scene: THREE.Scene) => {
  const objectsToDispose: Array<THREE.Object3D | THREE.Material | THREE.BufferGeometry | THREE.Texture> = [];

  const ambient = new THREE.AmbientLight(0xffffff, 0.22);
  scene.add(ambient);
  objectsToDispose.push(ambient);

  const sunLight = new THREE.PointLight(0xffefb5, 1.8, 100);
  scene.add(sunLight);
  objectsToDispose.push(sunLight);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.45, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0xffc035, emissive: 0xff8f1f, emissiveIntensity: 1.05 })
  );
  scene.add(sun);
  objectsToDispose.push(sun, sun.geometry, sun.material);

  const earthPivot = new THREE.Object3D();
  scene.add(earthPivot);
  objectsToDispose.push(earthPivot);

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 40, 40),
    new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      roughness: 0.94,
      metalness: 0.04
    })
  );
  earth.position.x = 6.96;
  earth.rotation.z = 0.38;
  earthPivot.add(earth);
  objectsToDispose.push(earth, earth.geometry, earth.material);

  const earthMaterial = earth.material as THREE.MeshStandardMaterial;
  if (earthMaterial.map) objectsToDispose.push(earthMaterial.map);

  const cloudLayer = new THREE.Mesh(
    new THREE.SphereGeometry(0.76, 32, 32),
    new THREE.MeshStandardMaterial({
      map: createCloudTexture(),
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    })
  );
  earth.add(cloudLayer);
  objectsToDispose.push(cloudLayer, cloudLayer.geometry, cloudLayer.material);

  const cloudMaterial = cloudLayer.material as THREE.MeshStandardMaterial;
  if (cloudMaterial.map) objectsToDispose.push(cloudMaterial.map);

  const moonPivot = new THREE.Object3D();
  earth.add(moonPivot);
  objectsToDispose.push(moonPivot);

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0xc4c4c4, roughness: 1 })
  );
  moon.position.set(1.08, 0, 0);
  moonPivot.add(moon);
  objectsToDispose.push(moon, moon.geometry, moon.material);

  return {
    update: (elapsedTime: number) => {
      earthPivot.rotation.y = elapsedTime * 0.6;
      earth.rotation.y += 0.03;
      cloudLayer.rotation.y += 0.042;
      moonPivot.rotation.y = elapsedTime * 1.8;
      sun.rotation.y += 0.004;
    },
    dispose: () => {
      for (const item of objectsToDispose) {
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
