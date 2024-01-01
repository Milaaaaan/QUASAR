<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const tab = ref('friends')
const router = useRouter()
</script>

<template>
  <q-page>
    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" narrow-indicator>
      <q-tab @click="router.push('/social/friends')" name="friends" icon="group" label="Friends" />
      <q-tab @click="router.push('/social/groups')" name="groups" icon="diversity_3" label="Groups" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="friends">
        <router-view />
      </q-tab-panel>

      <q-tab-panel name="groups">
        <router-view />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style scoped lang="scss">
.q-tab-panels {
  background: none;
}

.q-panel > div {
  padding: 0;
}
</style>
