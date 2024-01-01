<script setup lang="ts">
defineProps({
  name: {
    type: String,
  },
  minimalize: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <q-header id="header" :class="minimalize ? 'minimalize' : ''">
    <q-toolbar class="toolbar">
      <div class="toolie">
        <ion-back-button v-if="$route.path != '/'" defaultHref="/"></ion-back-button>
        <h1>{{ $route.name }}</h1>
        <div class="image">
          <img src="/src/assets/logo.svg" alt="" />
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<style scoped lang="scss">
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
}

h1 {
  margin: 0.5rem 0;
}

.toolie {
  width: calc(100% - 2rem);
  display: flex;
  margin: 1rem;
  height: 12rem;
  justify-content: center;
  align-items: flex-start;
  transition: height 0.5s ease-in-out;
}

.toolbar {
  display: flex;
  height: 12rem;
  --background: none;
  --background: var(--ion-background-color);
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
