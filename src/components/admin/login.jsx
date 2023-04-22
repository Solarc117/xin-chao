export default function Login() {
  return (
    <main className='login_main main'>
      <form className='login_form'>
        <label className='user_label'>
          Username:
          <br />
          <input type='text' className='user_input' name='username' required />
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
    </main>
  )
}
