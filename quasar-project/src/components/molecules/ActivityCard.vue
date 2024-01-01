<script setup>
import ContributorsList from 'src/components/molecules/ContributorsList.vue'
import helper from 'src/composables/helper'
import { useGroupStore } from 'src/stores/groups'
import { useReceiptStore } from 'src/stores/receipts'
import { useUserStore } from 'src/stores/user'
import { computed, ref } from 'vue'

const useUser = useUserStore()
const useReceipt = useReceiptStore()
const useGroup = useGroupStore()
const open = ref(false)

const props = defineProps({
  value: {
    required: true,
    type: Object,
  },
  index: {
    required: true,
    type: [Number, String],
  },
  id: {
    required: true,
    type: Number,
  },
  link: {
    required: false,
    type: String,
    default: 'Receipt details',
  },
})

const contributors = computed(() => {
  return helper.getContribrutors(props.value, useUser.user, useUser.friends)
})

const toggle = (event) => {
  event.preventDefault()
  open.value = !open.value
}
</script>

<template>
  <router-link :to="{ name: 'Receipt details', params: { index: index } }" class="card">
    <div class="info">
      <div>
        <h3>{{ value.title }}</h3>
        <div class="type">
          <p>{{ value.type }}</p>
          <p v-if="contributors.length > 2">{{ contributors.length }} Persons</p>
        </div>
      </div>
      <div>
        <h4>€{{ value.total }}</h4>
        
      </div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.card-type {
  background-color: color-mix(in srgb, $negative 50%, transparent);
  color: $white;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.8rem;
}
.type {
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.contributors {
  background-color: $card;
  position: relative;
  width: 100%;
  top: -1rem;
}
.card {
  margin: 0;
  position: relative;
  text-decoration: none;
  color: var(--text-color);
  padding: 1rem;
  z-index: 2;
  cursor: pointer;
  filter: drop-shadow(0px 0px 3px $step-150);
  background-color: $card;
  border-radius: 5px;
  max-width: 35rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  gap: 0.5rem;

  button {
    margin: 0;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 3rem;
    height: 1rem;
  }

  & .info {
    display: flex;
    width: 100%;
    justify-content: space-between;

    & div:last-child {
      text-align: end;
    }

    & div:first-child {
      text-align: start;
    }

    & h3 {
      margin: 0;
    }

    & p {
      margin: 0;
    }

    & i {
      font-size: x-small;
    }
  }

  & .img {
    border-radius: 5px;
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    flex-direction: column;

    &.General {
      background: linear-gradient(27deg, rgba(59, 36, 255, 1) 0%, rgba(63, 199, 251, 1) 100%);
    }
    &.Food {
      background: linear-gradient(27deg, rgba(251, 63, 117, 1) 0%, rgba(255, 99, 70, 1) 100%);
    }
    &.Recreation {
      background: linear-gradient(27deg, rgba(1, 193, 27, 1) 0%, rgba(2, 217, 137, 1) 100%);
    }
    &.Transport {
      background: linear-gradient(27deg, rgba(249, 141, 19, 1) 0%, rgba(185, 214, 0, 1) 100%);
    }
  }
}
</style>
