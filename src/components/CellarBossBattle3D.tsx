import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import confetti from 'canvas-confetti';
import {
  Skull,
  Shield,
  Flame,
  Trophy,
  RotateCcw,
  X,
  Zap,
  BookOpen,
  Sparkles,
  Crown,
} from 'lucide-react';
import {
  PART1_CURRICULUM_CHAPTERS,
  PART2_CURRICULUM_CHAPTERS,
} from '../data/part1CurriculumData';
import { generateBookWideBossQuestions } from '../utils/dynamicQuizGenerator';
import { formatMathText } from '../utils/formatMath';
import { BOSS_BADGE_ID } from '../data/masteryBadges';

interface CellarBossBattle3DProps {
  isOpen: boolean;
  onClose: () => void;
  onVictoryUnlockBossBadge: (badgeId: string, bonusPoints: number) => void;
  isBossAlreadyDefeated: boolean;
}

interface FlyingBookEntity {
  group: THREE.Group;
  velocity: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  isLethalStrike: boolean;
}

export const CellarBossBattle3D: React.FC<CellarBossBattle3DProps> = ({
  isOpen,
  onClose,
  onVictoryUnlockBossBadge,
  isBossAlreadyDefeated,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [battleSeed, setBattleSeed] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [bossHp, setBossHp] = useState<number>(30);
  const [battleState, setBattleState] = useState<'intro' | 'fighting' | 'dead' | 'victory'>('intro');
  const [deathReason, setDeathReason] = useState<string>('');
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  // Refs used inside Three.js animation loop to trigger immediate visual actions
  const triggerLethalBookRef = useRef<(() => void) | null>(null);
  const triggerCounterBeamRef = useRef<(() => void) | null>(null);
  const battleStateRef = useRef<'intro' | 'fighting' | 'dead' | 'victory'>('intro');

  useEffect(() => {
    battleStateRef.current = battleState;
  }, [battleState]);

  // Gather all static questions from the entire book (Part I + Part II)
  const allBookStaticPool = useMemo(() => {
    const p1 = PART1_CURRICULUM_CHAPTERS.filter((c) => c.chapterId !== 'ch8-master-quiz').flatMap(
      (c) => c.questionnaire
    );
    const p2 = PART2_CURRICULUM_CHAPTERS.filter(
      (c) => c.chapterId !== 'part2-ch8-master-quiz'
    ).flatMap((c) => c.questionnaire);
    return [...p1, ...p2];
  }, []);

  const bossQuestions = useMemo(
    () => generateBookWideBossQuestions(allBookStaticPool, battleSeed, 30),
    [allBookStaticPool, battleSeed]
  );

  const currentQuestion = bossQuestions[currentIndex] || bossQuestions[0];

  const handleStartOrRespawn = useCallback(() => {
    setBattleSeed((s) => s + 1);
    setCurrentIndex(0);
    setBossHp(30);
    setDeathReason('');
    setLastFeedback('The Arch-Librarian hurls ancient tomes from the shadows! Answer all 30 to survive!');
    setBattleState('fighting');
  }, []);

  const handleSelectOption = (optionIndex: number) => {
    if (battleState !== 'fighting' || !currentQuestion) return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      if (triggerCounterBeamRef.current) {
        triggerCounterBeamRef.current();
      }
      const nextHp = Math.max(0, bossHp - 1);
      setBossHp(nextHp);
      setLastFeedback(`Direct hit! You shattered the incoming tome! (${30 - nextHp}/30 cleared)`);

      if (currentIndex + 1 >= bossQuestions.length || nextHp <= 0) {
        setBattleState('victory');
        onVictoryUnlockBossBadge(BOSS_BADGE_ID, 500);
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.55 },
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      // Wrong answer -> Boss hurls lethal tome that kills the player
      if (triggerLethalBookRef.current) {
        triggerLethalBookRef.current();
      }
      const chosenText = currentQuestion.options[optionIndex];
      const correctText = currentQuestion.options[currentQuestion.correctIndex];
      setDeathReason(
        `You answered "${chosenText}", but the true Ganita formula was "${correctText}". A heavy iron-bound calculus tome struck you down in the cellar!`
      );
      setTimeout(() => {
        setBattleState('dead');
      }, 420);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Underground Cellar Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09070d);
    scene.fog = new THREE.FogExp2(0x09070d, 0.038);

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 120);
    camera.position.set(0, 2.3, 9.5);
    camera.lookAt(0, 2.2, -5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Software WebGL detection per threejs skill
    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '' : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software|Mesa OffScreen/i.test(rendererStr);

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // PMREM RoomEnvironment for metallic brass & stone highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 2. Lighting (Torchlit Underground Cellar)
    const ambientLight = new THREE.AmbientLight(0x2a1f3d, 0.7);
    scene.add(ambientLight);

    const torchLeft = new THREE.PointLight(0xff7b29, 4.5, 22);
    torchLeft.position.set(-5.2, 4.2, 1.5);
    scene.add(torchLeft);

    const torchRight = new THREE.PointLight(0xff7b29, 4.5, 22);
    torchRight.position.set(5.2, 4.2, 1.5);
    scene.add(torchRight);

    const bossAuraLight = new THREE.PointLight(0xa855f7, 6.0, 25);
    bossAuraLight.position.set(0, 3.8, -5.5);
    scene.add(bossAuraLight);

    // 3. Build Underground Stone Cellar Geometry
    const cellarGroup = new THREE.Group();
    scene.add(cellarGroup);

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b24,
      roughness: 0.88,
      metalness: 0.12,
    });
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x141118,
      roughness: 0.92,
      metalness: 0.08,
    });
    const goldRuneMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xb45309,
      emissiveIntensity: 0.65,
      roughness: 0.3,
      metalness: 0.85,
    });

    // Cellar Floor
    const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(24, 34), stoneMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, -4);
    cellarGroup.add(floorMesh);

    // Sacred Baudhayana Geometric Rune Ring on the Cellar Floor
    const runeOuter = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.8, 32), goldRuneMat);
    runeOuter.rotation.x = -Math.PI / 2;
    runeOuter.position.set(0, 0.02, -4.5);
    cellarGroup.add(runeOuter);

    const runeSquare = new THREE.Mesh(new THREE.RingGeometry(1.8, 1.95, 4), goldRuneMat);
    runeSquare.rotation.x = -Math.PI / 2;
    runeSquare.position.set(0, 0.025, -4.5);
    cellarGroup.add(runeSquare);

    // Cellar Ceiling & Back Wall
    const ceilingMesh = new THREE.Mesh(new THREE.PlaneGeometry(24, 34), darkStoneMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.set(0, 7.5, -4);
    cellarGroup.add(ceilingMesh);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(22, 8, 1), darkStoneMat);
    backWall.position.set(0, 3.8, -13);
    cellarGroup.add(backWall);

    // Stone Pillars & Vaulted Cellar Bookshelves along Left & Right Walls
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x3e2723,
      roughness: 0.78,
      metalness: 0.1,
    });

    const bookPalette = [0xb91c1c, 0x1d4ed8, 0x047857, 0x7e22ce, 0xd97706, 0x0f766e];

    for (const side of [-1, 1]) {
      for (let z = -10; z <= 6; z += 4) {
        // Stone Pillar
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 7.5, 1.1), stoneMat);
        pillar.position.set(side * 6.5, 3.75, z);
        cellarGroup.add(pillar);

        // Cellar Bookshelf recessed between pillars
        if (z < 6) {
          const shelfFrame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.2, 3.0), woodMat);
          shelfFrame.position.set(side * 6.8, 2.6, z + 2);
          cellarGroup.add(shelfFrame);

          // Rows of books on shelves
          for (let row = 0; row < 3; row++) {
            for (let b = 0; b < 5; b++) {
              const bColor = bookPalette[(row * 5 + b + Math.abs(z)) % bookPalette.length];
              const shelfBook = new THREE.Mesh(
                new THREE.BoxGeometry(0.55, 0.85, 0.35),
                new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.6 })
              );
              shelfBook.position.set(
                side * 6.45,
                1.1 + row * 1.45,
                z + 0.9 + b * 0.52
              );
              cellarGroup.add(shelfBook);
            }
          }
        }
      }

      // Torch Sconce & Flame
      const sconce = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.7, 8), woodMat);
      sconce.position.set(side * 5.6, 3.8, 1.5);
      sconce.rotation.z = side * 0.35;
      cellarGroup.add(sconce);

      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 0.55, 8),
        new THREE.MeshBasicMaterial({ color: 0xff9800 })
      );
      flame.position.set(side * 5.45, 4.2, 1.5);
      cellarGroup.add(flame);
    }

    // 4. Composite 3D Boss: The Arch-Librarian of the Underground Cellar (12+ parts)
    const bossGroup = new THREE.Group();
    bossGroup.position.set(0, 2.4, -5.2);
    scene.add(bossGroup);

    const bossArmorMat = new THREE.MeshStandardMaterial({
      color: 0x27193c,
      roughness: 0.35,
      metalness: 0.75,
    });
    const bossCoreMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    // Part 1: Robed Obsidian Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.45, 2.7, 8), bossArmorMat);
    bossGroup.add(torso);

    // Part 2: Glowing Mathematical Core Crystal
    const coreCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 0), bossCoreMat);
    coreCrystal.position.set(0, 0.25, 0.78);
    bossGroup.add(coreCrystal);

    // Part 3: Scholar Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.15, 1.05), bossArmorMat);
    head.position.set(0, 1.95, 0);
    bossGroup.add(head);

    // Part 4 & 5: Glowing Eyes
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.1), eyeMat);
    leftEye.position.set(-0.24, 2.0, 0.54);
    bossGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.1), eyeMat);
    rightEye.position.set(0.24, 2.0, 0.54);
    bossGroup.add(rightEye);

    // Part 6: Golden Crown of Brahmagupta
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.55, 0.45, 6), goldRuneMat);
    crown.position.set(0, 2.7, 0);
    bossGroup.add(crown);

    // Part 7 & 8: Articulated Left & Right Casting Arms
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.7, 0.45), bossArmorMat);
    leftArm.position.set(-1.45, 0.5, 0.4);
    leftArm.rotation.x = -0.5;
    bossGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.7, 0.45), bossArmorMat);
    rightArm.position.set(1.45, 0.5, 0.4);
    rightArm.rotation.x = -0.5;
    bossGroup.add(rightArm);

    // Part 9 & 10: Rotating Astrolabe Halo Rings behind the Boss
    const astrolabeRing1 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.07, 10, 36), goldRuneMat);
    astrolabeRing1.position.set(0, 0.9, -0.3);
    bossGroup.add(astrolabeRing1);

    const astrolabeRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.06, 10, 32), bossCoreMat);
    astrolabeRing2.position.set(0, 0.9, -0.3);
    bossGroup.add(astrolabeRing2);

    // Part 11+: Orbiting Grimoire Books around Boss
    const orbitingBooksGroup = new THREE.Group();
    orbitingBooksGroup.position.set(0, 1.1, 0);
    bossGroup.add(orbitingBooksGroup);

    const create3DBookMesh = (coverHex: number, scale = 1): THREE.Group => {
      const bookGrp = new THREE.Group();
      const coverMat = new THREE.MeshStandardMaterial({
        color: coverHex,
        roughness: 0.45,
        metalness: 0.25,
      });
      const pagesMat = new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        roughness: 0.8,
      });

      const pageBlock = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.95, 0.22), pagesMat);
      bookGrp.add(pageBlock);

      const frontCover = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.02, 0.04), coverMat);
      frontCover.position.z = 0.12;
      bookGrp.add(frontCover);

      const backCover = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.02, 0.04), coverMat);
      backCover.position.z = -0.12;
      bookGrp.add(backCover);

      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.02, 0.28), coverMat);
      spine.position.x = -0.39;
      bookGrp.add(spine);

      bookGrp.scale.setScalar(scale);
      return bookGrp;
    };

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const orbBook = create3DBookMesh(bookPalette[i % bookPalette.length], 0.65);
      orbBook.position.set(Math.cos(angle) * 2.5, Math.sin(angle * 2) * 0.4, Math.sin(angle) * 1.4);
      orbitingBooksGroup.add(orbBook);
    }

    // 5. Flying Books Projectile System (Boss shoots books at the player!)
    const flyingBooks: FlyingBookEntity[] = [];
    const projectilesGroup = new THREE.Group();
    scene.add(projectilesGroup);

    const spawnFlyingBook = (isLethalStrike = false) => {
      const coverHex = isLethalStrike
        ? 0xdc2626
        : bookPalette[Math.floor(Math.random() * bookPalette.length)];
      const bookMesh = create3DBookMesh(coverHex, isLethalStrike ? 1.45 : 0.85);
      bookMesh.position.set(
        (Math.random() - 0.5) * (isLethalStrike ? 0.4 : 2.2),
        2.5 + (Math.random() - 0.5) * 0.8,
        -4.2
      );
      projectilesGroup.add(bookMesh);

      const targetX = isLethalStrike ? 0 : (Math.random() - 0.5) * 2.8;
      const targetY = isLethalStrike ? 2.2 : 1.6 + (Math.random() - 0.5) * 1.2;
      const targetZ = 9.5;

      const dir = new THREE.Vector3(
        targetX - bookMesh.position.x,
        targetY - bookMesh.position.y,
        targetZ - bookMesh.position.z
      ).normalize();

      const speed = isLethalStrike ? 28 : 7.5 + Math.random() * 3.5;
      flyingBooks.push({
        group: bookMesh,
        velocity: dir.multiplyScalar(speed),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        isLethalStrike,
      });
    };

    // Golden Counter-Beam effect when answering correctly
    let beamAlpha = 0;
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0,
    });
    const counterBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.25, 14, 12), beamMat);
    counterBeam.rotation.x = Math.PI / 2;
    counterBeam.position.set(0, 2.2, 2.0);
    scene.add(counterBeam);

    let screenShake = 0;

    triggerLethalBookRef.current = () => {
      spawnFlyingBook(true);
      screenShake = 0.55;
    };

    triggerCounterBeamRef.current = () => {
      beamAlpha = 1.0;
      // Clear nearest incoming flying books when player fires counter-spell
      for (let i = flyingBooks.length - 1; i >= 0; i--) {
        projectilesGroup.remove(flyingBooks[i].group);
        flyingBooks.splice(i, 1);
      }
    };

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop with software WebGL frame pacing guard
    let prevTime = performance.now();
    let spawnTimer = 0;
    let rafId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isDisposed = false;

    const afterDraw = isSoftwareGl
      ? (cb: FrameRequestCallback) => {
          timeoutId = setTimeout(() => {
            rafId = requestAnimationFrame(cb);
          }, 16);
        }
      : (cb: FrameRequestCallback) => {
          rafId = requestAnimationFrame(cb);
        };

    const animate = (now: number) => {
      if (isDisposed) return;
      const dt = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;
      const elapsed = now * 0.001;

      // Animate Boss hovering & rotating astrolabe rings
      bossGroup.position.y = 2.4 + Math.sin(elapsed * 2.2) * 0.22;
      astrolabeRing1.rotation.z = elapsed * 0.85;
      astrolabeRing2.rotation.x = elapsed * 1.15;
      astrolabeRing2.rotation.y = elapsed * 0.65;
      coreCrystal.rotation.y = elapsed * 2.0;
      orbitingBooksGroup.rotation.y = -elapsed * 1.1;

      // Animate Boss casting arms throwing books
      leftArm.rotation.x = -0.5 + Math.sin(elapsed * 3.8) * 0.45;
      rightArm.rotation.x = -0.5 + Math.cos(elapsed * 3.8) * 0.45;

      // Flickering cellar torches
      torchLeft.intensity = 4.2 + Math.sin(elapsed * 13.0) * 0.6;
      torchRight.intensity = 4.2 + Math.cos(elapsed * 11.5) * 0.6;

      // Periodically hurl 3D books from the Boss towards the player in the cellar
      if (battleStateRef.current === 'fighting') {
        spawnTimer += dt;
        if (spawnTimer > 1.35 && flyingBooks.length < 7) {
          spawnTimer = 0;
          spawnFlyingBook(false);
        }
      }

      // Update flying books
      for (let i = flyingBooks.length - 1; i >= 0; i--) {
        const fb = flyingBooks[i];
        fb.group.position.addScaledVector(fb.velocity, dt);
        fb.group.rotation.x += fb.rotSpeed.x * dt;
        fb.group.rotation.y += fb.rotSpeed.y * dt;
        fb.group.rotation.z += fb.rotSpeed.z * dt;

        if (fb.group.position.z > 9.8) {
          projectilesGroup.remove(fb.group);
          flyingBooks.splice(i, 1);
        }
      }

      // Update Golden Counter-Beam
      if (beamAlpha > 0) {
        beamAlpha = Math.max(0, beamAlpha - dt * 3.2);
        beamMat.opacity = beamAlpha;
      }

      // Update Camera Shake
      if (screenShake > 0) {
        screenShake = Math.max(0, screenShake - dt * 1.4);
        camera.position.x = (Math.random() - 0.5) * screenShake;
        camera.position.y = 2.3 + (Math.random() - 0.5) * screenShake;
      } else {
        camera.position.x = Math.sin(elapsed * 0.5) * 0.18;
        camera.position.y = 2.3 + Math.cos(elapsed * 0.7) * 0.08;
      }
      camera.lookAt(0, 2.2, -5);

      renderer.render(scene, camera);
      afterDraw(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 sm:p-4 overflow-hidden">
      <div className="relative w-full max-w-6xl h-[92vh] rounded-2xl border-4 border-[#FACC15]/60 bg-[#09070D] text-[#FFFDF5] shadow-[0_0_90px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col">
        {/* 3D WebGL Canvas Stage */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Top HUD Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#FFFDF5]/15 bg-black/70 backdrop-blur-md px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#F87171] bg-[#7F1D1D]/60 text-[#FCA5A5]">
              <Skull className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FACC15] font-hand">
                  Underground Cellar Final Boss · Badge #115
                </span>
                {isBossAlreadyDefeated && (
                  <span className="rounded bg-[#4ADE80]/20 px-2 py-0.5 text-[10px] font-bold text-[#86EFAC] border border-[#4ADE80]/40 font-hand">
                    👑 Defeated
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#FFFDF5] font-display tracking-wide">
                The Arch-Librarian of the Chained Cellar
              </h2>
            </div>
          </div>

          {/* Boss 30-HP Bar */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-bold font-chalk mb-1">
              <span className="text-[#FCA5A5] flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-[#F87171]" /> Boss Grimoire Shield
              </span>
              <span className="text-[#FACC15]">
                {bossHp} / 30 HP (Question {Math.min(currentIndex + 1, 30)} of 30)
              </span>
            </div>
            <div className="h-3.5 w-full overflow-hidden rounded-full bg-black/80 border-2 border-[#F87171]/50">
              <div
                className="h-full bg-gradient-to-r from-[#DC2626] via-[#EA580C] to-[#FACC15] transition-all duration-300"
                style={{ width: `${(bossHp / 30) * 100}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#FFFDF5]/25 bg-black/60 px-3 py-2 text-xs font-bold text-[#FFFDF5] hover:border-[#FACC15] hover:text-[#FACC15] transition-colors cursor-pointer font-hand"
          >
            <X className="h-4 w-4" /> Exit Cellar
          </button>
        </div>

        {/* Center / Bottom Interactive Overlays depending on battleState */}
        <div className="relative z-10 flex-1 flex flex-col justify-between p-4 sm:p-6 pointer-events-none">
          {/* Top Status Toast */}
          {lastFeedback && battleState === 'fighting' && (
            <div className="mx-auto max-w-xl rounded-xl border border-[#FACC15]/40 bg-black/75 backdrop-blur-md px-4 py-2 text-center text-xs sm:text-sm font-bold text-[#FDE68A] font-hand shadow-lg">
              ⚡ {lastFeedback}
            </div>
          )}

          <div className="mt-auto pointer-events-auto">
            {/* STATE 1: INTRO */}
            {battleState === 'intro' && (
              <div className="mx-auto max-w-2xl rounded-2xl border-2 border-[#FACC15] bg-black/85 backdrop-blur-md p-6 text-center shadow-[0_0_50px_rgba(0,0,0,0.9)]">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#FACC15] bg-[#FACC15]/15 text-[#FACC15]">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#FFFDF5] font-display">
                  Welcome to the Torchlit Underground Cellar!
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#FFFDF5]/85 font-hand leading-relaxed">
                  You unlocked the 114-Badge Cellar Key and broke the iron chains! Inside this 3D subterranean library, the Arch-Librarian hurls enchanted textbooks at you. Answer <strong>30 questions</strong> drawn from the entire Part I & Part II curriculum.{" "}
                  <span className="text-[#FCA5A5] font-bold">
                    Warning: If you get a single question wrong, a flying tome strikes you down and YOU DIE!
                  </span>
                </p>
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={handleStartOrRespawn}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#FACC15] bg-[#FACC15] px-6 py-3 text-base font-bold text-[#1C1917] hover:bg-[#FDE047] transition-all cursor-pointer font-chalk shadow-[0_0_25px_rgba(250,204,21,0.5)]"
                  >
                    <Zap className="h-5 w-5 fill-[#1C1917]" />
                    Begin 30-Question 3D Boss Battle
                  </button>
                </div>
              </div>
            )}

            {/* STATE 2: FIGHTING (30 Questions HUD) */}
            {battleState === 'fighting' && currentQuestion && (
              <div className="mx-auto max-w-4xl rounded-2xl border-2 border-[#A855F7]/70 bg-black/82 backdrop-blur-md p-4 sm:p-5 shadow-[0_15px_45px_rgba(0,0,0,0.9)]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="rounded bg-[#A855F7]/25 px-2.5 py-0.5 text-xs font-bold text-[#E9D5FF] border border-[#A855F7]/50 font-chalk">
                    Tome Attack #{currentIndex + 1} of 30 · {currentQuestion.moduleRef}
                  </span>
                  <span className="text-xs font-bold text-[#FCA5A5] font-hand">
                    ⚠️ One wrong answer = Instant Death by Flying Book!
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-[#FFFDF5] font-chalk leading-snug mb-3.5">
                  {formatMathText(currentQuestion.prompt)}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        className="group flex items-center gap-3 rounded-xl border-2 border-[#FFFDF5]/20 bg-[#1B1626]/90 px-4 py-3 text-left text-sm font-bold text-[#FFFDF5] hover:border-[#FACC15] hover:bg-[#2E2142] transition-all cursor-pointer font-hand"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#FACC15]/50 bg-[#FACC15]/15 text-xs font-bold text-[#FACC15] group-hover:bg-[#FACC15] group-hover:text-[#1C1917] font-chalk">
                          {letters[idx]}
                        </span>
                        <span className="flex-1">{formatMathText(opt)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STATE 3: YOU DIED */}
            {battleState === 'dead' && (
              <div className="mx-auto max-w-2xl rounded-2xl border-4 border-[#EF4444] bg-[#1F0909]/95 backdrop-blur-md p-6 text-center shadow-[0_0_70px_rgba(239,68,68,0.6)] animate-in fade-in zoom-in-95 duration-200">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#EF4444] bg-[#EF4444]/20 text-[#FCA5A5]">
                  <Skull className="h-9 w-9" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-widest text-[#EF4444] font-display uppercase">
                  YOU DIED
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#FECACA] font-hand">
                  {deathReason}
                </p>
                {currentQuestion && (
                  <div className="mt-3 rounded-xl border border-[#EF4444]/40 bg-black/50 p-3 text-xs text-[#FFFDF5]/85 font-hand text-left">
                    <strong className="text-[#FACC15]">Scholar’s Note:</strong>{' '}
                    {formatMathText(currentQuestion.explanation)}
                  </div>
                )}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartOrRespawn}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#FACC15] bg-[#FACC15] px-6 py-3 text-sm font-bold text-[#1C1917] hover:bg-[#FDE047] transition-all cursor-pointer font-chalk shadow-lg"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Respawn in Cellar & Retry (30 Questions)
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#FFFDF5]/25 bg-black/50 px-4 py-3 text-sm font-bold text-[#FFFDF5] hover:border-[#FFFDF5] transition-all cursor-pointer font-hand"
                  >
                    Retreat to Classroom
                  </button>
                </div>
              </div>
            )}

            {/* STATE 4: VICTORY (BADGE #115 ACQUIRED) */}
            {battleState === 'victory' && (
              <div className="mx-auto max-w-2xl rounded-2xl border-4 border-[#FACC15] bg-[#14281D]/95 backdrop-blur-md p-6 text-center shadow-[0_0_70px_rgba(250,204,21,0.5)]">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#FACC15] bg-[#FACC15]/20 text-[#FACC15]">
                  <Crown className="h-9 w-9" />
                </div>
                <span className="rounded-full bg-[#FACC15] px-3 py-1 text-xs font-bold text-[#1C1917] font-chalk">
                  👑 BADGE #115 UNLOCKED · +500 MASTERY POINTS
                </span>
                <h3 className="mt-3 text-3xl font-bold text-[#FFFDF5] font-display">
                  Supreme Cellar Overlord!
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#FFFDF5]/85 font-hand">
                  You deflected all 30 flying textbooks and conquered the Arch-Librarian of the Underground Cellar! All 115 Mastery Badges of Ganita Prakash Class 8 are now yours!
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartOrRespawn}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#FFFDF5]/30 bg-black/40 px-4 py-2.5 text-xs font-bold text-[#FFFDF5] hover:border-[#FACC15] transition-all cursor-pointer font-hand"
                  >
                    <RotateCcw className="h-4 w-4" /> Replay Boss Battle
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#FACC15] bg-[#FACC15] px-6 py-2.5 text-sm font-bold text-[#1C1917] hover:bg-[#FDE047] transition-all cursor-pointer font-chalk shadow-lg"
                  >
                    <Trophy className="h-4 w-4" /> Return to Trophy Room
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
