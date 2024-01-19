<script setup>
import { useGroupStore } from 'src/stores/groups'
import GroupCard from 'src/components/molecules/GroupCard.vue'
import { computed, onMounted } from 'vue'

const useGroup = useGroupStore()
const loading = computed(() => (useGroup.groups ? false : true))

onMounted(() => {
  if (useGroup.groups == null) useGroup.sync()
})

const joined = computed(() => {
  if (useGroup.groups) return useGroup.groups.filter((x) => x.joined)
  else return null
})

const requests = computed(() => {
  if (useGroup.groups) return useGroup.groups.filter((x) => !x.joined)
  else return null
})
</script>

<template>
  <q-page>
    <section v-if="!loading">
      <div v-if="$route.name == 'Groups'" class="buttons">
        <q-btn :to="{ name: 'Create group' }" class="float" icon="add" label="Make group" color="primary" />
      </div>

      <q-list v-if="joined && $route.name == 'Groups'">
        <q-item-label header>Joined groups</q-item-label>
        <group-card v-for="group in joined" :key="group.id" :group="group" />
        <h3 v-if="joined.length < 1">No groups joined yet 😞</h3>
      </q-list>

      <q-list v-if="requests.length > 0 && $route.name == 'Groups'">
        <q-item-label header>Group requests</q-item-label>
        <group-card v-for="group in requests" request :key="group.id" :group="group" />
      </q-list>

      <RouterView v-else></RouterView>
    </section>
    <section v-else>
      <q-list v-if="$route.name == 'Groups'">
        <q-item-label header> <q-skeleton type="text" width="150px" /> </q-item-label>

        <q-item v-ripple clickable v-for="x in 10" :key="x">
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1"><q-skeleton type="text" width="150px" /></q-item-label>
            <q-item-label lines="2"><q-skeleton type="text" width="2000px" /></q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset="item" />
      </q-list>
    </section>
  </q-page>
</template>

<style scoped lang="scss">
.buttons {
  display: flex;
  flex-direction: row-reverse;
  padding: 1rem;
}

h3 {
  margin: 1rem;
}
</style>
