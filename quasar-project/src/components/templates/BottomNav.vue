<script setup>
import { Keyboard } from '@capacitor/keyboard'
import { Capacitor } from '@capacitor/core'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isOpen = ref(false)

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
      <q-icon size="2rem" name="home" />
    </RouterLink>

    <RouterLink
      class="button-before-action-btn"
      to="/social"
      :class="{ active: isRouteActive('/social') }"
      router-direction="forward"
    >
      <q-icon size="2rem" name="people" />
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
      <q-icon size="2rem" name="book" />
    </RouterLink>

    <RouterLink to="/account" :class="{ active: isRouteActive('/account') }" router-direction="forward">
      <q-icon size="2rem" name="person" />
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
nav {
  z-index: 99;
  position: fixed;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: center;
  filter: drop-shadow(0px 0px 2px $step-200);

  & a {
    text-decoration: none;
    padding: 0.5rem 0.5rem 0;
    display: flex;
    margin: 0;
    position: relative;
    color: $text;
    background: none;
    background: $card;
    width: 4rem;
    justify-content: center;

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
  height: 3rem;
  display: flex;
  position: relative;
  background: rgba(127, 255, 212, 0) url('/src/assets/tab.svg') bottom center/contain no-repeat;
  justify-content: center;

  & a {
    display: block;
    height: 3rem;
    width: 3rem;
    border: none;
    border-radius: 50%;
    border-radius: 50%;
    background: $primary;
    color: $light;
    position: relative;
    top: -0.8rem;

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

body.dark nav {
  filter: drop-shadow(0px 0px 2px var(ion-color-step-100));
}
</style>
