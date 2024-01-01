<script setup lang="ts">
import { useUserStore } from 'src/stores/user'
import helper from 'src/composables/helper'
import { usePopUpStore } from 'src/stores/popup'
import ProfilePicture from 'src/components/atoms/ProfilePicture.vue'
import NotificationsCard from 'src/components/molecules/NotificationCard.vue'
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

const useUser = useUserStore()
const usePopUp = usePopUpStore()
const notify = ref(false)
const quasar = useQuasar()
const vibrations = ref(false)
const darkmode = ref(quasar.dark.isActive)

const logout = async () => {
  await useUser.logout()
}

watch(
  () => darkmode.value,
  (val) => {
    useUser.toggleChange()
  }
)

const changeTheme = () => {
  useUser.toggleChange()
}

const showQr = () => {
  usePopUp.type = 'QR'
  usePopUp.details = { qr: useUser.user.friend_code }
  usePopUp.open = true
}

/*

<IonList :inset="true">
      <IonItem button>
        
        <ion-icon color="medium" slot="start" :icon="useUser.themeToggle ? moon : sunny" size="large"></ion-icon>
        <IonToggle :checked="useUser.themeToggle" @ionChange="useUser.toggleChange($event)" justify="space-between"
          >Dark Mode</IonToggle
        >
      </IonItem>
      <IonItem button @click="showQr">
        <ion-icon color="medium" slot="start" :icon="qrCode" size="large"></ion-icon>
        <IonLabel> FriendCode: {{ useUser.user.friend_code }} </IonLabel>
      </IonItem>
      <IonItem button @click="logout">
        <ion-icon color="medium" slot="start" :icon="logOut" size="large"></ion-icon>
        <IonLabel> Logout</IonLabel>
      </IonItem>
      <IonItem button>
        <ion-icon color="medium" slot="start" :icon="sunny" size="large"></ion-icon>
        <IonToggle :checked="null" @ionChange="null" justify="space-between">Vibrations</IonToggle>
      </IonItem>
      <IonItem button>
        <ion-icon color="medium" slot="start" :icon="notify ? notificationsOff : notifications" size="large"></ion-icon>
        <IonToggle :checked="notify" @ionChange="notify = !notify" justify="space-between">Notifications</IonToggle>
      </IonItem>
    </IonList>

*/
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
      <h3>Notifications 123</h3>
      <NotificationsCard :notifies="useUser.notifications" />

      <q-list padding>
        <q-item-label header>Settings</q-item-label>

        <q-item tag="label" v-ripple>
          <q-item-section avatar center>
            <q-icon name="qr_code_scanner" />
          </q-item-section>

          <q-item-section @click="showQr">
            <q-item-label>Friend code</q-item-label>
            <q-item-label caption>{{ useUser.user.friend_code }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section avatar center>
            <q-icon :name="useUser.themeToggle ? 'dark_mode' : 'light_mode'" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Darkmode</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-toggle v-model="darkmode" val="friend" />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section avatar center>
            <q-icon :name="notify ? 'notifications' : 'notifications_off'" />
          </q-item-section>
          <q-item-section>
            <q-item-label>notification</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle v-model="notify" val="friend" />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section avatar center>
            <q-icon :name="vibrations ? 'phonelink_ring' : 'smartphone'" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vibrations</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle v-model="vibrations" val="picture" />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple @click="logout">
          <q-item-section avatar center>
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
