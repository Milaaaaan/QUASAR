<script setup>
import BottomNav from 'src/components/templates/BottomNav.vue'
import CleanPopUp from 'src/components/atoms/CleanPopUp.vue'
import MobileHeader from 'src/components/templates/MobileHeader.vue'
import 'src/css/form.scss'
import { useQuasar } from 'quasar'
import { watch } from 'vue'
import { useFetchStore } from 'src/stores/fetchData'
import { Haptics } from '@capacitor/haptics';
import { useUserStore } from 'src/stores/user'

const quasar = useQuasar()
const useFetch = useFetchStore()
const useUser = useUserStore()

watch(useFetch, async () => {
  let error = ''
  if (useFetch.responses) {
    console.log(useFetch.responses)
    error = useFetch.responses[0]
    if (error) {
      quasar.notify({
        message: error.message,
        color: error.type,
        position: 'top',
        icon: 'report_problem',
      })
      if (useUser.settings.vibrations) await Haptics.vibrate();
    }
  }
})
</script>

<template>
  <q-layout>
    <mobile-header :minimalize="$route.name != 'Login' && $route.name != 'Register'" name="Foto galerij" />
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
    <CleanPopUp />
    <BottomNav />
  </q-layout>
</template>
