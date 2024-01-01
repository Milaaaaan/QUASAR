<script setup>
import validator from 'src/composables/validator'
import router from 'src/router'
import { useFetchStore } from 'src/stores/fetchData'
import { useUserStore } from 'src/stores/user'
import { computed, ref } from 'vue'
import CleanInput from '../atoms/CleanInput.vue'

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

const TryRegistrating = async () => {
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
  <form ref="form" @submit.prevent novalidate>
    <h2>Register</h2>
    <div v-if="step == 1">
      <CleanInput :error="nameError" v-model="name" label="Name" placeholder="Enter your full name" />

      <CleanInput :error="emailError" v-model="email" label="Email" type="email" placeholder="Your emailaddress" />

      <IonButton @click="validateStepOne">Next step</IonButton>
    </div>

    <div v-if="step == 2">
      <CleanInput :error="passError" v-model="pass" type="password" label="Password" />

      <CleanInput :error="passError" v-model="passRepeat" type="password" label="Password repeat" />

      <IonButtons>
        <IonButton @click="step--">go back</IonButton>
        <IonButton @click="TryRegistrating">Register</IonButton>
      </IonButtons>
    </div>
  </form>
</template>

<style scoped lang="scss">
.toolbar {
  display: flex;
  height: 100%;
  --background: var(--main);
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

button {
  margin: 1rem 0;
  border-radius: 5px;
  background-color: var(--main);
  padding: 1.2rem;
  width: 100%;
}
</style>
