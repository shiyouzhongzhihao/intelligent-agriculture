module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // 添加缩进规则
    'vue/html-indent': ['error', 2, {
      // 选项
      attribute: 1, // 属性缩进，默认为 1
      baseIndent: 1, // 基本缩进（缩进两个空格）
      closeBracket: 0 // 结束标签的括号缩进
    }]
  }
}
