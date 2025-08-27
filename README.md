# 🌍 Cesium 3D Map Viewer

A modern Vue 3 application for visualizing 3D geospatial data using CesiumJS. This project features an interactive 3D globe with custom tileset rendering, smooth camera animations, and Azure Blob Storage integration for hosting large 3D datasets.

![Cesium Map Viewer](screenshot.png)

## ✨ Features

- **🗺️ Interactive 3D Globe** - Full-featured Cesium viewer with terrain visualization
- **🏗️ Custom 3D Tilesets** - Load and display large-scale 3D models from Azure Blob Storage
- **🎬 Cinematic Camera Animations** - Smooth orbital camera movements with user interaction controls
- **☁️ Cloud-Hosted Assets** - Efficient delivery of 3D tiles via Azure CDN
- **🎛️ Clean Interface** - Minimalist UI with disabled unnecessary widgets
- **⚡ Modern Tech Stack** - Vue 3 with Composition API, Vite bundler, and ES modules

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + Vite
- **3D Engine**: CesiumJS
- **Styling**: CSS3
- **Build Tool**: Vite with static asset copying
- **Hosting**: GitHub Pages ready
- **Asset Storage**: Azure Blob Storage

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- A Cesium Ion account (free tier available)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/datasantana/cesium-map.git
cd cesium-map
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment template and configure your credentials:

```bash
cp .env.template .env
```

Edit `.env` file with your actual values:

```env
# Get your token from: https://ion.cesium.com/tokens
VITE_CESIUM_ION_ACCESS_TOKEN=your_cesium_ion_access_token_here

# URL to your hosted 3D tileset.json file
VITE_TILESET_URL=https://your-blob-storage.com/path/to/tileset.json
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser. You should see:
- A 3D globe loading with terrain
- Camera flying to Cali, Colombia
- Custom 3D tiles loading from your configured URL
- Automatic camera animation starting after 2 seconds
- Animation stops when you click anywhere on the map

## 🌐 Getting Cesium Ion Access Token

1. Go to [Cesium Ion](https://ion.cesium.com)
2. Create a free account
3. Navigate to "Access Tokens"
4. Create a new token or use the default one
5. Copy the token to your `.env` file

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🎯 Project Structure

```
cesium-map/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   └── CesiumComponent.vue   # Main 3D viewer component
│   ├── App.vue         # Root application component
│   └── main.js         # Application entry point
├── .env.template       # Environment variables template
├── .env                # Your environment variables (git-ignored)
├── vite.config.js      # Vite configuration with Cesium setup
└── package.json        # Dependencies and scripts
```

## 🎮 Usage

### Camera Controls
- **Left click + drag**: Rotate the camera
- **Right click + drag**: Pan the camera
- **Mouse wheel**: Zoom in/out
- **Click anywhere**: Stop automatic animation

### Animation Features
- Camera automatically flies to Cali, Colombia on load
- 3D tiles load from Azure Blob Storage
- Smooth transition to orbital animation after 2 seconds
- Orbital animation showcases the 3D model from all angles
- Animation stops on any user interaction

## 🔧 Configuration

### Customizing the View Location

Edit the coordinates in `CesiumComponent.vue`:

```javascript
const flyToCali = async (viewer) => {
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(
      -76.5410942407,  // Longitude
      3.4300127118,    // Latitude
      1500             // Height in meters
    ),
    // ... orientation settings
  });
};
```

### Adjusting Animation Parameters

Modify the animation settings:

```javascript
const startCameraRotation = (cesiumViewer) => {
  const rotationSpeed = 0.05;  // Adjust rotation speed
  const orbitRadius = 0.005;   // Adjust orbit size
  const height = 1500;         // Adjust camera height
  // ...
};
```

## 🚀 Deployment

### GitHub Pages (Automated)

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Setup Steps:

1. **Configure Repository Secrets:**
   - Go to your GitHub repository
   - Navigate to `Settings` > `Secrets and variables` > `Actions`
   - Add the following repository secrets:
     ```
     VITE_CESIUM_ION_ACCESS_TOKEN: your_cesium_ion_token_here
     VITE_TILESET_URL: your_azure_blob_storage_url_here
     ```

2. **Enable GitHub Pages:**
   - Go to repository `Settings` > `Pages`
   - Under "Source", select `GitHub Actions`
   - Save the settings

3. **Deploy:**
   - Push your code to the `main` branch
   - GitHub Actions will automatically build and deploy
   - Your site will be available at: `https://datasantana.github.io/cesium-map/`

#### Manual Deployment

For other hosting services:

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Ensure your hosting service supports single-page applications

## 🐛 Troubleshooting

### Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Restart the development server after editing `.env`
- Check that variable names start with `VITE_`

### 3D Tiles Not Loading
- Verify your tileset URL is accessible
- Check CORS settings on your Azure Blob Storage
- Ensure the tileset.json file is properly formatted

### Performance Issues
- Check browser console for WebGL errors
- Ensure your graphics drivers are up to date
- Try reducing the tileset quality or size

## 📄 License

MIT License - feel free to use this project for your own applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🔗 Related Resources

- [CesiumJS Documentation](https://cesium.com/docs/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Cesium Ion Platform](https://ion.cesium.com/)
