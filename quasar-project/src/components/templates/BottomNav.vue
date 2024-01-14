<script setup>
import { Keyboard } from '@capacitor/keyboard'
import { Capacitor } from '@capacitor/core'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from 'src/stores/user'
import ProfilePicture from '../atoms/ProfilePicture.vue'

const route = useRoute()
const isOpen = ref(false)
const useUser = useUserStore()

Capacitor.getPlatform()

if (Capacitor.getPlatform() != 'web') {
  Keyboard.addListener('keyboardWillShow', (info) => {
    isOpen.value = true
    console.log('keyboard will show with height:', info.keyboardHeight)
  })

  Keyboard.addListener('keyboardWillHide', () => {
    isOpen.value = false
    console.log('keyboard will hide')
  })
}

const isRouteActive = (routePattern) => {
  return route.fullPath.startsWith(routePattern)
}
</script>

<template>
  <nav v-if="!isOpen && $route.name != 'Login' && $route.name != 'Register'">
    <RouterLink to="/" :class="{ active: $route.path == '/' }" router-direction="forward">
      <q-icon size="1.5rem" name="home" />
      <p class="nav-text">Home</p>
    </RouterLink>

    <RouterLink
      class="button-before-action-btn"
      to="/social"
      :class="{ active: isRouteActive('/social') }"
      router-direction="forward"
    >
      <q-icon size="1.5rem" name="people" />
      <p class="nav-text">Social</p>
    </RouterLink>

    <div class="action-btn">
      <RouterLink to="/create" router-direction="forward">
        <q-icon size="2rem" name="add" />
      </RouterLink>
    </div>

    <RouterLink
      class="button-after-action-btn"
      to="/activity"
      :class="{ active: isRouteActive('/activity') }"
      router-direction="forward"
    >
      <q-icon size="1.5rem" name="receipt_long" />
      <p class="nav-text">Acitivity</p>
    </RouterLink>

    <RouterLink to="/account" :class="{ active: isRouteActive('/account') }" router-direction="forward">
      <ProfilePicture size="x-small" :pic="useUser.user.profile_picture" />
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.nav-text {
  line-height: 0.8rem;
}
nav {
  backdrop-filter: blur(6px);
  z-index: 99;
  position: fixed;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: center;
  filter: drop-shadow(0px 0px 2px $step-200);

  & a {
    text-decoration: none;
    padding: 0.5rem;
    display: flex;
    margin: 0;
    position: relative;
    color: $text;
    background: none;
    background: $card;
    width: 100%;
    max-width: 5rem;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;

    &::after {
      content: '';
      position: absolute;
      height: 0.1rem;
      width: 2%;
      bottom: 0;
      left: 48%;
      transition: all 0.3s ease-in-out;
    }

    &.active {
      color: $primary !important;

      &::after {
        height: 0.3rem;
        left: 25%;
        border-radius: 50% 50% 0 0;
        background-color: $primary;
        width: 50%;
      }
    }

    &:last-child {
      border-radius: 0 20px 0 0;
    }

    &:first-child {
      border-radius: 20px 0 0 0;
    }
  }
}

.button-before-action-btn {
  border-radius: 0 20px 0 0;
}

.button-after-action-btn {
  border-radius: 20px 0 0 0;
}

nav .action-btn {
  width: 4rem;
  height: 3.4rem;
  display: flex;
  position: relative;
  background: rgba(127, 255, 212, 0) url('/src/assets/tab.svg') bottom center/contain no-repeat;
  justify-content: center;

  & a {
    margin: 1rem;
    display: block;
    height: 3rem;
    width: 3rem;
    border: none;
    border-radius: 50%;
    background: $primary;
    color: $light;
    position: relative;
    top: -1.5rem;

    &::after {
      display: none;
    }
  }
}

.body--dark #q-app {
  .action-btn {
    background: rgba(127, 255, 212, 0) url('src/assets/tab_alt.svg') bottom center/contain no-repeat;
  }
}


</style>
