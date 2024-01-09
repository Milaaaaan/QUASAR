import { useConnectionStore } from 'src/stores/connection'
import { useFetchStore } from 'src/stores/fetchData'

const syncData = async (array, update_url, get_url) => {
  const useFetch = useFetchStore()
  const useConnection = useConnectionStore()
  const ids = array.map((x) => x.id)
  const unsyncedArray = array.filter((x) => x.synced == false)
  const payload = {
    lastPull: useConnection.lastSync,
    existingIds: ids,
  }

  if (unsyncedArray.length > 0)
    try {
      await useFetch.fetch(update_url, 'post', { data: unsyncedArray })
      array.forEach((x) => (x.synced = true))
    } catch (err) {}

  const data = await useFetch.fetch(get_url, 'post', payload)

  data.removed_data.forEach((element) => {
    array = array.filter((x) => x.id != element)
  })

  data.updated.forEach((element) => {
    const existingPostIndex = array.findIndex((x) => x.id === element.id)
    if (existingPostIndex !== -1) {
      element.synced = true
      array[existingPostIndex] = element
    } else {
      array.push(element)
    }
  })
  return array
}

const syncObject = async (object, update_url) => {
  const useFetch = useFetchStore()
  const useConnection = useConnectionStore()
  try {
    if (!object.synced)
      return await useFetch.fetch(update_url, 'post', {
        data: object,
        lastSync: useConnection.lastSync,
      })
    else return object
  } catch (err) {
    return object
  }
}

export default { syncData, syncObject }
