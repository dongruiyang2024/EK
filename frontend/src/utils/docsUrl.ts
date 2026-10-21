/** Help stays inside this deployment. */
export const DOCS_BASE_URL = "/help";
export const DOC_PAGES = {
  home: "",
  tenantAuth: "tenantAuth",
  models: "models",
  modelsCompat: "modelsCompat",
  knowledgeGraph: "knowledgeGraph",
  imIntegration: "imIntegration",
  apiOverview: "apiOverview",
  troubleshootingMigrations: "troubleshootingMigrations",
  sandboxDeployment: "sandboxDeployment",
} as const;
export type DocPage = keyof typeof DOC_PAGES;
export function docsUrl(page: DocPage): string {
  return DOCS_BASE_URL + (DOC_PAGES[page] ? `#${DOC_PAGES[page]}` : "");
}
