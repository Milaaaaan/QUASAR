<script setup>
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
import ProfilePicture from '../atoms/ProfilePicture.vue'
import { useRouter } from 'vue-router'

const name = ref('Receipt name')
const total = ref(5)
const loading = ref(false)
const useConnection = useConnectionStore()
const useMap = useMapStore()
const useUser = useUserStore()
const useGroup = useGroupStore()
const router = useRouter()
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

const contributor = ref(null)
const group = ref(null)
const persons = ref([])

const done1 = ref(false)
const done2 = ref(false)
const done3 = ref(false)

const types = ['personal', 'friend', 'group']
const pinFormatter = (value) => `€${parseFloat(value).toFixed(2)}`

if (useUser.friends == null) useUser.sync()
if (useGroup.groups == null) useGroup.sync()

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

const contributors = computed(() => {
  const people = []

  if (type.value == 'friend') {
    useUser.friends.forEach((person) => {
      if (person.friend) people.push({ label: person.name, value: person })
    })
  } else if (type.value == 'group' && group.value) {
    useUser.friends.forEach((x) => {
      const grp = x.groups.find((y) => y.group_id == group.value.value.id && y.joined)
      if (grp) {
        people.push({ label: x.name, value: x })
      }
    })
  }
  return people
})

const groups = computed(() => {
  const groups = []
  useGroup.groups.forEach((group) => {
    groups.push({ label: group.name, value: group })
  })
  return groups
})

const onContributorChange = () => {
  let x = []

  x.push({ id: useUser.user.id, user: useUser.user, amount: (total.value / (contributor.value.length + 1)).toFixed(2) })
  contributor.value.forEach((person) => {
    x.push({ id: person.id, user: person, amount: (total.value / (contributor.value.length + 1)).toFixed(2) })
  })

  persons.value = x
}

const onGroupChange = (e) => {
  let x = []

  x.push({ id: useUser.user.id, user: useUser.user, amount: (total.value / (contributor.value.length + 1)).toFixed(2) })
  contributor.value.forEach((person) => {
    x.push({ id: person.id, user: person, amount: (total.value / (contributor.value.length + 1)).toFixed(2) })
  })

  persons.value = x
}

const totalError = computed(() => validator.number(true, total.value, 'Total', 0.01, 1000000))

watch([withArtikles, artikles], () => {
  if (withArtikles.value && artikles.value) calculateTotalCost()
})

const submit = async () => {
  submitted.value = true
  if (!totalError.value) {
    loading.value = true

    const items = withArtikles.value ? artikles.value : null
    const img = image.value
    const formData = new FormData()

    formData.append('type', type.value)
    formData.append('title', name.value)
    formData.append('total', total.value)
    formData.append('category', category.value.id)
    formData.append('created', when.value ? when.value : new Date())
    formData.append('created_by', useUser.user.id)
    formData.append('synced', false)

    // remove user object from persons
    const x = persons.value.map((person) => {
      return { id: person.id, amount: person.amount }
    })

    if (text.value) formData.append('description', text.value)
    if (group.value) formData.append('group', group.value.value.id)
    if (persons.value.length > 0) formData.append('contributors', JSON.stringify(x))
    if (items) formData.append('items', JSON.stringify(items))
    if (image.value) formData.append('img_url', img)
    if (location.value) formData.append('location', location.value)
    if (lon.value) formData.append('lon', lon.value)
    if (lat.value) formData.append('lat', lat.value)

    const receipt = helper.formDataToObject(formData)
    receipt.id = useReceipt.receipts.length > 0 ? useReceipt.receipts[useReceipt.receipts.length - 1].id + 1 : 1
    if (items) receipt.items = items
    else receipt.items = []
    if (persons.value.length > 0)
      receipt.contributors = persons.value.map((person) => {
        return { ...person.user, pivot: { owed: person.amount, user_id: person.id, receipt_id: Infinity } }
      })
    receipt.category = parseInt(receipt.category)
    receipt.created_by = parseInt(receipt.created_by)
    receipt.total = parseFloat(receipt.total)
    receipt.date = receipt.created

    try {
      if (useConnection.isConnected) {
        await useFetch.fetch('/receipts/add', 'post', formData, true, false, true)
        receipt.synced = true
      }
      useReceipt.receipts.push(receipt)
      useReceipt.update()
      await router.push('/activity')
    } catch (error) {}
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

const calculateTotalCost = () => {
  total.value = artikles.value.reduce((total, object) => total + object.price * object.amount, 0)
}

const removeItem = () => {
  artikles.value.pop()
  calculateTotalCost()
}

const addItem = () => {
  artikles.value.push({ name: 'item', amount: 1, price: 1 })
  calculateTotalCost()
}

const clear = () => {
  contributor.value = null
  group.value = null
  persons.value = []
}

const updateAmount = (changedIndex) => {
  let remainingAmount = total.value - persons.value.reduce((sum, person) => sum + parseFloat(person.amount), 0)
  let amountPeople = persons.value.filter((person) => person.amount > 0).length

  if (Math.abs(remainingAmount) > 0.01 && amountPeople > 0) {
    let equalShare = remainingAmount / amountPeople

    persons.value = persons.value.map((person, index) => {
      if (index > changedIndex && person.amount > 0) {
        let newAmount = parseFloat(person.amount) + equalShare
        if (newAmount < 0) {
          remainingAmount += newAmount + 0.01
          person.amount = 0.01
          amountPeople--
        } else {
          person.amount = newAmount
          remainingAmount -= equalShare
        }
      }
      return person
    })

    // Check if all indexes after the current index have an amount of 0
    let allZero = true
    for (let i = changedIndex + 1; i < persons.value.length; i++) {
      if (persons.value[i].amount > 0.01) {
        allZero = false
        break
      }
    }

    // If all indexes after the current index have an amount of 0, set the current index to the value where total would equal to 5
    if (allZero) {
      const value =
        total.value -
        persons.value.reduce((sum, person, index) => {
          if (index < changedIndex) return sum + parseFloat(person.amount)
          else if (index == changedIndex) return sum + 0
          else return sum + 0.01
        }, 0)

      persons.value[changedIndex].amount = value
    }

    updateAmount(changedIndex)
  }
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

        <div class="buttons">
          <q-chip square color="primary" text-color="white" icon="event">
            {{ when }}
            <q-popup-proxy>
              <q-date v-model="when" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-chip>

          <q-chip square color="primary" text-color="white" icon="schedule">
            <q-popup-proxy>
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

        <q-table
          square
          flat
          bordered
          v-if="withArtikles"
          :rows="artikles"
          :columns="columns"
          title="Items"
          row-key="name"
        >
          <template v-slot:top>
            <q-btn
              v-if="artikles.length > 1"
              size="sm"
              dense
              color="negative"
              icon="remove"
              label="remove last"
              @click="removeItem"
            />

            <q-space />

            <q-btn size="sm" color="primary" dense icon="add" label="Add item" @click="addItem" />
          </template>

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
      <q-step :disable="nameError != '' || totalError != ''" :name="3" title="who" icon="people" :done="done3">
        <q-select filled v-model="type" :options="types" label="Type" @update:model-value="clear" />

        <q-select
          v-if="type == 'group'"
          filled
          v-model="group"
          :options="groups"
          label="Group"
          @change="onGroupChange"
        />

        <q-select
          v-if="type == 'friend' || type == 'group' && group"
          filled
          v-model="contributor"
          :options="contributors"
          :label="type == 'friend' ? 'Friends (multiple choice)' : 'Group members (multiple choice)'"
          multiple
          emit-value
          @update:model-value="onContributorChange"
          map-options
        />

        <q-list v-if="type != 'personal' && persons.length > 1" class="range" dense>
          <q-item v-for="(person, index) in persons" :key="index">
            <q-item-section avatar>
              <ProfilePicture size="x-small" :pic="person.user.profile_picture" />
              <q-item-label>
                {{ person.user.name }}
              </q-item-label>
              <q-space />
              <q-item-label>{{ pinFormatter(person.amount) }}</q-item-label>
            </q-item-section>
            <q-item-section class="slider">
              <q-slider
                v-model="person.amount"
                @update:model-value="updateAmount(index, $event)"
                :min="0"
                :step="0.01"
                :max="total"
                color="primary"
                track-size="10px"
                thumb-color="primary"
                label
                :label-value="pinFormatter(person.amount)"
                :markers="total / 10"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <q-stepper-navigation>
          <q-btn :disable="type != 'personal' && persons.length < 2" @click="handleForm" color="primary" label="Save" />
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

.range {
  .q-item {
    padding: 0;
    flex-direction: column;
  }
  .q-item__label {
    display: flex;
    flex-direction: row;
  }

  .profile {
    margin-right: 1rem;
  }
  .q-item__section {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
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
