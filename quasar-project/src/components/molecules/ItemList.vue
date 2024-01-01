<script setup lang="ts">
defineProps({
  items: {
    required: true,
    type: Object,
  },
})
</script>

<template>
  <div class="list">
    <i>Click on an item to edit or delete</i>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <b>{{ index + 1 }}.</b>
        <div>
          <b>{{ item.title }}</b>
          <span>{{ item.price }}</span>
        </div>

        <i>{{ item.amount }}x</i>

        <b>{{ item.amount * item.price }}</b>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
ul {
  padding: 0;

  & li {
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--ion-color-step-150);
    padding: 1rem;
    border-radius: 5px;

    & div {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
