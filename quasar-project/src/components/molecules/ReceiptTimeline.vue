<script setup>
import helper from 'src/composables/helper'
import ActivityCard from 'src/components/molecules/ActivityCard.vue'
import { useReceiptStore } from 'src/stores/receipts'

const props = defineProps({
  receipts: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const useReceipt = useReceiptStore()

const color = (type) => {
  const x = type >= 0 ? useReceipt.category[type].type : 'Transaction'
  if (x === 'Transaction') return 'contrast'
  if (x === 'Transport') return 'yellow-8'
  if (x === 'Food') return 'red'
  if (x === 'General') return 'blue'
  if (x === 'Recreation') return 'green'
}

const icon = (category) => {
  return category >= 0 ? useReceipt.category[category].icon : 'payments'
}

/*
  <q-timeline>
    <q-timeline-entry
      v-for="(item, index) in receipts"
      :key="index"
      :icon="useReceipt.category[item.category].icon"
      :color="color(item.category)"
    >
      <template v-slot:subtitle> {{ helper.cleanTime(item.created_at) }} </template>

      <activity-card link="Group receipt detail" :index="index" :value="item" :id="item.id" />
    </q-timeline-entry>
  </q-timeline>

*/
</script>

<template>
  <q-timeline>
    <div v-if="!loading">
      <q-timeline-entry
        v-for="(item, index) in receipts"
        :key="index"
        :icon="icon(item.category)"
        :color="color(item.category)"
      >
        <template v-slot:subtitle> {{ helper.cleanTime(item.date) }} </template>
        <q-intersection transition="scale">
          <activity-card link="Group receipt detail" :index="index" :value="item" :id="item.id" />
        </q-intersection>
      </q-timeline-entry>
    </div>
    <div v-else>
      <q-timeline-entry v-for="x in 5" :key="x" color="grey-8" icon="hourglass_bottom">
        <template v-slot:subtitle> <q-skeleton type="text" width="150px" /> </template>
        <q-intersection transition="scale">
          <activity-card link="Group receipt detail" :index="-1" :value="null" :id="-1" loading />
        </q-intersection>
      </q-timeline-entry>
    </div>
  </q-timeline>
</template>

<style lang="scss">
.q-timeline__title {
  margin-top: 0;
  margin-bottom: 5px;
}

.q-timeline__entry {
  height: 7rem;
}

.q-timeline__content {
  padding-bottom: 10px;
}

.text-one {
  color: rgba(59, 36, 255, 1);
}
.text-two {
  color: rgba(251, 63, 117, 1);
}
.text-three {
  color: rgba(1, 193, 27, 1);
}
.text-yellow-8 .q-icon {
  color: #000000;
}
.text-contrast {
  color: $step-950;
}

.body--dark .text-contrast {
  color: $card;

  .q-icon {
    color: $step-950;
  }
}
</style>
