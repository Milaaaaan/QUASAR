<script setup>
import { useUserStore } from 'src/stores/user'
import helper from 'src/composables/helper'
import { usePopUpStore } from 'src/stores/popup'
import ProfilePicture from 'src/components/atoms/ProfilePicture.vue'
import NotificationsCard from 'src/components/molecules/NotificationCard.vue'
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useConnectionStore } from 'src/stores/connection'

const useUser = useUserStore()
const usePopUp = usePopUpStore()
const useConnection = useConnectionStore()
const notify = ref(false)
const quasar = useQuasar()
const vibrations = ref(false)
const darkmode = ref(quasar.dark.isActive)

const logout = async () => {
  await useUser.logout()
}

const changeTheme = (change = true) => {
  useUser.toggleChange()
  if (change) darkmode.value = !darkmode.value
}

const showQr = () => {
  usePopUp.type = 'QR'
  usePopUp.details = { qr: useUser.user.friend_code }
  usePopUp.open = true
}
</script>

<template>
  <q-page>
    <section v-if="useUser.user">
      <div class="top">
        <ProfilePicture :pic="useUser.user.profile_picture" edit />
        <h2>{{ useUser.user.name }}</h2>
        <i>Member since: {{ helper.cleanEU(useUser.user.created_at) }}</i>
      </div>
      <hr />
      <NotificationsCard :notifies="useUser.notifications" />

      <q-btn color="primary" icon="check" label="OK" @click="useConnection.reload()" />

      <q-list padding separator>
        <q-item-label header>Settings</q-item-label>

        <q-item v-ripple>
          <q-item-section avatar>
            <q-icon name="qr_code_scanner" />
          </q-item-section>

          <q-item-section @click="showQr">
            <q-item-label>Friend code</q-item-label>
            <q-item-label caption>{{ useUser.user.friend_code }}</q-item-label>
          </q-item-section>

          <q-item-section side></q-item-section>
        </q-item>

        <q-item v-ripple clickable @click="changeTheme">
          <q-item-section avatar>
            <q-icon :name="darkmode ? 'dark_mode' : 'light_mode'" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Darkmode</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle @click="changeTheme(false)" v-model="darkmode" val="friend" />
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section avatar>
            <q-icon :name="notify ? 'notifications' : 'notifications_off'" />
          </q-item-section>
          <q-item-section>
            <q-item-label>notification</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle v-model="notify" val="friend" />
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section avatar>
            <q-icon :name="vibrations ? 'phonelink_ring' : 'smartphone'" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Vibrations</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle v-model="vibrations" val="picture" />
          </q-item-section>
        </q-item>

        <q-item v-ripple clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </section>
  </q-page>
</template>

<style scoped lang="scss">
#app ion-list {
  margin: 0;
  padding: 0;
  width: 100%;
}

.body--dark #q-app section {
  background-color: $step-850;
}

.column {
  align-content: start;
}

hr {
  width: 80%;
}

h3,
p {
  text-align: center;
}

.q-list {
  background-color: $card;
}

.q-item {
  margin: 0;
  flex-direction: row;
}

section {
  padding: 0;
  background-color: $card;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  & p {
    margin: 1rem 0;
  }

  & .top {
    padding: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
