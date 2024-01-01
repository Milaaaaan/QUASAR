<script setup lang="ts">
import img from '@/assets/nopfp.jpg'
import { IonButton } from '@ionic/vue'

defineProps({
  details: {
    required: true,
    type: Object,
  },
})
</script>

<template>
  <div class="card">
    <div class="img">
      <img class="pfp" :src="details.profile_picture ? details.profile_picture : img" alt="profile picture" />
    </div>
    <div class="info">
      <div>
        <h3>{{ details.name }}</h3>
      </div>

      <div>
        <IonButton>Accept</IonButton>
        <IonButton>Reject</IonButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  padding: 1rem;
  background-color: var(--card);
  border-radius: 10px;
  max-width: 35rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  & .info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    & div:last-child {
      text-align: end;
    }

    & div:first-child {
      text-align: start;
    }

    & p {
      margin: 0;
    }
  }

  & .img {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    flex-direction: column;

    & .pfp {
      border-radius: 50%;
      width: 3rem;
    }
  }
}
</style>
