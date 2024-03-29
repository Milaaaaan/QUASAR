<script setup>
import validator from 'src/composables/validator'
import router from 'src/router'
import { useFetchStore } from 'src/stores/fetchData'
import { useUserStore } from 'src/stores/user'
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning'
import { computed, onMounted, ref } from 'vue'
import FormSplitter from '../atoms/FormSplitter.vue'
import { useRoute } from 'vue-router'

const code = ref('')
const submitted = ref(false)
const route = useRoute()
const loading = ref(false)
const useFetch = useFetchStore()
const useUser = useUserStore()
const isSupported = ref(false)
const codeError = computed(() => validator.name(submitted.value, code.value, 'Friendcode', 7))

const checkSupport = async () => {
  const result = await BarcodeScanner.isSupported()
  isSupported.value = result.supported
}

const scan = async () => {
  if (isSupported.value) {
    const granted = await requestPermissions()
    if (!granted) {
      return
    }
    const { barcodes: scannedBarcodes } = await BarcodeScanner.scan()
    console.log(scannedBarcodes[0].rawValue)

    const url = new URL(scannedBarcodes[0].rawValue)
    const searchParams = new URLSearchParams(url.search)
    code.value = searchParams.get('code')

    submit()
  }
}

const requestPermissions = async () => {
  const { camera } = await BarcodeScanner.requestPermissions()
  return camera === 'granted' || camera === 'limited'
}

onMounted(checkSupport)

const submit = async () => {
  submitted.value = true
  if (!codeError.value) {
    try {
      //TODO: YOU NEED TO BE ONLINE
      loading.value = true

      //TODO: if online, validate and sync

      const friend = await useFetch.fetch('/friends/add', 'post', { friend_code: code.value }, true, true, true)

      useUser.friends.requests.sent.push(friend)
      useUser.update()
      loading.value = false
      router.push('/social/friends')
    } catch {
      loading.value = false
    }
  }
}

if (route.query.code) {
  console.log(route.query)
  code.value = route.query.code
  submit()
}
</script>

<template>
  <section class="form">
    <form ref="form" @submit.prevent novalidate>
      <h2>With Code</h2>

      <q-input
        :error="submitted && codeError != ''"
        :error-message="codeError"
        v-model="code"
        filled
        label="Friendcode"
        placeholder="Fill in a friends personal code in"
      />

      <q-btn size="large" color="primary" @click="submit()">
        <p v-if="!loading">Add Friend</p>
        <q-spinner-tail v-else color="white" />
      </q-btn>

      <FormSplitter v-if="isSupported" text="OR" />

      <q-btn size="large" v-if="isSupported" @click="scan" class="upload">
        <q-icon class="pd" name="photo_camera" />
        Scan QR code
      </q-btn>
    </form>
  </section>
</template>

<style scoped lang="scss">
ion-content {
  --padding-top: 0;
}
.upload {
  cursor: pointer;
  background-color: $step-100;
  width: 100%;
  margin: 1rem 0;
  padding: 0.5rem;
  border-radius: 5px;
  border: 2px dotted $primary;
}

.pd {
  margin-right: 1rem;
}

button {
  width: 100%;
}

.body--dark {
  .upload {
    background-color: $step-800;
  }
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
