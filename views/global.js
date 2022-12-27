const query = document.querySelector.bind(document),
  queryAll = document.querySelectorAll.bind(document)

function showNav() {
  query('.nav_links')?.classList.add('show')
  query('.gradient_container')?.classList.add('over')
  for (const node of Array.from(queryAll('.nav_links_a')))
    node.removeAttribute('tabindex')

  for (const tag of [query('header'), query('main')])
    tag.classList.add('dark_gradient')

  for (const tag of queryAll('.gradient_container')) tag.classList.add('dark')
}

function hideNav() {
  query('.nav_links')?.classList.remove('show')
  query('.gradient_container')?.classList.remove('over')
  for (const node of Array.from(queryAll('.nav_links_a')))
    node.setAttribute('tabindex', -1)

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

document.body.addEventListener('pointerdown', toggleNav)
  