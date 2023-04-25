import { useState, useEffect } from 'preact/hooks'
import Login from './admin/login'
import AdminMenu from './admin/admin-menu'
import { home1, about8 } from '../assets/images'
import messages from '../data/messages.json'
import '../css/login.css'

const key = 'categories'

/**
 * @param {string} key The key under which the menu is stored.
 * @returns {boolean} An indicator of whether the menu is stored.
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
    [menuStored, setMenuStored] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await fetch('/.netlify/functions/verify')

      if (status !== 200) return

      setAuthenticated(true)
      setMenuStored(await storeMenuIfNotStored(key))
    })()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

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
      console.error(error)
      return alert('something went wrong, please try again later')
    }

    if (status !== 200) return alert('Incorrect credentials, please try again')

    setAuthenticated(true)
    setMenuStored(await storeMenuIfNotStored(key))
  }

  return (
    <main className={`${authenticated ? 'admin_main' : 'login_main'} main`}>
      <div
        className='background_image opaque'
        style={{ backgroundImage: `url(${authenticated ? about8 : home1})` }}
      />
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
