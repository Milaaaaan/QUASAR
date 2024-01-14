<script setup>
import { useUserStore } from 'src/stores/user';
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const useUser = useUserStore()
const route = useRoute()
const tab = ref(route.path.startsWith('/social/groups') ? 'Groups' : 'Friends')

if (useUser.friends == null) useUser.sync()
</script>

<template>
  <q-page>
    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" narrow-indicator>
      <q-tab @click="router.push('/social/friends')" name="Friends" icon="group" label="Friends" />
      <q-tab @click="router.push('/social/groups')" name="Groups" icon="diversity_3" label="Groups" />
    </q-tabs>
    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="Friends">
        <router-view />
      </q-tab-panel>

      <q-tab-panel name="Groups">
        <router-view />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style scoped lang="scss">
.q-tab--inactive {
  color: $text;
}

.body--dark .q-tab--inactive {
  color: $white;
}

main {
  min-height: initial !important;
}

.q-panel > div {
  padding: 0;
}
</style>
