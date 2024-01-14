import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import mapboxgl from 'mapbox-gl'

export const useMapStore = defineStore('mapStore', () => {
  const initialized = ref(false)
  const map = ref()
  const geocoder = ref()
  const markers = ref([])
  const accessToken = 'pk.eyJ1IjoibWlsYW4tZGciLCJhIjoiY2xvMnRqeHYzMTJ0ejJpcGpxZGV4YnhzZiJ9.wDICnT52Sd0vpc5t4Y0fVA'
  const options = ref({
    dark: true,
    anim: true,
    threeDim: false,
  })

  const style = computed(() => {
    if (options.value.threeDim) return undefined
    else if (options.value.dark) return 'mapbox://styles/mapbox/navigation-night-v1'
    else return 'mapbox://styles/mapbox/navigation-day-v1'
  })

  const reset = async (element) => {
    mapboxgl.accessToken = accessToken

    map.value = new mapboxgl.Map({
      container: element,
      style: style.value,
      center: [4.345208, 50.8159894],
      zoom: 10,
    })

    map.value.on('style.load', async () => {
      initialized.value = true
      if (options.value.threeDim)
        map.value.setConfigProperty('basemap', 'lightPreset', options.value.dark ? 'night' : 'day')
      await update()
      markers.value.forEach((marker) => marker.addTo(map.value))
    })
  }

  const addCustomMarker = async (info, pos, zoomIntoView = false) => {
    const index = markers.value.length
    const center = [pos?.lon || 0, pos?.lat || 0]
    markers.value.push(
      new mapboxgl.Marker()
        .setLngLat(center)
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${info}</h3>`))
        .addTo(map.value)
    )
    if (zoomIntoView) relocateMap({ center: center, zoom: 13 })
    else relocateMap({ duration: options.value.threeDim ? 2500 : 1500 })
    return index
  }

  const relocateMap = ({
    reset = false,
    center = [4.345208, 50.8159894],
    zoom = 10,
    pitch = 0,
    bearing = 0,
    duration = options.value.threeDim ? 10000 : 2000,
  } = {}) => {
    const dur = !options.value.anim ? 0 : duration

    if (reset) clearMap()

    map.value?.flyTo({
      essential: true,
      center: center,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      duration: dur,
      easing: (t) => t,
    })
  }

  const clearMap = () => {
    markers.value.forEach((marker) => marker.remove())
    markers.value = []
  }

  const geocode = async (query) => {
    let x
    await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&limit=5&type=amenity&format=json&apiKey=b9042866c9bb4195873683d6f867c474`
    )
      .then((response) => response.json())
      .then((dt) => (x = dt))

    return x
  }

  const geocodeCoord = async (lat, lon) => {
    let x
    await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=b9042866c9bb4195873683d6f867c474`
    )
      .then((response) => response.json())
      .then((dt) => (x = dt))

    return x
  }

  const get = async (element) => {
    await reset(element)
  }

  const init = async () => {
    const OPTIONS = JSON.parse(localStorage.getItem('options'))
    if (OPTIONS) options.value = OPTIONS
  }

  init()

  const update = async () => {
    localStorage.setItem('options', JSON.stringify(options.value))
  }

  return {
    map,
    markers,
    options,
    geocoder,
    initialized,
    reset,
    addCustomMarker,
    geocodeCoord,
    clearMap,
    geocode,
    relocateMap,
    get,
    update,
  }
})
