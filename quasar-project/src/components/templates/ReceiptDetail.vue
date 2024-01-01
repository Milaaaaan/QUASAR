<script setup>
import ContributorsList from 'src/components/molecules/ContributorsList.vue'
import helper from 'src/composables/helper'
import { useReceiptStore } from 'src/stores/receipts'
import { useUserStore } from 'src/stores/user'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const useReceipt = useReceiptStore()
const useUser = useUserStore()
const route = useRoute()

const receipt = computed(() => {
  if (route.params.index) return useReceipt.receipts[route.params.index]
  return null
})

const contributors = computed(() => {
  return helper.getContribrutors(receipt.value, useUser.user, useUser.friends)
})

const creator = computed(() => {
  if (receipt.value) {
    if (useUser.user.id == receipt.value.created_by) return useUser.user
    else return useUser.friends.filter((x) => x.id == receipt.value.created_by)[0]
  }
  return null
})
</script>

<template>
  <section v-if="receipt" :class="'receipt ' + useReceipt.category[receipt.category - 1].type">
    <q-icon color="light" size="xx-large" :name="useReceipt.category[receipt.category - 1].icon" />
    <h2>{{ receipt.title }}</h2>
    <h3>{{ receipt.type }}</h3>
    <p>{{ receipt.description }}</p>
    <p>{{ receipt.location }}</p>
    <p v-if="creator">
      Created by
      <b>{{ creator.name }}</b>
    </p>

    <span v-if="receipt.items" class="splicer"></span>

    <div v-if="receipt.items" class="tabs">
      <h3>Receipt items</h3>
      <div>
        <div v-for="(item, index) in receipt.items" :key="index" class="items">
          <div class="left-item">
            <div>
              <h4>{{ item.name }}</h4>
              <b>{{ item.amount }}x</b>
            </div>
            <p>{{ helper.formatPrice(item.price) }}</p>
          </div>

          <p>
            <b>{{ helper.formatPrice(item.total) }}</b>
          </p>
        </div>
      </div>
    </div>

    <span v-if="contributors" class="splicer"></span>
    <div v-if="contributors" class="contributors">
      <h3>Contributors</h3>
      <ContributorsList :contributors="contributors" />
    </div>

    <span class="splicer"></span>

    <div>
      <h3>Picture</h3>
      <img :src="receipt.img_url" alt="" />
    </div>

    <i>{{ helper.cleanTime(receipt.created_at) }}</i>
  </section>
</template>

<style scoped lang="scss">
i {
  display: block;
  margin-top: 3rem;
}

ul {
  padding: 0;
  background-color: transparent;
}
.receipt {
  padding: 1rem;
  border-radius: 5px;
  max-width: 40rem;
  position: relative;
  margin: 2rem;

  & .q-icon {
    margin: 0;
    position: absolute;
    top: 2rem;
    right: 2rem;
  }

  &::before {
    content: '';
    position: absolute;
    width: 8rem;
    height: 8rem;
    top: 0;
    right: 0;
    transform: scale(1.1);
    clip-path: polygon(0 0, 50% 0, 100% 50%, 100% 100%);
  }

  &.General::before {
    background: linear-gradient(27deg, rgba(59, 36, 255, 1) 0%, rgba(63, 199, 251, 1) 100%);
  }
  &.Food::before {
    background: linear-gradient(27deg, rgba(251, 63, 117, 1) 0%, rgba(255, 99, 70, 1) 100%);
  }
  &.Recreation::before {
    background: linear-gradient(27deg, rgba(1, 193, 27, 1) 0%, rgba(2, 217, 137, 1) 100%);
  }
  &.Transport::before {
    background: linear-gradient(27deg, rgba(249, 141, 19, 1) 0%, rgba(185, 214, 0, 1) 100%);
  }

  & h2 {
    font-weight: bold;
    width: calc(100% - 4rem);
  }

  & h2,
  & h3 {
    text-align: left;
  }

  & .img {
    display: flex;
    justify-content: center;

    > img {
      width: 100%;
      max-width: 25rem;
    }
  }

  & span {
    margin: 2rem 0;
    height: 1px;
    display: block;
    border-top: dashed 0.5rem $background;
    position: relative;
    width: 100%;

    &::before,
    &::after {
      content: '';
      width: 3rem;
      height: 3rem;
      position: absolute;
      border-radius: 50%;
      background: $background;
    }

    &::before {
      left: -2rem;
      top: -1.75rem;
    }

    &::after {
      right: -2rem;
      top: -1.75rem;
    }
  }
}
.items {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  & .left-item {
    display: flex;
    width: 60%;
    align-items: flex-end;
    justify-content: space-between;
  }

  & p {
    margin: 0;
  }
}
.contributors {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .contributor {
    display: flex;
    justify-content: space-between;

    & div {
      display: flex;
      gap: 1rem;
    }
  }
}

.body--dark {
  span {
    border-top: dashed 0.5rem $step-950;

    &::before,
    &::after {
      background: $step-950;
    }
  }
}
</style>
