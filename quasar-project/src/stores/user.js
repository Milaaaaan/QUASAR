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
            useFetch.responses.push({
              message: data.notification.title,
              type: 'info',
            })
            notifications.value.push(data.notification)
            update()
            sync()
            console.log(data.notification.title)
          })
        }
      } else pusher.disconnect()
    },
    { deep: true }
  )

  // Use matchMedia to check the user preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

  // Add or remove the "dark" class on the :root element
  const toggleDarkTheme = (shouldAdd) => {
    const rootElement = document.documentElement
    if (shouldAdd) {
      rootElement.classList.add('dark')
    } else {
      rootElement.classList.remove('dark')
    }
  }

  // Check/uncheck the toggle and update the theme based on isDark
  const initializeDarkTheme = (isDark) => {
    themeToggle.value = isDark
    toggleDarkTheme(isDark)
    console.log(Dark)
  }

  // Initialize the dark theme based on the initial
  // value of the prefers-color-scheme media query
  initializeDarkTheme(prefersDark.matches)

  // Listen for changes to the prefers-color-scheme media query
  prefersDark.addEventListener('change', (mediaQuery) => initializeDarkTheme(mediaQuery.matches))

  // Listen for the toggle check/uncheck to toggle the dark theme
  const toggleChange = () => {
    Dark.set(!Dark.isActive)
    toggleDarkTheme(Dark.isActive)
  }

  const init = async () => {
    const USER = JSON.parse(localStorage.getItem('user'))
    const TOKEN = JSON.parse(localStorage.getItem('token'))
    const FRIENDS = JSON.parse(localStorage.getItem('friends'))
    const REQUESTS = JSON.parse(localStorage.getItem('requests'))
    const NOTIFIES = JSON.parse(localStorage.getItem('notifies'))

    if (NOTIFIES) notifications.value = NOTIFIES
    if (USER) user.value = USER
    if (FRIENDS) friends.value = FRIENDS
    if (REQUESTS) requests.value = REQUESTS
    if (TOKEN) {
      token.value = TOKEN
      useFetch.setToken(TOKEN)
    }
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
    console.log(user.value)
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
