import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const addOrbitControls = ({ camera, renderer }, callback) => {
	const orbit = new OrbitControls(camera, renderer.domElement);
	orbit.minPolarAngle = 0;
	orbit.maxPolarAngle = Math.PI / 2;
	orbit.enableDamping = true;
	orbit.dampingFactor = 0.1;
	orbit.enableKeys = false;
	orbit.enablePan = false;
	// orbit.enableZoom = false;

	callback(orbit);
}

export { addOrbitControls };

// addOrbitControls({ camera, renderer }, (o) => {
// 	orbit = o;
// orbit.target = ball.position;
// orbit.addEventListener('change', () => {
// const cameraDirection = new THREE.Vector3();
// camera.getWorldDirection(cameraDirection);
// const cameraDirectionNormalized = cameraDirection.normalize();
// const ballDirection = new THREE.Vector3();
// ballDirection.copy(cameraDirectionNormalized);
// ballDirection.multiplyScalar(10);
// ballBody.velocity.copy(ballDirection);

// Fix camera automatically moving backwards
// const cameraPosition = new THREE.Vector3();
// camera.getWorldPosition(cameraPosition);
// const distanceToBall = cameraPosition.distanceTo(ball.position);
// const cameraDirectionToBall = new THREE.Vector3();
// cameraDirectionToBall.subVectors(ball.position, cameraPosition).normalize();
// const cameraNewPosition = new THREE.Vector3();
// cameraNewPosition.copy(ball.position).addScaledVector(cameraDirectionToBall, -distanceToBall);
// camera.position.copy(cameraNewPosition);
// });
// });