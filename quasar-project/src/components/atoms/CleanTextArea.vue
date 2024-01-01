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
    type: String,
    required: true,
  },
  type: {
    default: 'text',
    type: String,
  },
})

defineEmits(['update:modelValue'])

const spanClass = computed(() => {
  let classes = props.modelValue ? 'focused' : ''
  if (props.error) {
    classes += ' error'
  }
  return classes
})
</script>

<template>
  <label :for="label" :class="error ? 'error' : ''">
    <textarea
      :id="label"
      :type="type"
      :name="label"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <span :class="spanClass">{{ error ? error : label }}</span>
  </label>
</template>
