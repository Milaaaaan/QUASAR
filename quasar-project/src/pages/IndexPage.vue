<script setup>
import { useReceiptStore } from 'src/stores/receipts'
import { useUserStore } from 'src/stores/user'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { computed, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { useQuasar } from 'quasar'
import NotificationCard from 'src/components/molecules/NotificationCard.vue'

const $q = useQuasar()
const useReceipt = useReceiptStore()
const useUser = useUserStore()

ChartJS.register(ArcElement, Tooltip, Legend)

const owed = computed(() => {
  const userOwes = {} // Change from array to object
  const receipts = useReceipt.receipts // Add type annotation
  const userId = useUser.user.id // Add type annotation
  if (receipts == null) return null
  receipts.forEach((receipt) => {
    // Add type annotation

    if (receipt.type !== 'personal') {
      receipt.contributors.forEach((contributor) => {
        // Add type annotation
        if (contributor.user_id === userId) {
          const category = useReceipt.category.find((x) => x.id == receipt.category)
          if (!userOwes[category.id]) {
            userOwes[category.id] = {
              // Create an object with desired properties
              id: category.id,
              label: category?.label,
              icon: category?.icon,
              title: category?.title,
              type: category?.type,
            }
            userOwes[category.id].total = 0
          }
          userOwes[category.id].total += contributor.owed // Update the total property
        }
      })
    } else {
      const category = useReceipt.category.find((x) => x.id == receipt.category)
      if (!userOwes[category.id]) {
        userOwes[category.id] = {
          // Create an object with desired properties
          id: category.id,
          label: category?.label,
          icon: category?.icon,
          title: category?.title,
          type: category?.type,
        }
        userOwes[category.id].total = 0
      }
      userOwes[category.id].total += receipt.total // Update the total property
    }
  })

  const sortedOwes = Object.values(userOwes).sort((a, b) => a.id - b.id) // Sort by id

  const total = sortedOwes.reduce((acc, total) => {
    // Add type annotation
    return acc + total
  }, 0)

  return {
    userOwes: sortedOwes,
    total,
  }
})

const typeColors = (type) => {
  switch (type) {
    case 'General':
      return '#3b24ff'
    case 'Food':
      return '#fb3f75'
    case 'Transport':
      return '#f9da13'
    case 'Recreation':
      return '#01c11b'
  }
}

const data = computed(() => {
  const backgroundColors = owed.value.userOwes.map((owe) => typeColors(owe.type))
  const colorCount = {}

  const modifiedBackgroundColors = backgroundColors.map((color) => {
    if (!colorCount[color]) {
      colorCount[color] = 1
    } else {
      colorCount[color]++
    }

    const opacity = colorCount[color] / backgroundColors.filter((c) => c === color).length
    const modifiedColor = `${color}${Math.round(opacity * 255).toString(16)}`

    return modifiedColor
  })

  return {
    labels: owed.value.userOwes.map((owe) => owe.label),
    datasets: [
      {
        backgroundColor: modifiedBackgroundColors,
        data: owed.value.userOwes.map((owe) => owe.total),
        borderColor: 'transparent',
      },
    ],
  }
})

const options = computed(() => {
  return {
    plugins: {
      legend: {
        labels: {
          color: $q.dark.isActive ? 'white' : 'black', // Change this to the color you want
        },
      },
    },
  }
})
onMounted(() => {
  if (useReceipt.receipts == null) useReceipt.sync()
})
</script>

<template>
  <q-page>
    <section v-if="useReceipt.receipts && owed.userOwes && useReceipt.category">
      <Pie :data="data" :options="options" />
    </section>

    <q-separator spaced inset vertical dark />

    <section>
      <NotificationCard :notifies="useUser.notifications" />
    </section>
  </q-page>
</template>

<style scoped lang="scss">
.q-separator {
  width: calc(100% - 1rem);
  margin: 1rem auto;
  height: 1px;
}

section {
  display: flex;
  flex-direction: column;
  max-width: 25rem;
  margin: 1rem auto;
  align-items: center;
}
</style>
