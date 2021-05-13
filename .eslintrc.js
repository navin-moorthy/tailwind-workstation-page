module.exports = {
  extends: ['auto'],
  env: {
    browser: true,
  },
  rules: {
    'no-console': 'off',
    'no-param-reassign': 'off',
    '@html-eslint/indent': ['error', 2],
  },
  settings: {
    compat: true,
  },
};
