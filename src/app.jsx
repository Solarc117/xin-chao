import { useState, useEffect } from 'preact/hooks'
import NotificationProvider from './context/notification-context'
import Router from 'preact-router'
import Header from './components/header'
import Nav from './components/nav'
import Home from './components/home'
import About from './components/about'
import Contact from './components/contact'
import Menu from './components/menu'
import Admin from './components/admin'
import HoursSnippet from './components/hours-snippet'
import './css/home.css'

/**
 * @returns {('localStorage' | 'sessionStorage')[]} The browser storage(s) not disabled by the client.
 */
function whichStoragesAvailable() {
  const test = 'test',
    available = []
  try {
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    available.push('localStorage')
  } catch (e) {}
  try {
    sessionStorage.setItem(test, test)
    sessionStorage.removeItem(test)
    available.push('sessionStorage')
  } catch (e) {
    console.log('please enable session storage for a better experience')
  }

  return available
}
const STORAGES = whichStoragesAvailable(),
  HOURS_KEY = 'hours',
  MENU_KEY = 'menu'

export default function App() {
  const [categories, setCategories] = useState(null),
    [hours, setHours] = useState(null),
    // For mobile & smaller screen sizes.
    [showHours, setShowHours] = useState(null),
    [showNav, setShowNav] = useState(null),
    [gradient, setGradient] = useState(false)

  useEffect(() => {
    async function fetchHoursAndMenu() {
      /**
       * @param {'hours' | 'menu'} data
       * @returns {Array | Object | null} The data (array for menu, object for store hours), if it is stored. Null otherwise.
       */
      function getDataFromStorage(data) {
        if (STORAGES.length === 0) return null

        if (data === 'hours') {
          try {
            return JSON.parse(window[STORAGES[0]].getItem(HOURS_KEY))
          } catch (error) {
            console.warn(error)
            return null
          }
        }

        if (!STORAGES.includes('sessionStorage')) return null

        try {
          return JSON.parse(sessionStorage.getItem(MENU_KEY))
        } catch (error) {
          console.warn(error)
          return null
        }
      }
      /**
       * @returns {boolean} An indicator of whether hours should be fetched (if they are not stored, or are a week old or older).
       * @effect Sets state to stored data if found.
       */
      function hoursNeeded() {
        /**
         * @param {string | Date} datePassed The date (or string used to instantiate the date) to check.
         * @returns {boolean | null} Null if an invalid date was passed.
         */
        function weekHasPassed(datePassed) {
          const date2 = new Date(),
            msInAWeek = 604_800_000,
            date1 =
              datePassed instanceof Date ? datePassed : new Date(datePassed)

          return isNaN(date1.valueOf())
            ? null
            : Math.abs(date2.getTime() - date1.getTime()) >= msInAWeek
        }
        const parsedHours = getDataFromStorage('hours')

        if (
          typeof parsedHours?.dateFetched !== 'string' ||
          weekHasPassed(parsedHours?.dateFetched)
        )
          return true

        setHours(parsedHours)
        return false
      }
      /**
       * @returns {boolean} An indicator of whether menu should be fetched (if not in session storage).
       * @effect Sets state to stored data if found.
       */
      function menuNeeded() {
        const parsedMenu = getDataFromStorage('menu')

        if (!Array.isArray(parsedMenu)) return true

        setCategories(parsedMenu)
        return false
      }

      const getHours = hoursNeeded(),
        getMenu = menuNeeded()

      if (!getHours && !getMenu) return

      let response, result
      try {
        response = await fetch(
          `/.netlify/functions/client${
            getHours && getMenu ? '' : `?data=${getHours ? 'hours' : 'menu'}`
          }`
        )
        result = await response.json()
      } catch (error) {
        return console.error('Could not fetch menu/hours:', error)
      }

      const { status } = response
      if (status !== 200 && status !== 207) return console.error(result)

      const { hours, menu } = result
      if (hours) {
        if (STORAGES[0])
          window[STORAGES[0]].setItem(HOURS_KEY, JSON.stringify(hours))
        setHours(hours)
      }
      if (menu) {
        if (STORAGES.includes('sessionStorage'))
          sessionStorage.setItem(MENU_KEY, JSON.stringify(menu))
        setCategories(menu)
      }
    }
    fetchHoursAndMenu()
  }, [])

  /**
   * @param {'nav' | 'hours'} [component] The component to toggle. None if components are to be hidden.
   */
  function toggleSnippets(component) {
    if (component === 'nav') {
      setShowNav(true)
      setShowHours(false)
      return setGradient(true)
    }
    if (component === 'hours') {
      setShowHours(true)
      setShowNav(false)
      return setGradient(true)
    }

    setShowNav(false)
    setShowHours(false)
    setGradient(false)
  }

  return (
    <NotificationProvider>
      <div class={`gradient_container ${gradient && 'dark'}`} />
      <Header />
      <Nav
        {...{
          showNav,
          toggleSnippets,
        }}
      />
      <Router>
        <Home path='/' />
        <About path='/about' />
        <Contact path='/contact' />
        <Menu path='/menu' categories={categories} />
        <Admin path='/admin' categories={categories} />
      </Router>
      <HoursSnippet
        {...{
          hours,
          showHours,
          toggleSnippets,
        }}
      />
    </NotificationProvider>
  )
}
