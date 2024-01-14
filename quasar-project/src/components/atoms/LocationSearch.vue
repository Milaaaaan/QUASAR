<script setup>
import { useMapStore } from 'src/stores/map'
import { ref, watch } from 'vue'

const props = defineProps({
  error: {
    type: String,
    required: false,
  },
  modelValue: {
    type: Object,
    required: true,
  },
})

const useMap = useMapStore()
const searchQuery = ref()
const suggestions = ref([])
let searchTimeout
const emit = defineEmits(['newLocation'])

const searchLocations = async () => {
  if (searchQuery.value.length >= 3) suggestions.value = await useMap.geocode(searchQuery.value)
  else suggestions.value = []
}
const selectSuggestion = (suggestion) => {
  console.log('selectSuggestion')
  searchQuery.value = suggestion.formatted
  suggestions.value = []
  emit('newLocation', suggestion)
}

watch(props, () => {
  if (props.modelValue) searchQuery.value = props.modelValue ? props.modelValue : ''
})

const handleInput = () => {
  console.log('handleInput')
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(searchLocations, 500)
}
</script>

<template>
  <q-input
    label
    placeholder="type in the addess"
    filled
    v-model="searchQuery"
    @update:model-value="handleInput"
    :error="error"
  >
    <template v-slot:label>
      location
      <span class="text-primary">(optional*)</span>
    </template>
  </q-input>

  <q-list v-if="suggestions.results" padding separator>
    <q-item
      v-ripple
      clickable
      v-for="suggestion in suggestions.results"
      :key="suggestion.id"
      @click="selectSuggestion(suggestion)"
    >
      {{ suggestion.formatted }}
    </q-item>
  </q-list>
</template>

<style scoped lang="scss">
.q-list {
  margin-top: -1rem;
  background-color: $step-50;
}

.body--dark .q-list {
  background-color: $step-850;
}
</style>
