<script setup>
import { useUserStore } from 'src/stores/user'
import ReceiptTimeline from 'src/components/molecules/ReceiptTimeline.vue'
import { useReceiptStore } from 'src/stores/receipts'
import { computed, onMounted, ref } from 'vue'

const useReceipt = useReceiptStore()
const useUser = useUserStore()
const loading = computed(() => activity.value == null)

const activity = computed(() => {
  const array = []

  if (useReceipt.receipts == null || useReceipt.transactions == null || useUser.friends == null) return null

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

  array.sort((a, b) => new Date(b.date) - new Date(a.date))
  return array
})

onMounted(() => {
  if (useUser.friends == null) useUser.sync()
  if (useReceipt.receipts == null) useReceipt.sync()
})


</script>

<template>
  <q-page>
    <section class="default">
      <h2>Recent Activity</h2>
      <ReceiptTimeline :loading="loading" :receipts="activity" />
    </section>
  </q-page>
</template>
