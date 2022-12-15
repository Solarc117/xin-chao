const query = document.querySelector.bind(document),
  queryAll = document.querySelectorAll.bind(document)

function setDynamicBackground(document) {
  const classNames = ['coffee', 'hot_chocolate', 'spring_rolls']
  let count = 0

  setInterval(() => {
    document.body.classList.add(classNames[count + 1 > 2 ? 0 : count + 1])
    document.body.classList.remove(classNames[count])
    count++
    if (count > 2) count = 0
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

function toggleNav(event) {
  const { target } = event

  if (
    target.classList.contains('bars') ||
    target.classList.contains('nav_links') ||
    target.id === 'bars_path'
  )
    showNav()
  else hideNav()
}

setDynamicBackground(document)
document.body.addEventListener('pointerdown', toggleNav)
