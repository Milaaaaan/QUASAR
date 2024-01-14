import { ref } from 'vue'
import { defineStore } from 'pinia'
import syncing from 'src/composables/syncing'

export const useGroupStore = defineStore('groupStore', () => {
  const groups = ref(null)

  const init = () => {
    const GROUPS = JSON.parse(localStorage.getItem('groups'))
    if (GROUPS) groups.value = GROUPS
  }

  const get = () => {
    init()
  }

  const sync = async () => {
    groups.value = await syncing.syncData(groups.value, '/groups/update', '/groups')
    update()
  }

  init()

  const update = () => {
    localStorage.setItem('groups', JSON.stringify(groups.value))
  }

  function clear() {
    groups.value = null
  }

  return {
    groups,
    get,
    clear,
    sync,
    update,
  }
})
