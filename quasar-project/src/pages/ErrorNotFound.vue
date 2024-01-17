<template>
  <q-page>
    <div class="fullscreen page text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 20vh">404</div>

        <div class="text-h2" style="opacity: 0.6">Oops. Nothing here...</div>
        {{ $route.fullPath }}
        <q-btn size="large" color="primary" unelevated to="/" label="Go Home" no-caps />
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">

.page {
  color: $text;
}

.q-btn {
  margin-top: 3rem;
  width: 100%;
}

.body--dark .page {
  color: $white;
  background-color: var(--q-dark-page);;
}

</style>