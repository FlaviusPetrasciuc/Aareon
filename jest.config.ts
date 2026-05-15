import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: { jsx: "react-jsx", esModuleInterop: true } },
    ],
  },
  moduleNameMapper: {
    "^nanoid$": "<rootDir>/__mocks__/nanoid.js",
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
};

export default config;
