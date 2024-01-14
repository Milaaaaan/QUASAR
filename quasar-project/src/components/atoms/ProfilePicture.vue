<script setup>
import img from 'src/assets/nopfp.jpg'
import { takePicture } from 'src/composables/photo'
import { useUserStore } from 'src/stores/user'

const useUser = useUserStore()

defineProps({
  pic: {
    type: String,
    required: false,
  },
  size: {
    type: String,
    required: false,
    default: 'medium',
  },
  edit: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const take = async () => {
  //TODO: upload to server
  useUser.user.profile_picture = await takePicture()
  useUser.user.synced = false
  await useUser.sync()
}
</script>

<template>
  <div class="profile">
    <img :class="size" :src="pic ? pic : img" alt="users profile picture" />
    <div v-if="edit">
      <q-btn color="primary" @click="take">
        <q-icon name="collections" />
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
img {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;

  &.x-small {
    width: 2rem;
    height: 2rem;
  }

  &.small {
    width: 3rem;
    height: 3rem;
  }
  &.large {
    width: 7rem;
    height: 7rem;
  }
}

.q-btn {
  display: flex;
  margin: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  position: relative;
  right: 1.5rem;
  bottom: -0.5rem;
  justify-content: center;

  i {
    width: 1rem;
    margin: 0;
    height: 1rem;
  }
}

.profile {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  & div {
    height: 0;
    width: 0;
  }
}
</style>
