export const emailRules = [
  (value) => !!value || 'Required.',
  (value) => (value || '').length <= 30 || 'Max 30 characters',
  (value) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  }
]
export const nameRules = [
  (value) => !!value || 'Required.',
  (value) => (value || '').length >= 2 || 'Min 2 characters'
]
export const dateRules = []
export default { emailRules, dateRules, nameRules }
