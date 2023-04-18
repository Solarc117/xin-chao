export default function Nav() {
  return (
    <nav class='nav_links'>
      <ul class='nav_links_ul'>
        <li class='page'>
          <a class='page_link nav_a' href='/about/' tabindex='-1'>
            About
          </a>
        </li>
        <li class='page'>
          <a class='page_link nav_a' href='/contact/' tabindex='-1'>
            Contact
          </a>
        </li>
        <li class='page'>
          <a class='page_link nav_a' href='/menu/' tabindex='-1'>
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
                tabindex='-1'
              >
                <img
                  src='../assets'
                  alt='Facebook logo'
                  class='media_svg'
                />
              </a>
            </li>
            <li class='instagram_logo'>
              <a
                class='media_link nav_a'
                href='https://www.instagram.com/xinchaoyyc/'
                tabindex='-1'
              >
                <img
                  src='./svgs/insta.svg'
                  alt='Instagram logo'
                  class='media_svg'
                />
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}
