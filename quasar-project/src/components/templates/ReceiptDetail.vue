<script setup>
import ContributorsList from 'src/components/molecules/ContributorsList.vue'
import helper from 'src/composables/helper'
import { useReceiptStore } from 'src/stores/receipts'
import { useUserStore } from 'src/stores/user'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import img from 'src/assets/nopfp.jpg'

const useReceipt = useReceiptStore()
const useUser = useUserStore()
const route = useRoute()
const columns = [
  { name: 'name', align: 'left', label: 'Name', field: 'name' },
  { name: 'amount', align: 'center', label: 'Amount', field: 'amount' },
  { name: 'price', label: 'Price', field: 'price' },
  { name: 'total', label: 'Total', field: 'total' },
]

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
    <div class="part">
      <q-icon color="light" size="xx-large" :name="useReceipt.category[receipt.category - 1].icon" />
      <h2>{{ receipt.title }}</h2>
      <h3>{{ receipt.type }}</h3>
      <p>{{ receipt.description }}</p>
      <p>{{ receipt.location }}</p>
      <p v-if="creator">
        Created by
        <b>{{ creator.name }}</b>
      </p>
    </div>

    <span v-if="receipt.items" class="splicer"></span>

    <div v-if="receipt.items">
      <q-table flat :rows="receipt.items" :columns="columns" title="Items" row-key="name" />
    </div>

    <span v-if="contributors" class="splicer"></span>

    <div v-if="contributors">
      <q-list>
        <q-item-label header>Friends</q-item-label>
        <div v-for="(contributor, index) in contributors" :key="index">
          <q-item clickable v-ripple @click="openPopUP(friend)">
            <q-item-section avatar>
              <q-avatar>
                <img :src="contributor.profile_picture ? contributor.profile_picture : img" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ contributor.name }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label lines="1">{{ helper.formatPrice(contributor.owed) }} </q-item-label>
              <q-item-label lines="2"> Owed </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset="item" />
        </div>
      </q-list>
    </div>

    <span class="splicer"></span>

    <div class="part">
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

.part {
  padding: 1rem;
}

.receipt {
  background: $card;
  border-radius: 5px;
  max-width: 40rem;
  position: relative;
  margin: 1rem;

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
