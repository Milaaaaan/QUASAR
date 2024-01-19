<script setup>
import { useGroupStore } from 'src/stores/groups'
import { useReceiptStore } from 'src/stores/receipts'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import FriendCard from '../molecules/FriendCard.vue'
import { useUserStore } from 'src/stores/user'
import ReceiptTimeline from 'src/components/molecules/ReceiptTimeline.vue'
import { usePopUpStore } from 'src/stores/popup'
import { useRouter } from 'vue-router'

const useGroup = useGroupStore()
const useReceipt = useReceiptStore()
const useUser = useUserStore()
const usePopUp = usePopUpStore()
const router = useRouter()
const route = useRoute()
const details = ref()
const tab = ref('Acitivty')

onMounted(async () => {
  await useGroup.get()
  await useReceipt.get()
  details.value = useGroup.groups.filter((x) => x.id == route.params.id)[0]

  if (!details.value.joined) router.push('/social/groups')

  details.value.members = useUser.friends.filter((x) => {
    if (x.groups && x.groups.length > 0) {
      return x.groups.some((y) => y.group_id == route.params.id)
    }
    return null
  })
  details.value.receipts = useReceipt.receipts.filter((x) => x.group_id == details.value.id)
})

const openPopUP = (details) => {
  usePopUp.type = 'members'
  usePopUp.details = details
  usePopUp.open = true
}
</script>

<template>
  <section v-if="details">
    <div class="pd">
      <h2>{{ details.name }}</h2>
      <i>{{ details.description }}</i>
    </div>

    <div class="buttons">
      <q-btn color="primary" @click="openPopUP(details)">
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
      <q-tab-panel name="Acitivty" class="no-pad">
        <ReceiptTimeline :receipts="details.receipts" />
      </q-tab-panel>

      <q-tab-panel name="Members" class="no-pad">
        <friend-card label="Joined members" :friends="details.members" />
      </q-tab-panel>
    </q-tab-panels>
  </section>
</template>

<style scoped lang="scss">
section {
  background-color: $card;
}

.body--dark {
  .q-tab-panels {
    background: transparent;
  }
}

.pd {
  padding: 1rem;
}

.q-panel {
  will-change: scroll-position;
}

.q-tab-panels {
  padding: 1rem;
  background: $background;
}

.no-pad {
  padding: 0;
}

.buttons {
  padding: 1rem;
  display: flex;
  flex-direction: row-reverse;
  gap: 1rem;
}

.body--dark section {
  background-color: $step-800;
}
</style>
