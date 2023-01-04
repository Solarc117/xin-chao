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

function setupStoreHoursIndicatorInterval() {
  const circle = query('circle'),
    text = query('.open_text'),
    oneMinute = 60_000,
    // Months are zero-indexed; dates are not.
    calgaryHolidays = {
      0: {
        1: 'New Years',
      },
      4: {
        // Victoria Day falls on the 25th IF the 24th falls on a Sunday.
        24: 'Victoria Day',
        25: 'Victoria Day',
      },
      6: {
        1: 'Canada Day',
      },
      8: {
        4: 'Labour Day',
        30: 'Truth and Reconciliation Day',
      },
      10: {
        11: 'Remembrance Day',
        23: 'Thanksgiving',
      },
      11: {
        25: 'Christmas',
        26: 'Boxing Day',
      },
    },
    mapQuery = query('.map')
  let map
  if (mapQuery instanceof Element) map = mapQuery
  else {
    map = document.createElement('iframe')
    map.allowFullscreen = true
    map.src =
      'https://www.google.com/maps/embed/v1/place?key=AIzaSyACH4gzkvAoGmlWtjhlFGexBndnTfPgNmw&q=2255+32+St+NE+Unit+3110,+Calgary,+AB+T1Y+6E8'
    map.classList.add('map')
    map.setAttribute('loading', 'lazy')
    map.setAttribute('referrerpolicy', 'no-referrer-when-downgrade')
  }

  const service = new google.maps.places.PlacesService(map)

    service.getDetails(
    {
      placeId: 'ChIJawKDKGBlcVMRqEUhscr_ATk',
      fields: ['opening_hours'],
    },
    (place, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK)
        return console.error('cannot fetch store hours:', status)

      console.log('place:', place)
    }
  )

  // const dailyStoreHoursCacheCleaner = setInterval(() => {
  //   // If it is a Sunday, or there is no information about the store hours, fetch.
  //   if (new Date().getDay() === 0 || !Array.isArray(window.storeHours)) {
  //     // localStorage.setItem('storeHours', )
  //   }
  // }, 86_400_000) // Number of milliseconds in a day (runs everyday).
}

setupStoreHoursIndicatorInterval()
document.body.addEventListener('pointerdown', toggleNav)
