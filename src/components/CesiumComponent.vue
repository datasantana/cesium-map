<template>
  <div id="cesiumContainer" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = './';

import { Cartesian3, Cartographic, Cesium3DTileset, EllipsoidTerrainProvider, Ion, Math as CesiumMath, Matrix4, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onMounted, onUnmounted, ref } from 'vue';

// Your access token can be found at: https://ion.cesium.com/tokens.
const cesiumIonToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN;
console.log('🔑 Cesium Ion Token loaded:', cesiumIonToken ? 'Yes' : 'No');
console.log('🌐 Available env vars:', import.meta.env);

if (!cesiumIonToken) {
  console.error('❌ VITE_CESIUM_ION_ACCESS_TOKEN not found in environment variables');
}

Ion.defaultAccessToken = cesiumIonToken;

// Reactive variables for cleanup
const viewer = ref(null);
let cameraAnimation = null;
let animationTimeout = null;
let clickHandler = null;

//methods
const initializeViewer = async () => {
  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  const cesiumViewer = new Viewer('cesiumContainer', {
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
  viewer.value = cesiumViewer;
  return cesiumViewer;
};

const transitionToAnimationPosition = async (cesiumViewer) => {
  console.log('🚀 Transitioning to animation starting position');
  
  // Define starting position for animation (first point in the orbit)
  const centerLongitude = -76.5410942407;
  const centerLatitude = 3.4300127118;
  const orbitRadius = 0.005;
  const startLongitude = centerLongitude + orbitRadius; // Start at 0 degrees
  const startLatitude = centerLatitude;
  const height = 1500;
  
  // Calculate heading to look at center from starting position
  const deltaLongitude = centerLongitude - startLongitude;
  const heading = Math.atan2(
    Math.sin(deltaLongitude) * Math.cos(CesiumMath.toRadians(centerLatitude)),
    Math.cos(CesiumMath.toRadians(startLatitude)) * Math.sin(CesiumMath.toRadians(centerLatitude)) -
    Math.sin(CesiumMath.toRadians(startLatitude)) * Math.cos(CesiumMath.toRadians(centerLatitude)) * Math.cos(deltaLongitude)
  );
  
  // Transition camera to animation starting position
  return new Promise((resolve) => {
    cesiumViewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(startLongitude, startLatitude, height),
      orientation: {
        heading: heading,
        pitch: CesiumMath.toRadians(-45.0),
        roll: 0.0
      },
      duration: 10.0, // 10 second transition
      complete: () => {
        console.log('✅ Transition to animation position complete');
        resolve();
      }
    });
  });
};

const startCameraRotation = (cesiumViewer) => {
  console.log('🎬 Starting camera rotation animation');
  
  const camera = cesiumViewer.camera;
  const startTime = Date.now();
  
  // Define origin/center point to orbit around (Cali, Colombia coordinates)
  const centerLongitude = -76.5410942407;
  const centerLatitude = 3.4300127118;
  const centerPoint = Cartesian3.fromDegrees(centerLongitude, centerLatitude, 0);
  
  const animate = () => {
    if (!cameraAnimation) return; // Animation was cancelled
    
    const elapsed = (Date.now() - startTime) / 1000;
    const rotationSpeed = 0.05; // radians per second
    const currentAngle = elapsed * rotationSpeed;
    
    // Calculate new camera position orbiting around the center
    const orbitRadius = 0.005; // Orbit radius in degrees
    const longitude = centerLongitude + (Math.cos(currentAngle) * orbitRadius);
    const latitude = centerLatitude + (Math.sin(currentAngle) * orbitRadius);
    const height = 1500; // Keep same height
    
    // Calculate camera position
    const cameraPosition = Cartesian3.fromDegrees(longitude, latitude, height);
    
    // Calculate heading to look at center point
    const cameraCartographic = Cartographic.fromCartesian(cameraPosition);
    const centerCartographic = Cartographic.fromCartesian(centerPoint);
    
    // Calculate bearing from camera to center
    const deltaLongitude = centerCartographic.longitude - cameraCartographic.longitude;
    const heading = Math.atan2(
      Math.sin(deltaLongitude) * Math.cos(centerCartographic.latitude),
      Math.cos(cameraCartographic.latitude) * Math.sin(centerCartographic.latitude) -
      Math.sin(cameraCartographic.latitude) * Math.cos(centerCartographic.latitude) * Math.cos(deltaLongitude)
    );
    
    // Set camera position and orientation
    camera.setView({
      destination: cameraPosition,
      orientation: {
        heading: heading,
        pitch: CesiumMath.toRadians(-45.0), // Keep same pitch
        roll: 0.0
      }
    });
    
    cameraAnimation = requestAnimationFrame(animate);
  };
  
  cameraAnimation = requestAnimationFrame(animate);
  
  // Set up click handler to stop animation
  clickHandler = cesiumViewer.cesiumWidget.canvas.addEventListener('click', () => {
    console.log('🎯 Map clicked - stopping camera animation');
    stopCameraAnimation();
  });
};

const stopCameraAnimation = () => {
  if (cameraAnimation) {
    cancelAnimationFrame(cameraAnimation);
    cameraAnimation = null;
    console.log('🛑 Camera animation stopped');
  }
  
  if (clickHandler && viewer.value) {
    viewer.value.cesiumWidget.canvas.removeEventListener('click', clickHandler);
    clickHandler = null;
  }
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
    const tilesetUrl = import.meta.env.VITE_TILESET_URL;
    
    console.log('🔍 Tileset URL from env:', tilesetUrl);
    
    if (!tilesetUrl) {
      console.error('❌ VITE_TILESET_URL not found in environment variables');
      return;
    }
    
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
    console.error('🔗 Failed URL:', import.meta.env.VITE_TILESET_URL);
  }
};

// lifecycle hooks
onMounted(async () => {
  try {
    const cesiumViewer = await initializeViewer();
    await flyToCali(cesiumViewer);
    await addPascualTiles(cesiumViewer);
    
    // Wait a moment after tiles are loaded, then start animation sequence
    animationTimeout = setTimeout(async () => {
      console.log('🎬 Starting camera animation sequence');
      
      // First transition to animation starting position
      await transitionToAnimationPosition(cesiumViewer);
      
      // Then start the orbital animation
      startCameraRotation(cesiumViewer);
    }, 2000); // Start animation sequence 2 seconds after tiles are loaded
    
  } catch (error) {
    console.error('Error initializing Cesium viewer:', error);
  }
});

onUnmounted(() => {
  console.log('🧹 Cleaning up Cesium viewer and animations');
  
  // Stop camera animation
  stopCameraAnimation();
  
  // Clear timeout if still pending
  if (animationTimeout) {
    clearTimeout(animationTimeout);
    animationTimeout = null;
  }
  
  // Destroy viewer
  if (viewer.value && !viewer.value.isDestroyed()) {
    viewer.value.destroy();
    viewer.value = null;
  }
  
  console.log('✅ Cleanup completed');
});








</script>

<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>