<script setup>
import { useGroupStore } from 'src/stores/groups'
import GroupCard from 'src/components/molecules/GroupCard.vue'

const useGroup = useGroupStore()
</script>

<template>
  <q-page>
    <section>
      <div v-if="$route.name == 'Groups'" class="buttons">
        <q-btn :to="{ name: 'Create group' }" class="float" icon="add" label="Make group" color="primary" />
      </div>

      <q-list v-if="useGroup.groups && $route.name == 'Groups'">
        <q-item-label header>Joined groups</q-item-label>
        <group-card v-for="group in useGroup.groups" :key="group.id" :group="group" />
      </q-list>

      <RouterView v-else></RouterView>
    </section>
  </q-page>
</template>

<style scoped lang="scss">
.buttons {
  display: flex;
  flex-direction: row-reverse;
  padding: 1rem;
}
</style>
