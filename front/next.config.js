const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
  // APIのルートパス
  env: {
    API_ROOT: process.env.API_ROOT,
  },
  // サブディレクトリにアップする場合
  // basePath: '/preview',
  // assetPrefix: '/preview',
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
	staticPageGenerationTimeout: 1500,
  experimental: {
    reactRefresh: true
  },
  future: {
    webpack5: true,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
      }
    })
    return config
  }
}
module.exports = nextConfig