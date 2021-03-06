module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  rules: {
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    'no-trailing-spaces': 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  globals: {
    Auth0Lock: 'readonly',
    ga: 'readonly',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
