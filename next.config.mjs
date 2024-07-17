/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['img.clerk.com']
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false,
            titleProp: true,
            ref: true
          }
        },
        'url-loader'
      ]
    })

    return config
  }
}

export default nextConfig
