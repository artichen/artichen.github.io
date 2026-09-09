import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 相对资源路径兼容 GitHub Pages 的 /仓库名/ 子目录。
  base: "./",
});
