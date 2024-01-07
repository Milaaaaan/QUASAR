import syncing from 'src/composables/syncing'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReceiptStore = defineStore('receiptsStore', () => {
  const receipts = ref([])

  const category = [
    { id: 0, icon: 'local_drink', label: 'Drinks', type: 'Food' },
    { id: 1, icon: 'local_pizza', label: 'Food', type: 'Food' },
    { id: 2, icon: 'fastfood', label: 'Food & Drinks', type: 'Food' },
    { id: 3, icon: 'receipt', label: 'Other', type: 'Food' },

    { id: 4, icon: 'account_balance_wallet', label: 'Pay back', type: 'General' },
    { id: 5, icon: 'water', label: 'Water', type: 'General' },
    { id: 6, icon: 'flash_on', label: 'Energy', type: 'General' },
    { id: 7, icon: 'wifi', label: 'Internet', type: 'General' },
    { id: 8, icon: 'card_giftcard', label: 'Gift', type: 'General' },
    { id: 9, icon: 'fitness_center', label: 'Healthcare', type: 'General' },
    { id: 10, icon: 'calculate', label: 'Taxes', type: 'General' },
    { id: 11, icon: 'diamond', label: 'Luxery', type: 'General' },
    { id: 12, icon: 'build', label: 'Maintenance', type: 'General' },
    { id: 13, icon: 'receipt', label: 'Other', type: 'General' },

    { id: 14, icon: 'directions_bike', label: 'Bicycle', type: 'Transport' },
    { id: 15, icon: 'directions_car', label: 'Car', type: 'Transport' },
    { id: 16, icon: 'directions_bus', label: 'Bus', type: 'Transport' },
    { id: 17, icon: 'directions_railway', label: 'Train', type: 'Transport' },
    { id: 18, icon: 'directions_subway', label: 'Subway', type: 'Transport' },
    { id: 19, icon: 'directions_boat', label: 'Boat', type: 'Transport' },
    { id: 20, icon: 'flight', label: 'Airplane', type: 'Transport' },
    { id: 21, icon: 'hotel', label: 'Hotel', type: 'Transport' },
    { id: 22, icon: 'receipt', label: 'Other', type: 'Transport' },

    { id: 23, icon: 'movie', label: 'Movies', type: 'Recreation' },
    { id: 24, icon: 'cake', label: 'Party', type: 'Recreation' },
    { id: 25, icon: 'sports_soccer', label: 'Sport', type: 'Recreation' },
    { id: 26, icon: 'shopping_bag', label: 'Shopping', type: 'Recreation' },
    { id: 27, icon: 'pets', label: 'Animals', type: 'Recreation' },
    { id: 28, icon: 'music_note', label: 'Music', type: 'Recreation' },
    { id: 29, icon: 'sports_esports', label: 'Games', type: 'Recreation' },
    { id: 30, icon: 'palette', label: 'Art', type: 'Recreation' },
    { id: 31, icon: 'receipt', label: 'Other', type: 'Recreation' },
  ]

  const init = async () => {
    if (localStorage.getItem('receipts')) {
      receipts.value = JSON.parse(localStorage.getItem('receipts'))
    }
  }

  const get = async () => {
    await init()
  }

  const sync = async () => {
    receipts.value = await syncing.syncData(receipts.value, '/receipts/update', '/receipts')
    await update()
  }

  init()

  const update = async () => {
    localStorage.setItem('receipts', JSON.stringify(receipts.value))
  }

  async function clear() {
    receipts.value = []
  }

  return {
    receipts,
    category,
    clear,
    get,
    sync,
    update,
  }
})
