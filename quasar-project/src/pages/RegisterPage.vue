<script setup>
import FormSplitter from 'src/components/atoms/FormSplitter.vue'
import validator from 'src/composables/validator'
import router from 'src/router'
import { useFetchStore } from 'src/stores/fetchData'
import { useUserStore } from 'src/stores/user'
import { computed, ref } from 'vue'

const useUser = useUserStore()
const name = ref('')
const email = ref('')
const pass = ref('')
const passRepeat = ref('')
const img = ref(null)
const step = ref(1)
const submitted = ref(false)

const nameError = computed(() => validator.name(submitted.value, name.value, 'Name', 5))

const emailError = computed(() => validator.email(submitted.value, email.value))

const passError = computed(() => {
  if (step.value == 2) return validator.password(submitted.value, pass.value, passRepeat.value)
  else return ''
})

const useFetch = useFetchStore()

const register = async () => {
  submitted.value = true
  if (!passError.value) {
    //TODO: LOADING ANIM
    //loading.value = true
    try {
      await useUser.register({
        name: name.value,
        email: email.value,
        password: pass.value,
      })
      router.push('/login')
    } catch (err) {
      // skip
    }
    //loading.value = false
  } else {
    //form.value.tabindex = 1
    //form.value.focus()
  }
}

const validateStepOne = async () => {
  submitted.value = true
  if (!nameError.value && !emailError.value) {
    //TODO: LOADING ANIM
    //loading.value = true
    try {
      // await userStore.login({ email: email.value, password: pwd.value })
    } catch (err) {
      // skip
    }
    submitted.value = false
    step.value++
  } else {
    //form.value.tabindex = 1
    //form.value.focus()
  }
}
</script>

<template>
  <q-page class="flex flex-center">
    <form ref="form" @submit.prevent novalidate>
      <h2>Register</h2>
      <q-input
        v-model="name"
        label="Name"
        filled
        placeholder="Enter your full name"
        :error-message="nameError"
        :error="submitted && nameError != ''"
      />

      <q-input
        v-model="email"
        label="Email"
        filled
        placeholder="Your emailaddress"
        :error-message="emailError"
        :error="submitted && emailError != ''"
      />

      <q-input
        v-model="pass"
        label="Password"
        filled
        type="password"
        placeholder="Your password"
        :error-message="passError"
        :error="submitted && passError != ''"
      />

      <q-input
        v-model="passRepeat"
        label="Password repeat"
        filled
        type="password"
        placeholder="Repeat your password"
        :error-message="passError"
        :error="submitted && passError != ''"
      />

      <q-btn size="large" color="primary" @click="register">
        <q-spinner-tail v-if="loading" color="white" />
        <p v-else>Sign up</p>
      </q-btn>

      <FormSplitter text="Already have an account?" />

      <RouterLink to="/login" router-direction="forward"> go to login page </RouterLink>
    </form>
  </q-page>
</template>

<style scoped lang="scss">
button {
  width: 100%;
}

main {
  align-content: flex-start;
}

a {
  color: $primary;
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
