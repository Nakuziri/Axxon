const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  output: "standalone",
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      oracledb: false, // keep existing fallback
    };

    if (!isServer) {
      // Prevent client-side bundle from trying to include Knex
      config.externals = config.externals || [];
      config.externals.push('knex');
    }

    return config;
  },
};

// Wrap with Sentry and export only once
module.exports = withSentryConfig(nextConfig, {
  org: "nanibro",
  project: "axxon",
  silent: !process.env.CI,
  disableLogger: true,
});
