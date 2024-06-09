import { combinePaths } from 'typescript'

function ref<T>(value: T) {
  return { value }
}

export const workspacePath = ref('')

export const tsdk = ref(combinePaths(__dirname, 'lib'))
