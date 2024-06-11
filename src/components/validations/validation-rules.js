import moment from 'moment'

function checkEmail(value) {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
}

function checkNumberPositive(value) {
  return /^\+?([1-9]\d*)$/.test(value)
}

function checkUrl(value) {
  return /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(value)
}

function checkMinLength(value, param) {
  if (value.length >= param) {
    return true
  }
  return false
}

function checkMinLengthOpt(value, param) {
  if (value.length === 0 || value.length >= param) {
    return true
  }
  return false
}

function checkMinValue(value, param) {
  try {
    parseFloat(value)
  } catch (e) {
    return false
  }
  if (parseFloat(value) >= param) {
    return true
  }
  return false
}

function checkMaxValue(value, param) {
  try {
    parseFloat(value)
  } catch (e) {
    return false
  }
  if (parseFloat(value) <= param) {
    return true
  }
  return false
}

function checkDuplicate(value, param) {
  if (value !== param) {
    return true
  }
  return false
}

function checkBeforeDate(value, toDate, format) {
  try {
    const selectedDate = value ? moment(value, format) : null
    if (!selectedDate || selectedDate.isBefore(toDate)) {
      return true
    }
  } catch (e) {
    return false
  }
  return false
}

function checkDateFormat(value, format) {
  let isValid = true
  if (value !== '') {
    const dates = value.split('-')
    dates.map((date) => {
      const formatedDate = date.trim()
      try {
        isValid = isValid && moment(formatedDate, format, true).isValid()
      // return isValid
      } catch (e) {
        return false
      }
    })
  }
  return isValid
}

function isRangeValid(value, from, to, format) {
  let isValid = true
  const dates = []
  if (value !== '') {
    const rangeDates = value.split('-')
    rangeDates.map((rangeDate) => {
      const date = rangeDate.trim()
      const formatedDate = moment(date, format)
      dates.push(formatedDate)
    })
    isValid = dates.length <= 2
    if (isValid) {
      isValid = dates[0].isAfter(from) && dates.length === 2 ? dates[1].isBefore(to) && dates[0].isBefore(dates[1]) : dates[0].isBefore(to)
    }
  }
  return isValid
}

function checkAfterDate(value, fromDate, format) {
  try {
    const selectedDate = value ? moment(value, format) : null
    if (!selectedDate || selectedDate.isAfter(fromDate)) {
      return true
    }
  } catch (e) {
    return false
  }
  return false
}

function checkBetweenDate(value, fromDate, toDate, format) {
  try {
    const selectedDate = value ? moment(value, format) : null
    if (!selectedDate || (fromDate && toDate
      && selectedDate.isAfter(fromDate) && selectedDate.isBefore(toDate))) {
      return true
    }
  } catch (e) {
    return false
  }
  return false
}

function checkMaxLength(value, param) {
  if (value.length <= param) {
    return true
  }
  return false
}

function checkMaxLengthOpt(value, param) {
  if (value.length === 0 || value.length <= param) {
    return true
  }
  return false
}

function checkExactLength(value, param) {
  if (value.length === param) {
    return true
  }
  return false
}

function checkExactLengthOpt(value, param) {
  if (value.length === 0 || value.length === param) {
    return true
  }
  return false
}

function checkRelMatch(value, compareTo) {
  if (value === compareTo) {
    return true
  }
  return false
}

function positiveNumberWithLimit(value, limit) {
  if (parseInt(value, 10) <= parseInt(limit, 10) && this.checkNumberPositive(value)) {
    return true
  }
  return false
}

function isEmpty(value) {
  return value == ''
}

function customValidation(value, regex) {
  const pattern = new RegExp(regex)
  return pattern.test(value)
}

export function callValidateRules(value, validator) {
  switch (validator.type) {
    case 'email':
      return checkEmail(value)
    case 'emailOpt':
      return value === '' || checkEmail(value)
    case 'required':
      return !(value == '')
    case 'onlyPositiveNumbers':
      return checkNumberPositive(value)
    case 'url':
      return checkUrl(value)
    case 'minLength':
      return checkMinLength(value, validator.minLength ? validator.minLength : 6)
    case 'minLengthOpt':
      return checkMinLengthOpt(value, validator.minLength ? validator.minLength : 6)
    case 'maxLength':
      return checkMaxLength(value, validator.maxLength ? validator.maxLength : 8)
    case 'maxLengthOpt':
      return checkMaxLengthOpt(value, validator.maxLength ? validator.maxLength : 6)
    case 'minValue':
      return checkMinValue(value, validator.minValue ? validator.minValue : 0)
    case 'maxValue':
      return checkMaxValue(value, validator.maxValue ? validator.maxValue : 100)
    case 'exactLength':
      return checkExactLength(value, validator.length ? validator.length : 6)
    case 'exactLengthOpt':
      return checkExactLengthOpt(value, validator.length ? validator.length : 6)
    case 'relMatch':
      return checkRelMatch(value && value.toLowerCase(), validator.relValue && validator.relValue.toLowerCase())
    case 'duplicate':
      return checkDuplicate(value, validator.relValue)
    case 'isBefore':
      return checkBeforeDate(value, validator.to ? validator.to : moment(), validator.format ? validator.format : 'DD/MM/YYYY')
    case 'isAfter':
      return checkAfterDate(value, validator.from ? validator.from : moment(), validator.format ? validator.format : 'DD/MM/YYYY')
    case 'dateFormat':
      return checkDateFormat(value, validator.format ? validator.format : 'DD/MM/YYYY')
    case 'isRangeValid':
      return isRangeValid(value, validator.from ? validator.from : moment(), validator.to ? validator.to : moment(), validator.format ? validator.format : 'DD/MM/YYYY')
    case 'isBetween':
      return checkBetweenDate(value, validator.from, validator.to, validator.format ? validator.format : 'DD/MM/YYYY')
    case 'positiveNumberWithLimit':
      return positiveNumberWithLimit(value, validator.limitNumber || 1)
    case 'custom':
      return customValidation(value, validator.pattern)
  }
}


export function callValidateRulesWithProps(value, type, props) {
  switch (type) {
    case 'email':
      return checkEmail(value)
    case 'required':
      return !(value == '')
    case 'onlyPositiveNumbers':
      return checkNumberPositive(value)
    case 'url':
      return checkUrl(value)
    case 'password':
      return checkMinLength(value, props.passwordMinLength ? props.passwordMinLength : 6)
    case 're_password':
      return checkRePassword(value, props.relValue)
    case 'positiveNumberWithLimit':
      return positiveNumberWithLimit(value, props.limitNumber || 1)
    case 'custom':
      return customValidation(value, props.validatePattern)
  }
}

// module.exports = {
//   isEmpty,
//   checkEmail,
//   checkNumberPositive,
//   checkUrl,
//   checkPassword,
//   checkRePassword,
//   positiveNumberWithLimit,
//   customValidation
// }
