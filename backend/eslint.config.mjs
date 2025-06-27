import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  ...tseslint.configs.recommended,

  {
    name: 'prettier',
    rules: prettier.rules,
  },
]);
