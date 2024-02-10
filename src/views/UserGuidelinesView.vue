<script setup>
import {config, saveConfig} from "../helpers/config";
import {sleep} from "../helpers/utils"
import {exit} from '@tauri-apps/api/process'
import {onMounted} from "vue";
import {i18n} from "../main.js";

onMounted(async () => {
  if (!config.agreedUserGuidelines) {
    const agreeBtn = document.getElementsByClassName("btn-agree")[0];
    const container = document.getElementsByClassName("container")[0];

    // Agree & disagree
    agreeBtn.onclick = () => {
      config.agreedUserGuidelines = true;
      saveConfig();
      container.classList.add("container-fadeOut");
      setTimeout(() => {
        // TODO: 前往主界面
      }, 500);
    }
    document.getElementsByClassName("btn-disagree")[0].onclick = () => {
      container.classList.add("container-fadeOut");
      setTimeout(() => {
        exit();
      }, 500);
    }

    // Agree countdown
    const endTime = Date.now() + 10000;
    while (true) {
      if (endTime - Date.now() >= 0) {
        agreeBtn.innerHTML = i18n.global.t("user-guidelines.agree-countdown", {"time": Math.ceil((endTime - Date.now()) / 1000)});
      } else {
        agreeBtn.disabled = null;
        agreeBtn.innerHTML = i18n.global.t("user-guidelines.agree");
        break;
      }
      await sleep(50);
    }
  } else {
    document.getElementsByClassName("buttons")[0].remove();
  }
});
</script>

<template>
  <div class="container">
    <div class="title">
      <h2>{{ $t("user-guidelines.title") }}</h2>
      <hr>
    </div>
    <div class="text">
      欢迎使用 Tiger's Minecraft Server Launcher（简称“TMSL”，下文称“本软件”）软件与服务。为了保障用户（也就是“您”）的权益，特制定本用户协议（以下简称本协议）
      <br>请您在使用本软件前，详细阅读本协议的所有内容。修改后的本协议一旦在官网或新版本的此页面上公布即有效代替原用户协议
      <br>请用户仔细阅读以下全部内容，当用户开始使用本软件时，则应视为用户已经详细阅读并同意本协议的全部内容，且同意遵守本协议的规定
      <h4>一、关于用户协议</h4>
      <strong>1. 发布地址</strong>
      <br>&emsp;&emsp;软件内(设置 - 关于TMSL - 用户协议)
      <br>&emsp;&emsp;官方文档 - 用户协议：https://tmsl.tigercrl.top/docs/UserGuidelines.html
      <br>&emsp;&emsp;注：软件内的用户协议可能不是最新，以官方文档为准
      <br><strong>2. 更新时间</strong>
      <br>2023/12/20
      <h4>二、关于本软件</h4>
      本软件是由Tigercrl编写并维护的开源 Minecraft 服务器启动器。
      <br>本软件的官方下载渠道为 官网(https://tmsl.tigercrl.top) 和
      GitHub(https://github.com/Tigercrl/TMSL)，如果您是从其他渠道下载的，不保证软件的安全性和可靠性
      <br>本软件根据 GNU GPL 3.0 开源，发布于 GitHub ，如果您是通过付费获取本软件的，请立刻退款、投诉商家并给予差评
      <h4 id="found-bug">三、遇到问题</h4>
      当您遇到本软件问题后，请先查阅：
      <br>&emsp;&emsp;官方文档 - 常见问题： https://tmsl.tigercrl.top/docs/FAQ.html
      <br>&emsp;&emsp;历史问题汇报： https://github.com/Tigercrl/TMSL/issues
      <br>如果您仍然无法解决问题，请查看<a href="#report">问题汇报</a>
      <h4 id="report">四、问题汇报</h4>
      如果您在使用本软件过程中遇到本软件的任何问题，并且您在尝试过<a href="#found-bug">遇到问题</a>栏目所说的解决方案后依然未能解决，可在
      GitHub 上汇报问题
      <br>GitHub 漏洞追踪页面：https://github.com/Tigercrl/TMSL/issues/new
      <br>如果您遇到的问题是关于MC服务器的，而非关于本软件的，请向相应服务端的漏洞追踪器汇报问题而非本软件的漏洞追踪页面
      <br>在提问之前，建议先阅读<a target="_blank" href="https://ask.icodeq.com/">《提问的智慧》</a>以避免不必要的交流
      <br>在提交问题时，请提供以下信息：
      <br>&emsp;&emsp;1. 问题描述
      <br>&emsp;&emsp;2. 截图（可选）
      <br>&emsp;&emsp;3. 运行环境（系统信息）
      <br>&emsp;&emsp;4. 软件版本（启动页面左下角的版本信息）
      <br>&emsp;&emsp;5. 其他（如果您觉得有必要）
      <h4>五、知识产权</h4>
      本软件提供的服务器由Minecraft官方及第三方提供，版权由 Mojang AB 所有。
      <br>用户应当遵守 <a href="https://www.minecraft.net/zh-hans/eula">Minecraft 最终用户许可协议</a>，不对下载的游戏等文件擅自分发，或做其他被
      Minecraft 最终用户许可协议所禁止的行为。
      <h4>六、其他</h4>
      本协议适用于中华人民共和国法律，若与法律，以法律为准
      <br>若用户使用本软件进行违反法律法规的行为，可法律法规对其进行处理，并采取相应措施
      <br>在法律许可范围内，开发者享有对本协议条款的解释权
      <br><br><br><br>
    </div>
    <div class="buttons">
      <button class="btn-agree" disabled>{{ $t("user-guidelines.agree") }}</button>
      <button class="btn-disagree">{{ $t("user-guidelines.disagree") }}</button>
    </div>
  </div>
</template>

<style>
.container {
  width: 75%;
  height: 75%;
  border-radius: 15px;
  background-color: var(--card-bg-color);
  box-shadow: var(--shadow-medium);
  padding: 20px;
  opacity: 0;
  animation: fadeInUp 0.5s both ease-in-out;
}

.container-fadeOut {
  animation: fadeOutDown 0.5s both ease-in-out;
}

.title h2 {
  font-size: 32px;
  font-weight: 500;
  margin: 0;
  color: var(--text-color);
}

.title hr {
  height: 4px;
  background-color: var(--text-color);
  margin: 0 0 10px 0;
  width: 90px;
  border-radius: 2px;
}

.text {
  overflow-y: auto;
  font-size: 14px;
  line-height: 20px;
  color: var(--text-color);
  height: calc(100% - 56px);
}

.text h4 {
  font-size: 18px;
  margin: 5px 0;
  font-weight: 500;
  color: var(--text-color);
}

.text strong {
  font-weight: 500;
  font-size: 16px;
}

.buttons {
  position: relative;
  left: 5px;
  top: -45px;
  display: flex;
  justify-content: space-between;
  width: 205px;
  padding: 5px;
  border-radius: 7.5px;
  -webkit-backdrop-filter: blur(5px);
  border: 0.5px solid var(--border-color-lightgray);
  background: var(--transparent-bg-color);
  box-shadow: var(--shadow-medium);
}

.buttons button {
  width: 100px;
  height: 30px;
  border-radius: 5px;
  box-shadow: var(--shadow-smallest);
  transition: .3s ease-in-out;
  background: var(--transparent-bg-color);
}

.btn-agree {
  border: 1px solid var(--primary-color-dark);
  color: var(--primary-color-dark);
}


.btn-agree:hover {
  box-shadow: var(--shadow-primary-color);
}

.btn-agree:disabled {
  border: 1px solid var(--border-color-gray);
  color: var(--border-color-gray);
}

.btn-disagree {
  border: 1px solid var(--border-color-gray);
  color: var(--text-color);
}

.btn-agree:hover:disabled, .btn-disagree:hover {
  box-shadow: var(--shadow-small);
}
</style>