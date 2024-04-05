import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
function spawnFruit(model, callBack) {
    const loader = new GLTFLoader();
    loader.load(model, (gltf) => {
        callBack(gltf);
    },
        (xhr) => {
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log('An error happened:', error);
        }
    );
}
export { spawnFruit };