<script setup lang="ts">
import { useGroupStore } from 'src/stores/groups'
import { useReceiptStore } from 'src/stores/receipts'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ActivityCard from '../molecules/ActivityCard.vue'
import FriendCard from '../molecules/FriendCard.vue'
import { useUserStore } from 'src/stores/user'

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

    <div class="actions">
      <q-btn router-link="/create/bill" router-direction="forward">
        <q-icon color="light" size="small" aria-hidden="true" name="personAdd" />
      </q-btn>
      <q-btn router-link="/create/bill" router-direction="forward">
        + <q-icon color="light" size="small" aria-hidden="true" name="receipt" />
      </q-btn>
    </div>

    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" narrow-indicator>
      <q-tab name="Acitivty" icon="book" label="Acitivty" />
      <q-tab name="Members" icon="diversity_3" label="Members" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Acitivty">
        <activity-card
          v-for="(item, index) in details.receipts"
          link="Group receipt detail"
          :key="index"
          :index="index"
          :value="item"
          :id="index"
        />
      </q-tab-panel>

      <q-tab-panel name="Members">
        <friend-card v-for="(friend, index) in details.members" :key="index" :details="friend" />
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
    background: $step-800;
  }
}

.q-panel {
  will-change: scroll-position;
  
  > div {
    padding: 0;
  }
}

.q-tab-panels {
  background: $background;
}

.actions {
  display: flex;
  gap: 1rem;
}
</style>
