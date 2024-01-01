import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePopUpStore = defineStore('popUpStore', () => {
  const open = ref(false)
  const details = ref([])
  const type = ref('default')

  const toggle = async () => {
    open.value = !open.value
  }

  return {
    open,
    details,
    type,
    toggle,
  }
})
