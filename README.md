# 🏞️ OpenGL 3D Scenery Project

A real-time 3D landscape rendering project developed in **C++** using **OpenGL**, **GLFW**, and **GLM**. This project features an interactive 3D environment with a realistic terrain, objects (trees, house, car, mountains), and dynamic lighting. It was designed as part of a university graphics assignment to showcase computer graphics concepts.


## 🌟 Features

- Realistic 3D terrain and scenery
- Custom models loaded from `.obj` files
- Dynamic lighting and shadows
- Camera movement (First-Person / Free Roam)
- Basic shading and textures
- Organized into modules: Camera, Shader, Mesh, Model


## 🛠️ Technologies & Libraries

- **C++**
- **OpenGL**
- **GLFW** (Window & Input handling)
- **GLM** (Mathematics library)
- **stb_image** (Texture loading)
- **tinyobjloader** (OBJ model loading)
- **Shader Programs** (Vertex and Fragment shaders)


## 📁 Folder Structure
```
│── models # 3D model files (OBJ format) 
│── shaders # GLSL shader files (vertex, fragment) 
│── src # Source code (Camera, Mesh, Model, Window, Shader, stb_image, etc.) 
│── README.md 
```

## 🚀 How to Run Locally

### Prerequisites
- C++17 or higher
- OpenGL-compatible graphics card
- GLFW
- GLM
- Visual Studio / CLion / Qt Creator (or your favorite C++ IDE)

### Build & Run
1. Clone the repository:
   ```bash
   git clone https://github.com/somodidenise/3D-Scene-OpenGL.git
   cd OpenGL-3D-Scenery
2. Open the project in Visual Studio or your IDE.
3. Make sure to link the necessary libraries:
   -OpenGL32.lib
   -GLFW
   -GLM (header-only)
4. Build and run the project.

## 🎮 Controls

- **W** – Move forward
- **A** – Move left
- **S** – Move backward
- **D** – Move right
- **Arrow LEFT** – Rotate the camera around the Z-axis (left)
- **Arrow RIGHT** – Rotate the camera around the Z-axis (right)
- **Arrow UP** – Move the camera upward
- **Arrow DOWN** – Move the camera downward
- **Mouse Movement** – Rotate the camera on X and Y axes
- **Q** – Rotate the light source counterclockwise
- **E** – Rotate the light source clockwise
- **N** – Toggle point light on/off


## ✨ Screenshot
![3D Scene](scene/3d_scene.png)

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



