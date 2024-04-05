import { MeshBasicMaterial, ShapeGeometry, Mesh, DoubleSide } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const addFont = (text, size, callBack) => {
    const loader = new FontLoader();
    loader.load('src/assets/fonts/gentilis_bold.typeface.json', function (font) {

        const color = 0xffffff;
        const matLite = new MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            side: DoubleSide,
        });
        const shapes = font.generateShapes(text, size);
        const geometry = new ShapeGeometry(shapes);
        geometry.computeBoundingBox();
        const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(xMid, 0, 0);
        const textMesh = new Mesh(geometry, matLite);
        callBack(textMesh);
    });
}

export { addFont };