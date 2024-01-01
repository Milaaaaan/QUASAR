<script setup>
import validator from 'src/composables/validator'
import { useUserStore } from 'src/stores/user'
import { Haptics } from '@capacitor/haptics'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormSplitter from 'src/components/atoms/FormSplitter.vue'

const email = ref('')
const pass = ref('')
const submitted = ref(false)
const router = useRouter()
const useUser = useUserStore()
const loading = ref(false)

const emailError = computed(() => validator.email(submitted.value, email.value))

const passError = computed(() => validator.password(submitted.value, pass.value, pass.value))
/*
const hapticsVibrate = async () => {
  await Haptics.vibrate()
}
*/
const tryLogin = async () => {
  submitted.value = true
  // hapticsVibrate()
  if (!emailError.value && !passError.value) {
    loading.value = true
    try {
      await useUser.login({
        email: email.value,
        password: pass.value,
      })

      router.push('/account')
    } catch (err) {}
    loading.value = false
  }
}
</script>

<template>
  <q-page padding>
    <section class="form">
      <form ref="form" @submit.prevent novalidate>
        <h2>Inloggen</h2>

        <q-input
          v-model="email"
          label="Email"
          filled
          placeholder="Your emailaddress"
          :error-message="emailError"
          :error="submitted && emailError != ''"
        />

        <q-input
          :error="submitted && passError != ''"
          :error-message="passError"
          v-model="pass"
          filled
          type="password"
          label="Password"
        />

        <q-btn @click="tryLogin">
          <q-spinner-tail v-if="loading" color="white" />
          <p v-else>Login</p>
        </q-btn>

        <FormSplitter text="No account yet?" />

        <RouterLink to="/register" router-direction="forward"> Register </RouterLink>
      </form>
    </section>
  </q-page>
</template>

<style scoped>
.toolbar {
  display: flex;
  height: 100%;
  --background: var(--main);
}

section {
  padding: 0;
}

section {
  padding: 0rem;
  height: -webkit-fill-available;
  display: flex;
  align-items: flex-start;
}

form {
  width: 100%;
}
</style>
