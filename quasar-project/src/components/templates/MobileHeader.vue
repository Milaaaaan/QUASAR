<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
defineProps({
  name: {
    type: String,
  },
  minimalize: {
    type: Boolean,
    default: true,
  },
})

const canGoBack = computed(() => route.path != '/' && route.name != 'Login' && route.name != 'Register')
</script>

<template>
  <q-header id="header" :class="minimalize ? 'minimalize' : ''">
    <q-toolbar class="toolbar">
      <div class="toolie">
        <q-btn v-if="canGoBack" @click="$router.back" flat rounded icon="arrow_back_ios_new" class="back-btn" />
        <h1>{{ $route.name }}</h1>
        <div class="image">
          <img src="/src/assets/logo.svg" alt="" />
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<style scoped lang="scss">
.back-btn {
  left: 1rem;
  position: absolute;
  top: 1.3rem;
  padding: 0.5rem;
}
.minimalize {
  & .toolbar {
    height: 5rem;
  }

  & .toolie {
    height: 3rem;
  }

  h1 {
    display: inline-block;
  }

  .image {
    margin-top: 0rem;
    margin-right: 1rem;
    width: 3rem;

    & img {
      background: var(--card);
      width: 3rem;
    }
  }
}

header {
  z-index: 5;
  background-color: $background;
  color: $text;

  nav {
    backdrop-filter: blur(3px);
  }
}

h1 {
  margin: 0.5rem 0;
}

.toolie {
  width: calc(100% - 2rem);
  display: flex;
  margin: 1rem;
  height: 11rem;
  justify-content: center;
  align-items: flex-start;
  transition: height 0.5s ease-in-out;
}

.toolbar {
  display: flex;
  height: 11rem;
  z-index: 1;
  align-items: flex-start;
  transition: height 0.5s ease-in-out;
}
.image {
  margin-top: 2.5rem;
  width: 100vw;
  right: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  transition: all 0.5s ease-in-out;
}
img {
  border-radius: 50% 50% 50% 50% / 15% 16% 84% 85%;
  width: 11rem;
  transition: all 0.5s ease-in-out;
}
</style>
