import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// For GitHub Pages, set base to '/repo-name/' if not using custom domain
// For user/organization pages (username.github.io), use '/'
const getBase = () => {
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
    // If it's a user/org page (ends with .github.io), use root
    if (repoName.endsWith('.github.io')) {
      return '/'
    }
    return `/${repoName}/`
  }
  return '/'
}

export default defineConfig({
  plugins: [react()],
  base: getBase(),
})
