<script setup>
import { useMapStore } from 'src/stores/map'
import { useUserStore } from 'src/stores/user'
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  show: {
    type: Boolean,
  },
})

const mapbox = ref()
const showControls = ref(false)
const route = useRoute()
const useMap = useMapStore()
const useUser = useUserStore()

onMounted(async () => {
  await useMap.get(mapbox.value)

  setTimeout(() => {
    useMap.map.resize()
  }, 5)

  useMap.map.on('load', () => useMap.map.resize())

  useMap.map.on('style.load', () => {
    useMap.map.setConfigProperty('basemap', 'lightPreset', useMap.options.dark ? 'night' : 'day')
  })
})

watch(route, () => {
  useMap.relocateMap({ reset: true })
})

onUnmounted(() => {
  if (useMap.map) useMap.map.remove()
  useMap.map = null
})

const toggleControlsVisibility = () => {
  showControls.value = !showControls.value
}

const toggleDarkMode = async (event) => {
  useMap.map = null
  useMap.options.dark = event.detail.checked
  useMap.reset(mapbox.value)
}

const toggleAnimation = (event) => {
  useMap.options.anim = event.detail.checked
  useMap.update()
}

const toggleDimension = (event) => {
  useMap.options.threeDim = event.detail.checked
  useMap.reset(mapbox.value)
}

const resetMap = () => {
  useMap.relocateMap({ reset: true })
}


/*
<div id="layout" :class="showControls ? 'open' : 'closed'">
      <IonButton color="none" @click="toggleControlsVisibility">
        <ion-icon
          color="white"
          slot="start"
          :icon="menu"
          size="medium"
          aria-label="Edit"
        />
        Options
      </IonButton>

      <div v-if="showControls" class="controls">
        <ion-list>
          <IonItem button>
            Dark Mode
            <IonToggle
              slot="start"
              :checked="useMap.options.dark"
              @ionChange="toggleDarkMode($event)"
              justify="space-between"
            />
          </IonItem>
          <ion-item button>
            Animation
            <IonToggle
              slot="start"
              :checked="useMap.options.anim"
              @ionChange="toggleAnimation($event)"
              justify="space-between"
            />
          </ion-item>
          <ion-item button>
            3D
            <IonToggle
              slot="start"
              :checked="useMap.options.threeDim"
              @ionChange="toggleDimension($event)"
              justify="space-between"
            />
          </ion-item>
          <ion-item button @click="resetMap">
            <ion-label>Reset Map</ion-label>
          </ion-item>
        </ion-list>
      </div>
    </div>

*/
</script>

<template>
  <section class="map" v-if="show">
    <div ref="mapbox" class="map-container"></div>
  </section>
</template>

<style lang="scss">
.map,
.map-container {
  flex: 1;
  top: 0px;
  width: 100%;
  position: sticky;
  z-index: 0;
  height: 30vh;
}

.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right {
  display: none;
}

#layout {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem;
  background: var(--ion-background-color);
  border-radius: 10px;
  z-index: 99;
}

.controls {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1000px) {
  #app .map,
  #app .map-container {
    width: calc(100vw - 35rem);
    height: calc(100% - 1px);
  }
}
</style>
