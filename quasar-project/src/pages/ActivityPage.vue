<script setup>
import ReceiptTimeline from 'src/components/molecules/ReceiptTimeline.vue'
import { useReceiptStore } from 'src/stores/receipts'
import { computed, ref } from 'vue'

const useReceipt = useReceiptStore()
const loading = computed(() => activity.value.length === 0)

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

if (useReceipt.receipts.length === 0) useReceipt.sync()
</script>

<template>
  <q-page>
    <section class="default">
      <h2>Recent Activity</h2>
      <ReceiptTimeline :loading="loading" :receipts="activity" />
    </section>
  </q-page>
</template>
