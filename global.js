const query = document.querySelector.bind(document),
  queryAll = document.querySelectorAll.bind(document),
  navLinks = query('.nav_links'),
  gradientContainer = query('.gradient_container')

function showNav() {
  navLinks.classList.remove('hide')
  navLinks.classList.add('show')
  gradientContainer.classList.add('dark')
  for (const node of queryAll('.nav_a')) node.removeAttribute('tabindex')
}
function hideNav() {
  if (
    !navLinks.classList.contains('show') &&
    !navLinks.classList.contains('hide')
  )
    return
  navLinks.classList.remove('show')
  navLinks.classList.add('hide')
  gradientContainer.classList.remove('dark')
  for (const node of queryAll('.nav_a')) node.setAttribute('tabindex', -1)
}
/**
 * @param {Event} event
 */
function toggleNav(event) {
  const { target } = event,
    bars = query('.bars')

  if (
    // @ts-ignore
    bars?.contains(target)
  )
    // Nav_links covers .bars when shown, so no need to check that the nav is hidden, as the user could not click .bars otherwise.
    return showNav()

  // @ts-ignore
  if (!navLinks?.contains(target) && navLinks.classList.contains('show'))
    hideNav()
}

function tabableNavIfDesktop() {
  if (document.body.clientWidth >= 900)
    for (const node of queryAll('.nav_a')) node.removeAttribute('tabindex')
}

document.body.addEventListener('pointerdown', toggleNav)
document.addEventListener('DOMContentLoaded', tabableNavIfDesktop)

// Notifications.
let id = 0
window.notify = function (textContent) {
  const currentId = `notification_${id++}`,
    notification = document.createElement('div')
  notification.id = currentId
  notification.classList.add('notification')
  notification.textContent = textContent

  document.body.append(notification)
  setTimeout(() => query(`#${currentId}`).remove(), 5_000)
}
