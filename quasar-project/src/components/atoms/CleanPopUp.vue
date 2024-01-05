<script setup>
import { usePopUpStore } from 'src/stores/popup'
import ProfilePicture from './ProfilePicture.vue'
import helper from 'src/composables/helper'
import QrcodeVue from 'qrcode.vue'
import { useUserStore } from 'src/stores/user'
import { computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useFetchStore } from 'src/stores/fetchData'

const usePopUp = usePopUpStore()
const useFetch = useFetchStore()
const useUser = useUserStore()
const $q = useQuasar()

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
</script>

<template>
  <q-dialog v-model="usePopUp.open" class="dialog">
    <q-card-section v-if="usePopUp.type == 'QR'" class="QR pop-up">
      <i><b>Code: </b>{{ details.qr }}</i>
      <qrcode-vue
        :foreground="$q.dark.isActive ? '#FFFF' : '#000'"
        background="transparent"
        :value="details.qr"
        level="H"
      />
    </q-card-section>

    <q-card-section v-else-if="usePopUp.type == 'friend'" class="pop-up">
      <ProfilePicture :pic="details.profile_picture" />
      <h3>{{ details.name }}</h3>
      {{ details }}

      <q-list separator>
        <q-item clickable v-ripple v-if="details.friend">
          <q-item-section side>Friends since: {{ helper.cleanEU(details.created_at) }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section side>{{ owed() }}</q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section side>Friends since: {{ helper.cleanEU(details.created_at) }}</q-item-section>
        </q-item>
      </q-list>

      <div class="buttons">
        <q-btn v-if="!details.friend || !details.requested" @click="addfriend" color="positive" icon="person"
          >Add as friend</q-btn
        >
        <q-btn v-if="friend" color="negative" icon="person" @click="removeFriend">Remove friend</q-btn>
        <q-btn v-if="details.user1_debt < 0" color="primary" icon="attach_money">Repay dept</q-btn>
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

.buttons {
  display: flex;
  gap: 1rem;
  flex-direction: column;
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
