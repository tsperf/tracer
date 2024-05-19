import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  ignores: [
    'playground/**/*.json',
  ],
}).append({
  files: ['playground/**'],
  rules: {
    'unused-imports/no-unused-vars': 'off',
    'ts/ban-types': 'off',
  },
})
