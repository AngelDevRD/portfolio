import nextConfig from "eslint-config-next";

const config = [...nextConfig, { ignores: [".next/**", "node_modules/**", ".claude/**"] }];

export default config;
