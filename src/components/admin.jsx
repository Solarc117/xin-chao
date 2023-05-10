import { useState, useEffect } from 'preact/hooks'
import { useMenu } from '../context/client-context'
import { useNotifications } from '../context/notification-context'
import Login from './admin/login'
import AdminMenu from './admin/admin-menu'
import Loading from './loading'
import { home1 } from '../assets/images'
import '../css/login.css'

/**
 * @returns {import('preact').Component}
 */
export default function Admin() {
  const [categories] = useMenu(),
    [authenticated, setAuthenticated] = useState(false),
    [loading, setLoading] = useState(true),
    notify = useNotifications()

  useEffect(() => {
    ;(async () => {
      let status
      try {
        status = (await fetch('/.netlify/functions/verify')).status
      } catch (error) {
        setLoading(false)
        return console.error(error)
      }

      if (status !== 200) return setLoading(false)

      setLoading(false)
      setAuthenticated(true)
    })()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.target),
      username = formData.get('username'),
      password = formData.get('password')
    let status

    try {
      const response = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })

      status = response.status
    } catch (error) {
      setLoading(false)
      console.error(error)
      return notify('❌ Something went wrong, please try again later', 'error')
    }

    if (status !== 200) {
      setLoading(false)
      return notify('🔒 Incorrect credentials, please try again')
    }

    notify('🔓 Authenticated!')
    setLoading(false)
    setAuthenticated(true)
  }

  return (
    <main className={`${authenticated ? 'admin_main' : 'login_main'} main`}>
      <div
        className='background_image opaque'
        style={authenticated ? { background: 'black' } : { backgroundImage: `url(${home1})` }}
      />
      {loading && <Loading />}
      {!authenticated ? (
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
      ) : Array.isArray(categories) ? (
        <AdminMenu categories={categories} />
      ) : (
        <div className='admin_menu_error'>
          Could not fetch menu, please refer to our Google images or call the
          store.
        </div>
      )}
    </main>
  )
}
