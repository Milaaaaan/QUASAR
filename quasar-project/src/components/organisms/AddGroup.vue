<script setup>
import validator from 'src/composables/validator'
import { computed, ref } from 'vue'
import { useFetchStore } from 'src/stores/fetchData'
import router from 'src/router'
import { useGroupStore } from 'src/stores/groups'

const title = ref('')
const submitted = ref(false)
const description = ref('')
const image = ref(null)
const loading = ref(false)
const useFetch = useFetchStore()
const useGroup = useGroupStore()

const nameError = computed(() => validator.name(submitted.value, title.value, 'Group title', 3))

const submit = async () => {
  submitted.value = true
  if (!nameError.value) {
    try {
      //TODO: YOU NEED TO BE ONLINE
      loading.value = true

      const payload = {
        name: title.value,
        description: description.value,
        img: image.value,
      }

      //TODO: if online, validate and sync
      const group = await useFetch.fetch('/groups/create', 'post', payload, true, true, true)

      useGroup.groups.push(group)
      useGroup.update()

      router.push(`/social/grous/${group.id}`)
    } catch {}
    loading.value = false
  }
}
</script>

<template>
  <section class="form">
    <form ref="form" @submit.prevent novalidate>
      <h2>Make a new group</h2>

      <q-input
        :error="submitted && nameError != ''"
        :error-message="nameError"
        v-model="title"
        filled
        label="Group name"
        placeholder="What is the name of your group"
      />

      <q-input v-model="description" filled type="textarea" label="Description" placeholder="What is this group about">
        <template v-slot:label>
          Give some more details
          <span class="text-primary">(optional*)</span>
        </template>
      </q-input>

      <q-file filled bottom-slots v-model="image" label counter>
        <template v-slot:prepend>
          <q-icon name="image" @click.stop.prevent />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click.stop.prevent="image = null" class="cursor-pointer" />
        </template>
        <template v-slot:label>
          Group picture
          <span class="text-primary">(optional*)</span>
        </template>
      </q-file>

      <q-btn size="large" color="primary" @click="submit()">
        <p v-if="!loading">Make group</p>
        <q-spinner-tail v-else color="white" />
      </q-btn>
    </form>
  </section>
</template>

<style scoped lang="scss">
.upload {
  margin: 1rem 0;
  --padding: 1rem;
  --border-radius: 5px;
  color: var(--ion-text-color);
  --background: var(--ion-color-step-50, #f2f2f2);
  border: 2px dotted var(--ion-color-step-500, gray);
  background: none;
}
.toolbar {
  display: flex;
  height: 100%;
  --background: var(--main);
}

button {
  width: 100%;
}

form {
  width: 100%;
}

section {
  padding: 0rem;
  height: -webkit-fill-available;
  display: flex;
  align-items: center;
}

ion-button {
  margin: 1rem 0;
  border-radius: 5px;
  color: var(--white);
  background-color: var(--main);
  width: 100%;

  & ion-icon {
    margin-right: 1rem;
  }
}
</style>
