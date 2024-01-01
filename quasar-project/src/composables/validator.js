const name = (submitted, value, label, length, required = true) => {
  if (submitted) {
    if (value) {
      if (value.length <= length) return `${label} must contain at least ${length} characters.`
    } else if (required) return `${label} is a required field.`
  }
  return ''
}

const number = (submitted, value, label, min, max, required = true) => {
  if (submitted) {
    if (value) {
      if (value < min && required) return `${label} must be at least ${min}.`
      if (value > max && required) return `${label} must be less than ${max}`
    } else if (required) return `${label} is a required field.`
  }
  return ''
}

const email = (submitted, value, required = true) => {
  if (submitted) {
    if (value) {
      if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) return 'Email is not valid'
    } else if (required) return 'Email is a required field.'
  }
  return ''
}

const password = (submitted, value, value_repeat) => {
  if (submitted) {
    if (value === '') return 'Password cannot be left empty'
    if (value.length < 7) return 'Password must contain at least 7 characters.'

    const specialCharactersRegex = /[@$!%*#?&]/
    if (!specialCharactersRegex.test(value)) {
      return 'Password must contain at least one of the following special characters: @$!%*#?&'
    }

    if (!/^[a-zA-Z0-9@$!%*#?&]+$/.test(value)) {
      return 'Password can only contain letterss, and the following special characters: @$!%*#?&'
    }

    if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)) {
      return 'Password must have at least one uppercase letter, one lowercase letter, and one digit.'
    }

    if (value !== value_repeat) return 'Passwords do not match'
  }
  return ''
}

const file = (submitted, acceptedExtensions, required = true) => {
  if (submitted) {
    if (value) {
      const matches = value.match(/^data:image\/([a-zA-Z+]+);base64,/)
      if (!matches) {
        return `Invalid file extension. Accepted extensions are: ${acceptedExtensions.join(', ')}`
      }

      const fileExtension = `${matches[1].toLowerCase()}`

      if (!acceptedExtensions.includes(fileExtension)) {
        return `Invalid file extension. Accepted extensions are: ${acceptedExtensions.join(', ')}`
      }
    } else if (required) {
      return 'File is a required field.'
    }
  }
  return ''
}

export default { name, email, password, file }
