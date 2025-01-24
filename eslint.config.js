import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true,
    ignores: [
      '**/assets/*',
    ],
  },
  {
    rules: {
      'no-console': ['off'], // 允许使用console
      'style/brace-style': ['error', '1tbs'], // 大括号风格
      'curly': ['error', 'all'], // 控制语句后必须有{}
    },
  },
)
