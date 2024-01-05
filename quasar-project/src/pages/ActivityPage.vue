<script setup lang="ts">
import ReceiptTimeline from 'src/components/molecules/ReceiptTimeline.vue'
import { useReceiptStore } from 'src/stores/receipts'

const useReceipt = useReceiptStore()
</script>

<template>
  <q-page>
    <section class="default">
      <h2>Recent Activity</h2>

      <ReceiptTimeline :receipts="useReceipt.receipts" />
    </section>
  </q-page>
</template>
