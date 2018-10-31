module.exports = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:compat/recommended',
    'prettier',
  ],
  plugins: ['jest', 'compat'],
  env: {
    'jest/globals': true,
    browser: true,
  },
};
