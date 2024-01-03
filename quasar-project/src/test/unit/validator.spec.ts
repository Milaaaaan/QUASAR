import validator from 'src/composables/validator'

describe('Validation Utils', () => {
  describe('name', () => {
    it('invalid name', () => {
      const result = validator.name(true, 'short', 'Name', 10)
      expect(result).toBe('Name must contain at least 10 characters.')
    })

    it('empty required name', () => {
      const result = validator.name(true, '', 'Name', 10, true)
      expect(result).toBe('Name is a required field.')
    })

    it('should return an empty string for valid name', () => {
      const result = validator.name(true, 'validName', 'Name', 5)
      expect(result).toBe('')
    })
  })

  describe('number', () => {
    it('invalid number', () => {
      const result = validator.number(true, 5, 'Number', 10, 20)
      expect(result).toBe('Number must be at least 10.')
    })

    it('empty required number', () => {
      const result = validator.number(true, null, 'Number', 10, 20, true)
      expect(result).toBe('Number is a required field.')
    })

    it('should return an empty string for valid number', () => {
      const result = validator.number(true, 15, 'Number', 10, 20)
      expect(result).toBe('')
    })
  })

  describe('email', () => {
    it('invalid email', () => {
      const result = validator.email(true, 'invalidEmail')
      expect(result).toBe('Email is not valid')
    })

    it('empty required email', () => {
      const result = validator.email(true, '', true)
      expect(result).toBe('Email is a required field.')
    })

    it('should return an empty string for valid email', () => {
      const result = validator.email(true, 'valid@example.com')
      expect(result).toBe('')
    })
  })

  describe('password', () => {
    it('empty password', () => {
      const result = validator.password(true, '', '')
      expect(result).toBe('Password cannot be left empty')
    })

    it('password with less than 7 characters', () => {
      const result = validator.password(true, 'weak', 'weak')
      expect(result).toBe('Password must contain at least 7 characters.')
    })

    it('password without special characters', () => {
      const result = validator.password(true, 'noSpecialChars', 'noSpecialChars')
      expect(result).toBe('Password must contain at least one of the following special characters: @$!%*#?&')
    })

    it('password with invalid characters', () => {
      const result = validator.password(true, 'InvalidPassword£@', 'InvalidPassword£@')
      expect(result).toBe('Password can only contain letters, numbers, and the following special characters: @$!%*#?&')
    })

    it('password without uppercase, lowercase, and digit', () => {
      const result = validator.password(true, 'noUppercaseLowercaseDigit', 'noUppercaseLowercaseDigit')
      expect(result).toBe('Password must contain at least one of the following special characters: @$!%*#?&')
    })

    it('non-matching passwords', () => {
      const result = validator.password(true, 'strongPassword123!', 'notMatching')
      expect(result).toBe('Passwords do not match')
    })

    it('should return an empty string for valid password', () => {
      const result = validator.password(true, 'StrongPassword123!', 'StrongPassword123!')
      expect(result).toBe('')
    })
  })

  describe('file', () => {
    test('valid file extension', () => {
      const result = validator.file(true, ['jpg', 'png', 'gif'], 'data:image/jpg;base64,/9j/4AAQSkZJRgABA')

      expect(result).toBe('')
    })

    test('invalid file extension', () => {
      const result = validator.file(true, ['jpg', 'png', 'gif'], 'data:document/pdf;base64,/9j/4AAQSkZJRgABA')

      expect(result).toBe('Invalid file extension. Accepted extensions are: jpg, png, gif')
    })

    test('not required empty file', () => {
      const result = validator.file(true, ['jpg', 'png', 'gif'], '', false)

      expect(result).toBe('')
    })

    test('required empty file', () => {
      const result = validator.file(true, ['jpg', 'png', 'gif'], '')

      expect(result).toBe('File is a required field.')
    })
  })
})
