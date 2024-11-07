// caculate number of booking days
/**
 * @param {string} dateRange 
 */
export function calculateDaysBetween(dateRange) {
  const [start, end] = dateRange.match(/\d{2}\/\d{2}\/\d{4}/g)

  const startDate = new Date(start.split('/').reverse().join('-'))
  const endDate = new Date(end.split('/').reverse().join('-'))

  const timeDiff = endDate - startDate
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24)

  return daysDiff + 1
}

