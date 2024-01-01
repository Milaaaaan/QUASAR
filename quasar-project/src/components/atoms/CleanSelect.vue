<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
  },
  error: {
    type: String,
  },
  modelValue: {
    type: Object,
    required: true,
  },
  options: {
    required: true,
    type: Object,
  },
})

const open = ref(false)
const spanClass = computed(() => {
  let classes = props.modelValue ? 'focused' : ''
  if (props.error) {
    classes += ' error'
  }
  return classes
})

const toggle = () => {
  open.value = !open.value
}

const emit = defineEmits(['update:modelValue'])

const update = (option) => {
  emit('update:modelValue', option)
  toggle()
}
</script>

<template>
  <label :for="label" :class="error ? 'error' : ''">
    <button class="input" @click="toggle">
      <p>{{ modelValue.type ? modelValue.type + ' |' : '' }} {{ modelValue.title }}</p>
    </button>
    <span :class="spanClass">{{ error ? error : label }}</span>

    <ul v-if="open">
      <li v-for="(option, index) in options" :key="index" :value="option.id">
        <button @click="update(option)" :class="modelValue.id == option.id ? 'selected ' + option.type : option.type">
          <ion-icon color="light" size="small" aria-hidden="true" :icon="option.icon" />
          {{ option.title }}
        </button>
      </li>
    </ul>
  </label>
</template>

<style scoped lang="scss">
body.dark button {
  background-color: var(--ion-color-step-150);
}
</style>
