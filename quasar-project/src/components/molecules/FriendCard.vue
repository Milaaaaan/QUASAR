<script setup>
import CleanPopUp from 'src/components/atoms/CleanPopUp.vue'
import { usePopUpStore } from 'src/stores/popup'
import { ref } from 'vue'
import ProfilePicture from 'src/components/atoms/ProfilePicture.vue'

const usePopUp = usePopUpStore()

const props = defineProps({
  details: {
    required: true,
    type: Object,
  },
})

const openPopUP = () => {
  usePopUp.type = 'friend'
  usePopUp.details = props.details
  usePopUp.open = true
}

const open = ref(false)
</script>

<template>
  <div class="card" @click="openPopUP">
    <ProfilePicture size="small" :pic="details.profile_picture" />

    <div class="info">
      <div>
        <h3>{{ details.name }}</h3>
      </div>
      <div>
        <h3>{{ details.user1_debt }}</h3>
        <p>Verschuldigd</p>
      </div>
    </div>
  </div>
  <CleanPopUp v-if="open" :details="details" />
</template>

<style scoped lang="scss">
.card {
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: $card;
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
    flex-direction: column;

    & .pfp {
      border-radius: 50%;
      width: 3rem;
    }
  }
}
</style>
