import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { spawnFruit } from './fruit';
import dragon from '../assets/models/cut-fruits/dragon-cut.glb';
import pineApple from '../assets/models/cut-fruits/pineApple-cut.glb';
import pomegranate from '../assets/models/cut-fruits/pomegranate-cut.glb';
import juice from '../assets/images/juice-diffuse.png';
const oFruitAssets = {
    dragon,
    pineApple,
    pomegranate
};
const decals = [];
const oColor = {
    dragon: 0x7E0025,
    pineApple: 0xB9A908,
    pomegranate: 0x560F1F
}
const handleMouse = (scene, camera, fruitGroup, cutFruitGroup, fruitsInterval, bombsInterval, updateFruitsInterval, updateBombsInterval, clearIntervals, score, replayButton, fontGroup, background) => {
    const container = document.querySelector('.trail-container');
    const cursor = document.querySelector('.cursor');
    const trailElements = [];
    let previousX, previousY;

    let isBombTouched = false;
    let isDragging = false;
    const slicingRaycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onPointerDown = () => {
        isDragging = true;
    }
    const onPointerUp = (event) => {
        isDragging = false;
        trailElements.forEach(trailElement => {
            if (trailElement.parentNode === container) {
                container.removeChild(trailElement);
            }
        });
        trailElements.length = 0;
    }
    const onPointerMove = (event) => {
        if (!isDragging) return;
        const x = event.clientX;
        const y = event.clientY;

        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;

        if (previousX !== undefined && previousY !== undefined) {
            const distance = Math.sqrt(Math.pow(x - previousX, 2) + Math.pow(y - previousY, 2));
            const angle = Math.atan2(y - previousY, x - previousX);

            for (let i = 0; i < distance; i += 2) {
                const trailElement = document.createElement('div');
                trailElement.classList.add('trail');
                trailElement.style.left = `${previousX + i * Math.cos(angle)}px`;
                trailElement.style.top = `${previousY + i * Math.sin(angle)}px`;
                trailElement.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
                container.appendChild(trailElement);
                trailElements.push(trailElement);

                if (trailElements.length > 100) {
                    const oldTrailElement = trailElements.shift();
                    container.removeChild(oldTrailElement);
                }
            }
        }
        previousX = x;
        previousY = y;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        slicingRaycaster.setFromCamera(mouse, camera);
        const intersects = slicingRaycaster.intersectObjects(fruitGroup.children, true);
        if (intersects.length > 0) {
            const object = intersects[0].object;
            const parent = object.parent;
            if (object.type === 'Mesh' && (object.name === 'dragon' || object.name === 'pineApple' || object.name === 'pomegranate')) {
                const fruitName = object.name;
                if (!isBombTouched) {
                    score++;
                    document.getElementById('score').textContent = `${score}`;
                    if (localStorage.getItem('fruitNinjaBestScore') < score) localStorage.setItem('fruitNinjaBestScore', score);
                    document.getElementById('best-score').textContent = `Best: ${localStorage.getItem('fruitNinjaBestScore')}`;
                    if (score > 0 && score % 5 === 0) {
                        updateFruitsInterval();
                        updateBombsInterval();
                    }
                    const juiceColor = fruitName;
                    addJuice(parent, juiceColor);
                    const selectedModel = oFruitAssets[fruitName];
                    spawnFruit(selectedModel, (gltf) => {
                        const cutFruits = gltf.scene.children;
                        cutFruits.forEach((cutFruit) => {
                            cutFruitGroup.add(cutFruit);
                            setFruitsSize(fruitName, cutFruit);
                            cutFruit.position.copy(parent.position);
                            cutFruit.velocity = new THREE.Vector3(parent.velocity.x, parent.velocity.y, parent.velocity.z);
                            // cutFruit.velocity = new THREE.Vector3(Math.random() * 0.02 + 0.02, Math.random() * 0.01 + 0.01, 0);
                            cutFruit.acceleration = new THREE.Vector3(0, -0.005, 0);
                            cutFruit.acceleration = new THREE.Vector3(parent.acceleration.x, parent.acceleration.y, parent.acceleration.z);
                        });
                    })
                    spawnFruit(selectedModel, (gltf) => {
                        const cutFruits = gltf.scene.children;
                        let i;
                        fruitName == 'pomegranate' ? i = 0 : i = 1;
                        cutFruits.forEach((cutFruit, index) => {
                            if (index === i) {
                                cutFruitGroup.add(cutFruit);
                                setFruitsSize(fruitName, cutFruit);
                                cutFruit.rotation.x = Math.PI;
                                cutFruit.position.copy(parent.position);
                                cutFruit.velocity = new THREE.Vector3(-(Math.random() * 0.02 + 0.02), Math.random() * 0.01 + 0.01, 0);
                                cutFruit.acceleration = new THREE.Vector3(0, -0.005, 0);
                            }
                        });
                    })
                    parent.remove(object);
                }
            }
            if (object.type === 'Mesh' && object.name === 'bomb') {
                if (isBombTouched) return;
                clearInterval(fruitsInterval);
                clearInterval(bombsInterval);
                handleBombCollisiton();
                isBombTouched = true;
            }
        }
    };
    function addJuice(parent, juiceColor) {
        const textureLoader = new THREE.TextureLoader();
        const decalDiffuse = textureLoader.load(juice);
        decalDiffuse.colorSpace = THREE.SRGBColorSpace;

        const decalMaterial = new THREE.MeshPhongMaterial({
            specular: 0x444444,
            map: decalDiffuse,
            normalMap: decalDiffuse,
            normalScale: new THREE.Vector2(1, 1),
            shininess: 30,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: - 4,
            wireframe: false
        });
        const orientation = new THREE.Euler();
        orientation.z = Math.random() * 2 * Math.PI;

        const scale = 3 + Math.random() * 1;
        const size = new THREE.Vector3(1, 1, 1);

        size.set(scale, scale, scale);

        const material = decalMaterial.clone();
        material.color.setHex(oColor[juiceColor]);
        const m = new THREE.Mesh(new DecalGeometry(background, parent.position, orientation, size), material);
        m.renderOrder = decals.length;
        m.position.x = parent.position.x;
        m.position.y = parent.position.y;
        m.position.z = -3;
        decals.push(m);
        scene.add(m);
        animateDecalRemoval(m);
    }

    function animateDecalRemoval(decal) {
        let animationStartTime = null;
        const animationDuration = 3000;
        let decalsToRemove = [];
        decalsToRemove.push(decal);

        const animate = (time) => {
            if (animationStartTime === null) return;
            const elapsedTime = time - animationStartTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
            decalsToRemove.forEach((decalObject) => {
                decalObject.material.opacity = 1 - progress;
            });
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                decalsToRemove.forEach((decal) => {
                    scene.remove(decal);
                });
                decalsToRemove.length = 0;
                animationStartTime = null;
            }
        };
        if (animationStartTime === null) {
            animationStartTime = performance.now();
            requestAnimationFrame(animate);
        }
    }
    function setFruitsSize(fruitName, fruit) {
        switch (fruitName) {
            case 'dragon':
                fruit.scale.set(13, 13, 13);
                break;
            case 'pineApple':
                fruit.scale.set(2, 2, 2);
                break;
            case 'pomegranate':
                fruit.scale.set(0.8, 0.8, 0.8);
                break;
            default:
                break;
        }
    }
    function handleBombCollisiton() {
        document.body.classList.add('shake');
        setTimeout(() => {
            document.body.classList.remove('shake');
            onPointerUp();
            removeEventListener('pointerdown', onPointerDown);
            removeEventListener('pointermove', onPointerMove);
            removeEventListener('pointerup', onPointerUp);
            camera.position.set(0, 0, 5);
            clearIntervals();
            replayButton.style.display = "block";
            document.getElementById("score-container").style.display = "none";
            document.getElementById('game-over').style.display = 'block';
            document.getElementById('final-score').textContent = score;
            document.getElementById('final-best-score').textContent = localStorage.getItem('fruitNinjaBestScore');
        }, 1000);
    }
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
}
export { handleMouse };