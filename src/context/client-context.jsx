// Though it doesn't make semantic sense to put a value in context when it is only used by one component, the API from which this data is fetched also provides the data that SHOULD be in context, due to its widespread use. By sacrificing on the semantic aspect, we pool both API calls together & effectively half the number of calls made to the client serverless function, enabling the app to scale better.
import { createContext } from 'preact'
import { useContext, useState, useEffect } from 'preact/hooks'
import '../types'

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
const MenuContext = createContext(),
  UpdateMenuContext = createContext(),
  HoursContext = createContext(),
  STORAGES = whichStoragesAvailable(),
  HOURS_KEY = 'hours',
  MENU_KEY = 'menu'

export function useMenu() {
  return [useContext(MenuContext), useContext(UpdateMenuContext)]
}

export function useHours() {
  return useContext(HoursContext)
}

export default function ClientDataProvider({ children }) {
  const [menu, setMenu] = useState(null),
    [hours, setHours] = useState(null)

  useEffect(() => {
    ;(async function fetchHoursAndMenu() {
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

        setMenu(parsedMenu)
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
        setMenu(menu)
      }
    })()
  }, [])

  /**
   * @param {product: Product}
   * @param {string} [action]
   * @param {string} [oldCategory] The product's previous category, if it changed.
   */
  function updateMenu(productChanged, action, oldCategory) {
    const newMenu = [...menu]
    function update() {
      if (STORAGES.includes('sessionStorage'))
        sessionStorage.setItem(MENU_KEY, JSON.stringify(newMenu))
      setMenu(newMenu)
    }

    if (action === 'update') {
      if (oldCategory) {
        /** @type {('added' | 'deleted')[]} */
        let actions = []

        for (const category of newMenu)
          if (category._id === oldCategory) {
            for (const [i, { _id }] of category.products.entries())
              if (_id === productChanged._id) {
                category.products = [
                  ...category.products.slice(0, i),
                  ...category.products.slice(i + 1),
                ]

                if (actions.includes('added')) return update()

                actions.push('deleted')
                break
              }
          } else if (category._id === productChanged.category) {
            category.products.push(productChanged)

            if (actions.includes('deleted')) return update()

            actions.push('added')
          }
        // If product was not added yet, it was added to a non-existing collection in the menu - create it.
        if (!actions.includes('added'))
          newMenu.push({
            _id: productChanged.category,
            category: productChanged.category,
            products: [productChanged],
          })

        return update()
      }

      for (const category of newMenu)
        if (category._id === productChanged.category)
          for (const [i, { _id }] of category.products.entries())
            if (_id === productChanged._id) {
              products[i] = productChanged
              return update()
            }
    }

    for (const category of newMenu)
      if (category._id === productChanged.category) {
        if (action === 'add') {
          category.products.push(productChanged)
          return update()
        }

        for (const [i, { _id }] of category.products.entries())
          if (_id === productChanged._id) {
            category.products = [
              ...category.products.slice(0, i),
              ...category.products.slice(i + 1),
            ]
            return update()
          }
      }
  }

  return (
    <MenuContext.Provider value={menu}>
      <UpdateMenuContext.Provider value={updateMenu}>
        <HoursContext.Provider value={hours}>{children}</HoursContext.Provider>
      </UpdateMenuContext.Provider>
    </MenuContext.Provider>
  )
}
