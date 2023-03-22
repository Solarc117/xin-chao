const query = document.querySelector.bind(document),
  adminForm = query('#admin_form')

class Authenticator {
  /**
   * @param {FormDataEvent} event
   */
  static async authenticate(event) {
    event.preventDefault()

    const body = {}
    for (const [key, value] of new FormData(query('#admin_form')))
      body[key] = value

    const response = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
      data = await response.json()

    if (data.error) {
      
    }
    // Username will likely be an unnecessary property to keep; will decide later.
    const { username, token } = data
  }
}

adminForm.addEventListener('submit', Authenticator.authenticate)
