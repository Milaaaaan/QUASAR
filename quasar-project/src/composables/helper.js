import moment from 'moment'
import 'moment/locale/nl'

function formatPrice(price) {
  // Round the price to two decimal places
  const roundedPrice = Math.round(price * 100) / 100

  // Use Intl.NumberFormat to format the price as currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  // Format and return the price
  return formatter.format(roundedPrice)
}

function formDataToObject(formData) {
  let object = {}
  for (let pair of formData.entries()) {
    if (object[pair[0]]) {
      if (!Array.isArray(object[pair[0]])) {
        object[pair[0]] = [object[pair[0]]]
      }
      object[pair[0]].push(pair[1])
    } else {
      object[pair[0]] = pair[1]
    }
  }
  return object
}

function dateDifferenceInDays(date1, date2) {
  // Parse the dates into JavaScript Date objects
  const startDate = new Date(date1)
  const endDate = new Date(date2)

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = endDate - startDate

  // Convert milliseconds to days
  const daysDifference = differenceInMilliseconds / (1000 * 60 * 60 * 24)

  // Round the result to get an integer value of days
  return Math.round(daysDifference + 1)
}

const clean = (date) => {
  return moment(date).format('YYYY-MM-DD')
}

const cleanEU = (date) => {
  return moment(date).format('D MMM YYYY')
}

const cleanTime = (date) => {
  if (moment(date).year() == moment(Date.now()).year()) return moment(date).format('D MMM HH:mm')
  else return moment(date).format('D MMM YYYY HH:mm')
}

const cleanPeriod = (date, date2) => {
  if (moment(date).year() == moment(date2).year() && moment(date).year() == moment(new Date()).year())
    return moment(date).format('D MMM') + ' - ' + moment(date2).format('D MMM')
  else return moment(date).format('D MMM YYYY') + ' - ' + moment(date2).format('D MMM YYYY')
}

const getContribrutors = (receipt, user, members) => {
  if (receipt.contributors && receipt.contributors.length > 1) {
    let arr = []
    receipt.contributors.forEach((element) => {
      let contributor = null
      if (user.id == element.id) contributor = user
      else contributor = members.filter((x) => x.id == element.id)[0]
      const combinedData = {
        ...contributor,
        owed: element.pivot.owed,
        receipt_id: element.receipt_id,
        created_at: element.created_at,
        updated_at: element.updated_at,
      }
      arr.push(combinedData)
    })
    return arr
  } else return [{ ...user, owed: receipt.total }]
}

const getTimeAgo = (dateTimeString) => {
  const date = new Date(dateTimeString)
  const now = new Date()
  const diffInMillis = now - date
  const seconds = Math.floor(diffInMillis / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return days === 1 ? '1 dag geleden' : `${days} dagen geleden`
  } else if (hours > 0) {
    return hours === 1 ? '1 uur geleden' : `${hours} uren geleden`
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minuut geleden' : `${minutes} minuten geleden`
  } else {
    return 'Zojuist'
  }
}

export default {
  formatPrice,
  clean,
  getContribrutors,
  cleanEU,
  dateDifferenceInDays,
  cleanPeriod,
  cleanTime,
  getTimeAgo,
  formDataToObject,
}
