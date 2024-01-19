<script setup>
import { usePopUpStore } from 'src/stores/popup'
import ProfilePicture from './ProfilePicture.vue'
import helper from 'src/composables/helper'
import QrcodeVue from 'qrcode.vue'
import { useUserStore } from 'src/stores/user'
import { computed, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useFetchStore } from 'src/stores/fetchData'
import { useReceiptStore } from 'src/stores/receipts'

const usePopUp = usePopUpStore()
const useFetch = useFetchStore()
const useUser = useUserStore()
const $q = useQuasar()
const amount = ref(0)
const title = ref('')
const member = ref(null)

watch(usePopUp, () => {
  if (usePopUp.open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

const details = computed(() => {
  return usePopUp.details
})

const owed = () => {
  if (details.value.user1_debt < 0) return `Owed ${helper.formatPrice(details.value.user1_debt)}`
  else if (details.value.user1_debt == 0) return 'You are even'
  else return `${helper.formatPrice(details.value.user1_debt)} in your debt`
}

const addfriend = async () => {
  await useFetch.fetch('/friends/add', 'post', { id: details.value.id }, true, true, false)
  const index = useUser.friends.findIndex((x) => x.id === details.value.id)
  if (index !== -1) {
    useUser.friends[index].requested = true
    useUser.friends[index].user1_id = useUser.user.id
  }
  useUser.update()
}

const removeFriend = async () => {
  await useFetch.fetch(`/friends/remove/${details.value.friend_id}`, 'del', null, true, true, false)
  const index = useUser.friends.findIndex((x) => x.id === details.value.id)
  if (index !== -1) {
    useUser.friends[index].friend = false
    useUser.friends[index].user1_id = null
    useUser.friends[index].requested = false
  }
  useUser.update()
}

const openPay = () => {
  amount.value = Math.abs(details.value.user1_debt)
  title.value = `lift debt`
  usePopUp.type = 'pay'
}

const cancel = () => {
  usePopUp.type = 'friend'
}

const payBack = async () => {
  const payload = {
    amount: amount.value,
    title: title.value,
  }
  await useFetch.fetch(`/transactions/user/${details.value.id}`, 'post', payload, true, true, false)
  await useReceiptStore().sync()
  usePopUp.open = false
}

const validate = () => {
  if (amount.value > Math.abs(details.value.user1_debt)) amount.value = Math.abs(details.value.user1_debt)
  else if (amount.value < 0) amount.value = 0.01
}

const unJoinedMembers = computed(() => {
  if (!useUser.friends) return null
  return useUser.friends
    .filter((x) => {
      if (x.groups && x.groups.length > 0) {
        return !x.groups.some((y) => y.group_id == details.value.id)
      }
      return true
    })
    .map((x) => ({ label: x.name, value: x }))
})

const addMember = async () => {
  await useFetch.fetch(
    `/groups/${details.value.id}/members/add`,
    'post',
    { id: member.value.value.id },
    true,
    true,
    false
  )
  const index = useUser.friends.findIndex((x) => x.id === member.value.value.id)
  console.log(useUser.friends[index])
  if (index !== -1) {
    useUser.friends[index].groups.push({ group_id: details.value.id, joined: 0, ower: 0 })
    useUser.friends[index].synced = false
  }
  useUser.update()
  usePopUp.open = false
}
</script>

<template>
  <q-dialog full-width v-model="usePopUp.open" class="dialog">
    <q-card-section v-if="usePopUp.type == 'QR'" class="QR pop-up">
      <i><b>Code: </b>{{ details.qr }}</i>
      <qrcode-vue
        :foreground="$q.dark.isActive ? '#FFFF' : '#000'"
        background="transparent"
        :value="`https://bill-buddy.milandegraeve.ikdoeict.be/social/friends/add?code=${details.qr}`"
        level="H"
        size="150"
      />
    </q-card-section>

    <q-card-section v-else-if="usePopUp.type == 'friend'" class="pop-up">
      <ProfilePicture :pic="details.profile_picture" />
      <h3>{{ details.name }}</h3>

      <q-list separator>
        <q-item clickable v-ripple v-if="details.friend">
          <q-item-section side>Friends since: {{ helper.cleanEU(details.created_at) }}</q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section side>{{ owed() }}</q-item-section>
        </q-item>
      </q-list>

      <div class="buttons">
        <q-btn v-if="!details.friend || !details.requested" @click="addfriend" color="positive" icon="person">
          Add as friend
        </q-btn>
        <q-btn v-if="details.friend" color="negative" icon="person" @click="removeFriend">Remove friend</q-btn>
        <q-btn v-if="details.user1_debt < 0" color="primary" icon="attach_money" @click="openPay">Repay dept</q-btn>
      </div>
    </q-card-section>

    <q-card-section v-else-if="usePopUp.type == 'pay'" class="pop-up">
      <ProfilePicture :pic="details.profile_picture" />
      <h3>Pay {{ details.name }} back</h3>

      <q-slider
        v-model="amount"
        :min="0.5"
        :max="Math.abs(details.user1_debt)"
        :label-value="helper.formatPrice(amount)"
        :step="0.5"
        label-always
        color="primary"
      />

      <q-input
        v-model.numer="amount"
        @update:model-value="validate"
        filled
        type="number"
        label="Transfer amount"
        placeholder="amount to transfer to person"
      />

      <q-input v-model.numer="title" filled label="title" placeholder="transaction title" />

      <i class="small">
        Money is not really being transfered, you will still need to do this, this just keeps track of the money flow
      </i>

      <div class="buttons">
        <q-btn @click="cancel" color="negative">Cancel</q-btn>
        <q-btn @click="payBack" color="positive">Transfer</q-btn>
      </div>
    </q-card-section>

    <q-card-section v-else-if="usePopUp.type == 'members'" class="pop-up">
      <ProfilePicture :pic="details.profile_picture" />
      <h3>Add members to {{ details.name }}</h3>
      <q-select
        v-if="unJoinedMembers.length >= 1"
        v-model="member"
        :options="unJoinedMembers"
        label="Standard"
        filled
      />
      <h4 v-else>Everyone you know is already in the group.</h4>

      <div class="buttons">
        <q-btn @click="usePopUp.open = false" color="negative">Cancel</q-btn>
        <q-btn v-if="unJoinedMembers.length >= 1" @click="addMember" color="positive">Add member</q-btn>
      </div>
    </q-card-section>

    <q-card-section v-else class="pop-up">
      {{ details }}
    </q-card-section>
  </q-dialog>
</template>

<style scoped lang="scss">
.QR {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  i {
    margin: 0.5rem 0;
    color: var(--ion-text-color);
  }
}

h4 {
  margin: 1rem 0;
}

.q-slider {
  margin-top: 1rem;
}

.small {
  font-size: xx-small;
  line-height: xx-small;
}

.buttons {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.q-slider {
  width: calc(100% - 1rem);
}

.pop-up {
  padding: 1rem;
  background: $step-50;
}

html.dark {
  .dialog div {
    background: $step-850;
  }
}
</style>
