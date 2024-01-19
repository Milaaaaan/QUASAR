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
  const userOwes = {}
  const receipts = useReceipt.receipts
  const userId = useUser.user.id
  if (receipts == null) return null
  receipts.forEach((receipt) => {
    if (receipt.type !== 'personal') {
      receipt.contributors.forEach((contributor) => {
        if (contributor.id === userId) {
          const category = useReceipt.category.find((x) => x.id == receipt.category)
          if (!userOwes[category.id]) {
            userOwes[category.id] = {
              id: category.id,
              label: category?.label,
              icon: category?.icon,
              title: category?.title,
              type: category?.type,
            }
            userOwes[category.id].total = 0
          }
          userOwes[category.id].total += contributor.pivot.owed
        }
      })
    } else {
      const category = useReceipt.category.find((x) => x.id == receipt.category)
      if (!userOwes[category.id]) {
        userOwes[category.id] = {
          id: category.id,
          label: category?.label,
          icon: category?.icon,
          title: category?.title,
          type: category?.type,
        }
        userOwes[category.id].total = 0
      }
      userOwes[category.id].total += receipt.total
    }
  })

  const sortedOwes = Object.values(userOwes).sort((a, b) => a.id - b.id) // Sort by id

  const total = sortedOwes.reduce((acc, total) => {
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
  if (owed.value == null) return null
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
onMounted(async () => {
  if (useReceipt.receipts == null) await useReceipt.sync()
  if (useUser.notifications == null) await useUser.sync()
})
</script>

<template>
  <q-page>
    <section class="pie">
      <Pie v-if="data && data.datasets[0].data.length > 0 && owed" :data="data" :options="options" />
      <div v-else-if="data && data.datasets[0].data.length == 0">
        <h3>No activity yet</h3>
        <q-btn color="primary" icon="add" label="Make receipt" to="/create/bill" />
      </div>
      <q-skeleton v-else class="canvas" type="QAvatar" />
    </section>
    <q-separator spaced inset vertical dark />

    <section>
      <NotificationCard :skeleton="useUser.notifications == null" :notifies="useUser.notifications" />
    </section>
  </q-page>
</template>

<style scoped lang="scss">
.q-separator {
  width: calc(100% - 1rem);
  margin: 1rem auto;
  height: 1px;
}

section.pie {
  display: flex;
  flex-direction: column;

  max-width: 25rem;
  margin: 1rem auto;
  padding: 0 1rem;
  align-items: center;

  canvas,
  .canvas {
    width: 35vh !important;
    height: 35vh !important;
    max-width: 25rem;
    max-height: 25rem;
  }

  .canvas {
    width: 30vh !important;
    height: 30vh !important;
    max-width: 25rem;
    max-height: 25rem;
  }
}
</style>
