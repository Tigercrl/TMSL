<script setup>
import {onMounted} from "vue";
import {version} from "../main.js";
import {config} from "../helpers/config.js";
import router from "../router/index.js";

onMounted(() => {
  const style = document.createElement("style");
  document.getElementById("app").appendChild(style);
  const width = document.getElementById("title").scrollWidth + 227;
  style.innerHTML = "@keyframes logo-container-anim{ 0% { width: 192px; } 100% { width: " + width + "px; } }";
  setTimeout(() => {
    if (config.agreedUserGuidelines) {
      // TODO: 前往主界面
    } else {
      router.push("user-guidelines");
    }
  }, 3000)
});
</script>

<template>
  <div class="logo-container">
    <img src="/assets/img/logo.svg" alt=""/>
    <div id="title">
      <p class="p1">{{ $t("splash.tmsl") }}</p>
      <hr>
      <p class="p2">{{ $t("splash.desc") }}</p>
    </div>
  </div>
  <div class="footer">
    <p>{{ $t("splash.footer", {"version": version}) }}</p>
  </div>
</template>

<style scoped>
* {
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  overflow: hidden;
  animation: .7s ease-in-out both 1s logo-container-anim, .5s ease-in-out 2.5s both fadeOut;
}

.logo-container img {
  width: 192px;
  height: 192px;
  margin-right: 15px;
  opacity: 0;
  animation: .7s ease-in-out .5s both fadeIn;
}

.logo-container span {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-container p {
  margin: 0;
  opacity: 0;
  animation: .7s ease-in-out 1.1s both fadeIn;
}

.logo-container hr {
  width: 100%;
  opacity: 0;
  animation: .7s ease-in-out 1.1s both fadeIn;
}

.p1 {
  font-size: 48px;
  font-weight: 450;
  color: #333;
}

.p2 {
  font-size: 34px;
  color: #777;
}

.theme-dark .p1 {
  color: #eee;
}

.theme-dark .p2 {
  color: #ddd;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 30px;
  display: flex;
  align-items: center;
  color: var(--text-color);
  font-size: 12px;
  font-weight: 500;
  padding: 0 10px;
}
</style>