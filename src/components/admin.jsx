import { useState, useEffect } from 'preact/hooks'
import messages from '../data/messages.json'
import Login from './admin/login'
import AdminMenu from './admin/admin-menu'

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await fetch('/.netlify/functions/verify')

      if (status === 200) setAuthenticated(true)
    })()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target),
      username = formData.get('username'),
      password = formData.get('password'),
      { status } = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })

    if (status === 200) return setAuthenticated(true)

    alert('Incorrect credentials, please try again')
  }

  return (
    <main className='admin_main main'>
      {/* {authenticated ? (
        <div>Authenticated!</div>
      ) : (
        <form className='login_form' onSubmit={handleSubmit}>
          <label className='user_label'>
            Username:
            <br />
            <input
              type='text'
              className='user_input'
              name='username'
              required
            />
          </label>
          <label className='password_label'>
            Password:
            <br />
            <input
              type='password'
              className='password_input'
              name='password'
              required
            />
          </label>
          <button type='submit' className='login_button'>
            Login
          </button>
        </form>
      )} */}
    </main>
  )
}
