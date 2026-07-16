import type { NextConfig } from "next";

// En producción el sitio vive en https://nexoaiecosystem-coder.github.io/gp-core/
// (GitHub Pages, subcarpeta = nombre del repo). En desarrollo (`next dev`) no se
// aplica basePath, así que localhost sigue funcionando en la raíz.
const isProd = process.env.NODE_ENV === "production";
const repo = "gp-core";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
