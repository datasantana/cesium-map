<template>
  <div id="cesiumContainer" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = './';

import { Cartesian3, Cartographic, Cesium3DTileset, EllipsoidTerrainProvider, Ion, Math as CesiumMath, Matrix4, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onMounted } from 'vue';

// Your access token can be found at: https://ion.cesium.com/tokens.
// Replace `your_access_token` with your Cesium ion access token.
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZjI0ZmEzMy0zYzgxLTQ5NzctYWFiYy0xZmJjZjk4MTI3ZTUiLCJpZCI6MzM0MjI5LCJpYXQiOjE3NTU4MTQ3OTJ9.jj90w51X6eaQ3QF48tLvImrtDuh7F_Jx_TjycA_vS6k';

//methods
const initializeViewer = async () => {
  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  const viewer = new Viewer('cesiumContainer', {
    terrain: Terrain.fromWorldTerrain(),
    timeline: false,
    animation: false,
    // Other optional widgets to disable:
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    geocoder: false,
    // fullscreenButton: false,
    // vrButton: false,
  });
  return viewer;
};

const flyToCali = async (viewer) => {
  // Fly the camera to Cali, Colombia at the given longitude, latitude, and height.
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(-76.5410942407, 3.4300127118, 1500),
    orientation: {
      heading: CesiumMath.toRadians(0.0),
      pitch: CesiumMath.toRadians(-80.0),
    }
  });
};

const addPascualTiles = async (viewer) => {
  try {
    const tilesetUrl = 'https://atomdiag.blob.core.windows.net/general-purpose/assets/models/pascual_tiles_extracted/tileset.json';
    
    console.log('🔍 Loading 3D tiles from:', tilesetUrl);
    console.log('📍 Tiles origin: Azure Blob Storage (atomdiag.blob.core.windows.net)');
    
    // Add Cesium 3D Tiles from Azure Blob Storage
    const tileset = await Cesium3DTileset.fromUrl(tilesetUrl);
    
    // Wait for tileset to be ready
    await tileset.readyPromise;
    
    // Option 1: Adjust tileset height offset
    const heightOffset = 20; // Adjust this value (positive = higher, negative = lower)
    const cartographic = Cartographic.fromCartesian(tileset.boundingSphere.center);
    const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + heightOffset);
    const translation = Cartesian3.subtract(surface, tileset.boundingSphere.center, new Cartesian3());
    tileset.modelMatrix = Matrix4.fromTranslation(translation);
    
    // Option 2: Disable terrain for better visibility (uncomment if needed)
    // viewer.terrainProvider = new EllipsoidTerrainProvider();
    
    // Option 3: Make terrain transparent/translucent (uncomment if needed)
    // viewer.scene.globe.translucency.enabled = true;
    // viewer.scene.globe.translucency.frontFaceAlpha = 0.5;
    
    console.log('✅ Tileset loaded successfully from Azure Blob Storage');
    console.log('📊 Tileset details:', {
      url: tileset.url,
      ready: tileset.ready,
      tilesLoaded: tileset.tilesLoaded,
      heightOffset: heightOffset
    });
    
    viewer.scene.primitives.add(tileset);
    
    // Optional: Fly to the tileset once it's loaded
    await viewer.zoomTo(tileset);
    
    console.log('🎯 Camera zoomed to tileset from Azure Blob Storage');
  } catch (error) {
    console.error('❌ Error loading Pascual tiles from Azure Blob Storage:', error);
    console.error('🔗 Failed URL:', 'https://atomdiag.blob.core.windows.net/general-purpose/assets/models/pascual_tiles_extracted/tileset.json');
  }
};

// lifecycle hooks
onMounted(async () => {
  try {
    const viewer = await initializeViewer();
    await flyToCali(viewer);
    await addPascualTiles(viewer);
  } catch (error) {
    console.error('Error initializing Cesium viewer:', error);
  }
});








</script>

<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>