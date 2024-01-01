<script setup lang="ts">
defineProps({
  text: {
    required: false,
    type: String,
  },
})
</script>

<template>
  <span>
    <b>{{ text }}</b>
  </span>
</template>

<style scoped lang="scss">
span {
  margin: 2rem 0;
  display: inline-block;
  text-align: center;
  height: 2px;
  width: 100%;
  background-color: var(--ion-color-step-400);

  & b {
    background-color: var(--card);
    padding: 0.5rem 1.5rem;
    position: relative;
    top: -0.5rem;
    margin: 0;
    text-align: center;
  }
}
</style>
