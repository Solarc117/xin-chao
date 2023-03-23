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
      { error, username, token } = await response.json()

    if (error) return alert('Incorrect username or password')

    // Username will likely be an unnecessary property to keep; will decide later.
    document.cookie = `jwt=${token}; secure; httpOnly; sameSite=Lax`
  }
}

adminForm.addEventListener('submit', Authenticator.authenticate)
