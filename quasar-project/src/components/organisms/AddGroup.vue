<script setup>
import validator from '@/composables/validator'
import { computed, ref } from 'vue'
import { useFetchStore } from '@/stores/fetchData'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import FormSplitter from '../atoms/FormSplitter.vue'
import CleanInput from '../atoms/CleanInput.vue'

const title = ref('')
const submitted = ref(false)
const loading = ref(false)
const useFetch = useFetchStore()
const useUser = useUserStore()

const titleError = computed(() =>
  validator.name(submitted.value, title.value, 'Group title', 7)
)

const submit = async () => {
  submitted.value = true
  if (!titleError.value) {
    try {
      //TODO: YOU NEED TO BE ONLINE
      loading.value = true

      //TODO: if online, validate and sync

      const friend = await useFetch.post('/friends/add', { friend_code: code.value }, true)

      useUser.friends.requests.sent.push(friend)
      useUser.update()
      loading.value = false
      router.push('/social/friends')
    } catch {
      loading.value = false
    }
  }
}
</script>

<template>
  <IonPage>
    <ion-content :fullscreen="true">
      <section class="form">
        <form ref="form" @submit.prevent novalidate>
          <h2>Making a new group</h2>
          <CleanInput
            :error="titleError"
            v-model="title"
            label="Group title"
            placeholder="What is the groups name?"
          />

          <IonButton @click="submit()">
            <p v-if="!loading">Add Friend</p>
            <IonSpinner v-else name="circles" />
          </IonButton>

          <FormSplitter text="OR" />

          <IonButton class="upload" @click="null">
            <ion-icon aria-hidden="true" :icon="camera" />
            Scan QR code
          </IonButton>
        </form>
      </section>
    </ion-content>
  </IonPage>
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
