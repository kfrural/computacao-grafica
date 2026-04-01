import * as THREE from 'three';

const createFlatEarthTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const center = canvas.width / 2;
  const radius = 470;

  ctx.fillStyle = '#2d6fcb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Vinheta radial para dar volume visual ao disco.
  const radial = ctx.createRadialGradient(center, center, 40, center, center, radius);
  radial.addColorStop(0, 'rgba(140,205,255,0.35)');
  radial.addColorStop(0.7, 'rgba(35,85,165,0.24)');
  radial.addColorStop(1, 'rgba(18,42,96,0.5)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();

  // Continentes estilizados no disco.
  const continents = [
    [[390, 320], [470, 260], [560, 300], [620, 360], [585, 430], [505, 455], [430, 410]],
    [[270, 500], [340, 455], [420, 485], [445, 565], [385, 625], [300, 610], [248, 550]],
    [[575, 560], [645, 520], [728, 550], [742, 620], [675, 680], [598, 650]],
    [[455, 670], [520, 640], [590, 668], [572, 735], [500, 758], [440, 725]]
  ];

  ctx.fillStyle = '#63a44d';
  for (const points of continents) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fill();
  }

  // Nuvens suaves sobre o mapa.
  for (let i = 0; i < 180; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * (radius - 25);
    const x = center + Math.cos(angle) * dist;
    const y = center + Math.sin(angle) * dist;
    const rx = 10 + Math.random() * 26;
    const ry = 6 + Math.random() * 16;
    ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.16})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

export const createTerraPlanaAnimation = (scene: THREE.Scene) => {
  const objectsToDispose: Array<THREE.Object3D | THREE.Material | THREE.BufferGeometry | THREE.Texture> = [];

  const ambient = new THREE.AmbientLight(0xffffff, 0.22);
  scene.add(ambient);
  objectsToDispose.push(ambient);

  const sunLight = new THREE.PointLight(0xfff3c8, 1.75, 100);
  scene.add(sunLight);
  objectsToDispose.push(sunLight);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.45, 48, 48),
    new THREE.MeshStandardMaterial({ color: 0xffbb2f, emissive: 0xff8b18, emissiveIntensity: 1.08 })
  );
  scene.add(sun);
  objectsToDispose.push(sun, sun.geometry, sun.material);

  const orbitRing = new THREE.Mesh(
    new THREE.RingGeometry(6.7, 6.82, 160),
    new THREE.MeshBasicMaterial({ color: 0x5a647f, side: THREE.DoubleSide })
  );
  orbitRing.rotation.x = Math.PI / 2;
  scene.add(orbitRing);
  objectsToDispose.push(orbitRing, orbitRing.geometry, orbitRing.material);

  const flatPivot = new THREE.Object3D();
  scene.add(flatPivot);
  objectsToDispose.push(flatPivot);

  const flatEarthGroup = new THREE.Object3D();
  flatEarthGroup.position.x = 6.76;
  flatEarthGroup.rotation.z = 0.28;
  flatPivot.add(flatEarthGroup);
  objectsToDispose.push(flatEarthGroup);

  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.95, 0.12, 64),
    new THREE.MeshStandardMaterial({ color: 0x3d87ff, roughness: 0.88, metalness: 0.04 })
  );
  flatEarthGroup.add(disc);
  objectsToDispose.push(disc, disc.geometry, disc.material);

  const topCap = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 64),
    new THREE.MeshStandardMaterial({ map: createFlatEarthTexture(), roughness: 0.92, metalness: 0.03 })
  );
  topCap.position.y = 0.061;
  topCap.rotation.x = -Math.PI / 2;
  flatEarthGroup.add(topCap);
  objectsToDispose.push(topCap, topCap.geometry, topCap.material);

  const topCapMaterial = topCap.material as THREE.MeshStandardMaterial;
  if (topCapMaterial.map) objectsToDispose.push(topCapMaterial.map);

  return {
    update: (elapsedTime: number) => {
      flatPivot.rotation.y = elapsedTime * 0.5;
      flatEarthGroup.rotation.y += 0.028;
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
