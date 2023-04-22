import messages from '../data/messages.json'
import Login from './admin/login'
import AdminMenu from './admin/admin-menu'

const form = 

export default function Admin() {
  async function verify() {
    const { status } = await fetch('/.netlify/functions/verify')
    // event.preventDefault()

    // const formInputs = {}
    // for (const [key, value] of new FormData(adminForm)) formInputs[key] = value

    // const { status } = await fetch('/.netlify/functions/auth', {
    //   method: 'POST',
    //   body: JSON.stringify(formInputs),
    // })

    // if (status === 401 || status === 403)
    //   return notify('❌ Incorrect username or password')

    // if (status !== 200) {
    //   console.error(data)
    //   return notify('❌ Something went wrong, please try again later')
    // }

    // window.location.replace(`${window.location.origin}/admin/home/`)
  }

  return <main className='login_main main'></main>
}
