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
      }),
      { clientError, serverError } = await response.json()

    if (clientError) return alert('Incorrect username or password')
    if (serverError)
      return alert('Something went wrong, please try again later')
  }
}

adminForm.addEventListener('submit', Authenticator.authenticate)
