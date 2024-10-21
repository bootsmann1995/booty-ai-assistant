<template>
  <div>
    <div class="w-screen h-screen absolute left-0 top-0" id="container3D"></div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  let object;
  let controls;

  let objToRender = "cube";

  const loader = new GLTFLoader();

  loader.load(
    "./models/" + objToRender + ".gltf",
    function (gltf) {
      object = gltf.scene;
      scene.add(object);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error(error);
    }
  );

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById("container3D")?.appendChild(renderer.domElement);
  camera.position.z = 25;

  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(500, 500, 500);
  topLight.castShadow = true;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  scene.add(topLight);

  function animate() {
    requestAnimationFrame(animate);
  }

  window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );

  animate();
});
</script>

<style lang="scss">
body {
  background-color: black;
}
</style>
