import type { NextConfig } from 'next';

// Set by the Pages workflow (actions/configure-pages): "" for <user>.github.io, "/<repo>" otherwise.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default config;
