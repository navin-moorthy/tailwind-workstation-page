module.exports = {
  extends: ['auto'],
  env: {
    browser: true,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['tailwind.config.js'] }],
    'no-console': 'off',
    'no-param-reassign': 'off',
  },
};
