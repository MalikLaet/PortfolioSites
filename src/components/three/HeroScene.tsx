import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { readAccentColor } from '@/lib/accent';
import styles from './HeroScene.module.css';

/** Largura, altura e distância em Z entre as camadas do site explodido. */
const W = 3.3;
const H = 2.25;
const GAP = 0.92;

/**
 * Um site explodido em camadas — as quatro que um navegador empilha: cromo,
 * faixa de hero, fileira de cards e grade de rodapé, em metal escuro.
 *
 * O componente é carregado sob demanda (`lazy`) e só é montado acima de 900px e
 * sem `prefers-reduced-motion`; quem decide isso é o Hero, não este arquivo.
 */
export function HeroScene(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // sem WebGL a página segue sem a cena — o hero já é legível sem ela
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const accent = readAccentColor();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 9.6);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = envTexture;

    const steel = new THREE.MeshPhysicalMaterial({
      color: 0x2b2b33,
      metalness: 1,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.9,
    });
    const light = new THREE.MeshPhysicalMaterial({
      color: 0x5c5c6a,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.9,
    });
    const gold = new THREE.MeshPhysicalMaterial({
      color: accent,
      metalness: 1,
      roughness: 0.18,
      envMapIntensity: 2.4,
    });
    const wire = new THREE.MeshPhysicalMaterial({
      color: 0x76767f,
      metalness: 1,
      roughness: 0.28,
      envMapIntensity: 1.6,
    });

    const geometries: THREE.BufferGeometry[] = [];
    const block = (
      w: number,
      h: number,
      material: THREE.Material,
      x: number,
      y: number,
      depth = 0.055,
    ) => {
      const geometry = new RoundedBoxGeometry(w, h, depth, 3, Math.min(0.026, h / 2.6));
      geometries.push(geometry);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, 0);
      return mesh;
    };

    /** Moldura de arame que delimita cada camada. */
    const frame = () => {
      const group = new THREE.Group();
      const t = 0.032;
      group.add(
        block(W, t, wire, 0, H / 2, 0.05),
        block(W, t, wire, 0, -H / 2, 0.05),
        block(t, H, wire, -W / 2, 0, 0.05),
        block(t, H, wire, W / 2, 0, 0.05),
      );
      return group;
    };

    const group = new THREE.Group();
    const layers: THREE.Group[] = [];
    const addLayer = (build: (layer: THREE.Group) => void) => {
      const layer = new THREE.Group();
      layer.add(frame());
      build(layer);
      layer.position.z = -layers.length * GAP;
      layer.userData.baseZ = layer.position.z;
      layer.userData.phase = layers.length * 1.4;
      group.add(layer);
      layers.push(layer);
    };

    // 1 · cromo do navegador: barra, três pontos e campo de URL
    addLayer((layer) => {
      layer.add(block(W - 0.14, 0.26, light, 0, H / 2 - 0.24));
      for (const x of [-1.44, -1.3, -1.16]) layer.add(block(0.06, 0.06, wire, x, H / 2 - 0.24));
      layer.add(block(1.5, 0.13, steel, 0.05, H / 2 - 0.24));
    });

    // 2 · faixa de hero: dois títulos, uma linha, um botão de acento e um secundário
    addLayer((layer) => {
      layer.add(block(1.85, 0.3, light, -0.62, 0.52));
      layer.add(block(1.45, 0.3, light, -0.82, 0.14));
      layer.add(block(1.15, 0.13, steel, -0.97, -0.22));
      layer.add(block(0.62, 0.24, gold, -1.24, -0.66));
      layer.add(block(0.48, 0.24, wire, -0.5, -0.66));
    });

    // 3 · fileira de três cards, o do meio mais claro
    addLayer((layer) => {
      [-1.02, 0, 1.02].forEach((x, index) => {
        layer.add(block(0.9, 1.12, index === 1 ? light : steel, x, 0.1));
        layer.add(block(0.56, 0.1, wire, x - 0.16, -0.62));
      });
    });

    // 4 · grade de rodapé 4×3, primeira célula em acento
    addLayer((layer) => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          const material = col === 0 && row === 0 ? gold : wire;
          layer.add(block(0.62, 0.1, material, -1.16 + col * 0.78, 0.62 - row * 0.36));
        }
      }
      layer.add(block(W - 0.3, 0.075, steel, 0, -0.72));
    });

    // linha de varredura percorrendo a pilha — sugere carregamento
    const sweepGeometry = new THREE.PlaneGeometry(W - 0.1, 0.02);
    const sweepMaterial = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.85,
    });
    const sweep = new THREE.Mesh(sweepGeometry, sweepMaterial);
    group.add(sweep);

    group.rotation.set(0.24, -0.62, 0.06);
    group.position.set(-0.1, 0, 0);
    scene.add(group);

    const key = new THREE.DirectionalLight(0xffffff, 3.4);
    key.position.set(4, 6, 5);
    const fill = new THREE.DirectionalLight(0xffffff, 1.5);
    fill.position.set(-3, 2, 6);
    const rim = new THREE.DirectionalLight(accent, 1.8);
    rim.position.set(-6, -2, -4);
    scene.add(key, fill, rim, new THREE.AmbientLight(0xffffff, 0.4));

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const resize = () => {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = 11;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // o loop pausa quando o canvas sai da tela: renderizar o que ninguém vê é
    // só consumo de bateria
    let visible = true;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    let animationFrame = 0;
    let t = 0;
    const loop = () => {
      animationFrame = requestAnimationFrame(loop);
      if (!visible) return;

      t += 0.006;
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      const scrolled = Math.min(window.scrollY / (window.innerHeight || 1), 1.6);

      group.rotation.y = -0.62 + Math.sin(t * 0.55) * 0.18 + pointer.x * 0.38;
      group.rotation.x = 0.24 + pointer.y * 0.2 + scrolled * 0.34;
      group.rotation.z = 0.06 + pointer.x * 0.05;
      group.position.y = Math.sin(t) * 0.09 - scrolled * 0.5;

      // as camadas se afastam com o mouse nas laterais e se juntam ao rolar
      const spread = Math.max(1 + Math.abs(pointer.x) * 0.55 - scrolled * 0.42, 0.25);
      for (const layer of layers) {
        layer.position.z = (layer.userData.baseZ as number) * spread;
        layer.position.y = Math.sin(t * 1.3 + (layer.userData.phase as number)) * 0.045;
      }

      const cycle = (t * 0.42) % 1.6;
      sweep.position.set(0, H / 2 - cycle * H, 0.09);
      sweepMaterial.opacity = cycle < 1 ? 0.85 * (1 - Math.abs(cycle - 0.5) * 0.7) : 0;

      camera.position.x = pointer.x * 0.5;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    loop();
    requestAnimationFrame(() => {
      canvas.style.opacity = '1';
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      visibility.disconnect();
      for (const geometry of [...geometries, sweepGeometry]) geometry.dispose();
      for (const material of [steel, light, gold, wire, sweepMaterial]) material.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
