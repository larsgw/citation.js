const monthMap = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12
}

const getMonth = monthName => monthMap[monthName.toLowerCase().slice(0, 3)]

const parseEpoch = function (date) {
  if (typeof date === 'number') {
    date = new Date(date)
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  } else {
    return null
  }
}

const parseIso8601 = function (date) {
  const pattern = /^(\d{4}|[-+]\d{6,})-(\d{2})-(\d{2})/

  if (typeof date !== 'string' || !pattern.test(date)) {
    return null
  }

  let [, year, month, day] = date.match(pattern)

  if (!+month) {
    return [year]
  } else if (!+day) {
    return [year, month]
  } else {
    return [year, month, day]
  }
}

const parseRfc2822 = function (date) {
  const pattern = /^(?:[a-z]{3},\s*)?(\d{1,2}) ([a-z]{3}) (\d{4,})/i

  if (typeof date !== 'string' || !pattern.test(date)) {
    return null
  }

  let [, day, month, year] = date.match(pattern)
  month = getMonth(month)

  return [year, month, day]
}

const parseDay = function (date) {
  const pattern = /^(\d+)[ .\-/](\d{1,2}|[a-z]{3,10})[ .\-/](\d{1,2})/
  const reversePattern = /^(\d{1,2})[ .\-/](\d{1,2}|[a-z]{3,10})[ .\-/](\d+)/

  let year
  let month
  let day

  if (typeof date !== 'string') {
    return null
  } else if (pattern.test(date)) {
    [, year, month, day] = date.match(pattern)
  } else if (reversePattern.test(date)) {
    [, day, month, year] = date.match(reversePattern)
  } else {
    return null
  }

  if (getMonth(month)) {
    month = getMonth(month)
  } else if (isNaN(month)) {
    return null
  }

  return [year, month, day]
}

const parseMonth = function (date) {
  if (typeof date === 'string' && /^([a-z]{3,10}|-?\d{2,})\W+([a-z]{3,10}|-?\d{2,})$/.test(date)) {
    let values = date.split(/\W+/)

    let month
    if (getMonth(values[1])) {
      month = getMonth(values.pop())
    } else if (getMonth(values[0])) {
      month = getMonth(values.shift())
    } else if (values.some(isNaN)) {
      return null
    } else if (values[0] > values[1]) {
      month = values.pop()
    } else {
      month = values.shift()
    }

    let year = values.pop()

    return [year, month]
  } else {
    return null
  }
}

const parseYear = function (date) {
  if (typeof date === 'string' && /^-?\d{4,}$/.test(date)) {
    return [date]
  } else if (typeof date === 'number') {
    return [date]
  } else {
    return null
  }
}

/**
 * Convert epoch to CSL date
 *
 * @access protected
 * @memberof Cite.parse
 *
 * @param {Number|String} value - Epoch time or string in format "YYYY-MM-DD"
 *
 * @return {Object} Object with property "date-parts" with the value [[ YYYY, MM, DD ]]
 */
const parseDate = function (value) {
  let dateParts = parseEpoch(value) ||
                  parseIso8601(value) ||
                  parseRfc2822(value) ||
                  parseDay(value) ||
                  parseMonth(value) ||
                  parseYear(value)

  if (dateParts) {
    dateParts = dateParts.map(string => parseInt(string))
    return {'date-parts': [dateParts]}
  } else {
    return {raw: value}
  }
}

export const scope = '@date'
export const types = '@date'
export {
  parseDate as parse,
  parseDate as default
}
