import * as THREE from 'three';
import { spawnFruit } from './fruit';
import { addOrbitControls } from './orbitControls';
import { handleMouse } from './mouseHandle';

// Set up the scene, camera, and renderer
let scene, camera, renderer, orbit, replayButton, fontGroup, score, fruitGroup, cutFruitGroup, bombGroup, buttonGroup, fruit,
	bomb, fruitsInterval, bombsInterval, nRandomX, nRandomY, nRandomZ;
const fruitTypes = ['pineApple', 'dragon', 'pomegranate'];
const setPosition = (object, objectName) => {
	const startX = Math.random() * 8 - 4;
	const startY = -3;
	const startZ = 0;
	object.position.set(startX, startY, startZ);
	const velocityX = startX < 0 ? Math.random() * 0.05 + 0.025 : -Math.random() * 0.05 - 0.025;
	const velocityY = Math.random() * 0.1 + 0.1;
	const velocityZ = 0;
	object.velocity = new THREE.Vector3(velocityX, velocityY, velocityZ);
	object.acceleration = new THREE.Vector3(0, -0.0025, 0);
	switch (objectName) {
		case 'dragon':
			object.scale.set(15, 15, 15);
			break;
		case 'pineApple':
			object.scale.set(2, 2, 2);
			break;
		case 'pomegranate':
			object.scale.set(0.8, 0.8, 0.8);
			break;
		case 'bomb':
			object.scale.set(0.3, 0.3, 0.3);
		default:
			break;
	}
	nRandomX = Math.random() * 0.1 - 0.05;
	nRandomY = Math.random() * 0.1 - 0.05;
	nRandomZ = Math.random() * 0.1 - 0.05;
}
function startGame() {
	clearInterval(fruitsInterval);
	clearInterval(bombsInterval);
	let score = 0;
	document.getElementById('score').textContent = `Score: ${score}`;

	const createObject = (modelPath, object, objectName) => {
		spawnFruit(modelPath, (gltf) => {
			fruitGroup.add(gltf.scene);
			object = gltf.scene;
			object.children[0].name = objectName;
			setPosition(object, objectName);
		});
	};

	const calculateInterval = (score, objectName) => {
		if (objectName == "fruit") {
			return Math.max(1000, 3000 - score * 50);
		} else {
			return Math.max(1000, 6000 - score * 20);
		}
	};

	const spawnFruitsBasedOnScore = (modelPath, object, objectName) => {
		createObject(modelPath, object, objectName);
	};

	const randomFruitType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
	spawnFruitsBasedOnScore(`src/assets/models/fruits/${randomFruitType}.glb`, fruit, randomFruitType);

	const updateFruitsInterval = () => {
		clearInterval(fruitsInterval);
		fruitsInterval = setInterval(() => {
			const randomFruitType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
			spawnFruitsBasedOnScore(`src/assets/models/fruits/${randomFruitType}.glb`, fruit, randomFruitType);
		}, calculateInterval(parseInt(document.getElementById('score').textContent.split(': ').pop()), "fruit"));
	};

	const updateBombsInterval = () => {
		clearInterval(bombsInterval);
		bombsInterval = setInterval(() => {
			spawnFruitsBasedOnScore(`src/assets/models/bomb.glb`, bomb, "bomb");
		}, calculateInterval(parseInt(document.getElementById('score').textContent.split(': ').pop()), "bomb"));
	};

	updateFruitsInterval();
	updateBombsInterval();
	handleMouse(camera, fruitGroup, cutFruitGroup, fruitsInterval, bombsInterval, updateFruitsInterval, updateBombsInterval, score, replayButton, fontGroup);
}
const init = () => {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 5;
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 0, 2);
	scene.add(light);
	const ambientLight = new THREE.AmbientLight(0xffffff, 4);
	ambientLight.position.set(0, 0, 2);
	scene.add(ambientLight);
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('game-division').appendChild(renderer.domElement);
	// addOrbitControls({ camera, renderer }, (o) => {
	// 	orbit = o;
	// });
	fontGroup = new THREE.Group();
	fontGroup.name = 'fontGroup';
	scene.add(fontGroup);
	bombGroup = new THREE.Group();
	bombGroup.name = 'bombGroup';
	scene.add(bombGroup);
	fruitGroup = new THREE.Group();
	fruitGroup.name = 'fruitGroup';
	scene.add(fruitGroup);
	cutFruitGroup = new THREE.Group();
	cutFruitGroup.name = 'cutFruitGroup';
	scene.add(cutFruitGroup);
	const playButton = document.getElementById("playButton");
	playButton.addEventListener("click", () => {
		playButton.style.display = "none";
		startGame();
	})
	replayButton = document.getElementById("replayButton");
	replayButton.addEventListener('click', () => {
		fontGroup.remove(fontGroup.children[0]);
		replayButton.style.display = "none";
		startGame();

	});
}
init();
const updatePosition = (obj) => {
	const parent = obj.parent;
	obj.rotation.x += nRandomX;
	obj.rotation.y += nRandomY;
	obj.rotation.z += nRandomZ;
	obj.position.add(obj.velocity);
	obj.velocity.add(obj.acceleration);
	if (obj.position.y > 50) {
		obj.velocity.y *= -0.8;
		obj.position.y = 50;
	}
	if (obj.position.y < -20) {
		parent.remove(obj);
	}
}
function animate() {
	// orbit.update();
	if (fruitGroup) {
		fruitGroup.children.forEach((obj) => {
			if (obj instanceof THREE.Object3D) {
				updatePosition(obj);
			}
		});
	}
	if (scene.getObjectByName('cutFruitGroup')) {
		const cutFruitGroup = scene.getObjectByName('cutFruitGroup');
		cutFruitGroup.children.forEach((obj) => {
			updatePosition(obj);
		});
	}
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});
