import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const CubeAnimation = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const cubesRef = useRef(null);
  const groupRef = useRef(null);
  const tlRef = useRef(null);
  const dragRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const backgroundColor = 0x000000; // Changed to black for better visibility
    const renderCalls = [];

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(backgroundColor, 30, 300);
    sceneRef.current = scene;

    // Camera setup
    const frustumSize = 3;
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      2000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(backgroundColor, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Alpha map texture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 128;
    const height = canvas.height = 128;

    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#000';
    ctx.fillRect(1, 1, width - 2, height - 2);

    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load(canvas.toDataURL());
    tex.magFilter = THREE.NearestFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 2;

    // Cube setup
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      depthTest: false,
      depthWrite: false,
      transparent: true,
      alphaMap: tex,
      opacity: 0.95,
      side: THREE.DoubleSide
    });

    const cube = new THREE.Mesh(geo, mat);
    cube.material.color.set('#f35a2f'); // Changed to match your theme color
    cube.material.color.offsetHSL(0.02, 0.02, 0);

    const cubes = new THREE.Group();
    for (let i = 0, total = 8; i < total; i++) {
      const clone = cube.clone();
      clone.material = clone.material.clone();
      clone.material.color.offsetHSL(
        0.15 * (i / total),
        0,
        0.15 * (i / total)
      );
      clone.scale.set(
        1 - 0.9 * (i / total),
        1,
        1 - 0.9 * (i / total)
      );
      cubes.add(clone);
    }
    cubesRef.current = cubes;
    scene.add(cubes);

    // Animation setup
    const tl = gsap.timeline({
      repeat: -1,
      delay: 0.9,
      repeatDelay: 0.2,
      yoyo: true
    });
    tl.timeScale(0.8);
    tlRef.current = tl;

    cubes.children.forEach((cube, i, arr) => {
      tl.addLabel(
        'cube' + i,
        0.75 * (1 - i / arr.length)
      );

      tl.to(
        cube.rotation,
        {
          z: Math.PI * 2,
          x: Math.PI * -2,
          duration: 5,
          ease: "power2.inOut",
        },
        'cube' + i
      );

      tl.to(
        cube.scale,
        {
          y: 1 - 0.9 * (i / arr.length),
          duration: 1.25,
          ease: "power2.inOut",
        },
        'cube' + i
      );

      tl.to(
        cube.scale,
        {
          y: 1,
          duration: 1.25,
          ease: "power2.inOut",
        },
        3 + (0.75 * (i / arr.length))
      );
    });

    tl.to(
      tex.offset,
      {
        x: 1,
        y: 1,
        duration: 1.25,
        ease: "power2.in"
      },
      2.25
    );

    tl.to(
      cubes.rotation,
      {
        x: Math.PI * 2,
        z: Math.PI * -2,
        duration: 5.75,
        ease: "power2.inOut",
      },
      0.25
    );

    // Group setup
    const group = new THREE.Group();
    group.add(cubes);
    groupRef.current = group;
    scene.add(group);

    // Drag handling
    const twoPI = Math.PI * 2;
    const quarterAngle = Math.PI / 4;

    const drag = {
      x: 0,
      y: 0,
      dragging: false,
      startX: 0,
      startY: 0,
      _startRotation: 0,
      setPosition(e, start) {
        if (!e) return;
        e.preventDefault();
        const event = e.touches ? e.touches[0] : e;
        this.x = event.pageX;
        this.y = event.pageY;
        if (start) {
          this.startX = this.x;
          this.startY = this.y;
        }
      },
      move(e) {
        if (this.dragging) {
          this.setPosition(e);
          this.onUpdate();
        }
      },
      start(e) {
        this.dragging = true;
        this.setPosition(e, true);
        this.onStart();
        this.onUpdate();
      },
      end(e) {
        if (this.dragging) {
          this.dragging = false;
          this.setPosition(e);
          this.onUpdate();
          this.onEnd();
        }
      },
      onUpdate() {
        const r = (this.x - this.startX) / window.innerWidth;
        group.rotation.y = this._startRotation + (r * twoPI);
      },
      onStart() {
        this._startRotation = group.rotation.y || 0;
        gsap.to(tl, {
          timeScale: 0.2,
          duration: 1.5,
          ease: "power4.out"
        });
      },
      onEnd() {
        const resetTL = gsap.timeline();
        resetTL.to(group.rotation, {
          y: Math.round(group.rotation.y / quarterAngle) * quarterAngle,
          duration: 0.8,
          ease: "power3.inOut"
        }, 0);
        resetTL.to(tl, {
          timeScale: 0.8,
          duration: 0.8,
          ease: "power3.in"
        }, 0.5);
      }
    };

    dragRef.current = drag;

    // Bind event handlers
    const boundStart = drag.start.bind(drag);
    const boundMove = drag.move.bind(drag);
    const boundEnd = drag.end.bind(drag);

    // Add event listeners
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', boundStart);
      container.addEventListener('mousemove', boundMove);
      container.addEventListener('mouseup', boundEnd);
      container.addEventListener('mouseleave', boundEnd);
      
      container.addEventListener('touchstart', boundStart);
      container.addEventListener('touchmove', boundMove);
      container.addEventListener('touchend', boundEnd);
    }

    // Animation loop
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.left = -frustumSize * aspect / 2;
      camera.right = frustumSize * aspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      window.removeEventListener('resize', handleResize);
      
      // Remove event listeners
      if (container) {
        container.removeEventListener('mousedown', boundStart);
        container.removeEventListener('mousemove', boundMove);
        container.removeEventListener('mouseup', boundEnd);
        container.removeEventListener('mouseleave', boundEnd);
        
        container.removeEventListener('touchstart', boundStart);
        container.removeEventListener('touchmove', boundMove);
        container.removeEventListener('touchend', boundEnd);
      }

      // Stop animations
      if (tlRef.current) {
        tlRef.current.kill();
      }

      // Cleanup Three.js resources
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (object.material.map) object.material.map.dispose();
              if (object.material.alphaMap) object.material.alphaMap.dispose();
              object.material.dispose();
            }
          }
        });
        sceneRef.current = null;
      }

      // Clear all refs
      rendererRef.current = null;
      cameraRef.current = null;
      cubesRef.current = null;
      groupRef.current = null;
      tlRef.current = null;
      dragRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent'
      }} 
    />
  );
};

export default CubeAnimation; 