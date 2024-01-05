import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useFetchStore } from './fetchData'
import Pusher from 'pusher-js'
import syncer from 'src/composables/syncing'
import { useConnectionStore } from './connection'
import { Dark } from 'quasar'
import router from 'src/router'

export const useUserStore = defineStore('userStore', () => {
  const user = ref(null)
  const useFetch = useFetchStore()
  const useConnection = useConnectionStore()
  const notifications = ref([])
  const friends = ref([])
  const requests = ref([])
  const listener = ref(null)
  const themeToggle = ref(false)
  const token = ref(null)

  const pusher = new Pusher('e6108f2a8aeb9210e0f7', {
    cluster: 'eu',
  })

  watch(
    user,
    () => {
      if (user.value) {
        pusher.connect()
        if (!listener.value) {
          listener.value = pusher.subscribe('user.' + user.value.id)
          listener.value.bind('new-notification', function (data) {
            useFetch.responses.unshift({
              message: data.notification.title,
              type: 'info',
            })
            notifications.value.unshift(data.notification)
            update()
            sync()
          })
        }
      } else pusher.disconnect()
    },
    { deep: true }
  )

  const init = async () => {
    const DARK = JSON.parse(localStorage.getItem('dark'))
    const USER = JSON.parse(localStorage.getItem('user'))
    const TOKEN = JSON.parse(localStorage.getItem('token'))
    const FRIENDS = JSON.parse(localStorage.getItem('friends'))
    const REQUESTS = JSON.parse(localStorage.getItem('requests'))
    const NOTIFIES = JSON.parse(localStorage.getItem('notifies'))

    themeToggle.value = DARK
    if (NOTIFIES) notifications.value = NOTIFIES
    if (USER) user.value = USER
    if (FRIENDS) friends.value = FRIENDS
    if (REQUESTS) requests.value = REQUESTS
    if (TOKEN) {
      token.value = TOKEN
      useFetch.setToken(TOKEN)
    }
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

  const toggleDarkTheme = (shouldAdd) => {
    const rootElement = document.documentElement
    if (shouldAdd) rootElement.classList.add('dark')
    else rootElement.classList.remove('dark')
    localStorage.setItem('dark', JSON.stringify(shouldAdd))
  }

  const initializeDarkTheme = async (isDark) => {
    await init()
    toggleDarkTheme(themeToggle.value != null ? themeToggle.value : isDark)
    Dark.set(themeToggle.value != null ? themeToggle.value : isDark)
  }

  initializeDarkTheme(prefersDark.matches)
  prefersDark.addEventListener('change', (mediaQuery) => toggleChange(mediaQuery.matches))

  const toggleChange = () => {
    Dark.set(!Dark.isActive)
    toggleDarkTheme(Dark.isActive)
  }

  const get = async () => {
    await init()
  }

  const sync = async () => {
    let [A, B, C, D] = await Promise.all([
      syncer.syncData(friends.value, '/friends', '/friends'),
      syncer.syncData(requests.value, '/requests', '/requests'),
      syncer.syncObject(user.value, '/user/update'),
      syncer.syncData(notifications.value, '/notifications/update', '/notifications'),
    ])

    friends.value = A
    requests.value = B
    user.value = C
    notifications.value = D
    await update()
  }

  init()

  // login: try to login and get organisations corresponding to your credentials (wich one you have joined or not, backend does this)
  async function login(credentials) {
    try {
      const data = await useFetch.login(credentials)
      user.value = data.user
      token.value = data.access_token
      await useConnection.reload()
    } catch (err) {
      return false
    }
  }

  async function register(credentials) {
    try {
      await useFetch.register(credentials)
    } catch (err) {
      return false
    }
  }

  async function logout() {
    try {
      await useFetch.fetch('/logout', 'post')
    } catch (err) {
    } finally {
      await useConnection.clear()
      router.push('/login')
    }
  }

  const update = async () => {
    localStorage.setItem('notifies', JSON.stringify(notifications.value))
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', JSON.stringify(token.value))
    localStorage.setItem('friends', JSON.stringify(friends.value))
  }

  async function clear() {
    user.value = null
    token.value = null
    friends.value = []
    requests.value = []
    notifications.value = []
    localStorage.clear()
  }

  return {
    user,
    themeToggle,
    friends,
    requests,
    notifications,
    get,
    clear,
    logout,
    login,
    sync,
    register,
    update,
    toggleChange,
  }
})
