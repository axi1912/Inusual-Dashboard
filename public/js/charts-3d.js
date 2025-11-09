// 3D CHARTS SYSTEM
// Advanced Three.js 3D Data Visualization

class Charts3D {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.controls = {};
        this.animations = {};
        this.manualRotation = {};
        
        // 🔥 DATOS INICIALES REALES (serán actualizados desde el dashboard)
        this.data = {
            stats: {
                tickets: window.initialStats?.totalTickets || 0,
                vouches: window.initialStats?.totalVouches || 0,
                verified: window.initialStats?.verifiedUsers || 0,
                active: window.initialStats?.activeTickets || 0
            },
            activity: [65, 89, 92, 78, 56, 89, 95], // Datos por defecto, serán actualizados
            performance: [88, 92, 85, 97, 89, 93, 96] // Datos por defecto, serán actualizados
        };
        this.init();
    }

    init() {
        this.createStatscube();
        this.createActivitySphere();
        this.createPerformanceWaves();
        this.startAnimationLoop();
        this.setupResize();
    }

    createStatscube() {
        const container = document.getElementById('stats-3d-chart');
        if (!container) return;

        // Scene setup
        this.scenes.stats = new THREE.Scene();
        this.scenes.stats.background = new THREE.Color(0x0a0a0a);

        // Camera
        this.cameras.stats = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.cameras.stats.position.set(5, 5, 5);

        // Renderer
        this.renderers.stats = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderers.stats.setSize(container.offsetWidth, container.offsetHeight);
        this.renderers.stats.shadowMap.enabled = true;
        this.renderers.stats.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderers.stats.domElement);

        // Controls (with fallback)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls.stats = new THREE.OrbitControls(this.cameras.stats, this.renderers.stats.domElement);
            this.controls.stats.enableDamping = true;
            this.controls.stats.dampingFactor = 0.05;
            this.controls.stats.autoRotate = true;
            this.controls.stats.autoRotateSpeed = 2;
        } else {
            console.log('OrbitControls not available, using manual rotation');
            this.manualRotation = { stats: true };
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scenes.stats.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00D9A3, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scenes.stats.add(directionalLight);

        // Create data cubes
        this.createDataCubes();

        // Add info overlay
        this.addInfoOverlay(container, 'Interactive 3D Stats - Drag to rotate');
    }

    createDataCubes() {
        const cubeGroup = new THREE.Group();
        const stats = this.data.stats;
        const positions = [
            { x: -2, y: 1, z: 0, value: stats.tickets, color: 0x00D9A3, label: 'Tickets' },
            { x: 2, y: 1, z: 0, value: stats.vouches, color: 0x667eea, label: 'Vouches' },
            { x: 0, y: 1, z: -2, value: stats.verified, color: 0xf093fb, label: 'Verified' },
            { x: 0, y: 1, z: 2, value: stats.active, color: 0xffd93d, label: 'Active' }
        ];

        positions.forEach((pos, index) => {
            const height = (pos.value / 100) * 3 + 0.5;
            const geometry = new THREE.BoxGeometry(1, height, 1);
            const material = new THREE.MeshPhongMaterial({ 
                color: pos.color,
                transparent: true,
                opacity: 0.8,
                shininess: 100
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(pos.x, height / 2, pos.z);
            cube.castShadow = true;
            cube.receiveShadow = true;
            
            // Add glow effect
            const glowGeometry = new THREE.BoxGeometry(1.2, height + 0.2, 1.2);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: pos.color,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(cube.position);
            
            cubeGroup.add(cube);
            cubeGroup.add(glow);

            // Animation
            this.animations[`cube_${index}`] = () => {
                cube.rotation.y += 0.01;
                glow.rotation.y += 0.01;
                cube.position.y = Math.sin(Date.now() * 0.001 + index) * 0.2 + height / 2;
            };
        });

        // Add base platform
        const platformGeometry = new THREE.CylinderGeometry(4, 4, 0.2, 32);
        const platformMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.6
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.1;
        platform.receiveShadow = true;
        cubeGroup.add(platform);

        this.scenes.stats.add(cubeGroup);
    }

    createActivitySphere() {
        const container = document.getElementById('activity-3d-chart');
        if (!container) return;

        // Scene setup
        this.scenes.activity = new THREE.Scene();
        this.scenes.activity.background = new THREE.Color(0x0a0a0a);

        // Camera
        this.cameras.activity = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.cameras.activity.position.set(0, 0, 8);

        // Renderer
        this.renderers.activity = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderers.activity.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(this.renderers.activity.domElement);

        // Controls (with fallback)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls.activity = new THREE.OrbitControls(this.cameras.activity, this.renderers.activity.domElement);
            this.controls.activity.enableDamping = true;
            this.controls.activity.autoRotate = true;
            this.controls.activity.autoRotateSpeed = 1;
        } else {
            this.manualRotation = { ...this.manualRotation, activity: true };
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scenes.activity.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00D9A3, 1, 100);
        pointLight.position.set(0, 0, 10);
        this.scenes.activity.add(pointLight);

        // Create activity sphere
        this.createActivityVisualization();

        this.addInfoOverlay(container, 'Activity Data Sphere - 7 Days');
    }

    createActivityVisualization() {
        const sphereGroup = new THREE.Group();
        
        // Main sphere
        const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x00D9A3,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereGroup.add(sphere);

        // Activity data points
        this.data.activity.forEach((value, index) => {
            const phi = Math.acos(-1 + (2 * index) / this.data.activity.length);
            const theta = Math.sqrt(this.data.activity.length * Math.PI) * phi;
            
            const radius = 3.5 + (value / 100) * 2;
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(theta) * Math.sin(phi);

            const pointGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const pointMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL((value / 100) * 0.3, 1, 0.5),
                emissive: new THREE.Color().setHSL((value / 100) * 0.3, 0.5, 0.1)
            });
            
            const point = new THREE.Mesh(pointGeometry, pointMaterial);
            point.position.set(x, y, z);
            sphereGroup.add(point);

            // Animation
            this.animations[`point_${index}`] = () => {
                point.rotation.x += 0.02;
                point.rotation.y += 0.02;
                const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.3;
                point.scale.setScalar(scale);
            };
        });

        // Particle system
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00D9A3,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        sphereGroup.add(particles);

        this.animations.particles = () => {
            particles.rotation.y += 0.002;
            particles.rotation.x += 0.001;
        };

        this.scenes.activity.add(sphereGroup);
    }

    createPerformanceWaves() {
        const container = document.getElementById('performance-3d-chart');
        if (!container) return;

        // Scene setup
        this.scenes.performance = new THREE.Scene();
        this.scenes.performance.background = new THREE.Color(0x0a0a0a);

        // Camera
        this.cameras.performance = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.cameras.performance.position.set(0, 5, 10);

        // Renderer
        this.renderers.performance = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderers.performance.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(this.renderers.performance.domElement);

        // Controls (with fallback)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls.performance = new THREE.OrbitControls(this.cameras.performance, this.renderers.performance.domElement);
            this.controls.performance.enableDamping = true;
            this.controls.performance.autoRotate = true;
            this.controls.performance.autoRotateSpeed = 0.5;
        } else {
            this.manualRotation = { ...this.manualRotation, performance: true };
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scenes.performance.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xf093fb, 1, 100, Math.PI / 4, 0.5);
        spotLight.position.set(0, 10, 10);
        this.scenes.performance.add(spotLight);

        // Create performance waves
        this.createWaveVisualization();

        this.addInfoOverlay(container, 'Performance Waves - Real-time');
    }

    createWaveVisualization() {
        const waveGroup = new THREE.Group();
        
        // Create multiple wave planes
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.PlaneGeometry(10, 10, 50, 50);
            const material = new THREE.MeshPhongMaterial({
                color: [0x00D9A3, 0x667eea, 0xf093fb][i],
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide,
                wireframe: false
            });
            
            const wave = new THREE.Mesh(geometry, material);
            wave.rotation.x = -Math.PI / 2;
            wave.position.y = i * 0.5;
            waveGroup.add(wave);

            // Wave animation
            this.animations[`wave_${i}`] = () => {
                const positions = wave.geometry.attributes.position.array;
                const time = Date.now() * 0.002;
                
                for (let j = 0; j < positions.length; j += 3) {
                    const x = positions[j];
                    const y = positions[j + 1];
                    positions[j + 2] = Math.sin(x * 0.3 + time + i) * Math.cos(y * 0.3 + time + i) * 2;
                }
                
                wave.geometry.attributes.position.needsUpdate = true;
                wave.geometry.computeVertexNormals();
            };
        }

        // Add floating performance indicators
        this.data.performance.forEach((value, index) => {
            const height = (value / 100) * 5;
            const geometry = new THREE.CylinderGeometry(0.2, 0.2, height, 8);
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL((value / 100) * 0.3, 1, 0.6),
                emissive: new THREE.Color().setHSL((value / 100) * 0.3, 0.3, 0.1)
            });
            
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.set(
                (index - 3) * 1.5,
                height / 2 + 3,
                -2
            );
            waveGroup.add(cylinder);

            this.animations[`cylinder_${index}`] = () => {
                cylinder.rotation.y += 0.01;
                cylinder.position.y = height / 2 + 3 + Math.sin(Date.now() * 0.002 + index) * 0.5;
            };
        });

        this.scenes.performance.add(waveGroup);
    }

    addInfoOverlay(container, text) {
        const overlay = document.createElement('div');
        overlay.className = 'chart-info-overlay';
        overlay.textContent = text;
        container.appendChild(overlay);
    }

    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);

            // Update controls
            Object.values(this.controls).forEach(control => {
                if (control && control.update) control.update();
            });

            // Manual rotation fallback
            if (this.manualRotation) {
                const time = Date.now() * 0.001;
                if (this.manualRotation.stats && this.cameras.stats) {
                    this.cameras.stats.position.x = Math.cos(time * 0.5) * 8;
                    this.cameras.stats.position.z = Math.sin(time * 0.5) * 8;
                    this.cameras.stats.lookAt(0, 0, 0);
                }
                if (this.manualRotation.activity && this.cameras.activity) {
                    this.cameras.activity.position.x = Math.cos(time * 0.3) * 10;
                    this.cameras.activity.position.z = Math.sin(time * 0.3) * 10;
                    this.cameras.activity.lookAt(0, 0, 0);
                }
                if (this.manualRotation.performance && this.cameras.performance) {
                    this.cameras.performance.position.x = Math.cos(time * 0.2) * 12;
                    this.cameras.performance.position.z = Math.sin(time * 0.2) * 12;
                    this.cameras.performance.lookAt(0, 0, 0);
                }
            }

            // Run animations
            Object.values(this.animations).forEach(animation => animation());

            // Render scenes
            if (this.renderers.stats && this.scenes.stats && this.cameras.stats) {
                this.renderers.stats.render(this.scenes.stats, this.cameras.stats);
            }
            if (this.renderers.activity && this.scenes.activity && this.cameras.activity) {
                this.renderers.activity.render(this.scenes.activity, this.cameras.activity);
            }
            if (this.renderers.performance && this.scenes.performance && this.cameras.performance) {
                this.renderers.performance.render(this.scenes.performance, this.cameras.performance);
            }
        };
        animate();
    }

    setupResize() {
        window.addEventListener('resize', () => {
            Object.keys(this.renderers).forEach(key => {
                const container = document.getElementById(`${key}-3d-chart`);
                if (container && this.renderers[key] && this.cameras[key]) {
                    const width = container.offsetWidth;
                    const height = container.offsetHeight;
                    
                    this.cameras[key].aspect = width / height;
                    this.cameras[key].updateProjectionMatrix();
                    this.renderers[key].setSize(width, height);
                }
            });
        });
    }

    updateData(newData) {
        if (newData.stats) {
            this.data.stats = { ...this.data.stats, ...newData.stats };
        }
        if (newData.activity) {
            this.data.activity = newData.activity;
        }
        if (newData.performance) {
            this.data.performance = newData.performance;
        }
        
        // Rebuild visualizations with new data
        setTimeout(() => {
            this.rebuildVisualizations();
        }, 100);
    }

    rebuildVisualizations() {
        // Clear existing objects and rebuild
        Object.keys(this.scenes).forEach(sceneKey => {
            const scene = this.scenes[sceneKey];
            const objectsToRemove = [];
            scene.traverse(child => {
                if (child.isMesh || child.isGroup) {
                    if (child !== scene) objectsToRemove.push(child);
                }
            });
            objectsToRemove.forEach(obj => scene.remove(obj));
        });

        // Recreate visualizations
        if (this.scenes.stats) this.createDataCubes();
        if (this.scenes.activity) this.createActivityVisualization();
        if (this.scenes.performance) this.createWaveVisualization();
    }
}

// Initialize 3D charts when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to load
    setTimeout(() => {
        if (typeof THREE !== 'undefined') {
            window.charts3D = new Charts3D();
            console.log('🎯 3D Charts initialized successfully!');
        } else {
            console.error('❌ Three.js not loaded');
        }
    }, 500);
});