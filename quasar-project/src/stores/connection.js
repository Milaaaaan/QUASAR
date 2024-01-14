import { defineStore } from 'pinia'
import { Network } from '@capacitor/network'
import { ref } from 'vue'
import { useReceiptStore } from './receipts'
import { useUserStore } from './user'
import { useGroupStore } from './groups'
import { useFetchStore } from './fetchData'

export const useConnectionStore = defineStore('connectionStore', () => {
  const isConnected = ref(true)
  const useReceipt = useReceiptStore()
  const useFetch = useFetchStore()
  const useUser = useUserStore()
  const useGroup = useGroupStore()
  const lastSync = ref(null)
  const type = ref()

  Network.addListener('networkStatusChange', async (status) => {
    isConnected.value = status.connected
    type.value = status.type
    console.log('Network status changed', isConnected.value)
  })

  const reload = async (event = null) => {
    if (isConnected.value) {
      if (useUser.user) {
        const date = new Date()
        await Promise.all([useReceipt.sync(), useUser.sync(), useGroup.sync()])
        lastSync.value = date
        console.log(date)
        localStorage.setItem('lastSync', JSON.stringify(date))
      }
    } else
      useFetch.responses.push({
        message: 'You went offline',
        type: 'negative',
      })
    if (event) event.target.complete()
  }

  const clear = async () => {
    lastSync.value = null
    await Promise.all([useReceipt.clear(), useUser.clear(), useGroup.clear()])
  }

  const init = async () => {
    lastSync.value = JSON.parse(localStorage.getItem('lastSync'))
    const data = await Network.getStatus()
    type.value = data.connectionType
    isConnected.value = data.connected
    if (isConnected.value) await reload()
  }

  init()

  return {
    isConnected,
    lastSync,
    type,
    clear,
    reload,
  }
})
