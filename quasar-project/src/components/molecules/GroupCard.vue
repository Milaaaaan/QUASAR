<script setup>
import img from 'src/assets/nopfp.jpg'

defineProps({
  group: {
    required: true,
    type: Object,
  },
})
</script>

<template>
  <RouterLink :to="{ name: 'Group detail', params: { id: group.id } }">
    <q-item v-ripple clickable>
      <q-item-section avatar>
        <q-avatar>
          <img :src="group.profile_picuture ? group.profile_picuture : img" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">{{ group.name }}</q-item-label>
        <q-item-label lines="1">{{ group.description }}</q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label lines="1">€{{ group.user1_debt }} </q-item-label>
        <q-item-label lines="2"> Owed </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset="item" />
  </RouterLink>
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
}
</style>
