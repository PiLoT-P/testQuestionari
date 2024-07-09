module.exports = {
  env: { browser: true, es2020: true },
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'import'],
  rules: {
    indent: ['error', 2],
    quotes: ['warn', 'single', {avoidEscape: true}],
    semi: 0,
    'linebreak-style': ['error', 'unix'],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
}
