<template data-tauri-drag-region>
  <div class="logo-container">
			<img src="/img/logo.png" alt="" />
			<span>
				<p class="p1">splash.tmsl</p>
				<hr>
				<p class="p2">splash.desc</p>
			</span>
	</div>
</template>

<style scoped>
* {
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  animation: .5s ease-in-out 1s both logo-container-anim, .5s ease-in-out 2.5s both fadeOut;
}

.logo-container img {
  width: 192px;
  height: 192px;
  animation: .7s ease-in-out .5s both fadeIn;
}

.logo-container span {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  justify-content: center;
  animation: .5s ease-in-out 1.45s both fadeIn;
}

.logo-container p {
  margin: 0;
}

.logo-container hr{
  width: 100%;
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
</style>

<script lang="ts">
export default {
  mounted() {
    writeLang();
    setTimeout(() => {
      var width = (Math.max(document.getElementsByClassName("p1")[0].offsetWidth, document.getElementsByClassName("p2")[0].offsetWidth) + 201) + "px";
      var style = document.createElement("style");
      style.innerHTML = "@keyframes logo-container-anim{ 0% { width: 192px; } 100% { width: " + width + "; } }";
      document.getElementById("app").appendChild(style);
    },50)
  }
}
</script>