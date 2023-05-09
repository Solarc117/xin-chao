import Footer from './footer'
import { store } from '../assets/images'
import '../css/contact.css'

export default function Contact() {
  return (
    <main className='contact_main main'>
      <div
        className='contact_background background_image opaque'
        style={{
          background: `linear-gradient(to right, hsla(0, 0%, 0%, 0.6), hsla(38, 89%, 49%, 0.2)), url(${store})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className='content'>
        <p>
          Email:&nbsp;
          <a className='email link' href='mailto:xinchaocoffee2021@gmail.com'>
            xinchaocoffee2021@gmail.com
          </a>
          <br />
          <br />
          Phone:&nbsp;
          <a className='phone_number link' href='tel:403-590-9999'>
            +1 (403) 590-9999
          </a>
          <br />
          <br />
          Find us at: 2255 32 St NE Unit 3110, Calgary, AB T1Y 6E8
        </p>
        <iframe
          class='map'
          loading='lazy'
          allowfullscreen
          referrerpolicy='no-referrer-when-downgrade'
          src='https://www.google.com/maps/embed/v1/place?key=AIzaSyACH4gzkvAoGmlWtjhlFGexBndnTfPgNmw&q=2255+32+St+NE+Unit+3110,+Calgary,+AB+T1Y+6E8'
        ></iframe>
      </div>
      <Footer />
    </main>
  )
}
