<script setup>
import { usePopUpStore } from 'src/stores/popup'
import ProfilePicture from './ProfilePicture.vue'
import helper from 'src/composables/helper'
import QrcodeVue from 'qrcode.vue'
import { useUserStore } from 'src/stores/user'
import { watch } from 'vue'
import { useQuasar } from 'quasar'

const usePopUp = usePopUpStore()
const useUser = useUserStore()
const $q = useQuasar()

watch(usePopUp, () => {
  if (usePopUp.open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})
</script>

<template>
  <dialog v-if="usePopUp.open" class="pop-up-container">
    <span @click="usePopUp.open = false"></span>
    <div class="pop-up">
      <div v-if="usePopUp.type == 'QR'" class="QR">
        <i><b>Code: </b>{{ usePopUp.details.qr }}</i>
        <qrcode-vue
          :foreground="$q.dark.isActive ? '#FFFF' : '#000'"
          background="transparent"
          :value="usePopUp.details.qr"
          level="H"
        />
      </div>

      <div v-else-if="usePopUp.type == 'friend'">
        <ProfilePicture :pic="usePopUp.details.profile_picture" />
        <h3>{{ usePopUp.details.name }}</h3>
        <i> Friends since: {{ helper.cleanEU(usePopUp.details.created_at) }} </i>

        <q-btn color="negative">Verwijder vriend</q-btn>
      </div>

      <div v-else>
        {{ usePopUp.details }}
      </div>
    </div>
  </dialog>
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
span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.pop-up-container {
  z-index: 100;
  border: none;
  padding: 0;
  display: flex;
  background: #1a1a1a20;
  backdrop-filter: blur(3px);
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  position: fixed;
  align-items: center;
  justify-content: center;
}
.pop-up {
  padding: 2rem 1rem;
  background-color: $card;
  border-radius: 10px;
  max-width: 35rem;
  width: calc(100% - 4rem);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-direction: column;
}

.body--dark {
  .pop-up {
    color: $step-50;
    background-color: $step-950;
  }
}
</style>
