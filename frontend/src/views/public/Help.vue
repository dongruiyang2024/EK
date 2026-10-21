<template>
  <div class="help-page">
    <header>
      <router-link to="/" aria-label="EK 首页"><BrandLogo /></router-link
      ><router-link to="/platform/knowledge-bases">进入工作空间 ↗</router-link>
    </header>
    <main>
      <aside>
        <span class="eyebrow">EK / GUIDE</span>
        <h1>使用指南</h1>
        <p>从第一份资料，<br />到有依据的回答。</p>
        <nav aria-label="指南目录">
          <a
            v-for="section in sections"
            :key="section.id"
            :href="`#${section.id}`"
            >{{ section.title }}</a
          >
        </nav>
        <router-link to="/" class="back-home">← 返回首页</router-link>
      </aside>
      <div class="help-content">
        <section id="start">
          <span class="eyebrow">GETTING STARTED</span>
          <h2>开始你的知识工作空间</h2>
          <p>
            登录后，先由空间管理员配置模型，再创建知识库并导入资料。文档完成解析和索引后，即可在对话中选择知识库提问。点击回答中的引用，核对原文与上下文。
          </p>
          <ol>
            <li>设置 → 模型管理：添加对话模型和向量模型，测试连接。</li>
            <li>知识库 → 新建：选择模型，设置名称与文档解析方式。</li>
            <li>上传资料：等待状态变为就绪，再开始检索或问答。</li>
          </ol>
          <div class="help-note">
            模型服务需要你自己的服务地址和凭据。文档处理及回答效果取决于模型配置、资料质量和索引状态。
          </div>
        </section>
        <section v-for="section in sections" :id="section.id" :key="section.id">
          <h2>{{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">
            {{ paragraph }}
          </p>
        </section>
      </div>
    </main>
    <footer>EK · 让知识，成为日常的力量。</footer>
  </div>
</template>
<script setup lang="ts">
import BrandLogo from "@/components/BrandLogo.vue";
const sections = [
  {
    id: "tenantAuth",
    title: "账号与空间",
    paragraphs: [
      "使用邮箱和密码登录。新成员请联系管理员获取邀请；邀请链接只授予指定空间与角色的权限。",
      "空间之间的资源和权限独立。共享资料前，请核对当前空间与成员角色；账号信息和密码可在个人设置中管理。",
    ],
  },
  {
    id: "models",
    title: "模型配置",
    paragraphs: [
      "在模型管理中添加服务商、模型名称、服务地址与 API Key。对话模型用于生成回答，向量模型用于文档索引和语义检索；重排模型可进一步优化检索结果。",
      "先运行连接测试，再在知识库或智能体配置中选择对应模型。替换向量模型前先确认维度与已有索引兼容，必要时重新索引。不要把 API Key 填入文档或共享对话。",
    ],
  },
  {
    id: "modelsCompat",
    title: "接口兼容与排查",
    paragraphs: [
      "选择与服务商匹配的协议，并按服务商要求填写完整 Base URL 和模型 ID。兼容配置用于适配特定服务的参数差异，只有明确了解服务要求时才修改。",
      "连接失败时检查服务地址、凭据、模型权限与服务器网络。保留错误信息供管理员排查，并遮盖凭据。",
    ],
  },
  {
    id: "knowledgeGraph",
    title: "知识库与关联",
    paragraphs: [
      "按主题或使用范围组织知识库，为文档设置清晰的名称和分类。网页、文件和 FAQ 可根据知识库支持的方式导入。",
      "对话时限定相关知识库，检查回答中的引用是否足以支持结论。知识图谱等可选功能需要管理员启用对应能力后才能使用。",
    ],
  },
  {
    id: "imIntegration",
    title: "发布与消息集成",
    paragraphs: [
      "在发布集成中选择消息渠道，按渠道要求配置凭据、回调地址和访问范围。先用测试账号验证收发，再开放给实际使用者。",
      "为每个渠道绑定合适的智能体与知识范围。公开渠道可能让外部用户查询资料，发布前请检查共享权限。",
    ],
  },
  {
    id: "apiOverview",
    title: "API 与嵌入",
    paragraphs: [
      "在工作空间的 API 配置中获取当前部署地址，并创建权限范围合适的访问密钥。服务地址以当前站点为准。",
      "嵌入聊天需要配置允许的来源和令牌签发方式。长期密钥与签名密钥只放在可信后端，不要放入网页脚本。具体请求示例可在对应集成面板中查看。",
    ],
  },
  {
    id: "troubleshootingMigrations",
    title: "服务异常与恢复",
    paragraphs: [
      "页面无法加载时，先刷新并确认网络连接。登录问题可尝试重新登录；资料处理失败时查看任务中的错误详情。",
      "如果系统信息提示数据库迁移失败，请联系部署管理员检查服务日志和数据库连接。恢复前应先备份数据库、文件与配置，勿直接删除数据卷。错误日志可能包含内部信息，请勿公开上传。",
    ],
  },
  {
    id: "sandboxDeployment",
    title: "扩展执行环境",
    paragraphs: [
      "沙箱属于可选能力，需要管理员配置独立的执行环境与资源限制。普通文档检索和知识问答不要求启用沙箱。",
      "启用前确认执行环境的网络权限、可挂载目录和资源上限。共享空间应采用隔离环境，避免将宿主机敏感目录或凭据交给执行任务。",
    ],
  },
];
</script>
<style scoped>
.help-page {
  min-height: 100vh;
  background: var(--td-bg-color-page);
  color: var(--td-text-color-primary);
  padding: 0 40px;
}
header {
  max-width: 1100px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 110px;
  border-bottom: 1px solid var(--td-component-stroke);
}
a {
  color: var(--td-brand-color);
  text-decoration: none;
  font-size: 13px;
}
a:focus-visible {
  outline: 2px solid var(--td-brand-color);
  outline-offset: 5px;
}
main {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 80px;
  max-width: 1050px;
  margin: 60px auto;
}
aside {
  position: sticky;
  top: 35px;
  align-self: start;
}
.eyebrow {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--td-text-color-secondary);
}
h1 {
  font-size: 32px;
  font-weight: 500;
  margin: 16px 0;
}
aside p {
  font-size: 13px;
  line-height: 1.8;
  color: var(--td-text-color-secondary);
}
nav {
  display: grid;
  gap: 15px;
  margin: 30px 0;
}
nav a {
  color: var(--td-text-color-secondary);
}
nav a:hover {
  color: var(--td-brand-color);
}
.back-home {
  display: block;
  margin-top: 40px;
}
section {
  scroll-margin-top: 35px;
  margin-bottom: 46px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--td-component-stroke);
}
h2 {
  font-size: 23px;
  font-weight: 500;
  margin: 12px 0 20px;
}
section p,
li {
  font-size: 14px;
  line-height: 2;
  color: var(--td-text-color-secondary);
}
ol {
  padding-left: 22px;
}
.help-note {
  font-size: 12px;
  line-height: 1.9;
  padding: 16px 20px;
  border-radius: 8px;
  background: var(--td-brand-color-light);
  color: var(--td-text-color-secondary);
  margin-top: 25px;
}
footer {
  max-width: 1100px;
  margin: auto;
  padding: 20px 0 35px;
  color: var(--td-text-color-secondary);
  font-size: 11px;
}
@media (max-width: 760px) {
  .help-page {
    padding: 0 24px;
  }
  header {
    height: 90px;
  }
  header :deep(.ek-descriptor) {
    display: none;
  }
  main {
    display: block;
    margin-top: 35px;
  }
  aside {
    position: static;
  }
  nav {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .back-home {
    margin: 20px 0 40px;
  }
  .help-content {
    padding-top: 10px;
  }
  h2 {
    font-size: 22px;
  }
}
</style>
