<script setup>
import helper from 'src/composables/helper'
import ProfilePicture from 'src/components/atoms/ProfilePicture.vue'

defineProps({
  contributors: {
    required: true,
    type: Object,
  },
})
</script>

<template>
  <ul>
    <li v-for="(contributor, index) in contributors" :key="index">
      <div>
        <profile-picture size="small" :pic="contributor.profile_picture" />
        <p>
          {{ contributor.name }}
        </p>
      </div>

      <p>{{ helper.formatPrice(contributor.owed) }}</p>
    </li>
  </ul>
</template>

<style scoped lang="scss">
ul {
  margin: 0;
  padding: 2rem 0.5rem 0.5rem;
  background-color: var(--card);
  display: flex;
  z-index: 1;
  border-radius: 10px;
  gap: 0.5rem;
  flex-direction: column;

  li {
    list-style: none;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;

    div {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    p {
      margin: 0;
    }
  }
}
</style>
