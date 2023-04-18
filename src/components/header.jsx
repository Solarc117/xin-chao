import Router from 'preact-router'
import logo from '../assets/svgs/light-logo.svg'
import bars from '../assets/svgs/bars.svg'

export default function Header() {
  return (
    <header class='header'>
      <div class='logo_section'>
        <a class='logo_link' href='/'>
          <img src={logo} alt='Xin ChÃo logo' class='logo_svg' />
        </a>
      </div>
      <div class='title_section'>
        <h1 class='title'>Xin ChÃo</h1>
        &nbsp;
        <p class='title_coffee'>COFFEE</p>
      </div>
      <div class='nav_section'>
        <img src={bars} alt='Browse' class='bars' />
      </div>
    </header>
  )
}
