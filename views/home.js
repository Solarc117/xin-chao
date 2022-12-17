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
    bars = document.querySelector('.bars'),
    nav = document.querySelector('.nav_links')

  if (
    // @ts-ignore
    bars?.contains(target)
  )
    return showNav()

  // @ts-ignore
  if (!nav?.contains(target) && nav.classList.contains('show')) hideNav()
}

setDynamicBackground(document)
document.body.addEventListener('pointerdown', toggleNav)
