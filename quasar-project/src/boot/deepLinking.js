import { boot } from 'quasar/wrappers'
import { App } from '@capacitor/app'

export default boot(async ({ router }) => {
  App.addListener('appUrlOpen', function (event) {
    try {
      const url = new URL(event.url)
      const slug = url.pathname
      const params = new URLSearchParams(url.search)
      if (slug) {
        router.push({
          path: slug,
          query: Object.fromEntries(params.entries()),
        })
      }
    } catch (err) {
      router.push({
        name: 'Error',
      })
    }
  })
})