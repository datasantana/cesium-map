<template>
  <div id="cesiumContainer" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = './';

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
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
  });
  return viewer;
};

const flyToSanFrancisco = async (viewer) => {
  // Fly the camera to San Francisco at the given longitude, latitude, and height.
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    orientation: {
      heading: CesiumMath.toRadians(0.0),
      pitch: CesiumMath.toRadians(-15.0),
    }
  });
};

const addCesiumOsmBuildings = async (viewer) => {
  // Add Cesium OSM Buildings, a global 3D buildings layer.
  const buildingTileset = await createOsmBuildingsAsync();
  viewer.scene.primitives.add(buildingTileset);
};

// lifecycle hooks
onMounted(async () => {
  try {
    const viewer = await initializeViewer();
    await flyToSanFrancisco(viewer);
    await addCesiumOsmBuildings(viewer);
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