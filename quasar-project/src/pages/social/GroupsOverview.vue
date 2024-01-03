<script setup>
import { useGroupStore } from 'src/stores/groups'
import GroupCard from 'src/components/molecules/GroupCard.vue'

const useGroup = useGroupStore()
</script>

<template>
  <q-page>
    <section v-if="useGroup.groups && $route.name == 'Groups'">
      <q-list>
        <q-item-label header>Joined groups</q-item-label>
        <group-card v-for="group in useGroup.groups" :key="group.id" :group="group" />
      </q-list>
    </section>
    <section v-else>
      <RouterView></RouterView>
    </section>
  </q-page>
</template>

<style scoped lang="scss"></style>
