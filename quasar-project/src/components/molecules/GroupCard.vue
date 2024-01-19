<script setup>
import { useGroupStore } from 'src/stores/groups'
import img from 'src/assets/nopfp.jpg'
import { useFetchStore } from 'src/stores/fetchData'

const useGroup = useGroupStore()
const useFetch = useFetchStore()

defineProps({
  group: {
    required: true,
    type: Object,
  },
  request: {
    required: false,
    type: Boolean,
    default: false,
  },
})

const decline = async (group) => {
  await useFetch.fetch(`/groups/${group.id}/members/decline`, 'del', null, true, true, false)
  const index = useGroup.groups.findIndex((x) => x.id === group.id)
  console.log(index)
  console.log(useGroup.groups[index])
  if (index !== -1) useGroup.groups.splice(index, 1)
  useGroup.update()
}

const accept = async (group) => {
  await useFetch.fetch(`/groups/${group.id}/members/accept`, 'put', null, true, true, false)
  const index = useGroup.groups.findIndex((x) => x.id === group.id)
  if (index !== -1) useGroup.groups[index].joined = true
  useGroup.update()
}
</script>

<template>
  <RouterLink :to="{ name: 'Group detail', params: { id: group.id } }">
    <q-item v-ripple clickable>
      <q-item-section avatar>
        <q-avatar square>
          <img :src="group.img ? group.img : img" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">{{ group.name }}</q-item-label>
        <q-item-label class="desc" lines="2">{{ group.description }}</q-item-label>
        <q-item-label class="flex actions" v-if="request" lines="2">
          <q-btn size="xx-small" color="negative" dense icon="close" label="Decline" @click.stop="decline(group)" />
          <q-btn size="xx-small" color="positive" dense icon="done" label="Accept" @click.stop="accept(group)" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset="item" />
  </RouterLink>
</template>

<style scoped lang="scss">
a {
  text-decoration: none;
}

.actions {
  display: flex !important;
  justify-content: flex-end;
  gap: 1rem;
}

.desc {
  font-size: x-small;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  white-space: nowrap;
  display: inline-block !important;
}
</style>
