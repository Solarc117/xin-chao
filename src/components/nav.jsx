import { useState } from 'preact/hooks'
import { face, insta } from '../assets/svgs'

export default function Nav({ showNav, toggleSnippets }) {
  
  // function showNav() {
  //   navLinks.classList.remove('hide')
  //   navLinks.classList.add('show')
  //   gradientContainer.classList.add('dark')
  //   for (const node of queryAll('.nav_a')) node.removeAttribute('tabindex')
  // }
  // function hideNav() {
  //   if (
  //     !navLinks.classList.contains('show') &&
  //     !navLinks.classList.contains('hide')
  //   )
  //     return
  //   navLinks.classList.remove('show')
  //   navLinks.classList.add('hide')
  //   gradientContainer.classList.remove('dark')
  //   for (const node of queryAll('.nav_a')) node.setAttribute('tabindex', -1)
  // }

  return (
    <nav
      class={`nav_links ${
        showNav === true ? 'show' : showNav === false ? 'hide' : ''
      }`}
    >
      <ul class='nav_links_ul'>
        <li class='page'>
          <a
            class='page_link nav_a'
            href='/about'
            tabindex={showNav === true ? '1' : '-1'}
          >
            About
          </a>
        </li>
        <li class='page'>
          <a
            class='page_link nav_a'
            href='/contact'
            tabindex={showNav === true ? '1' : '-1'}
          >
            Contact
          </a>
        </li>
        <li class='page'>
          <a
            class='page_link nav_a'
            href='/menu'
            tabindex={showNav === true ? '1' : '-1'}
          >
            Menu
          </a>
        </li>
        <li class='logos'>
          <p>Follow</p>
          <ul class='logo_list'>
            <li class='facebook_logo'>
              <a
                class='media_link nav_a'
                href='https://www.facebook.com/profile.php?id=100087433302511'
                tabindex={showNav === true ? '1' : '-1'}
              >
                <img src={face} alt='Facebook logo' class='media_svg' />
              </a>
            </li>
            <li class='instagram_logo'>
              <a
                class='media_link nav_a'
                href='https://www.instagram.com/xinchaoyyc/'
                tabindex={showNav === true ? '1' : '-1'}
              >
                <img src={insta} alt='Instagram logo' class='media_svg' />
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}
