import * as THREE from 'three';

const createEarthTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.Texture();

  // oceano
  ctx.fillStyle = '#1f5fbf';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ruído leve do oceano
  for (let i = 0; i < 1800; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 1 + Math.random() * 3;
    ctx.fillStyle = `rgba(255,255,255,${0.01 + Math.random() * 0.025})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // continentes mais largos, já pensando no mapeamento da esfera
  const continents = [
    // Américas
    [
      [260, 170], [340, 120], [430, 140], [470, 230], [445, 330], [395, 420],
      [355, 520], [315, 650], [255, 720], [210, 660], [220, 560], [250, 470],
      [280, 360], [240, 260]
    ],
    // Groenlândia
    [
      [420, 90], [470, 70], [510, 105], [490, 150], [440, 145]
    ],
    // Europa/África/Ásia
    [
      [900, 170], [1020, 130], [1180, 150], [1320, 210], [1460, 250], [1590, 300],
      [1710, 390], [1700, 500], [1600, 580], [1490, 600], [1400, 560], [1320, 510],
      [1240, 480], [1180, 510], [1120, 600], [1060, 710], [980, 760], [930, 700],
      [950, 610], [1010, 520], [1030, 430], [980, 350], [900, 280]
    ],
    // Península Arábica/Índia
    [
      [1240, 430], [1310, 420], [1360, 470], [1340, 550], [1280, 560], [1220, 510]
    ],
    // Austrália
    [
      [1600, 690], [1680, 670], [1750, 720], [1740, 790], [1660, 810], [1580, 770]
    ],
    // Antártida
    [
      [200, 900], [450, 880], [760, 910], [1050, 890], [1350, 910], [1650, 885], [1880, 905],
      [1880, 980], [200, 980]
    ]
  ];

  ctx.fillStyle = '#5fa44d';
  for (const points of continents) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  
  ctx.fillStyle = 'rgba(189, 148, 80, 0.55)';
  ctx.beginPath();
  ctx.ellipse(1180, 330, 120, 55, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(320, 280, 70, 35, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // calotas
  ctx.fillStyle = 'rgba(240,248,255,0.9)';
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, 45, 700, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height - 45, 760, 65, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  return texture;
};

export const createTerraEsfericaAnimation = (scene: THREE.Scene) => {
  const items: Array<THREE.Object3D | THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);
  items.push(ambient);

  const sunLight = new THREE.PointLight(0xffefb5, 2, 100);
  scene.add(sunLight);
  items.push(sunLight);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xffc035,
      emissive: 0xff8f1f,
      emissiveIntensity: 1.1,
      roughness: 0.35
    })
  );
  scene.add(sun);
  items.push(sun, sun.geometry, sun.material);

  const earthPivot = new THREE.Object3D();
  scene.add(earthPivot);
  items.push(earthPivot);

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 48, 48),
    new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      roughness: 0.92,
      metalness: 0.03
    })
  );
  earth.position.x = 6.8;
  earth.rotation.z = 0.38;
  earthPivot.add(earth);
  items.push(earth, earth.geometry, earth.material);

  const earthMaterial = earth.material as THREE.MeshStandardMaterial;
  if (earthMaterial.map) items.push(earthMaterial.map);

  return {
    update: (elapsedTime: number) => {
      earthPivot.rotation.y = elapsedTime * 0.6;
      earth.rotation.y += 0.02;
      sun.rotation.y += 0.01;
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