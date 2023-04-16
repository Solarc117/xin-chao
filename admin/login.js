import messages from '../messages.json'

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

    window.location.replace(`${window.location.origin}/admin/home/`)
  }
}

adminForm.addEventListener('submit', event => {
  const randomMessage = messages[Math.floor(Math.random() * messages.length)]
  notify(randomMessage)
  Authenticator.authenticate(event)
})
