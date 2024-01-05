<script setup lang="ts">
import { useGroupStore } from 'src/stores/groups'
import { useReceiptStore } from 'src/stores/receipts'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import FriendCard from '../molecules/FriendCard.vue'
import { useUserStore } from 'src/stores/user'
import ReceiptTimeline from 'src/components/molecules/ReceiptTimeline.vue'

const useGroup = useGroupStore()
const useReceipt = useReceiptStore()
const useUser = useUserStore()
const route = useRoute()
const details = ref()
const tab = ref('Acitivty')

onMounted(async () => {
  await useGroup.get()
  await useReceipt.get()
  details.value = useGroup.groups.filter((x) => x.id == route.params.id)[0]
  details.value.members = useUser.friends.filter((x) => {
    if (x.groups && x.groups.length > 0) {
      return x.groups.some((y) => y.group_id === 1)
    }
    return null
  })
  details.value.receipts = useReceipt.receipts.filter((x) => x.group_id == details.value.id)
})
</script>

<template>
  <section v-if="details">
    <h2>{{ details.name }}</h2>
    <i>{{ details.description }}</i>

    <div class="buttons">
      <q-btn color="primary" to="/create/bill">
        + <q-icon color="light" size="small" aria-hidden="true" name="person" />
      </q-btn>
      <q-btn color="primary" to="/create/bill">
        + <q-icon color="light" size="small" aria-hidden="true" name="receipt" />
      </q-btn>
    </div>

    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" narrow-indicator>
      <q-tab name="Acitivty" icon="book" label="Acitivty" />
      <q-tab name="Members" icon="diversity_3" label="Members" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Acitivty" class="pad">
        <ReceiptTimeline :receipts="details.receipts" />
      </q-tab-panel>

      <q-tab-panel name="Members" class="no-pad">
        <friend-card :friends="details.members" />
      </q-tab-panel>
    </q-tab-panels>
  </section>
</template>

<style scoped lang="scss">
section {
  padding: 1rem;
}

.body--dark {
  .q-tab-panels {
    background: transparent;
  }
}

.q-panel {
  will-change: scroll-position;
}

.q-tab-panels {
  background: $background;
}

.no-pad {
  padding: 0;
}

.pad {
  padding: 1rem;
}

.buttons {
  display: flex;
  flex-direction: row-reverse;
  gap: 1rem;
}
</style>
