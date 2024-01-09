<script setup>
import ReceiptTimeline from 'src/components/molecules/ReceiptTimeline.vue'
import { useReceiptStore } from 'src/stores/receipts'
import { computed } from 'vue'

const useReceipt = useReceiptStore()
const activity = computed(() => {
  const array = []

  array.push(
    ...useReceipt.receipts.map((receipt) => ({
      ...receipt,
      isTransaction: false,
    }))
  )
  array.push(
    ...useReceipt.transactions.map((transaction) => ({
      ...transaction,
      category: 'transaction',
      isTransaction: true,
    }))
  )

  // Sort the array based on the created_at property
  array.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  console.log(array)

  return array
})
</script>

<template>
  <q-page>
    <section class="default">
      <h2>Recent Activity</h2>

      <ReceiptTimeline :receipts="activity" />
    </section>
  </q-page>
</template>
