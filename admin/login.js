const query = document.querySelector.bind(document),
  adminForm = query('#admin_form')

class Authenticator {
  /**
   * @param {FormDataEvent} event
   */
  static async authenticate(event) {
    event.preventDefault()

    const formInputs = {}
    for (const [key, value] of new FormData(query('#admin_form')))
      formInputs[key] = value

    const response = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        body: JSON.stringify(formInputs),
      })
      console.log('response:', response)
      const data = await response.json(),
      { clientError, serverError } = data

      console.log('data:', data)

    if (clientError) return notify('❌ Incorrect username or password')
    if (serverError)
      return notify('❌ Something went wrong, please try again later')
    if (response.status === 200)
      window.location.replace(`${window.location.origin}/admin/home/home.html`)
  }
}

adminForm.addEventListener('submit', Authenticator.authenticate)
