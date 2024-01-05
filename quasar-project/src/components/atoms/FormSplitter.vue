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
  background-color: $step-450;

  & b {
    background-color: $card;
    padding: 0.5rem 1.5rem;
    position: relative;
    top: -0.5rem;
    margin: 0;
    text-align: center;
  }
}

:root.dark {
  b {
    background-color: $step-850;
  }
}
</style>
