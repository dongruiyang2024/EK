<template>
  <div class="login-page">
    <header class="login-header">
      <router-link to="/" aria-label="EK 首页"><BrandLogo /></router-link>
      <div class="header-links">
        <router-link to="/" class="home-link">{{
          currentLanguage.startsWith("zh") ? "返回首页" : "Home"
        }}</router-link>
        <div class="language-switch">
          <button
            type="button"
            class="language-toggle"
            @click="toggleLanguageMenu"
            :aria-expanded="showLanguageMenu"
          >
            {{ currentLangOption?.label }} ▾
          </button>
          <div v-if="showLanguageMenu" class="language-dropdown">
            <button
              v-for="lang in languageOptions"
              :key="lang.value"
              type="button"
              @click="selectLanguage(lang.value)"
              :class="{ active: currentLanguage === lang.value }"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>
      </div>
    </header>
    <section class="login-story">
      <h1>
        {{
          currentLanguage.startsWith("zh")
            ? "让知识归位，"
            : "A space for knowledge."
        }}<br /><em>{{
          currentLanguage.startsWith("zh")
            ? "让思考向前。"
            : "Room for thought."
        }}</em>
      </h1>
    </section>
    <!-- Right Form Section -->
    <div class="form-section">
      <div class="form-panel">
        <!-- Login Card -->
        <div class="form-card" v-if="!isRegisterMode">
          <!-- 登录已有账号时保留邀请上下文。 -->
          <div v-if="inviteLookup" class="invite-banner">
            <t-icon name="link" class="invite-banner__icon" />
            <div class="invite-banner__text">
              <div class="invite-banner__title">
                {{
                  $t("inviteRegister.bannerTitle", {
                    tenant: inviteLookup.tenant_name || "",
                  })
                }}
              </div>
              <div class="invite-banner__hint">
                {{ $t("inviteRegister.bannerHintLogin") }}
              </div>
            </div>
          </div>
          <div
            v-else-if="inviteLookupError"
            class="invite-banner invite-banner--error"
          >
            {{ inviteLookupError }}
          </div>
          <div class="form-header">
            <h2 class="form-title">{{ $t("auth.login") }}</h2>
          </div>

          <div class="form-content">
            <t-form
              ref="formRef"
              :data="formData"
              :rules="formRules"
              @submit="handleLogin"
              layout="vertical"
              label-align="top"
            >
              <t-form-item :label="$t('auth.email')" name="email">
                <t-input
                  v-model="formData.email"
                  :placeholder="$t('auth.emailPlaceholder')"
                  type="text"
                  autocomplete="email"
                  size="large"
                  :disabled="loading"
                />
              </t-form-item>

              <t-form-item :label="$t('auth.password')" name="password">
                <t-input
                  v-model="formData.password"
                  :placeholder="$t('auth.passwordPlaceholder')"
                  type="password"
                  autocomplete="current-password"
                  size="large"
                  :disabled="loading"
                  @enter="handleLogin"
                />
              </t-form-item>

              <t-button
                type="submit"
                theme="primary"
                size="large"
                block
                :loading="loading"
                class="submit-button"
              >
                {{ loading ? $t("auth.loggingIn") : $t("auth.login") }}
              </t-button>

              <div class="register-cta" v-if="registrationEnabled">
                <div class="register-cta__divider">
                  <span>{{ $t("auth.firstTime") }}</span>
                </div>
                <t-button
                  theme="default"
                  variant="outline"
                  size="large"
                  block
                  class="register-cta__button"
                  :disabled="loading"
                  @click="toggleMode"
                >
                  {{ $t("auth.createAccount") }}
                </t-button>
              </div>

              <div v-if="oidcEnabled" class="oidc-divider">
                <span>{{ $t("auth.orContinueWith") }}</span>
              </div>

              <t-button
                v-if="oidcEnabled"
                theme="default"
                size="large"
                block
                :loading="oidcLoading"
                :disabled="loading"
                class="oidc-button"
                @click="handleOIDCLogin"
              >
                {{ oidcLoading ? $t("auth.redirectingToOIDC") : oidcLoginText }}
              </t-button>
            </t-form>

          </div>
        </div>

        <!-- Registration must be allowed for this mode and invitation. -->
        <div class="form-card" v-if="isRegisterMode && registrationEnabled">
          <!-- Share-link banner: shown only when ?token= resolved to a
               real invitation row. Sits above the form header so the
               invitee instantly sees who invited them and into which
               workspace, without bumping the existing register UX. -->
          <div v-if="inviteLookup" class="invite-banner">
            <t-icon name="link" class="invite-banner__icon" />
            <div class="invite-banner__text">
              <div class="invite-banner__title">
                {{
                  $t("inviteRegister.bannerTitle", {
                    tenant: inviteLookup.tenant_name || "",
                  })
                }}
              </div>
              <div class="invite-banner__hint">
                {{ $t("inviteRegister.bannerHint") }}
              </div>
            </div>
          </div>
          <div
            v-else-if="inviteLookupError"
            class="invite-banner invite-banner--error"
          >
            {{ inviteLookupError }}
          </div>
          <div class="form-header">
            <h2 class="form-title">{{ $t("auth.createAccount") }}</h2>
            <p class="form-subtitle">{{ $t("auth.registerSubtitle") }}</p>
          </div>

          <div class="form-content">
            <t-form
              ref="registerFormRef"
              :data="registerData"
              :rules="registerRules"
              @submit="handleRegister"
              layout="vertical"
              label-align="top"
            >
              <t-form-item :label="$t('auth.username')" name="username">
                <t-input
                  v-model="registerData.username"
                  :placeholder="$t('auth.usernamePlaceholder')"
                  size="large"
                  :disabled="loading"
                />
              </t-form-item>

              <t-form-item :label="$t('auth.email')" name="email">
                <t-input
                  v-model="registerData.email"
                  :placeholder="$t('auth.emailPlaceholder')"
                  type="text"
                  autocomplete="email"
                  size="large"
                  :disabled="loading"
                />
              </t-form-item>

              <t-form-item :label="$t('auth.password')" name="password">
                <t-input
                  v-model="registerData.password"
                  :placeholder="$t('auth.passwordPlaceholder')"
                  type="password"
                  autocomplete="new-password"
                  size="large"
                  :disabled="loading"
                />
              </t-form-item>

              <t-form-item
                :label="$t('auth.confirmPassword')"
                name="confirmPassword"
              >
                <t-input
                  v-model="registerData.confirmPassword"
                  :placeholder="$t('auth.confirmPasswordPlaceholder')"
                  type="password"
                  autocomplete="new-password"
                  size="large"
                  :disabled="loading"
                  @enter="handleRegister"
                />
              </t-form-item>

              <t-button
                type="submit"
                theme="primary"
                size="large"
                block
                :loading="loading"
                class="submit-button"
              >
                {{ loading ? $t("auth.registering") : $t("auth.register") }}
              </t-button>
            </t-form>

            <div class="form-footer">
              <span>{{ $t("auth.haveAccount") }}</span>
              <a href="#" @click.prevent="toggleMode" class="link-button">
                {{ $t("auth.backToLogin") }}
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BrandLogo from "@/components/BrandLogo.vue";
import {
  ref,
  reactive,
  nextTick,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { MessagePlugin } from "tdesign-vue-next";
import { useRoleLabel } from "@/composables/useRoleLabel";
import { notifyLoginSuccess } from "@/utils/loginNotify";
import { canRegister } from "./registrationPolicy";
import { newPasswordRules } from "@/utils/passwordPolicy";
import {
  login,
  register,
  getOIDCAuthorizationURL,
  getOIDCConfig,
  autoSetup,
  getAuthConfig,
  userInfoFromApi,
  getInvitationByToken,
  registerByInvite,
  type InviteLookup,
} from "@/api/auth";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { t, tm, locale } = useI18n();
const { formatRole, roleIcon } = useRoleLabel();

// Form references
const formRef = ref();
const registerFormRef = ref();

// State management
const loading = ref(false);
const oidcLoading = ref(false);
const isRegisterMode = ref(false);
const showLanguageMenu = ref(false);
const oidcEnabled = ref(false);
const oidcProviderName = ref("");
// Wait for configuration before showing a registration entry.
const registrationMode = ref("");
const registrationEnabled = computed(() =>
  canRegister(registrationMode.value, !!inviteLookup.value),
);
const complexPasswordEnabled = ref(false);

// invite-link state. When the URL carries ?token=xxx we resolve it to
// the originating tenant + role and switch the form into a "register
// via invitation" mode when invitation registration is enabled. Submitting the register
// form with this set hits /auth/register-by-invite (auto-login on
// success) instead of /auth/register.
const inviteToken = ref("");
const inviteLookup = ref<InviteLookup | null>(null);
const inviteLookupError = ref("");
const inviteLookupLoading = ref(false);

// Language options
const languageOptions = [
  { value: "zh-CN", label: "简体中文", shortLabel: "中文", flag: "🇨🇳" },
  { value: "zh-TW", label: "繁體中文", shortLabel: "繁中", flag: "繁" },
  { value: "en-US", label: "English", shortLabel: "EN", flag: "🇺🇸" },
  { value: "ru-RU", label: "Русский", shortLabel: "RU", flag: "🇷🇺" },
  { value: "ko-KR", label: "한국어", shortLabel: "한국어", flag: "🇰🇷" },
  { value: "ja-JP", label: "日本語", shortLabel: "日本語", flag: "🇯🇵" },
];

const currentLanguage = computed(() => locale.value);
const oidcLoginText = computed(() => {
  if (oidcProviderName.value) {
    return t("auth.oidcLoginWithProvider", {
      provider: oidcProviderName.value,
    });
  }
  return t("auth.oidcLogin");
});
const currentLangOption = computed(() =>
  languageOptions.find((l) => l.value === currentLanguage.value),
);

// Login form data
const formData = reactive<{ [key: string]: any }>({
  email: "",
  password: "",
});

// Register form data
const registerData = reactive<{ [key: string]: any }>({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Login form validation rules
const formRules = computed(() => ({
  email: [
    { required: true, message: t("auth.emailRequired"), type: "error" },
    { email: true, message: t("auth.emailInvalid"), type: "error" },
  ],
  password: [
    { required: true, message: t("auth.passwordRequired"), type: "error" },
    { min: 8, message: t("auth.passwordMinLength"), type: "error" },
    { max: 32, message: t("auth.passwordMaxLength"), type: "error" },
  ],
}));

// Register form validation rules
const registerRules = computed(() => ({
  username: [
    { required: true, message: t("auth.usernameRequired"), type: "error" },
    { min: 2, message: t("auth.usernameMinLength"), type: "error" },
    { max: 20, message: t("auth.usernameMaxLength"), type: "error" },
    {
      pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
      message: t("auth.usernameInvalid"),
      type: "error",
    },
  ],
  email: [
    { required: true, message: t("auth.emailRequired"), type: "error" },
    { email: true, message: t("auth.emailInvalid"), type: "error" },
  ],
  password: newPasswordRules(t, complexPasswordEnabled.value),
  confirmPassword: [
    {
      required: true,
      message: t("auth.confirmPasswordRequired"),
      type: "error",
    },
    {
      validator: (val: string) => val === registerData.password,
      message: t("auth.passwordMismatch"),
      type: "error",
    },
  ],
}));

// Toggle login/register mode
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value && registrationEnabled.value;

  Object.keys(registerData).forEach((key) => {
    (registerData as any)[key] = "";
  });
};

// Toggle language menu
const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value;
};

// Select language
const selectLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem("locale", lang);
  showLanguageMenu.value = false;
  MessagePlugin.success(t("language.languageSaved"));
};

// Close language menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".language-switch")) {
    showLanguageMenu.value = false;
  }
};

// Add click outside listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const persistLoginResponse = async (response: any, skipRedirect = false) => {
  // Backend renamed `tenant` to `active_tenant` and added `memberships`
  // when tenant-level RBAC landed (issue #1303). The two are otherwise
  // identical — `active_tenant` is the tenant whose ID is encoded in the
  // JWT, defaulting to the user's home tenant on a fresh login.
  const activeTenant = response.active_tenant || response.tenant;
  if (response.user && response.token) {
    // user.tenant_id must be the user's HOME tenant (the immutable row
    // on the users table); useHomeTenant() and the home-badge logic both
    // assume so. The ACTIVE tenant (which can differ from home when the
    // server honoured a remembered last-active-tenant preference) is
    // expressed separately via setSelectedTenant below.
    const homeTenantIdRaw = response.user.tenant_id ?? activeTenant?.id ?? "";
    authStore.setUser(userInfoFromApi(response.user, homeTenantIdRaw));
    authStore.setToken(response.token);
    if (response.refresh_token) {
      authStore.setRefreshToken(response.refresh_token);
    }
    if (activeTenant) {
      authStore.setTenant({
        id: String(activeTenant.id) || "",
        name: activeTenant.name || "",
        owner_id: response.user.id || "",
        created_at: activeTenant.created_at || new Date().toISOString(),
        updated_at: activeTenant.updated_at || new Date().toISOString(),
      });
    } else {
      authStore.setTenant(null);
    }
    if (Array.isArray(response.memberships)) {
      authStore.setMemberships(response.memberships);
    }
    // If the backend dropped us into a non-home tenant (honoured a
    // remembered "last active tenant" preference), set the override so
    // subsequent requests carry X-Tenant-ID and the UI stays consistent.
    // Otherwise clear any stale override left in localStorage by a
    // previous session for a different account.
    const activeIdNum = Number(activeTenant?.id);
    const homeIdNum = Number(homeTenantIdRaw);
    if (
      Number.isFinite(activeIdNum) &&
      Number.isFinite(homeIdNum) &&
      activeIdNum !== homeIdNum
    ) {
      authStore.setSelectedTenant(activeIdNum, activeTenant?.name || null);
    } else {
      authStore.setSelectedTenant(null, null);
    }
  }

  // Pull runtime capabilities (including whether ordinary users may create
  // workspaces) before entering the main UI so create actions never flash
  // briefly when the deployment is invitation-only.
  await authStore.refreshFromAuthMe();
  await nextTick();
  if (skipRedirect) return;
  router.replace(
    authStore.hasValidTenant
      ? "/platform/knowledge-bases"
      : "/onboarding/workspace",
  );
};

const getBackendOIDCRedirectURI = () =>
  `${window.location.origin}/api/v1/auth/oidc/callback`;

const loadOIDCConfig = async () => {
  try {
    const response = await getOIDCConfig();
    oidcEnabled.value = !!response.success && !!response.enabled;
    oidcProviderName.value = response.provider_display_name || "";
  } catch {
    oidcEnabled.value = false;
    oidcProviderName.value = "";
  }
};

// Registration stays hidden if configuration cannot be loaded.
const loadAuthConfig = async () => {
  try {
    const response = await getAuthConfig();
    registrationMode.value = response.success ? response.registration_mode : "";
    complexPasswordEnabled.value = response.complex_password_enabled;
  } catch {
    registrationMode.value = "";
    complexPasswordEnabled.value = false;
  }
};

const handleOIDCLogin = async () => {
  try {
    oidcLoading.value = true;
    const response = await getOIDCAuthorizationURL(getBackendOIDCRedirectURI());
    const authorizationURL = response.authorization_url;

    if (!response.success || !authorizationURL) {
      MessagePlugin.error(response.message || t("auth.oidcLoginFailed"));
      return;
    }

    // 跳转 IdP 会丢失 URL 中的 token，暂存到 sessionStorage，回调后由 App.vue 兑换。
    if (inviteToken.value) {
      sessionStorage.setItem("weknora_pending_invite_token", inviteToken.value);
    }
    window.location.href = authorizationURL;
  } catch (error: any) {
    console.error("OIDC 登录跳转失败:", error);
    MessagePlugin.error(error.message || t("auth.oidcLoginFailed"));
  } finally {
    oidcLoading.value = false;
  }
};

// 用 token 加入空间并进入应用。会话此时已有效，故即便 token 失效也照常进入（避免困在登录页）。
const acceptAndEnter = async (token: string) => {
  loading.value = true;
  try {
    const result = await authStore.acceptInvitationByTokenAndRefresh(token);
    if (result.ok) {
      MessagePlugin.success(t("inviteRegister.joined"));
    } else {
      MessagePlugin.warning(t("inviteRegister.invalidBody"));
    }
  } catch {
    MessagePlugin.warning(t("inviteRegister.invalidBody"));
  } finally {
    loading.value = false;
    await nextTick();
    router.replace("/platform/knowledge-bases");
  }
};

// Handle login
const handleLogin = async () => {
  try {
    const valid = await formRef.value?.validate();
    if (valid !== true) return;

    loading.value = true;

    const response = await login({
      email: formData.email,
      password: formData.password,
    });

    if (response.success) {
      if (inviteToken.value) {
        // 从邀请链接登录：持久化会话后兑换 token 并进入对应空间。
        await persistLoginResponse(response, true);
        await acceptAndEnter(inviteToken.value);
        return;
      }
      await persistLoginResponse(response);
      notifyLoginSuccess(response, t, tm, formatRole, roleIcon);
    } else {
      MessagePlugin.error(response.message || t("auth.loginError"));
    }
  } catch (error: any) {
    console.error("登录错误:", error);
    MessagePlugin.error(error.message || t("auth.loginErrorRetry"));
  } finally {
    loading.value = false;
  }
};

// Handle registration. Dispatches based on whether the user arrived
// with a share-link token: with token -> register-by-invite (auto-
// login on success); without -> the normal self-service register
// (drops back to the login form for the user to sign in).
const handleRegister = async () => {
  if (!registrationEnabled.value) return;
  try {
    const valid = await registerFormRef.value?.validate();
    if (valid !== true) return;

    loading.value = true;

    if (inviteToken.value) {
      const response = await registerByInvite({
        token: inviteToken.value,
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      });
      if (!response.success) {
        MessagePlugin.error(response.message || t("auth.registerFailed"));
        return;
      }
      MessagePlugin.success(t("auth.registerSuccess"));
      // register-by-invite returns the same shape as login (token +
      // active_tenant + memberships), so reuse the login persistence
      // path — same store writes, same redirect target.
      await persistLoginResponse(response);
      return;
    }

    const response = await register({
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
    });

    if (response.success) {
      MessagePlugin.success(t("auth.registerSuccess"));

      // Switch to login mode and fill in email
      isRegisterMode.value = false;
      formData.email = registerData.email;

      // Clear register form
      Object.keys(registerData).forEach((key) => {
        (registerData as any)[key] = "";
      });
    } else {
      MessagePlugin.error(response.message || t("auth.registerFailed"));
    }
  } catch (error: any) {
    console.error("注册错误:", error);
    MessagePlugin.error(error.message || t("auth.registerError"));
  } finally {
    loading.value = false;
  }
};

// Check if already logged in; for lite edition, attempt transparent auto-setup
onMounted(async () => {
  // Share-link landing: ?token=xxx switches the form into invite-
  // register mode before any other auto-flow (logged-in redirect /
  // auto-setup / OIDC) gets a chance to redirect. Resolution failure
  // surfaces inline; the user can still log in normally if they
  // already have an account. We check this BEFORE the isLoggedIn
  // redirect so an existing session doesn't bounce the user to
  // /platform (and possibly back to /login if the session is stale),
  // dropping the invite token along the way.
  const tokenFromQuery = String(route.query.token || "").trim();
  if (tokenFromQuery) {
    inviteToken.value = tokenFromQuery;
    inviteLookupLoading.value = true;
    // 1. 先校验 token：无效/过期则停在登录页报错，不进注册模式。
    try {
      const resp = await getInvitationByToken(tokenFromQuery);
      if (resp.success && resp.data) {
        inviteLookup.value = resp.data;
      } else {
        inviteLookupError.value =
          resp.message || t("inviteRegister.invalidBody");
        loadOIDCConfig();
        loadAuthConfig();
        return;
      }
    } catch {
      inviteLookupError.value = t("inviteRegister.invalidBody");
      loadOIDCConfig();
      loadAuthConfig();
      return;
    } finally {
      inviteLookupLoading.value = false;
    }

    // 2. 已登录则直接兑换 token 进入空间（三种模式通用）。
    if (authStore.isLoggedIn && (await authStore.refreshFromAuthMe())) {
      await acceptAndEnter(tokenFromQuery);
      return;
    }

    // 3. Only enabled registration modes may create an invited account.
    await loadAuthConfig();
    isRegisterMode.value = registrationEnabled.value;
    loadOIDCConfig();
    return;
  }

  if (authStore.isLoggedIn) {
    router.replace("/platform/knowledge-bases");
    return;
  }

  localStorage.removeItem("weknora_auto_setup_failed");
  try {
    const response = await autoSetup();
    if (response.success) {
      authStore.setLiteMode(true);
      await persistLoginResponse(response);
      return;
    }
  } catch {
    // Auto-setup may be unavailable outside the native Lite shell.
  }

  loadOIDCConfig();
  loadAuthConfig();
});
</script>
<style scoped lang="less">
.login-page {
  box-sizing: border-box;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 50px;
  padding: 145px max(6vw, 24px) 70px;
  background: var(--td-bg-color-page);
  color: var(--td-text-color-primary);
  position: relative;
}
.login-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 32px max(6vw, 24px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
a {
  color: var(--td-brand-color);
  text-decoration: none;
}
.header-links {
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 13px;
}
.home-link {
  color: var(--td-text-color-secondary);
}
.language-switch {
  position: relative;
}
.language-toggle {
  background: none;
  border: 0;
  color: var(--td-text-color-secondary);
  padding: 8px;
  cursor: pointer;
}
.language-dropdown {
  position: absolute;
  right: 0;
  top: 38px;
  padding: 6px;
  min-width: 150px;
  border: 1px solid var(--td-component-stroke);
  background: var(--td-bg-color-container);
  border-radius: 10px;
  z-index: 10;
  box-shadow: 0 8px 30px #233e5410;
  display: grid;
}
.language-dropdown button {
  border: 0;
  border-radius: 5px;
  text-align: left;
  padding: 10px;
  background: none;
  color: var(--td-text-color-primary);
  cursor: pointer;
}
.language-dropdown button:hover,
.language-dropdown button.active {
  background: var(--td-brand-color-light);
  color: var(--td-brand-color);
}
.login-story {
  max-width: 500px;
  margin: auto;
}
.login-story h1 {
  font-size: clamp(36px, 4vw, 56px);
  line-height: 1.4;
  font-weight: 500;
  margin: 28px 0 22px;
  letter-spacing: -1px;
}
.login-story h1 em {
  font-style: normal;
  color: var(--td-brand-color);
}
.form-section {
  width: 100%;
  max-width: 440px;
  margin: auto;
}
.form-panel {
  padding: 40px;
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-component-stroke);
  border-radius: 18px;
  box-shadow: 0 16px 70px #36566e08;
}
.form-header {
  margin-bottom: 29px;
}
.form-title {
  font-weight: 500;
  font-size: 25px;
  margin: 0 0 12px;
}
.form-subtitle {
  font-size: 13px;
  line-height: 1.7;
  color: var(--td-text-color-secondary);
  margin: 7px 0;
}
.form-content :deep(.t-input) {
  border-radius: 7px;
}
.form-content :deep(.t-form__label) {
  font-size: 13px;
}
.submit-button {
  margin-top: 6px;
  border-radius: 7px;
}
.form-footer {
  display: flex;
  justify-content: center;
  gap: 9px;
  margin: 24px 0;
  font-size: 12px;
  color: var(--td-text-color-secondary);
}
.register-cta__divider,
.oidc-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--td-text-color-placeholder);
  font-size: 11px;
  margin: 22px 0 15px;
  &:before,
  &:after {
    content: "";
    height: 1px;
    background: var(--td-component-stroke);
    flex: 1;
  }
}
.register-cta__button,
.oidc-button {
  border-radius: 7px;
}
.invite-banner {
  padding: 14px;
  background: var(--td-brand-color-light);
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  gap: 9px;
  font-size: 12px;
  line-height: 1.7;
}
.invite-banner__title {
  font-weight: 600;
}
.invite-banner--error {
  color: var(--td-error-color);
  background: var(--td-error-color-light);
}
@media (max-width: 900px) {
  .login-page {
    gap: 30px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .form-panel {
    padding: 30px;
  }
  .login-story h1 {
    font-size: 38px;
  }
}
@media (max-width: 700px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 110px 22px 45px;
    gap: 30px;
  }
  .login-header {
    padding: 25px 22px;
  }
  .login-header :deep(.ek-descriptor) {
    display: none;
  }
  .header-links {
    gap: 12px;
  }
  .login-story {
    max-width: 440px;
    width: 100%;
  }
  .login-story h1 {
    font-size: 30px;
    margin: 12px 0 8px;
  }

  .form-panel {
    padding: 28px;
  }
  .form-title {
    font-size: 23px;
  }
}
</style>
