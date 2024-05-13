import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  ignores: [
    'playground/**',
    'spa/.quasar/**',
    'out/**',
  ],
})
