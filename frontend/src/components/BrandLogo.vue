<template>
  <span class="ek-logo" :class="{ compact }" aria-label="EK 知识空间">
    <svg class="ek-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="currentColor" />
      <path
        d="M11 12h12M11 20h9M11 28h12M11 12v16M25 20l5-8M25 20l5 8"
        stroke="#fff"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span class="ek-wordmark"
      >EK<span v-if="!compact" class="ek-descriptor">知识空间</span></span
    >
  </span>
</template>
<script setup lang="ts">
defineProps<{ compact?: boolean }>();
</script>
<style scoped>
.ek-logo {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--td-text-color-primary);
  white-space: nowrap;
}
.ek-mark {
  width: 38px;
  height: 38px;
  color: var(--td-brand-color);
  flex-shrink: 0;
}
.ek-wordmark {
  font-size: 25px;
  font-weight: 650;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.ek-descriptor {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 2px;
  color: var(--td-text-color-secondary);
  padding-left: 14px;
  border-left: 1px solid var(--td-component-stroke);
}
.compact .ek-mark {
  width: 29px;
  height: 29px;
  border-radius: 8px;
}
.compact .ek-wordmark {
  font-size: 23px;
}
</style>
