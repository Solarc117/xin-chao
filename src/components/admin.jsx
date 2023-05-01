import { useState, useEffect } from 'preact/hooks'
import { useNotifications } from '../context/notification-context'
import Login from './admin/login'
import AdminMenu from './admin/admin-menu'
import Loading from './loading'
import { home1, about8 } from '../assets/images'
import messages from '../data/messages.json'
import '../css/login.css'

const key = 'categories'

/**
 * @param {string} key The key under which the menu is stored.
 * @returns {Promise<boolean>} An indicator of whether the menu is stored.
 */
async function storeMenuIfNotStored(key) {
  if (typeof sessionStorage.getItem(key) === 'string') return true

  try {
    const response = await fetch('/.netlify/functions/menu'),
      result = await response.json()

    if (response.status !== 200) {
      console.error(result?.error || result)
      return false
    }

    sessionStorage.setItem(key, JSON.stringify(result))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * @param {object} props
 * @returns {import('preact').Component}
 */
export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false),
    [menuStored, setMenuStored] = useState(false),
    [loading, setLoading] = useState(true),
    notify = useNotifications()

  useEffect(() => {
    ;(async () => {
      const { status } = await fetch('/.netlify/functions/verify')

      if (status !== 200) return setLoading(false)

      storeMenuIfNotStored(key).then(stored => {
        setMenuStored(stored)
        setLoading(false)
      })
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
    storeMenuIfNotStored(key).then(stored => {
      setMenuStored(stored)
      setLoading(false)
    })
    setAuthenticated(true)
  }

  return (
    <main className={`${authenticated ? 'admin_main' : 'login_main'} main`}>
      <div
        className='background_image opaque'
        style={{ backgroundImage: `url(${authenticated ? about8 : home1})` }}
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
      ) : !menuStored ? (
        <div className='admin_menu_error'>
          Could not fetch menu, please refer to our Google images or call the
          store.
        </div>
      ) : (
        <AdminMenu categories={JSON.parse(sessionStorage.getItem(key))} />
      )}
    </main>
  )
}
