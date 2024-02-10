<script setup>
import {exit} from '@tauri-apps/api/process'
import {getCurrent} from "@tauri-apps/api/window";
import {onMounted} from "vue";
import {isMacOS} from "../main.js";

async function exitApp() {
  await exit();
}

async function minimizeApp() {
  await getCurrent().minimize();
}

async function maximizeApp() {
  const minimizeButton = document.getElementById("window-minimize-button");
  const maximizeButtonIcon = document.getElementById("window-maximize-button").getElementsByTagName("i")[0];
  if (await getCurrent().isFullscreen()) {
    minimizeButton.disabled = void (0);
    maximizeButtonIcon.className = "fas fa-up-right-and-down-left-from-center";
    await getCurrent().setFullscreen(false);
  } else {
    await getCurrent().setFullscreen(true);
    minimizeButton.disabled = "disabled";
    maximizeButtonIcon.className = "fas fa-down-left-and-up-right-to-center";
  }
}

onMounted(() => {
  if (isMacOS) {
    document.getElementsByClassName("window-buttons")[0].remove();
  }
})
</script>

<template>
  <div class="window-buttons">
    <button class="window-button" @click="exitApp"><i class="fas fa-xmark"></i></button>
    <button class="window-button" @click="minimizeApp" id="window-minimize-button"><i class="fas fa-minus"></i></button>
    <button class="window-button" @click="maximizeApp" id="window-maximize-button"><i
        class="fas fa-up-right-and-down-left-from-center"></i></button>
  </div>
</template>

<style scoped>
.window-buttons {
  position: fixed;
  top: 5px;
  left: 5px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80px;
}

.window-button {
  width: 24px;
  height: 24px;
  padding: 2px;
  background-color: #fff;
  border: 1px solid #fff;
  font-weight: bold;
  font-size: 12px;
  border-radius: 8px;
  transition-duration: .3s;
  box-shadow: rgba(100, 100, 111, 0.2) 0 0 10px 0;
}

.window-button:hover {
  border: 1px solid #ccc;
}
</style>