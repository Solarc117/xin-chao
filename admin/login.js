const query = document.querySelector.bind(document),
  adminForm = query('#admin_form')

class Authenticator {
  /**
   * @param {FormDataEvent} event
   */
  static async authenticate(event) {
    event.preventDefault()

    const formInputs = {}
    for (const [key, value] of new FormData(adminForm)) formInputs[key] = value

    const { status } = await fetch('/.netlify/functions/auth', {
      method: 'POST',
      body: JSON.stringify(formInputs),
    })

    if (status === 401 || status === 403)
      return notify('🔒 Incorrect username or password')

    if (status !== 200) {
      console.error(data)
      return notify('🤔 Something went wrong, please try again later')
    }

    window.location.replace(`${window.location.origin}/admin/home/home.html`)
  }
}

adminForm.addEventListener('submit', event => {
  notify('🥚 prepping your egg coffee...')
  Authenticator.authenticate(event)
})
