import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function githubPagesBase() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) return "/";

  const repoName = repository.split("/").pop();
  if (!repoName || repoName.endsWith(".github.io")) return "/";

  return `/${repoName}/`;
}

export default defineConfig({
  base: githubPagesBase(),
  plugins: [react()],
});
