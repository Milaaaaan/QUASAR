import { ref, watch } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { useConnectionStore } from './connection'

axios.defaults.withCredentials = true
axios.defaults.baseURL = `${import.meta.env.VITE_BASE_URL}/api`
axios.defaults.headers.common['Accept'] = 'application/json'

export const useFetchStore = defineStore('fetchStore', () => {
  const responses = ref([])
  const error = ref(null)
  const accessToken = ref(null)
  const useConnection = useConnectionStore()
  const route = useRoute()

  const setToken = async (token) => {
    accessToken.value = token
    if (accessToken.value) {
      axios.defaults.headers.Authorization = `Bearer ${accessToken.value}`
    }
  }

  watch(route, () => {
    responses.value = []
  })

  const login = async (payload) => {
    try {
      const response = await axios.post('/login', payload)
      setToken(response.data.access_token)
      return response.data
    } catch (e) {
      handleErrors(e, true)
    }
  }

  const register = async (payload) => {
    try {
      await axios.post('/register', payload)
    } catch (e) {
      handleErrors(e, true)
    }
  }

  const fetch = async (
    url,
    type = 'get',
    payload = null,
    showErrors = false,
    showMessage = false,
    throwError = true,
    allData = false
  ) => {
    let data
    try {
      if (useConnection.isConnected) {
        if (type.toLocaleLowerCase() === 'post') data = (await axios.post(url, payload)).data
        else if (type.toLocaleLowerCase() === 'put') data = (await axios.put(url, payload)).data
        else if (type.toLocaleLowerCase() === 'del') data = (await axios.delete(url)).data
        else data = await (await axios.get(url)).data

        if (showMessage) responses.value.unshift({ message: data.message, type: 'positive' })

        if (allData) return data
        return data.data
      } else if (showErrors) {
        responses.value.unshift({ message: 'No internet connection', type: 'negative' })
      }
    } catch (e) {
      if (showErrors) handleErrors(e, throwError)
    }
  }

  const handleErrors = (data, throwError = false) => {
    responses.value = []
    let message

    if (data.response && data.response.data.message) message = data.response.data.message
    else message = 'Something went wrong please try again later.'

    responses.value.unshift({
      message: message,
      type: 'negative',
    })
    if (throwError) throw new Error(message)
  }

  return {
    responses,
    error,
    login,
    register,
    fetch,
    setToken,
  }
})
