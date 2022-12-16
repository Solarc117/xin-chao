const query = document.querySelector.bind(document),
  queryAll = document.querySelectorAll.bind(document)

/**
 * @param {Document} document
 */
function setDynamicBackground(document) {
  const backgroundImages = [
    "url('./public/images/coffee.jpg')",
    "url('./public/images/hot-chocolate.jpg')",
    "url('./public/images/spring-rolls.jpg')",
  ]
  let count = 0

  setInterval(() => {
    count++
    if (count > 2) count = 0

    document.body.style.backgroundImage = backgroundImages[count]
  }, 2000)
}

function showNav() {
  query('.nav_links')?.classList.add('show')

  for (const tag of [query('header'), query('main')])
    tag.classList.add('dark_gradient')

  for (const tag of queryAll('.gradient_container')) tag.classList.add('dark')
}

function hideNav() {
  query('.nav_links')?.classList.remove('show')

  for (const tag of [query('header'), query('main')])
    tag.classList.remove('dark_gradient')

  for (const tag of queryAll('.gradient_container'))
    tag.classList.remove('dark')
}

/**
 * @param {Event} event
 */
function toggleNav(event) {
  const { target } = event,
    showNavClasses = ['bars', 'nav_links', 'logos', 'page', 'nav_links_ul'],
    viewPortWidth = query('.gradient_container')?.clientWidth

  if (
    (showNavClasses.some(showNavClass =>
      // @ts-ignore
      target?.classList.contains(showNavClass)
    ) ||
      // @ts-ignore
      target?.id === 'bars_path') &&
    viewPortWidth <= 900
  )
    showNav()
  else hideNav()
}

setDynamicBackground(document)
document.body.addEventListener('pointerdown', toggleNav)
