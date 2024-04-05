import { defineConfig } from 'vite';

export default defineConfig({
	// Add .glb to the assetsInclude array
	assetsInclude: ['**/*.glb', '**/*.gltf']
});
