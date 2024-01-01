<script setup>
import { takePicture } from 'src/composables/photo'
import validator from 'src/composables/validator'
import { useConnectionStore } from 'src/stores/connection'
import { useFetchStore } from 'src/stores/fetchData'
import { useGroupStore } from 'src/stores/groups'
import { useReceiptStore } from 'src/stores/receipts'
import { useUserStore } from 'src/stores/user'
import { computed, ref, watch } from 'vue'
import CleanInput from '../atoms/CleanInput.vue'
import ItemList from '../molecules/ItemList.vue'

const name = ref()
const total = ref(0)
const loading = ref(false)
const useConnection = useConnectionStore()
const useUser = useUserStore()
const useGroup = useGroupStore()
const useFetch = useFetchStore()
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

const temp = ref(0)
const types = ['personal', 'friend', 'group']
const pinFormatter = (value) => `€${value}`

const artikles = ref([
  { title: 'example', amount: 3, price: 3.49 },
  { title: 'example', amount: 3, price: 3.49 },
  { title: 'example', amount: 3, price: 3.49 },
  { title: 'example', amount: 3, price: 3.49 },
  { title: 'example', amount: 3, price: 3.49 },
  { title: 'example', amount: 3, price: 3.49 },
  { title: 'example', amount: 3, price: 3.49 },
  { title: 'example', amount: 3, price: 3.49 },
  { title: 'example', amount: 3, price: 3.49 },
  { title: 'example', amount: 3, price: 3.49 },
])

const nameError = computed(() => validator.name(submitted.value, name.value, 'Name', 5))

const take = async () => {
  image.value = await takePicture()
}

const onFriendChange = (e) => {
  friend.value = e.detail.value
}

const onGroupChange = (e) => {
  group.value = e.detail.value
}

const totalError = computed(() => {
  if (step.value >= 3) return validator.number(submitted.value, total.value, 'Total', 0.01, 1000000)
  else return ''
})

const submit = async () => {
  submitted.value = true
  if (!totalError.value) {
    loading.value = true

    const items = withArtikles.value ? artikles.value : null

    //TODO: if online, validate and sync
    const receipt = {
      type: type.value,
      title: name.value,
      description: text.value,
      img_url: image.value,
      total: total.value,
      category: category.value.id,
      items: items,
      created: when.value ? when.value : new Date(),
      friend: friend.value,
      group: group.value,
      created_by: useUser.user.id,
      persons: persons.value,
      synced: false,
    }

    try {
      if (useConnection.isConnected) {
        await useFetch.fetch('/receipts/add', 'post', receipt)
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

watch(artikles, () => {
  // total.value = artikles.reduce((total, object) => total + object.price, 0)
})

const handleForm = async () => {
  submitted.value = true
  if (step.value == 3 && !totalError.value) submit()
  if (step.value == 2) {
    submitted.value = false
    done2.value = true
    step.value++
  }
  if (step.value == 1 && !nameError.value) {
    submitted.value = false
    done1.value = true
    step.value++
  }
}

//WHEN
//WHERE
//WHAT

/*


          

            <h2>Type?</h2>
            <IonRadioGroup v-model="type">
              <IonItem v-for="(X, index) in types" :key="index">
                <IonRadio :value="X" justify="start" label-placement="end">
                  {{ X }}
                </IonRadio>
              </IonItem>
            </IonRadioGroup>

            <div v-if="type == 'friend'">
              <IonSelect
                label="Choose a friend"
                label-placement="floating"
                fill="solid"
                :model-value="friend"
                @ionChange="onFriendChange($event)"
              >
                <IonSelectOption v-for="(type, index) in useUser.friends.friends" :key="index" :value="type">
                  {{ type }}
                </IonSelectOption>
              </IonSelect>
            </div>
            <div v-if="type == 'group'">
              <IonSelect
                label="Choose a group"
                label-placement="floating"
                fill="solid"
                :model-value="type"
                @ionChange="onGroupChange($event)"
              >
                <IonSelectOption v-for="(type, index) in useGroup.groups.groups" :key="index" :value="type">
                  {{ type.name }}
                </IonSelectOption>
              </IonSelect>
            </div>
          </div>

          <div v-if="step == 2">
            <q-uploader
              url="http://localhost:4444/upload"
              label="Upload a image"
              multiple
              accept=".jpg, image/*"
              @rejected="onRejected"
            />

            <q-input v-model="text" label="Note" type="textarea" filled bg-color="white">
              <template v-slot:label>
                Give some more details
                <span class="text-primary">(optional*)</span>
              </template>
            </q-input>

            <q-date v-model="when" :options="noPastDates" />
          </div>

          <div v-if="step == 3">
            <CleanInput
              :error="totalError"
              v-model="total"
              label="Total cost"
              type="number"
              placeholder="The amount of total money spent"
            />

            <div v-if="type == 'friend'">
              <IonRange
                v-if="friend"
                :min="0"
                :max="total"
                :step="0.01"
                :value="total - temp"
                :pin="true"
                @ionChange="temp = $event.detail.value"
                :pin-formatter="pinFormatter"
                label-placement="stacked"
                :label="useUser.user.name + ' €' + (total - temp)"
              ></IonRange>
              <IonRange
                v-if="friend"
                :min="0"
                :max="total"
                :step="0.01"
                :value="temp"
                :pin="true"
                @ionChange="temp = $event.detail.value"
                :pin-formatter="pinFormatter"
                label-placement="stacked"
                :label="friend.name + ' €' + temp"
              ></IonRange>
            </div>

            <IonCheckbox v-model="withArtikles" label-placement="end"> Add purchased items list </IonCheckbox>

            <ItemList v-if="withArtikles" :items="artikles" />
          </div>

          <div class="buttons">
            <q-btn color="negative" v-if="step > 1" @click="step--"> Back </q-btn>
            <q-btn color="primary" @click="handleForm()">
              <p v-if="!loading">{{ step == 3 ? 'Save' : 'Next' }}</p>
              <IonSpinner v-else name="circles" />
            </q-btn>
          </div>



*/
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <section>
        <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated alternative-labels>
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

            <q-stepper-navigation>
              <q-btn
                @click="
                  () => {
                    done1 = true
                    step = 2
                  }
                "
                color="primary"
                label="Continue"
              />
            </q-stepper-navigation>
          </q-step>

          <!-- STEP 2-->
          <q-step :name="2" title="Details" caption="Optional" icon="create_new_folder" :done="done2">
            <q-uploader
              url="http://localhost:4444/upload"
              label="Upload a image"
              multiple
              accept=".jpg, image/*"
              @rejected="onRejected"
            />

            <q-input v-model="text" label="Note" type="textarea" filled>
              <template v-slot:label>
                Give some more details
                <span class="text-primary">(optional*)</span>
              </template>
            </q-input>

            {{ when }}

            <q-btn icon="event" color="primary">
              <q-popup-proxy @before-show="updateProxy">
                <q-date v-model="when" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>

            <q-btn icon="schedule" color="primary">
              <q-popup-proxy @before-show="updateProxy">
                <q-time v-model="when" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Cancel" color="primary" flat v-close-popup />
                    <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-btn>

            <q-stepper-navigation>
              <q-btn @click="step--" color="negative" label="Back" />
              <q-btn @click="handleForm" color="primary" label="Continue" />
            </q-stepper-navigation>
          </q-step>

          <!-- STEP 3-->
          <q-step :name="3" title="3" icon="add_comment" :done="done3">
            <q-markup-table flat square v-if="withArtikles">
              <thead class="bg-primary">
                <tr>
                  <th class="text-left">Item</th>
                  <th class="text-right">price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
                <tr>
                  <td class="text-left">Frozen Yogurt</td>
                  <td class="text-right">159</td>
                  <td class="text-right">6</td>
                </tr>
                <tr>
                  <td class="text-left">Ice cream sandwich</td>
                  <td class="text-right">237</td>
                  <td class="text-right">9</td>
                </tr>
                <tr>
                  <td class="text-left">Eclair</td>
                  <td class="text-right">262</td>
                  <td class="text-right">16</td>
                </tr>
                <tr>
                  <td class="text-left">Cupcake</td>
                  <td class="text-right">305</td>
                  <td class="text-right">3.7</td>
                </tr>
                <tr>
                  <td class="text-left">Gingerbread</td>
                  <td class="text-right">356</td>
                  <td class="text-right">16</td>
                </tr>
              </tbody>
            </q-markup-table>
            <q-input
              v-model="total"
              label="Total cost"
              :disable="withArtikles"
              filled
              square
              type="number"
              placeholder="The amount of total money spent"
              :error-message="nameError"
              :error="submitted && nameError != ''"
            />

            <q-checkbox v-model="withArtikles" label="With items" />

            <q-stepper-navigation>
              <q-btn @click="step = 2" color="negative" label="Back" />
              <q-btn color="primary" @click="handleForm" label="Finish" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </section>
    </IonContent>
  </IonPage>
</template>

<style scoped lang="scss">
.q-stepper {
  min-height: 75vh;
  width: 100%;
}

.q-select {
  margin-bottom: 1rem;
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
  padding: 1rem 0;
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
}
</style>
