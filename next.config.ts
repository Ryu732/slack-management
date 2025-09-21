import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時のESLintチェックを無効化
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
