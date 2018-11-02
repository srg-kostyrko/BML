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
  rules: {
    'no-unused-vars': [
      'error',
      { args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'no-underscore-dangle': [
      'error',
      { allow: ['_pack_', '_parse_', '_encode_', '_decode_'] },
    ],
    'class-methods-use-this': ['error', { exceptMethods: ['type'] }],
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
  },
};
