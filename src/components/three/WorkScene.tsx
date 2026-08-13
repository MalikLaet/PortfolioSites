import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { PROJECTS } from '@/data/projects';
import { readAccentColor } from '@/lib/accent';
import styles from './WorkScene.module.css';

interface WorkSceneProps {
  readonly activeIndex: number;
  readonly onSelect: (index: number) => void;
  readonly onReady: () => void;
}

interface CardState {
  readonly group: THREE.Group;
  readonly glow: THREE.Mesh;
  readonly texture: THREE.Texture;
  readonly index: number;
  readonly phase: number;
  readonly current: { x: number; z: number; rotationY: number; scale: number };
  panRange: number;
  pan: number;
  hover: number;
}

const SCREEN_WIDTH = 3.15;
const SCREEN_HEIGHT = 2;
const BODY_HEIGHT = SCREEN_HEIGHT + 0.5;

function wrappedDistance(index: number, active: number): number {
  let distance = index - active;
  if (distance > PROJECTS.length / 2) distance -= PROJECTS.length;
  if (distance < -PROJECTS.length / 2) distance += PROJECTS.length;
  return distance;
}

function targetFor(distance: number): { x: number; z: number; rotationY: number; scale: number } {
  return distance === 0
    ? { x: 0, z: 1.15, rotationY: 0, scale: 1 }
    : { x: 3.35 * distance, z: -1.25, rotationY: -0.6 * distance, scale: 0.86 };
}

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export function WorkScene({ activeIndex, onSelect, onReady }: WorkSceneProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(activeIndex);
  const onSelectRef = useRef(onSelect);
  const onReadyRef = useRef(onReady);
  const [painted, setPainted] = useState(false);
  const [activeHovered, setActiveHovered] = useState(false);

  useEffect(() => { activeRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.3, 9.4);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = environment;
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(3, 5, 6);
    const rimLight = new THREE.DirectionalLight(readAccentColor(), 0.9);
    rimLight.position.set(-5, 1, -3);
    scene.add(keyLight, rimLight, new THREE.AmbientLight(0xffffff, 0.45));

    const gradientCanvas = document.createElement('canvas');
    gradientCanvas.width = 4;
    gradientCanvas.height = 128;
    const context = gradientCanvas.getContext('2d');
    if (!context) {
      renderer.dispose();
      pmrem.dispose();
      environment.dispose();
      return;
    }
    const gradient = context.createLinearGradient(0, 0, 0, 128);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(255,255,255,.55)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 4, 128);
    const alphaTexture = new THREE.CanvasTexture(gradientCanvas);

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a20,
      metalness: 0.95,
      roughness: 0.24,
      clearcoat: 0.7,
      envMapIntensity: 1.3,
    });
    const edgeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3a3a44,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.6,
    });
    const group = new THREE.Group();
    group.position.y = 0.35;
    scene.add(group);

    const cards: CardState[] = [];
    const hitTargets: THREE.Mesh[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [bodyMaterial, edgeMaterial];
    const loader = new THREE.TextureLoader();

    for (const [index, project] of PROJECTS.entries()) {
      const card = new THREE.Group();
      const distance = wrappedDistance(index, activeRef.current);
      const initial = targetFor(distance);

      const bodyGeometry = new RoundedBoxGeometry(SCREEN_WIDTH + 0.2, BODY_HEIGHT, 0.13, 5, 0.085);
      geometries.push(bodyGeometry);
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.userData.index = index;
      card.add(body);
      hitTargets.push(body);

      const barGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH, 0.28);
      const barMaterial = new THREE.MeshBasicMaterial({ color: 0x24242c });
      geometries.push(barGeometry);
      materials.push(barMaterial);
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      bar.position.set(0, SCREEN_HEIGHT / 2 + 0.1, 0.07);
      card.add(bar);

      for (let dotIndex = 0; dotIndex < 3; dotIndex += 1) {
        const dotGeometry = new THREE.CircleGeometry(0.021, 16);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x585863 });
        geometries.push(dotGeometry);
        materials.push(dotMaterial);
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.set(-SCREEN_WIDTH / 2 + 0.13 + dotIndex * 0.11, SCREEN_HEIGHT / 2 + 0.1, 0.074);
        card.add(dot);
      }

      const addressGeometry = new THREE.PlaneGeometry(1.15, 0.1);
      const addressMaterial = new THREE.MeshBasicMaterial({ color: 0x14141a });
      geometries.push(addressGeometry);
      materials.push(addressMaterial);
      const address = new THREE.Mesh(addressGeometry, addressMaterial);
      address.position.set(0.1, SCREEN_HEIGHT / 2 + 0.1, 0.074);
      card.add(address);

      const state = {} as CardState;
      const texture = loader.load(project.texture, (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const image = loaded.image as { width?: number; height?: number };
        const imageAspect = (image.width ?? 1) / (image.height ?? 1);
        const planeAspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        if (imageAspect < planeAspect) {
          const repeat = imageAspect / planeAspect;
          loaded.repeat.set(1, repeat);
          loaded.offset.set(0, 1 - repeat);
          state.panRange = 1 - repeat;
        } else {
          const repeat = planeAspect / imageAspect;
          loaded.repeat.set(repeat, 1);
          loaded.offset.set((1 - repeat) / 2, 0);
        }
        loaded.needsUpdate = true;
      });
      texture.colorSpace = THREE.SRGBColorSpace;

      const screenGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT);
      geometries.push(screenGeometry);
      const screenMaterial = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
      const reflectionMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        alphaMap: alphaTexture,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        toneMapped: false,
      });
      materials.push(screenMaterial, reflectionMaterial);
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.set(0, -0.11, 0.071);
      card.add(screen);
      const reflection = new THREE.Mesh(screenGeometry, reflectionMaterial);
      reflection.scale.y = -1;
      reflection.position.set(0, -BODY_HEIGHT / 2 - SCREEN_HEIGHT / 2 - 0.14, 0.071);
      card.add(reflection);

      const glowGeometry = new RoundedBoxGeometry(SCREEN_WIDTH + 0.28, BODY_HEIGHT + 0.08, 0.02, 4, 0.09);
      geometries.push(glowGeometry);
      const glow = new THREE.Mesh(glowGeometry, edgeMaterial);
      glow.position.z = -0.09;
      glow.visible = false;
      card.add(glow);

      card.position.set(initial.x, 0, initial.z);
      card.rotation.y = initial.rotationY;
      card.scale.setScalar(initial.scale);
      Object.assign(state, {
        group: card,
        glow,
        texture,
        index,
        phase: index * 1.7,
        current: { ...initial },
        panRange: 0,
        pan: 0,
        hover: 0,
      });
      cards.push(state);
      group.add(card);
    }

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let hovered = -1;
    let dragging = false;
    let dragStartX = 0;
    let dragDistance = 0;

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerNdc.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      pointerNdc.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
      pointer.targetX = pointerNdc.x;
      pointer.targetY = pointerNdc.y;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      dragging = true;
      dragStartX = event.clientX;
      dragDistance = 0;
      canvas.style.cursor = 'grabbing';
    };
    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event);
      if (dragging) dragDistance = event.clientX - dragStartX;
      raycaster.setFromCamera(pointerNdc, camera);
      const hit = raycaster.intersectObjects(hitTargets, false)[0];
      hovered = hit ? Number(hit.object.userData.index) : -1;
      setActiveHovered(!dragging && hovered === activeRef.current);
      canvas.style.cursor = dragging ? 'grabbing' : hovered >= 0 ? 'pointer' : 'grab';
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = hovered >= 0 ? 'pointer' : 'grab';
      if (Math.abs(dragDistance) > 55) {
        onSelectRef.current(activeRef.current + (dragDistance < 0 ? 1 : -1));
      } else if (hovered >= 0 && hovered !== activeRef.current) {
        onSelectRef.current(hovered);
      } else if (hovered === activeRef.current) {
        window.open(PROJECTS[hovered]!.url, '_blank', 'noopener,noreferrer');
      }
    };
    const onPointerLeave = () => {
      hovered = -1;
      setActiveHovered(false);
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('pointerup', onPointerUp);

    const resize = () => {
      const width = stage.clientWidth || 1;
      const height = stage.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 1080 ? 11.2 : 9.4;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
    });
    visibilityObserver.observe(stage);

    let animationFrame = 0;
    let readyTimer = 0;
    let hasPainted = false;
    let time = 0;
    const loop = () => {
      animationFrame = requestAnimationFrame(loop);
      if (!visible) return;
      time += 0.01;
      const rect = stage.getBoundingClientRect();
      const scrollProgress = 1 - (rect.top + rect.height / 2) / (window.innerHeight || 1);
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      group.rotation.y = pointer.x * 0.1 + (dragging ? dragDistance * 0.0004 : 0);
      group.rotation.x = -pointer.y * 0.05 + (scrollProgress - 0.5) * -0.1;

      for (const card of cards) {
        const distance = wrappedDistance(card.index, activeRef.current);
        const target = targetFor(distance);
        const velocityX = target.x - card.current.x;
        card.current.x = lerp(card.current.x, target.x, 0.085);
        card.current.z = lerp(card.current.z, target.z, 0.085);
        card.current.rotationY = lerp(card.current.rotationY, target.rotationY, 0.085);
        card.hover = lerp(card.hover, hovered === card.index ? 1 : 0, 0.12);
        card.current.scale = lerp(card.current.scale, target.scale + card.hover * 0.035, 0.1);
        card.group.position.set(
          card.current.x,
          Math.sin(time * 1.1 + card.phase) * 0.07 + card.hover * 0.1,
          card.current.z,
        );
        card.group.rotation.y = card.current.rotationY + velocityX * 0.045;
        card.group.rotation.z = distance * 0.012 - velocityX * 0.02;
        card.group.scale.setScalar(card.current.scale);
        if (card.panRange > 0) {
          const goal = distance === 0 ? Math.sin(time * 0.35 - Math.PI / 2) * 0.5 + 0.5 : 0;
          card.pan = lerp(card.pan, goal, distance === 0 ? 0.02 : 0.05);
          card.texture.offset.y = (1 - card.texture.repeat.y) * (1 - card.pan);
        }
        card.glow.visible = card.hover > 0.02;
        card.glow.scale.setScalar(1 + card.hover * 0.004);
      }
      renderer.render(scene, camera);

      if (!hasPainted) {
        hasPainted = true;
        readyTimer = window.setTimeout(() => {
          setPainted(true);
          onReadyRef.current();
        }, 220);
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(readyTimer);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('pointerup', onPointerUp);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      for (const geometry of geometries) geometry.dispose();
      for (const material of new Set(materials)) material.dispose();
      for (const card of cards) card.texture.dispose();
      alphaTexture.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${painted ? styles.visible : ''}`}
        aria-hidden="true"
      />
      <span className={`${styles.openHint} ${activeHovered ? styles.openHintVisible : ''}`} aria-hidden="true">
        Clique para abrir o site
      </span>
    </>
  );
}
