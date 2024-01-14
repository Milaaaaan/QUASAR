<script setup>
import 'src/css/form.scss'
import { useConnectionStore } from 'src/stores/connection'

const useConnection = useConnectionStore()

/*
  ! add group
  ! add group members
  ! make receipts
*/
</script>

<template>
  <router-view />
</template>

<style lang="scss">
main {
  padding: 0 !important;
}

.q-page-container {
  padding: 1rem 0rem 8rem 0rem;
  overflow: hidden;
  background-color: $background;
}
</style>
