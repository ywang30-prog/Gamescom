import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Button from './Button';

export default function ReflexRange() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gamepadIndexRef = useRef(null);

  // Game state
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(30);

  // Calculate accuracy on the fly
  const accuracy = totalShots === 0 ? 0 : Math.round((totalHits / totalShots) * 100);

  // 3D Camera
  const cameraRef = useRef({
    x: 0,
    y: 1.6, // Eye height (meters)
    z: 0,
    yaw: 0,   // Horizontal rotation
    pitch: 0  // Vertical rotation
  });

  // Game objects
  const targetsRef = useRef([]);
  const particlesRef = useRef([]);
  const bulletsRef = useRef([]);
  const muzzleFlashRef = useRef({ active: false, time: 0 });
  const lastShotTimeRef = useRef(0);
  const triggerPressedRef = useRef(false);
  const startTimeRef = useRef(0);

  // Game settings
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 800;
  const MOVE_SPEED = 0.08; // Units per frame
  const LOOK_SENSITIVITY = 0.04;
  const SHOT_COOLDOWN = 250;
  const MAX_TARGETS = 8;
  const FOV = 90;
  const TARGET_SIZE = 0.6; // meters - visual size
  const HIT_RADIUS = 1.2; // meters - collision radius (more forgiving)

  // Aim Assist settings
  const AIM_ASSIST_ENABLED = true;
  const AIM_ASSIST_ACTIVATION_ANGLE = 0.15; // radians (~8.5 degrees) - moderate zone
  const AIM_ASSIST_SLOWDOWN = 0.5; // 50% sensitivity reduction when near target
  const AIM_ASSIST_MAGNETISM = 0.25; // 25% pull strength toward target

  // Detect gamepad
  useEffect(() => {
    const handleGamepadConnected = (e) => {
      gamepadIndexRef.current = e.gamepad.index;
    };
    const handleGamepadDisconnected = () => {
      gamepadIndexRef.current = null;
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        gamepadIndexRef.current = i;
        break;
      }
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTotalShots(0);
    setTotalHits(0);
    setElapsedTime(30);
    cameraRef.current = { x: 0, y: 1.6, z: 0, yaw: 0, pitch: 0 };
    targetsRef.current = [];
    particlesRef.current = [];
    bulletsRef.current = [];
    muzzleFlashRef.current = { active: false, time: 0 };
    lastShotTimeRef.current = 0;
    triggerPressedRef.current = false;
    startTimeRef.current = Date.now();

    // Spawn initial targets
    for (let i = 0; i < MAX_TARGETS; i++) {
      spawnTarget();
    }
  };

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const gameLoop = () => {
      const now = Date.now();
      const camera = cameraRef.current;
      const gamepad = gamepadIndexRef.current !== null ? navigator.getGamepads()[gamepadIndexRef.current] : null;

      // Update countdown time
      const timeRemaining = 30 - Math.floor((now - startTimeRef.current) / 1000);
      setElapsedTime(Math.max(0, timeRemaining));

      // End game when time runs out
      if (timeRemaining <= 0) {
        setGameState('finished');
        return;
      }

      if (gamepad) {
        // Right stick - look around (camera rotation)
        const rightX = Math.abs(gamepad.axes[2]) > 0.15 ? gamepad.axes[2] : 0;
        const rightY = Math.abs(gamepad.axes[3]) > 0.15 ? gamepad.axes[3] : 0;

        // Aim Assist calculation
        let sensitivityMultiplier = 1.0;
        let magnetismYaw = 0;
        let magnetismPitch = 0;

        if (AIM_ASSIST_ENABLED && targetsRef.current.length > 0) {
          // Find nearest target to crosshair
          let nearestTarget = null;
          let smallestAngle = Infinity;

          targetsRef.current.forEach(target => {
            // Calculate angle from camera to target
            const dx = target.x - camera.x;
            const dy = target.y - camera.y;
            const dz = target.z - camera.z;

            // Calculate yaw angle to target
            const targetYaw = Math.atan2(dx, dz);
            const targetPitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));

            // Calculate angular distance from crosshair to target
            const yawDiff = targetYaw - (-camera.yaw); // Negate camera.yaw to match inverted controls
            const pitchDiff = targetPitch - camera.pitch;

            // Normalize yaw difference to [-PI, PI]
            let normalizedYawDiff = yawDiff;
            while (normalizedYawDiff > Math.PI) normalizedYawDiff -= Math.PI * 2;
            while (normalizedYawDiff < -Math.PI) normalizedYawDiff += Math.PI * 2;

            const angularDistance = Math.sqrt(normalizedYawDiff * normalizedYawDiff + pitchDiff * pitchDiff);

            if (angularDistance < smallestAngle) {
              smallestAngle = angularDistance;
              nearestTarget = { target, yawDiff: normalizedYawDiff, pitchDiff };
            }
          });

          // Apply aim assist if target is within activation zone
          if (nearestTarget && smallestAngle < AIM_ASSIST_ACTIVATION_ANGLE) {
            // Slowdown: reduce sensitivity when near target
            const assistStrength = 1 - (smallestAngle / AIM_ASSIST_ACTIVATION_ANGLE);
            sensitivityMultiplier = 1 - (AIM_ASSIST_SLOWDOWN * assistStrength);

            // Magnetism: pull crosshair toward target (only when stick is moving)
            if (Math.abs(rightX) > 0.15 || Math.abs(rightY) > 0.15) {
              magnetismYaw = nearestTarget.yawDiff * AIM_ASSIST_MAGNETISM * assistStrength;
              magnetismPitch = nearestTarget.pitchDiff * AIM_ASSIST_MAGNETISM * assistStrength;
            }
          }
        }

        // Apply look input with aim assist
        camera.yaw -= (rightX * LOOK_SENSITIVITY * sensitivityMultiplier) + magnetismYaw;
        camera.pitch += (rightY * LOOK_SENSITIVITY * sensitivityMultiplier) + magnetismPitch;

        // Clamp pitch to prevent looking too far up/down
        camera.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, camera.pitch));

        // Left stick - move in 3D space
        const leftX = Math.abs(gamepad.axes[0]) > 0.15 ? gamepad.axes[0] : 0;
        const leftY = Math.abs(gamepad.axes[1]) > 0.15 ? gamepad.axes[1] : 0;

        // Use negative yaw to match inverted look controls
        const moveYaw = -camera.yaw;

        // Forward/backward movement (along look direction, ignoring pitch)
        // Negate leftY so forward (negative) moves forward, backward (positive) moves back
        camera.x += Math.sin(moveYaw) * -leftY * MOVE_SPEED;
        camera.z += Math.cos(moveYaw) * -leftY * MOVE_SPEED;

        // Strafe left/right (perpendicular to look direction)
        camera.x += Math.sin(moveYaw + Math.PI / 2) * leftX * MOVE_SPEED;
        camera.z += Math.cos(moveYaw + Math.PI / 2) * leftX * MOVE_SPEED;

        // Right trigger - shoot
        const trigger = gamepad.buttons[7]?.value || 0;
        if (trigger > 0.5 && !triggerPressedRef.current && now - lastShotTimeRef.current > SHOT_COOLDOWN) {
          shoot(now);
          lastShotTimeRef.current = now;
          triggerPressedRef.current = true;
        } else if (trigger <= 0.5) {
          triggerPressedRef.current = false;
        }
      }

      // Update bullets
      bulletsRef.current.forEach(bullet => {
        const speed = 0.5; // units per frame
        // Negate yaw to match inverted look controls
        const yaw = -bullet.yaw;
        bullet.x += Math.sin(yaw) * Math.cos(bullet.pitch) * speed;
        bullet.y -= Math.sin(bullet.pitch) * speed;
        bullet.z += Math.cos(yaw) * Math.cos(bullet.pitch) * speed;
        bullet.distance += speed;
      });

      // Remove bullets that traveled too far (count as misses)
      const bulletsBeforeRemoval = bulletsRef.current.length;
      bulletsRef.current = bulletsRef.current.filter(bullet => bullet.distance < 50);
      const missedShots = bulletsBeforeRemoval - bulletsRef.current.length;
      if (missedShots > 0) {
        setTotalShots(prev => prev + missedShots);
      }

      // Check bullet-target collisions
      bulletsRef.current = bulletsRef.current.filter(bullet => {
        for (let i = 0; i < targetsRef.current.length; i++) {
          const target = targetsRef.current[i];
          const dx = bullet.x - target.x;
          const dy = bullet.y - target.y;
          const dz = bullet.z - target.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < HIT_RADIUS) {
            handleHit(target);
            targetsRef.current.splice(i, 1);
            spawnTarget();
            setTotalShots(prev => prev + 1); // Count this shot now that it resolved
            return false;
          }
        }
        return true;
      });

      // Update muzzle flash
      if (muzzleFlashRef.current.active && now - muzzleFlashRef.current.time > 80) {
        muzzleFlashRef.current.active = false;
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life -= 0.015;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        particle.vy -= 0.01; // gravity
        return particle.life > 0;
      });

      render(ctx, now);
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [gameState]);

  const spawnTarget = () => {
    // Spawn targets in a large area around the player
    const angle = Math.random() * Math.PI * 2;
    const distance = 5 + Math.random() * 15; // 5-20 meters away
    const height = 0.5 + Math.random() * 2.5; // 0.5-3 meters high

    targetsRef.current.push({
      x: Math.sin(angle) * distance,
      y: height,
      z: Math.cos(angle) * distance,
      spawnTime: Date.now(),
      id: Math.random()
    });
  };

  const shoot = (now) => {
    muzzleFlashRef.current = { active: true, time: now };

    // Create bullet
    const camera = cameraRef.current;
    bulletsRef.current.push({
      x: camera.x,
      y: camera.y,
      z: camera.z,
      yaw: camera.yaw,
      pitch: camera.pitch,
      distance: 0,
      startTime: now
    });
  };

  const handleHit = (target) => {
    setTotalHits(prev => prev + 1);
    setScore(prev => prev + 100);

    // Create hit particles in 3D
    for (let i = 0; i < 30; i++) {
      particlesRef.current.push({
        x: target.x,
        y: target.y,
        z: target.z,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        vz: (Math.random() - 0.5) * 0.1,
        life: 1,
        size: 0.05 + Math.random() * 0.05
      });
    }
  };

  const project3DTo2D = (x, y, z) => {
    const camera = cameraRef.current;

    // Translate to camera space
    const dx = x - camera.x;
    const dy = y - camera.y;
    const dz = z - camera.z;

    // Rotate by camera yaw (horizontal)
    const cosYaw = Math.cos(-camera.yaw);
    const sinYaw = Math.sin(-camera.yaw);
    const rx = dx * cosYaw - dz * sinYaw;
    const rz = dx * sinYaw + dz * cosYaw;

    // Rotate by camera pitch (vertical)
    const cosPitch = Math.cos(-camera.pitch);
    const sinPitch = Math.sin(-camera.pitch);
    const ry = dy * cosPitch - rz * sinPitch;
    const finalZ = dy * sinPitch + rz * cosPitch;

    // Behind camera check
    if (finalZ <= 0.1) return null;

    // Perspective projection
    const fov = FOV * (Math.PI / 180);
    const scale = (CANVAS_HEIGHT / 2) / Math.tan(fov / 2);
    const screenX = (rx / finalZ) * scale + CANVAS_WIDTH / 2;
    const screenY = -(ry / finalZ) * scale + CANVAS_HEIGHT / 2; // Negate Y to flip vertical axis

    return { x: screenX, y: screenY, z: finalZ };
  };

  const render = (ctx, now) => {
    // Dark background
    ctx.fillStyle = '#000510';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw 3D grid room
    drawGridRoom(ctx);

    // Collect and sort all 3D objects by distance
    const renderQueue = [];

    // Add targets
    targetsRef.current.forEach(target => {
      const camera = cameraRef.current;
      const dx = target.x - camera.x;
      const dy = target.y - camera.y;
      const dz = target.z - camera.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      renderQueue.push({ type: 'target', data: target, distance });
    });

    // Add particles
    particlesRef.current.forEach(particle => {
      const camera = cameraRef.current;
      const dx = particle.x - camera.x;
      const dy = particle.y - camera.y;
      const dz = particle.z - camera.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      renderQueue.push({ type: 'particle', data: particle, distance });
    });

    // Add bullets
    bulletsRef.current.forEach(bullet => {
      const camera = cameraRef.current;
      const dx = bullet.x - camera.x;
      const dy = bullet.y - camera.y;
      const dz = bullet.z - camera.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      renderQueue.push({ type: 'bullet', data: bullet, distance });
    });

    // Sort by distance (far to near)
    renderQueue.sort((a, b) => b.distance - a.distance);

    // Render sorted objects
    renderQueue.forEach(item => {
      if (item.type === 'target') {
        drawTarget(ctx, item.data, now);
      } else if (item.type === 'particle') {
        drawParticle(ctx, item.data);
      } else if (item.type === 'bullet') {
        drawBullet(ctx, item.data);
      }
    });

    // Muzzle flash
    if (muzzleFlashRef.current.active) {
      ctx.fillStyle = 'rgba(255, 220, 100, 0.15)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw crosshair
    drawCrosshair(ctx);

    // Vignette
    const vignette = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 200,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 1.5
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const drawGridRoom = (ctx) => {
    const camera = cameraRef.current;
    const gridSize = 2; // meters
    const gridRange = 40; // Large room
    const roomHeight = 10; // 10 meter tall room

    // Draw floor grid - FIXED IN WORLD SPACE
    for (let x = -gridRange; x <= gridRange; x += gridSize) {
      for (let z = -gridRange; z <= gridRange; z += gridSize) {
        const worldX = x; // Fixed world position
        const worldZ = z;

        // Grid lines
        const corners = [
          { x: worldX, y: 0, z: worldZ },
          { x: worldX + gridSize, y: 0, z: worldZ },
          { x: worldX + gridSize, y: 0, z: worldZ + gridSize },
          { x: worldX, y: 0, z: worldZ + gridSize }
        ];

        const projected = corners.map(c => project3DTo2D(c.x, c.y, c.z)).filter(p => p !== null);

        if (projected.length >= 2) {
          const dx = x - camera.x;
          const dz = z - camera.z;
          const distFromCamera = Math.sqrt(dx * dx + dz * dz);
          const alpha = Math.max(0.1, 1 - (distFromCamera / gridRange));

          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha * 0.15})`; // Tuned down
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(projected[0].x, projected[0].y);
          for (let i = 1; i < projected.length; i++) {
            ctx.lineTo(projected[i].x, projected[i].y);
          }
          ctx.closePath();
          ctx.stroke();

          // Draw dots at intersections (tuned down)
          if (alpha > 0.3) { // Only draw close dots
            projected.forEach(point => {
              ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.3})`;
              ctx.beginPath();
              ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        }
      }
    }

    // Draw walls (back, left, right)
    const wallDistance = 30;

    // Back wall - FIXED IN WORLD SPACE
    for (let x = -wallDistance; x <= wallDistance; x += gridSize) {
      for (let y = 0; y <= roomHeight; y += gridSize) {
        const worldX = x;
        const worldY = y;
        const worldZ = wallDistance;

        const corners = [
          { x: worldX, y: worldY, z: worldZ },
          { x: worldX + gridSize, y: worldY, z: worldZ },
          { x: worldX + gridSize, y: worldY + gridSize, z: worldZ },
          { x: worldX, y: worldY + gridSize, z: worldZ }
        ];

        const projected = corners.map(c => project3DTo2D(c.x, c.y, c.z)).filter(p => p !== null);

        if (projected.length >= 2) {
          ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)'; // Tuned down
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(projected[0].x, projected[0].y);
          for (let i = 1; i < projected.length; i++) {
            ctx.lineTo(projected[i].x, projected[i].y);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    }

    // Left wall - FIXED IN WORLD SPACE
    for (let z = -wallDistance; z <= wallDistance; z += gridSize) {
      for (let y = 0; y <= roomHeight; y += gridSize) {
        const worldX = -wallDistance;
        const worldY = y;
        const worldZ = z;

        const p1 = project3DTo2D(worldX, worldY, worldZ);
        const p2 = project3DTo2D(worldX, worldY + gridSize, worldZ);
        const p3 = project3DTo2D(worldX, worldY, worldZ + gridSize);

        if (p1 && p2) {
          ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)'; // Tuned down
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        if (p1 && p3) {
          ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.stroke();
        }
      }
    }

    // Right wall - FIXED IN WORLD SPACE
    for (let z = -wallDistance; z <= wallDistance; z += gridSize) {
      for (let y = 0; y <= roomHeight; y += gridSize) {
        const worldX = wallDistance;
        const worldY = y;
        const worldZ = z;

        const p1 = project3DTo2D(worldX, worldY, worldZ);
        const p2 = project3DTo2D(worldX, worldY + gridSize, worldZ);
        const p3 = project3DTo2D(worldX, worldY, worldZ + gridSize);

        if (p1 && p2) {
          ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)'; // Tuned down
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        if (p1 && p3) {
          ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.stroke();
        }
      }
    }

    // Ceiling - FIXED IN WORLD SPACE
    for (let x = -gridRange; x <= gridRange; x += gridSize) {
      for (let z = -gridRange; z <= gridRange; z += gridSize) {
        const worldX = x;
        const worldZ = z;

        const corners = [
          { x: worldX, y: roomHeight, z: worldZ },
          { x: worldX + gridSize, y: roomHeight, z: worldZ },
          { x: worldX + gridSize, y: roomHeight, z: worldZ + gridSize },
          { x: worldX, y: roomHeight, z: worldZ + gridSize }
        ];

        const projected = corners.map(c => project3DTo2D(c.x, c.y, c.z)).filter(p => p !== null);

        if (projected.length >= 2) {
          const dx = x - camera.x;
          const dz = z - camera.z;
          const distFromCamera = Math.sqrt(dx * dx + dz * dz);
          const alpha = Math.max(0.05, 1 - (distFromCamera / gridRange));

          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha * 0.1})`; // Very subtle ceiling
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(projected[0].x, projected[0].y);
          for (let i = 1; i < projected.length; i++) {
            ctx.lineTo(projected[i].x, projected[i].y);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  };

  const drawTarget = (ctx, target, now) => {
    const projected = project3DTo2D(target.x, target.y, target.z);
    if (!projected) return;

    const distance = projected.z;
    const screenSize = (TARGET_SIZE / distance) * (CANVAS_HEIGHT / 2);

    // Pulsing effect
    const pulse = 1 + Math.sin(now / 300) * 0.1;
    const size = screenSize * pulse;

    // Outer glow ring
    ctx.strokeStyle = '#00b6fa';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00b6fa';
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner fill
    const gradient = ctx.createRadialGradient(
      projected.x, projected.y, 0,
      projected.x, projected.y, size
    );
    gradient.addColorStop(0, 'rgba(0, 182, 250, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 182, 250, 0.2)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
    ctx.fill();

    // Center dot
    ctx.fillStyle = '#00d4ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00d4ff';
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Crosshair
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    const crossSize = size * 0.5;
    ctx.beginPath();
    ctx.moveTo(projected.x - crossSize, projected.y);
    ctx.lineTo(projected.x + crossSize, projected.y);
    ctx.moveTo(projected.x, projected.y - crossSize);
    ctx.lineTo(projected.x, projected.y + crossSize);
    ctx.stroke();
  };

  const drawParticle = (ctx, particle) => {
    const projected = project3DTo2D(particle.x, particle.y, particle.z);
    if (!projected) return;

    const distance = projected.z;
    const screenSize = (particle.size / distance) * (CANVAS_HEIGHT / 2);

    ctx.fillStyle = '#00d4ff';
    ctx.globalAlpha = particle.life;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00d4ff';
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, Math.max(2, screenSize), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };

  const drawBullet = (ctx, bullet) => {
    const projected = project3DTo2D(bullet.x, bullet.y, bullet.z);
    if (!projected) return;

    const distance = projected.z;
    const bulletSize = (0.1 / distance) * (CANVAS_HEIGHT / 2); // 0.1 meter bullet

    ctx.fillStyle = '#ffff00';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffff00';
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, Math.max(4, bulletSize), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const drawCrosshair = (ctx) => {
    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2;

    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00ff88';

    // Center dot
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();

    // Crosshair lines
    const size = 12;
    const gap = 6;
    ctx.beginPath();
    ctx.moveTo(cx - size, cy);
    ctx.lineTo(cx - gap, cy);
    ctx.moveTo(cx + size, cy);
    ctx.lineTo(cx + gap, cy);
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx, cy - gap);
    ctx.moveTo(cx, cy + size);
    ctx.lineTo(cx, cy + gap);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // KeyBinding Chip Component
  const KeyBindingChip = ({ text }) => (
    <div className="border border-[#4d4d4d] flex items-center justify-center min-w-[24px] h-[24px] px-1 py-1.5 rounded">
      <span className="font-logitech font-bold text-[#a7a7a8] text-sm leading-[1.3] tracking-[-0.42px]">
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {gameState === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-[800px]">
            {/* Top content area */}
            <div className="bg-[#1a1a1a] p-10 rounded-t-xl">
              <div className="flex flex-col gap-6">
                <h2 className="font-logitech font-bold text-2xl text-white leading-[28px] tracking-[-0.96px]">
                  Aim Training
                </h2>
                <p className="font-logitech text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                  Test controller inputs and fine-tune stick sensitivity in a 3D aim training environment.
                </p>
                <div className="flex flex-col gap-1 w-[277px]">
                  {/* Command: Left Stick */}
                  <div className="flex gap-2 items-center py-2">
                    <div className="flex gap-2 items-center w-[110px]">
                      <KeyBindingChip text="L" />
                      <span className="font-logitech font-bold text-sm text-white leading-[1.3] tracking-[-0.42px]">
                        Left Stick
                      </span>
                    </div>
                    <span className="font-logitech text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                      Move forward / backward
                    </span>
                  </div>
                  {/* Command: Right Stick (Aim) */}
                  <div className="flex gap-2 items-center py-2">
                    <div className="flex gap-2 items-center w-[110px]">
                      <KeyBindingChip text="R" />
                      <span className="font-logitech font-bold text-sm text-white leading-[1.3] tracking-[-0.42px]">
                        Right Stick
                      </span>
                    </div>
                    <span className="font-logitech text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                      Aim
                    </span>
                  </div>
                  {/* Command: Right Trigger */}
                  <div className="flex gap-2 items-center py-2">
                    <div className="flex gap-2 items-center w-[110px]">
                      <KeyBindingChip text="RT" />
                      <span className="font-logitech font-bold text-sm text-white leading-[1.3] tracking-[-0.42px]">
                        Right Stick
                      </span>
                    </div>
                    <span className="font-logitech text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                      Fire
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom button bar */}
            <div className="bg-[#1a1a1a] h-[89px] rounded-b-xl relative">
              {/* Divider */}
              <div className="absolute top-0 left-0 right-[-1px] h-px bg-[rgba(255,255,255,0.1)]" />

              {/* Info text - left side */}
              <div className="absolute left-[30px] top-1/2 -translate-y-1/2 flex gap-1.5 items-center">
                <div className="relative w-4 h-4">
                  <div className="absolute inset-[8.33%]">
                    <img src="/info-icon.svg" alt="" className="absolute block inset-0 w-full h-full" />
                  </div>
                </div>
                <p className="font-logitech text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px] whitespace-nowrap">
                  Any changes to the controller will be applied in the aim training
                </p>
              </div>

              {/* Buttons - right side */}
              <div className="absolute right-[36px] top-1/2 -translate-y-1/2 flex gap-4 items-center">
                <button
                  onClick={() => navigate('/')}
                  className="bg-[#2e2e2e] border border-[#666] hover:bg-[#383838] text-white font-logitech font-bold text-sm h-10 px-6 rounded-lg tracking-[0.42px] transition-colors uppercase"
                >
                  QUIT
                </button>
                <button
                  onClick={startGame}
                  className="bg-[#00b6fa] hover:bg-[#0099d9] text-black font-logitech font-bold text-sm h-10 px-6 rounded-lg tracking-[0.42px] transition-colors uppercase"
                >
                  PLAY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-[600px]">
            {/* Results content area */}
            <div className="bg-[#1a1a1a] p-10 rounded-t-xl">
              <div className="flex flex-col items-center gap-8">
                <h2 className="font-logitech font-bold text-3xl text-white leading-[28px] tracking-[-0.96px]">
                  Training Complete
                </h2>

                {/* Final Score */}
                <div className="flex flex-col items-center gap-2">
                  <span className="font-logitech text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                    FINAL SCORE
                  </span>
                  <span className="font-logitech font-bold text-6xl text-[#00b6fa] tracking-[-0.96px]">
                    {score}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="flex gap-8 w-full justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-logitech text-xs text-[#666] uppercase">Accuracy</span>
                    <span className="font-logitech font-bold text-2xl text-white">{accuracy}%</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-logitech text-xs text-[#666] uppercase">Hits</span>
                    <span className="font-logitech font-bold text-2xl text-white">{totalHits}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-logitech text-xs text-[#666] uppercase">Shots</span>
                    <span className="font-logitech font-bold text-2xl text-white">{totalShots}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom button bar */}
            <div className="bg-[#1a1a1a] h-[89px] rounded-b-xl relative">
              {/* Divider */}
              <div className="absolute top-0 left-0 right-[-1px] h-px bg-[rgba(255,255,255,0.1)]" />

              {/* Buttons - centered */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex gap-4 items-center">
                <button
                  onClick={() => navigate('/')}
                  className="bg-[#2e2e2e] border border-[#666] hover:bg-[#383838] text-white font-logitech font-bold text-sm h-10 px-6 rounded-lg tracking-[0.42px] transition-colors uppercase"
                >
                  QUIT
                </button>
                <button
                  onClick={startGame}
                  className="bg-[#00b6fa] hover:bg-[#0099d9] text-black font-logitech font-bold text-sm h-10 px-6 rounded-lg tracking-[0.42px] transition-colors uppercase"
                >
                  PLAY AGAIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex-1 relative">
          {/* Score Banner Overlay */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex gap-[8px] items-center">
            {/* Points Section */}
            <div className="bg-[rgba(5,5,5,0.72)] border border-[rgba(255,255,255,0.2)] border-solid flex flex-col h-[62px] items-start p-px rounded-[4px] shrink-0 w-[150px]">
              <div className="flex flex-col justify-between h-[60px] items-start px-[8px] py-[10px] rounded-[4px] shrink-0 w-full">
                <p className="font-logitech leading-[16px] text-[#8e8e8f] text-[12px] whitespace-nowrap">POINTS</p>
                <p className="font-logitech font-bold leading-[20px] text-[24px] text-[#e6e6e6] tracking-[-0.42px] whitespace-nowrap">{score}</p>
              </div>
            </div>

            {/* Time Section */}
            <div className="bg-[rgba(5,5,5,0.72)] border border-[rgba(255,255,255,0.2)] border-solid flex flex-col h-[62px] items-start p-px rounded-[4px] shrink-0 w-[150px]">
              <div className="flex flex-col justify-between h-[60px] items-start px-[8px] py-[10px] rounded-[4px] shrink-0 w-full">
                <p className="font-logitech leading-[16px] text-[#8e8e8f] text-[12px] whitespace-nowrap">TIME</p>
                <p className="font-logitech font-bold leading-[20px] text-[24px] text-[#e6e6e6] tracking-[-0.42px] whitespace-nowrap">{formatTime(elapsedTime)}</p>
              </div>
            </div>

            {/* Accuracy Section */}
            <div className="bg-[rgba(5,5,5,0.72)] border border-[rgba(255,255,255,0.2)] border-solid flex flex-col h-[62px] items-start p-px rounded-[4px] shrink-0 w-[150px]">
              <div className="flex flex-col justify-between h-[60px] items-start px-[8px] py-[10px] rounded-[4px] shrink-0 w-full">
                <p className="font-logitech leading-[16px] text-[#8e8e8f] text-[12px] whitespace-nowrap">ACCURACY</p>
                <p className="font-logitech font-bold leading-[20px] text-[24px] text-[#e6e6e6] tracking-[-0.42px] whitespace-nowrap">{accuracy}%</p>
              </div>
            </div>
          </div>

          {/* Exit Button */}
          <button
            onClick={() => setGameState('menu')}
            className="absolute top-6 right-6 z-10 text-[#8e8e8f] hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Game Canvas - Full Screen */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
