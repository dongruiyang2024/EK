<template>
  <div class="ek-home">
    <a href="#main" class="skip-link">跳至内容</a>
    <header class="site-header">
      <router-link to="/" class="brand-link" aria-label="EK 首页"
        ><BrandLogo
      /></router-link>
      <nav aria-label="主导航">
        <a href="#approach" class="nav-detail">工作方式</a>
        <router-link to="/help" class="nav-detail">使用指南</router-link>
        <router-link :to="workspaceLink" class="nav-enter"
          >{{ auth.isLoggedIn ? "进入工作空间" : "登录" }}
          <span aria-hidden="true">↗</span></router-link
        >
      </nav>
    </header>
    <main id="main">
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow"><span></span> A QUIETER SPACE FOR KNOWLEDGE</div>
          <h1>知识有序，<br /><span>思考从容。</span></h1>
          <p class="hero-description">
            让散落的文档汇成知识，让每一次提问有所依据。<br
              class="desktop-break"
            />在 EK，建立一个属于你和团队的知识空间。
          </p>
          <div class="hero-actions">
            <router-link :to="workspaceLink" class="primary-link"
              >进入知识空间 <span aria-hidden="true">→</span></router-link
            >
            <a href="#approach" class="quiet-link"
              >了解 EK <span aria-hidden="true">↓</span></a
            >
          </div>
          <div class="hero-note">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="m10 2 6 3v5c0 4-6 7-6 7s-6-3-6-7V5z"
                stroke="currentColor"
                stroke-width="1.3"
              />
              <path d="m7 9 2 2 4-4" stroke="currentColor" stroke-width="1.3" />
            </svg>
            独立工作空间 · 按权限共享 · 回答可溯源
          </div>
        </div>
        <div class="knowledge-scene" aria-label="知识整理与问答示意">
          <div class="scene-orbit orbit-one"></div>
          <div class="scene-orbit orbit-two"></div>
          <span class="scene-caption">FROM INFORMATION TO UNDERSTANDING</span>
          <div class="source-sheet sheet-back">
            <span class="file-label">NOTES / 灵感与记录</span>
            <div class="sheet-lines"><i></i><i></i><i></i></div>
          </div>
          <div class="source-sheet sheet-front">
            <div class="sheet-heading">
              <span class="file-icon">↳</span
              ><span>团队知识手册<small>文档 · 知识库</small></span
              ><span class="sheet-dots">···</span>
            </div>
            <div class="sheet-lines"><i></i><i></i><i></i></div>
            <div class="sheet-tags">
              <span>工作方法</span><span>经验沉淀</span>
            </div>
          </div>
          <div class="answer-card">
            <div class="answer-heading">
              <span class="answer-spark">✳</span> 让资料成为答案
              <span class="demo-label">示意</span>
            </div>
            <p>“新同事可以从哪里开始？”</p>
            <div class="answer-body">
              从团队知识手册出发，了解工作方式，<br />再沿着资料中的线索，找到所需的知识。
            </div>
            <div class="source-citation">
              <span>01</span> 团队知识手册
              <span class="citation-arrow">↗</span>
            </div>
          </div>
          <div class="scene-foot">
            <span class="scene-dot"></span> 每一份积累，都能再次被发现
          </div>
        </div>
      </section>
      <section id="approach" class="approach">
        <div class="section-intro">
          <span class="eyebrow">LESS SEARCHING. MORE UNDERSTANDING.</span>
          <h2>从资料到洞见，<br />让知识自然连接。</h2>
          <p>给重要的信息一个归处，<br />也给下一次思考一个起点。</p>
        </div>
        <div class="approach-steps">
          <article v-for="step in steps" :key="step.number">
            <span class="step-number">{{ step.number }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
            <span class="step-symbol" aria-hidden="true">{{
              step.symbol
            }}</span>
          </article>
        </div>
      </section>
      <section class="workspace-invite">
        <div>
          <span class="eyebrow">MAKE ROOM FOR WHAT MATTERS</span>
          <h2>下一次好想法，<br />从已有的知识开始。</h2>
        </div>
        <div class="invite-action">
          <router-link :to="workspaceLink" class="primary-link"
            >打开你的工作空间 <span aria-hidden="true">→</span></router-link
          >
          <p>使用已有账号登录；新成员请联系空间管理员。</p>
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <BrandLogo compact /><span>让知识，成为日常的力量。</span
      ><router-link to="/help"
        >使用指南 <span aria-hidden="true">↗</span></router-link
      >
    </footer>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import BrandLogo from "@/components/BrandLogo.vue";
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();
const workspaceLink = computed(() =>
  auth.isLoggedIn ? "/platform/knowledge-bases" : "/login",
);
const steps = [
  {
    number: "01",
    title: "收集，把资料放在一起",
    description:
      "文档、网页、笔记与常见问题，按主题归入知识库。不必再在文件夹之间反复寻找。",
    symbol: "＋",
  },
  {
    number: "02",
    title: "理解，找到问题的线索",
    description: "用自然语言提问，从相关资料中获取回答，并回到原文核对出处。",
    symbol: "⌕",
  },
  {
    number: "03",
    title: "连接，让经验持续生长",
    description:
      "与团队按权限共享知识，围绕具体任务组织智能体，让积累融入每天的工作。",
    symbol: "↗",
  },
];
</script>
<style scoped>
.ek-home {
  --ink: #293c49;
  --muted: #71808a;
  --paper: #f8f9f7;
  --line: #dde4e6;
  color: var(--ink);
  background: var(--paper);
  min-height: 100vh;
  overflow-x: clip;
  font-family: var(--app-font-family);
}
.ek-home :deep(.ek-logo) {
  color: var(--ink);
}
.ek-home :deep(.ek-descriptor) {
  color: var(--muted);
  border-color: var(--line);
}
a {
  text-decoration: none;
  color: inherit;
}
a:focus-visible {
  outline: 3px solid #91adbf;
  outline-offset: 6px;
}
.skip-link {
  position: absolute;
  top: -70px;
  left: 20px;
  z-index: 10;
  background: white;
  padding: 12px;
}
.skip-link:focus {
  top: 12px;
}
.site-header,
.site-footer,
main {
  max-width: 1240px;
  margin: auto;
}
.site-header {
  height: 108px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
}
.site-header nav {
  display: flex;
  align-items: center;
  gap: 36px;
  font-size: 13px;
}
.nav-detail {
  color: #687681;
}
.nav-detail:hover,
.quiet-link:hover {
  color: #314e65;
}
.nav-enter {
  padding: 11px 19px;
  border: 1px solid #cbd6dd;
  border-radius: 7px;
  display: flex;
  gap: 22px;
}
.nav-enter:hover {
  background: #eaf0f3;
}
.hero {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1.08fr 1fr;
  gap: 24px;
  align-items: center;
  padding: 62px 48px 104px;
  min-height: 640px;
}
.eyebrow {
  font-size: 10px;
  letter-spacing: 2px;
  font-weight: 600;
  color: #758994;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.7;
}
.eyebrow > span {
  width: 6px;
  height: 6px;
  background: #7e9bb0;
  border-radius: 50%;
}
.hero h1 {
  font-size: clamp(44px, 4.6vw, 64px);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -2px;
  margin: 29px 0 22px;
}
.hero h1 > span {
  color: #668299;
}
.hero-description {
  font-size: 15px;
  line-height: 2.1;
  color: #6c7b84;
  margin: 0;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 34px;
}
.primary-link {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  background: #57758e;
  color: #fff;
  border: 1px solid #57758e;
  padding: 16px 23px;
  border-radius: 7px;
  font-size: 14px;
  transition:
    background 0.2s,
    transform 0.2s;
}
.primary-link:hover {
  background: #46657e;
  transform: translateY(-2px);
}
.primary-link > span {
  font-size: 19px;
}
.quiet-link {
  font-size: 13px;
  color: #687984;
  display: flex;
  gap: 14px;
}
.hero-note {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: #7c8991;
  margin-top: 26px;
}
.hero-note svg {
  width: 15px;
  height: 15px;
}
.knowledge-scene {
  height: 470px;
  position: relative;
  isolation: isolate;
}
.knowledge-scene:before {
  content: "";
  position: absolute;
  inset: 25px -10px 15px;
  background: radial-gradient(
    ellipse,
    #e4edf2 0%,
    #ecf1f2 45%,
    transparent 72%
  );
  z-index: -1;
}
.scene-orbit {
  position: absolute;
  border: 1px solid #dce5e9;
  border-radius: 50%;
  z-index: -1;
}
.orbit-one {
  width: 370px;
  height: 370px;
  top: 38px;
  left: 42px;
}
.orbit-two {
  width: 450px;
  height: 450px;
  top: 0;
  left: 3px;
}
.scene-caption {
  position: absolute;
  top: 9px;
  left: 61px;
  font-size: 8px;
  letter-spacing: 2px;
  color: #8599a6;
}
.source-sheet {
  position: absolute;
  background: #fff;
  border: 1px solid #e1e7eb;
  border-radius: 12px;
  box-shadow: 0 18px 40px #3e607008;
}
.sheet-back {
  width: 260px;
  height: 166px;
  top: 56px;
  left: 115px;
  transform: rotate(8deg);
  padding: 23px;
  background: #f1f5f7;
}
.file-label {
  font-size: 10px;
  letter-spacing: 1px;
  color: #8397a3;
}
.sheet-front {
  width: 298px;
  height: 186px;
  top: 99px;
  left: 49px;
  transform: rotate(-5deg);
  padding: 22px;
}
.sheet-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}
.file-icon {
  display: grid;
  place-items: center;
  width: 35px;
  height: 40px;
  border-radius: 6px;
  background: #eaf0f5;
  color: #69899f;
  font-size: 24px;
}
.sheet-heading small {
  display: block;
  font-size: 9px;
  color: #96a1a9;
  margin-top: 5px;
}
.sheet-dots {
  margin-left: auto;
  color: #9aa8af;
  font-size: 22px;
}
.sheet-lines {
  display: grid;
  gap: 9px;
  margin: 20px 0;
}
.sheet-lines i {
  display: block;
  height: 4px;
  border-radius: 3px;
  background: #e7edf0;
}
.sheet-lines i:nth-child(2) {
  width: 82%;
}
.sheet-lines i:nth-child(3) {
  width: 62%;
}
.sheet-tags {
  display: flex;
  gap: 7px;
  font-size: 9px;
  color: #7c919f;
}
.sheet-tags span {
  border: 1px solid #e1e9ee;
  padding: 3px 6px;
  border-radius: 3px;
}
.answer-card {
  position: absolute;
  left: 106px;
  top: 240px;
  right: 0;
  background: #fff;
  border: 1px solid #d5e0e7;
  border-radius: 12px;
  box-shadow: 0 22px 50px #45627a0d;
  padding: 22px;
}
.answer-heading {
  font-size: 11px;
  color: #678397;
  display: flex;
  align-items: center;
  gap: 8px;
}
.answer-spark {
  font-size: 20px;
}
.demo-label {
  margin-left: auto;
  font-size: 9px;
  color: #8c9ba4;
  border: 1px solid #e1e7eb;
  border-radius: 3px;
  padding: 2px 5px;
}
.answer-card p {
  font-size: 16px;
  margin: 16px 0 12px;
  letter-spacing: 0.3px;
}
.answer-body {
  font-size: 11px;
  line-height: 1.9;
  color: #8a979f;
}
.source-citation {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #edf0f2;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7a8d99;
  font-size: 10px;
}
.source-citation > span:first-child {
  background: #eaf0f4;
  color: #638097;
  border-radius: 3px;
  padding: 2px 4px;
  font-size: 9px;
}
.citation-arrow {
  margin-left: auto;
}
.scene-foot {
  position: absolute;
  bottom: -22px;
  left: 118px;
  font-size: 10px;
  letter-spacing: 1px;
  color: #8b9ba5;
  display: flex;
  align-items: center;
  gap: 8px;
}
.scene-dot {
  width: 4px;
  height: 4px;
  background: #8ca6b8;
  border-radius: 50%;
}
.approach {
  border-top: 1px solid var(--line);
  padding: 65px 48px 72px;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 72px;
}
.section-intro h2,
.workspace-invite h2 {
  font-size: 30px;
  line-height: 1.55;
  font-weight: 500;
  letter-spacing: -0.6px;
  margin: 20px 0;
}
.section-intro p {
  font-size: 13px;
  line-height: 1.9;
  color: #859099;
}
.approach-steps article {
  display: flex;
  gap: 22px;
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
}
.approach-steps article:first-child {
  padding-top: 6px;
}
.approach-steps article:last-child {
  border-bottom: 0;
}
.step-number {
  font-size: 11px;
  color: #88a0b1;
  line-height: 26px;
  font-variant-numeric: tabular-nums;
}
.approach-steps h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 10px;
}
.approach-steps p {
  color: #7e8a92;
  font-size: 12px;
  line-height: 1.9;
  margin: 0;
}
.step-symbol {
  font-size: 21px;
  margin-left: auto;
  color: #8ca0ad;
}
.workspace-invite {
  margin: 0 48px 58px;
  background: #eaf0f3;
  border-radius: 14px;
  padding: 38px 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}
.workspace-invite h2 {
  font-size: 26px;
  margin: 12px 0 0;
}
.invite-action p {
  font-size: 11px;
  color: #84939d;
  margin: 15px 0 0;
}
.site-footer {
  padding: 0 48px 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: #8a969e;
  font-size: 11px;
}
.site-footer > a {
  margin-left: auto;
}
.site-footer :deep(.ek-mark) {
  width: 27px;
  height: 27px;
}
.site-footer :deep(.ek-wordmark) {
  font-size: 20px;
}
@media (min-width: 1600px) {
  .hero {
    padding-top: 90px;
    padding-bottom: 120px;
  }
}
@media (max-width: 1000px) {
  .site-header {
    padding: 0 30px;
  }
  .hero {
    padding: 40px 30px 80px;
    gap: 0;
  }
  .hero h1 {
    font-size: 48px;
  }
  .knowledge-scene {
    transform: scale(0.85);
    transform-origin: center right;
    margin-left: -40px;
  }
  .approach {
    padding: 50px 30px;
    gap: 40px;
  }
  .workspace-invite {
    margin: 0 30px 40px;
    padding: 30px;
  }
  .site-footer {
    padding: 0 30px 30px;
  }
  .eyebrow {
    font-size: 9px;
    letter-spacing: 1.4px;
  }
}
@media (max-width: 760px) {
  .site-header {
    height: 85px;
    padding: 0 23px;
  }
  .site-header nav {
    gap: 16px;
  }
  .nav-detail {
    display: none;
  }
  .site-header :deep(.ek-descriptor) {
    display: none;
  }
  .nav-enter {
    padding: 9px 12px;
    font-size: 12px;
  }
  .hero {
    grid-template-columns: 1fr;
    padding: 38px 24px 55px;
    gap: 24px;
  }
  .hero h1 {
    font-size: 48px;
  }
  .hero-description {
    font-size: 13px;
  }
  .desktop-break {
    display: none;
  }
  .hero-actions {
    margin-top: 27px;
    gap: 25px;
  }
  .hero-note {
    font-size: 10px;
  }
  .knowledge-scene {
    width: 360px;
    max-width: 100%;
    height: 450px;
    margin: 4px auto 0;
    transform: none;
  }
  .orbit-one {
    width: 285px;
    height: 285px;
    left: 30px;
    top: 42px;
  }
  .orbit-two {
    width: 345px;
    height: 345px;
    left: 0;
    top: 10px;
  }
  .scene-caption {
    left: 20px;
    font-size: 7px;
  }
  .sheet-back {
    left: 79px;
    width: 230px;
    top: 47px;
    height: 145px;
  }
  .sheet-front {
    width: 255px;
    left: 4px;
    top: 83px;
    height: 170px;
    padding: 18px;
  }
  .answer-card {
    left: 40px;
    top: 213px;
    padding: 18px;
    right: 0;
  }
  .scene-foot {
    left: 56px;
    bottom: 3px;
    font-size: 9px;
  }
  .approach {
    padding: 42px 24px;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .section-intro h2 {
    font-size: 28px;
  }
  .section-intro p {
    display: none;
  }
  .approach-steps article {
    gap: 16px;
    padding: 23px 0;
  }
  .workspace-invite {
    margin: 0 24px 34px;
    padding: 28px;
    align-items: flex-start;
    flex-direction: column;
  }
  .workspace-invite h2 {
    font-size: 26px;
  }
  .site-footer {
    padding: 0 24px 26px;
    gap: 12px;
  }
  .site-footer > span {
    font-size: 9px;
  }
  .site-footer > a {
    font-size: 10px;
  }
  .site-footer :deep(.ek-wordmark) {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>
