<template>
  <div class="container" data-tauri-drag-region>
    <div class="logo-container">
			<img src="/logo.png" alt="" />
			<span>
				<p class="p1">Tiger的MC服务器启动器</p>
				<hr>
				<p class="p2">一个强大的Minecraft服务器启动器</p>
			</span>
	  </div>
  </div>
</template>

<style scoped>
* {
  display: flex;
  flex-shrink: 0;
}

body, html {
  height: 100%;
}

.container {
  justify-content: center;
  align-items: center;
}

.logo-container {
  height: 192px;
  animation: .5s ease-in-out 1s both logo-container-anim;
}

.logo-container img {
  width: 192px;
  height: 192px;
  animation: .7s ease-in-out .5s both fadeIn;
}

.logo-container span {
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
  color: #333333;
}

.p2 {
  font-size: 34px;
  color: #777777;
}

@keyframes logo-container-anim {
  0% {
    width: 192px;
  }
  100% {
    width: 738px;
  }
}
</style>