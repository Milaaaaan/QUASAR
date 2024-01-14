<script setup>
import { takePicture } from 'src/composables/photo'
import validator from 'src/composables/validator'
import { useConnectionStore } from 'src/stores/connection'
import { useFetchStore } from 'src/stores/fetchData'
import { useGroupStore } from 'src/stores/groups'
import { useReceiptStore } from 'src/stores/receipts'
import { useUserStore } from 'src/stores/user'
import { computed, ref, watch } from 'vue'
import helper from 'src/composables/helper'
import LocationSearch from 'src/components/atoms/LocationSearch.vue'
import TheMap from 'src/components/molecules/TheMap.vue'
import { useMapStore } from 'src/stores/map'
import { Geolocation } from '@capacitor/geolocation'

const name = ref()
const total = ref(0)
const loading = ref(false)
const useConnection = useConnectionStore()
const useMap = useMapStore()
const useUser = useUserStore()
const useGroup = useGroupStore()
const useFetch = useFetchStore()

const location = ref(null)
const lon = ref(null)
const lat = ref(null)
const image = ref(null)
const step = ref(1)
const text = ref(null)
const category = ref({
  id: 0,
  icon: 'local_drink',
  label: 'Drinks',
  type: 'Food',
})
const type = ref('personal')
const withArtikles = ref(false)
const when = ref(new Date().toISOString().slice(0, 16).replace('T', ' '))
const submitted = ref(false)
const useReceipt = useReceiptStore()

const friend = ref(null)
const group = ref(null)
const persons = ref([])

const done1 = ref(false)
const done2 = ref(false)
const done3 = ref(false)

const types = ['personal', 'friend', 'group']
const pinFormatter = (value) => `€${value.toFixed(2)}`

const columns = [
  { name: 'name', align: 'left', label: 'Name', field: 'name' },
  { name: 'amount', align: 'center', label: 'Amount', field: 'amount' },
  { name: 'price', label: 'Price', field: 'price' },
  { name: 'total', label: 'Total', field: 'total' },
]

const artikles = ref([
  { name: 'example', amount: 3, price: 3.49 },
  { name: 'example', amount: 3, price: 3.49 },
])

const nameError = computed(() => validator.name(true, name.value, 'Receipt title', 5))

const take = async () => {
  image.value = await takePicture()
}

const onFriendChange = (e) => {
  friend.value = e.detail.value
}

const onGroupChange = (e) => {
  group.value = e.detail.value
}

const totalError = computed(() => validator.number(true, total.value, 'Total', 0.01, 1000000))

watch([withArtikles, artikles], () => {
  if (withArtikles.value && artikles.value)
    total.value = artikles.value.reduce((total, object) => total + object.price * object.amount, 0)
})

const submit = async () => {
  submitted.value = true
  if (!totalError.value) {
    loading.value = true

    const items = withArtikles.value ? artikles.value : null

    const formData = new FormData()

    formData.append('type', type.value)
    formData.append('title', name.value)
    formData.append('description', text.value)
    formData.append('total', total.value)
    formData.append('category', category.value.id)
    formData.append('created', when.value ? when.value : new Date())
    formData.append('created_by', useUser.user.id)
    formData.append('synced', false)

    if (group.value) formData.append('group', group.value)
    if (friend.value) formData.append('friend', friend.value)
    if (persons.value.length > 0) formData.append('persons', persons.value)
    if (items) formData.append('items', JSON.stringify(items))
    if (image.value) formData.append('img_url', image.value)
    if (location.value) formData.append('location', location.value)
    if (lon.value) formData.append('lon', lon.value)
    if (lat.value) formData.append('lat', lat.value)

    const receipt = helper.formDataToObject(formData)
    receipt.id = useReceipt.receipts.length > 0 ? useReceipt.receipts[useReceipt.receipts.length - 1].id + 1 : 1;
    if (items) receipt.items = items
    receipt.date = receipt.created

    try {
      if (useConnection.isConnected) {
        await useFetch.fetch('/receipts/add', 'post', formData, true, false, true)
        receipt.synced = true
      }
    } catch (error) {
      loading.value = false
    } finally {
      useReceipt.receipts.push(receipt)
      useReceipt.update()
      console.log(useReceipt.receipts)
      loading.value = false
    }
  }
}

const handleForm = async () => {
  submitted.value = true
  if (step.value == 3 && !totalError.value) submit()
  if (step.value == 2) {
    done2.value = true
    step.value++
  }
  if (step.value == 1 && !nameError.value && !totalError.value) {
    done1.value = true
    step.value++
  }
}

const updateLocation = (new_location) => {
  useMap.clearMap()
  useMap.addCustomMarker(name.value, new_location, true)

  location.value = new_location.formatted
  lon.value = new_location.lon
  lat.value = new_location.lat
}

const currentLocation = async () => {
  const coordinates = await Geolocation.getCurrentPosition()
  const x = await useMap.geocodeCoord(coordinates.coords.latitude, coordinates.coords.longitude)
  lon.value = x.features[0].properties.lon
  lat.value = x.features[0].properties.lat
  location.value = x.features[0].properties.formatted

  useMap.clearMap()
  useMap.addCustomMarker(name.value, x.features[0].properties, true)
}
</script>

<template>
  <section>
    <q-stepper
      v-model="step"
      inactive-color="text"
      header-nav
      ref="stepper"
      color="primary"
      animated
      alternative-labels
    >
      <q-step :name="1" title="Basics" icon="settings" :done="done1">
        <q-input
          v-model="name"
          label="Receipt Title"
          filled
          placeholder="Give this receipt a name"
          :error-message="nameError"
          :error="submitted && nameError != ''"
        />
        <q-select filled v-model="category" :options="useReceipt.category" label="Category">
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ scope.opt.type }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select filled v-model="type" :options="types" label="Type" />

        <div class="buttons">
          <q-chip square color="primary" text-color="white" icon="event">
            {{ when }}
            <q-popup-proxy @before-show="updateProxy">
              <q-date v-model="when" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-chip>

          <q-chip square color="primary" text-color="white" icon="schedule">
            <q-popup-proxy @before-show="updateProxy">
              <q-time v-model="when" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                </div>
              </q-time>
            </q-popup-proxy>
            Time
          </q-chip>
        </div>

        <q-table v-if="withArtikles" :rows="artikles" :columns="columns" title="Items" row-key="name">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Name" auto-save v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
                </q-popup-edit>
              </q-td>
              <q-td key="amount" :props="props">
                {{ props.row.amount }}
                <q-popup-edit title="Edit amount" v-model.number="props.row.amount" auto-save v-slot="scope">
                  <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
                </q-popup-edit>
              </q-td>
              <q-td key="price" :props="props">
                {{ props.row.price }}
                <q-popup-edit title="Edit price" v-model="props.row.price" auto-save v-slot="scope">
                  <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
                </q-popup-edit>
              </q-td>
              <q-td key="total" :props="props">
                {{ props.row.amount * props.row.price }}
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <q-input
          v-model="total"
          label="Total cost"
          :disable="withArtikles"
          filled
          square
          type="number"
          placeholder="The amount of total money spent"
          :error-message="totalError"
          :error="submitted && totalError != ''"
        />

        <q-checkbox v-model="withArtikles" label="With items" />

        <q-stepper-navigation>
          <q-btn @click="handleForm" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <!-- STEP 2-->
      <q-step
        :disable="nameError != '' || totalError != ''"
        :name="2"
        title="Details"
        caption="Optional"
        icon="create_new_folder"
        :done="done2"
      >
        <q-file accept=".jpg, image/*" filled bottom-slots v-model="image" label counter>
          <template v-slot:prepend>
            <q-icon name="image" @click.stop.prevent />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click.stop.prevent="image = null" class="cursor-pointer" />
          </template>

          <template v-slot:label>
            Upload image
            <span class="text-primary">(optional*)</span>
          </template>
        </q-file>

        <q-input v-model="text" label="Note" type="textarea" filled>
          <template v-slot:label>
            Give some more details
            <span class="text-primary">(optional*)</span>
          </template>
        </q-input>

        <LocationSearch v-model="location" :error="LocationError" @new-location="updateLocation" />
        <q-btn class="full" color="primary" icon="my_location" label="Use my location" @click="currentLocation" />
        <TheMap :show="useConnection.isConnected" />

        <q-stepper-navigation>
          <q-btn @click="handleForm" color="primary" label="Continue" />
          <q-btn @click="step--" color="negative" label="Back" />
        </q-stepper-navigation>
      </q-step>

      <!-- STEP 3-->
      <q-step
        :disable="nameError != '' || totalError != ''"
        :name="3"
        title="who"
        icon="people"
        :done="done3"
      >
        <q-stepper-navigation>
          <q-btn @click="handleForm" color="primary" label="Save" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </section>
</template>

<style scoped lang="scss">
.options {
  padding: 0.5rem;
}
.q-stepper {
  min-height: 75vh;
  width: 100%;
}

.full {
  width: 100%;
  margin-bottom: 1rem;
}

.q-select {
  margin-bottom: 1rem;
}

.buttons {
  margin: 1rem 0;
}

.body--dark #q-app section,
.body--dark #q-app form {
  background-color: transparent;
  color: #ecf2fd;
}

form {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

section {
  padding: 0;
  height: -webkit-fill-available;
  display: flex;
  align-items: center;
}

.err {
  background-color: var(--ion-color-danger);
  color: var(--white);
}

.q-stepper__nav {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
}
</style>
