<script setup lang="ts">
import img from 'src/assets/nopfp.jpg'
import { useFetchStore } from 'src/stores/fetchData'
import { useUserStore } from 'src/stores/user'

const useFetch = useFetchStore()
const useUser = useUserStore()

const props = defineProps({
  details: {
    required: true,
    type: Object,
  },
})

const accept = async () => {
  try {
    const friend = await useFetch.post('/friends/accept', { id: props.details.id }, true)
    console.log(friend)
    useUser.friends.friends.push(friend)
    const index = useUser.friends.requests.received.findIndex((request) => request.id === props.details.id)
    console.log(index)
    if (index !== -1) {
      useUser.friends.requests.received.splice(index, 1)
    }
  } catch {}
}

const reject = async () => {}
</script>

<template>
  <div class="card">
    <div class="img">
      <img class="pfp" :src="details.profile_picture ? details.profile_picture : img" alt="profile picture" />
    </div>
    <div v-if="details.user1" class="info">
      <div>
        <h3>{{ details.user1.name }}</h3>
      </div>

      <div>
        <IonButton @click="accept" size="small">Accept</IonButton>
        <IonButton @click="reject" color="danger" size="small">Reject</IonButton>
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
    flex-direction: column;

    & ion-button {
      margin: 0.5rem 0 0;
    }

    & div:last-child {
      text-align: end;
      display: flex;
    }

    & div:first-child {
      text-align: start;
    }

    & h3 {
      margin: 0;
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
    flex-direction: column;

    & .pfp {
      border-radius: 50%;
      width: 3rem;
    }
  }
}
</style>
