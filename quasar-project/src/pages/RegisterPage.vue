<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import RegisterForm from 'src/components/organisms/RegisterForm.vue'
</script>

<template>
  <q-page class="flex flex-center">
    <RegisterForm />
  </q-page>
</template>

<style scoped>
ion-content {
  --padding-top: 12rem;
}
</style>
