import { useEffect, useRef } from 'preact/hooks'
import { face, insta, lightLogo, bars } from '../assets/svgs'

export default function HeaderNav({ showNav, toggleSnippets }) {
  const barsRef = useRef(null)

  useEffect(() => {
    /**
     * @param {{ target: EventTarget }} event
     * @return {Function}
     */
    function hideNav({ target }) {
      if (!barsRef.current.contains(target)) toggleSnippets()
    }
    document.body.addEventListener('click', hideNav)

    return () => document.body.removeEventListener('click', hideNav)
  }, [])

  return (
    <>
      <header class='header'>
        <div class='logo_section'>
          <a class='logo_link' href='/'>
            <img src={lightLogo} alt='Xin ChÃo logo' class='logo_svg' />
          </a>
        </div>
        <div class='title_section'>
          <h1 class='title'>Xin Chao</h1>
          &nbsp;
          <p class='title_coffee'>COFFEE</p>
        </div>
        <div
          class='nav_section'
          ref={barsRef}
          onClick={() => toggleSnippets('nav')}
        >
          <img src={bars} alt='Browse' class='bars' />
        </div>
      </header>

      <nav
        class={`nav_links ${
          showNav ? 'show' : showNav === false ? 'hide' : ''
        }`}
      >
        <ul class='nav_links_ul'>
          <li class='page'>
            <a
              class='page_link nav_a'
              href='/about'
              tabindex={showNav ? '1' : '-1'}
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
    </>
  )
}
