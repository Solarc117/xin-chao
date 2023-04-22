import { lightLogo, lightMail, lightPhone, lightPin } from '../assets/svgs'

export default function Footer() {
  return (
    <footer className='footer'>
      <a className='footer_number' href='tel:403-590-9999'>
        <img
          className='footer_number_logo footer_logo'
          src={lightPhone}
          alt='Phone:'
        />
        +1 (403) 590-9999
      </a>
      <a className='footer_mail' href='mailto:xinchaocoffee2021@gmail.com'>
        <img
          className='footer_mail_logo footer_logo'
          src={lightMail}
          alt='Mail:'
        />
        xinchaocoffee2021@gmail.com
      </a>
      <a
        className='footer_address'
        href='https://www.google.com/maps/place/Xin+Chao+Coffee/@51.0722422,-113.9994201,15z/data=!3m1!4b1!4m6!3m5!1s0x537165602883026b:0x3901ffcab12145a8!8m2!3d51.0722427!4d-113.9891204!16s%2Fg%2F11swpjbvrm'
        target='_blank'
        rel='noreferrer'
      >
        <img
          className='footer_address_logo address_logo'
          src={lightPin}
          alt='Location Pin'
        />
        2255 32 St NE Unit 3110,
        <br /> Calgary, AB T1Y 6E8
      </a>
      <img
        className='footer_main_logo footer_logo'
        src={lightLogo}
        alt='Xin Chao Logo'
      />
    </footer>
  )
}
