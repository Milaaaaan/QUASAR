<script setup>
import { computed } from 'vue'

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
    required: true,
  },
  type: {
    default: 'text',
    type: String,
  },
  alt: {
    default: false,
    type: Boolean,
  },
})

defineEmits(['update:modelValue'])

const spanClass = computed(() => {
  let classes = props.modelValue || props.modelValue === 0 ? 'focused' : ''
  if (props.error) {
    classes += ' error'
  }
  return classes
})
</script>

<template>
  <label :for="label" :class="error ? 'error' : ''">
    <input
      :class="alt ? 'alt' : ''"
      :id="label"
      :type="type"
      :name="label"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span :class="spanClass">{{ label }}</span>
    <p v-if="error" class="error-label">{{ error }}</p>
  </label>
</template>
