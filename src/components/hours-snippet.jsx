import { useState, useEffect } from 'preact/hooks'
import '../css/hours-snippet.css'

const hoursKey = 'storeHours'

/**
 * @param {string} hoursKey
 * @returns {Promise<boolean>} Whether the hours could be stored locally or not.
 */
async function fetchHours(hoursKey) {
  /**
   * @param {string | Date} datePassed The date (or string used to instantiate the date) to check.
   * @returns {boolean | null} Null if an invalid date was passed.
   */
  function weekHasPassed(datePassed) {
    const date2 = new Date(),
      msInAWeek = 604_800_000,
      date1 = datePassed instanceof Date ? datePassed : new Date(datePassed)

    return isNaN(date1.valueOf())
      ? null
      : Math.abs(date2.getTime() - datePassed.getTime()) >= msInAWeek
  }

  const hours = localStorage.getItem(hoursKey)
  if (hours !== null && !weekHasPassed(hours.dateFetched)) return true

  let response, result
  try {
    response = await fetch(
      '/.netlify/functions/hours'
    )
    result = await response.json()
  } catch (error) {
    console.error('Could not fetch hours:', error)
    return false
  }

  if (response.status !== 200) {
    console.error(result)
    return false
  }

  const hoursToStore = {}
  hoursToStore.weekday_text = result.opening_hours.weekday_text
  hoursToStore.dateFetched = new Date().toLocaleDateString()
  try {
    localStorage.setItem(hoursKey, JSON.stringify(hoursToStore))
  } catch (error) {
    console.error('Could not set store hours:', error)
    return false
  }

  return true
}

export default function HoursSnippet() {
  const [hours, setHours] = useState(null)

  // const query = document.querySelector.bind(document),
  //   storeHoursKey = 'storeHours',
  //   storeHours = query('.store_hours'),
  //   hoursDefaultHTML = `<p id="hours_text">
  //       For up to date hours, please search our
  //       <a
  //         id="google_hours_link"
  //         class="link"
  //         href="https://www.google.com/search?q=xin+chao+coffee+calgary+hours"
  //         target="_blank"
  //         rel="noreferrer"
  //         tabindex="-1"
  //         >Google hours</a
  //       >, or call the store.
  //     </p>`

  // /**
  //  * Updates store hours snippet html to either its open, closed, or default value.
  //  * @param {'default' | 'open' | 'closed'} storeStatus
  //  * @param {string[] | null} storeHoursArray An array containing strings indicating the week's opening/closing hours, if known.
  //  */
  // function updateStoreHoursHTML(
  //   storeStatus = 'default',
  //   storeHoursArray = null
  // ) {
  //   /**
  //    * Returns the inner HTML of the store hours snippet, depending on whether the store status is known or not.
  //    * @param {'default' | 'open' | 'closed'} storeStatus Defaults to "default".
  //    * @returns {string} The snippet's innerHTML.
  //    */
  //   function snippetContent(storeStatus = 'default') {
  //     return storeStatus === 'default'
  //       ? `<p id="snippet_text">
  //   <a class="open_text link">Business Hours</a>
  //   </p>`
  //       : `<svg id="snippet_svg" class="snippet_svg">
  //       <circle id="snippet_circle" class="snippet_circle ${storeStatus}" cx="12" cy="12" r="12"></circle>
  //     </svg>
  //     <p id="snippet_text">
  //       ${
  //         storeStatus[0].toUpperCase() + storeStatus.slice(1)
  //       } -&nbsp;<a class="open_text link">Business Hours</a>
  //     </p>`
  //   }
  //   if (
  //     storeStatus === 'default' ||
  //     storeHoursArray === null ||
  //     localStorage.getItem(storeHoursKey) === null
  //   ) {
  //     query('#store_hours').innerHTML = hoursDefaultHTML
  //     return (query('#snippet').innerHTML = snippetContent('default'))
  //   }

  //   const hours = [
  //     ...storeHoursArray.map(
  //       weekdayHours => `<li>${weekdayHours}</li><br><br>`
  //     ),
  //     '<p>Please double check store hours for holidays</p>',
  //   ].join('')

  //   query('#snippet').innerHTML = snippetContent(storeStatus)
  //   query('#store_hours').innerHTML = hours
  // }

  // let storeHoursInterval
  // function setCheckStoreHoursInterval() {
  //   /**
  //    * Fetches from Google api if it is unable to parse the localStorage "storeHours" value, OR if the data stored locally is a week old or older, or if there is no local data about the store.
  //    */
  //   function checkForOldStoreHours() {
  //     /**
  //      * Utilizes the store hours array fetched from Google to check if the current MDT date falls under open hours.
  //      * @param {string[]} weekdayHours
  //      * @returns {'open' | 'closed' | null}
  //      */
  //     function storeIsOpen(
  //       weekdayHours = JSON.parse(localStorage.getItem(storeHoursKey) || '{}')
  //         ?.weekdayText
  //     ) {
  //       if (!Array.isArray(weekdayHours) || weekdayHours.length !== 7) {
  //         console.warn(
  //           'unable to check store status; store hours not in storage'
  //         )
  //         return null
  //       }

  //       const weekdayAndTime = new Intl.DateTimeFormat('en-CA', {
  //           hour12: false,
  //           weekday: 'long',
  //           hour: 'numeric',
  //           minute: 'numeric',
  //           timeZone: 'America/Edmonton',
  //         }).format(new Date()),
  //         // @ts-ignore
  //         currentHours = +weekdayAndTime.match(/\d+(?=\:)/)[0],
  //         // @ts-ignore
  //         currentMinutes = +weekdayAndTime.match(/:\d+/)[0].substring(1),
  //         hoursToday = JSON.parse(localStorage.getItem(storeHoursKey) || '{}')
  //           .periods[
  //           [
  //             'Monday',
  //             'Tuesday',
  //             'Wednesday',
  //             'Thursday',
  //             'Friday',
  //             'Saturday',
  //             'Sunday',
  //             // @ts-ignore
  //           ].indexOf(weekdayAndTime.match(/^[a-z]+/i)[0])
  //         ],
  //         [openHours, openMinutes] = [
  //           hoursToday.open.hours,
  //           hoursToday.open.minutes,
  //         ],
  //         [closeHours, closeMinutes] = [
  //           hoursToday.close.hours,
  //           hoursToday.close.minutes,
  //         ]

  //       return (currentHours > openHours && currentHours < closeHours) ||
  //         (currentHours === openHours && currentMinutes >= openMinutes) ||
  //         (currentHours === closeHours && currentMinutes < closeMinutes)
  //         ? 'open'
  //         : 'closed'
  //     }
  //     function updateOpeningHours() {
  //       const mapQuery = query('.map')
  //       let map
  //       if (mapQuery instanceof Element) map = mapQuery
  //       else {
  //         map = document.createElement('iframe')
  //         map.allowFullscreen = true
  //         map.src =
  //           'https://www.google.com/maps/embed/v1/place?key=AIzaSyACH4gzkvAoGmlWtjhlFGexBndnTfPgNmw&q=2255+32+St+NE+Unit+3110,+Calgary,+AB+T1Y+6E8'
  //         map.classList.add('map')
  //         map.setAttribute('loading', 'lazy')
  //         map.setAttribute('referrerpolicy', 'no-referrer-when-downgrade')
  //       }

  //       // @ts-ignore
  //       const service = new google.maps.places.PlacesService(map)

  //       service.getDetails(
  //         {
  //           placeId: 'ChIJawKDKGBlcVMRqEUhscr_ATk',
  //           fields: ['opening_hours'],
  //         },
  //         (place, status) => {
  //           if (
  //             // @ts-ignore
  //             status !== google.maps.places.PlacesServiceStatus.OK ||
  //             place.opening_hours === void 0
  //           ) {
  //             console.error('cannot fetch store hours:', status)
  //             return updateStoreHoursHTML()
  //           }
  //           const { periods, weekday_text: weekdayText } = place.opening_hours

  //           localStorage.setItem(
  //             storeHoursKey,
  //             JSON.stringify({
  //               periods,
  //               weekdayText,
  //               lastFetchDate: new Date().toUTCString(),
  //             })
  //           )
  //           updateStoreHoursHTML(
  //             // @ts-ignore
  //             storeIsOpen(weekdayText),
  //             weekdayText
  //           )
  //         }
  //       )
  //     }
  //     /**
  //      * @description Returns whether the current weekday in MDT time is a Sunday.
  //      * @param {Date} date Defaults to the current date.
  //      * @returns {boolean}
  //      */
  //     function isMDTSunday(date = new Date()) {
  //       // Return whether: the current UTC day is Sunday, and the hour is 07 or later; OR, whether the current UTC day is Monday, & the hour is before 07.
  //       const UTCWeekday = date.getUTCDay(),
  //         UTCHour = date.getUTCHours()

  //       return (
  //         (UTCWeekday === 0 && UTCHour >= 7) ||
  //         (UTCWeekday === 1 && UTCHour < 7)
  //       )
  //     }
  //     /**
  //      * @description Returns a boolean indicating whether at least a day has passed between the two date arguments.
  //      * @param {Date} date1
  //      * @param {Date} date2 Defaults to the current date.
  //      * @returns {boolean}
  //      */
  //     function dayHasPassed(date1, date2 = new Date()) {
  //       const msInADay = 86_400_000

  //       return Math.abs(date2.getTime() - date1.getTime()) >= msInADay
  //     }
  //     /**
  //      * @description Returns a boolean indicating whether at least a week has passed since the two date arguments.
  //      * @param {Date} date1
  //      * @param {Date} date2 Defaults to the current date.
  //      * @returns {boolean}
  //      */
  // function weekHasPassed(date1, date2 = new Date()) {
  //   const msInAWeek = 604_800_000

  //   return Math.abs(date2.getTime() - date1.getTime()) >= msInAWeek
  // }
  //     const storeHoursDataString = localStorage.getItem(storeHoursKey)
  //     let storeHoursData, lastFetchDate
  //     try {
  //       // @ts-ignore
  //       storeHoursData = JSON.parse(storeHoursDataString || undefined)
  //       lastFetchDate = new Date(storeHoursData?.lastFetchDate)
  //     } catch (error) {
  //       // Update hours, since stringified data in local storage is not parseable, and is therefore invalid.
  //       return updateOpeningHours()
  //     }

  //     if (
  //       Object.keys(storeHoursData || {}).length === 0 ||
  //       // Verifying lastFetchDate is a valid date.
  //       isNaN(lastFetchDate.getDay()) ||
  //       (isMDTSunday() && dayHasPassed(lastFetchDate)) ||
  //       weekHasPassed(lastFetchDate)
  //     )
  //       updateOpeningHours()

  //     updateStoreHoursHTML(
  //       storeIsOpen() || 'default',
  //       storeHoursData.weekdayText
  //     )
  //   }
  //   clearInterval(storeHoursInterval)
  //   checkForOldStoreHours()
  //   storeHoursInterval = setInterval(checkForOldStoreHours, 120_000)
  // }

  // /**
  //  * @param {Event} event
  //  */
  // function toggleStoreHours(event) {
  //   function showStoreHours() {
  //     if (document.body.clientWidth < 900) hideNav()
  //     storeHours.classList.remove('hide')
  //     storeHours.classList.add('show')
  //     gradientContainer.classList.add('over', 'dark')
  //     query('#google_hours_link')?.removeAttribute('tabindex')
  //   }
  //   function hideStoreHours() {
  //     storeHours.classList.add('hide')
  //     storeHours.classList.remove('show')
  //     gradientContainer.classList.remove('over', 'dark')
  //     query('#google_hours_link')?.setAttribute('tabindex', -1)
  //   }
  //   const { target } = event,
  //     snippet = query('.hours_snippet')

  //   if (snippet?.contains(target)) return showStoreHours()

  //   if (!storeHours?.contains(target) && storeHours.classList.contains('show'))
  //     hideStoreHours()
  // }
  // document.body.addEventListener('pointerdown', toggleStoreHours)
  return (
    <>
      <section id='store_hours' class='store_hours'>
        <p>
          For up to date hours, please search our
          <a
            class='link'
            href='https://www.google.com/search?q=xin+chao+coffee+calgary+hours'
            target='_blank'
            rel='noreferrer'
            tabindex='-1'
          >
            Google hours
          </a>
          , or call the store.
        </p>
      </section>
      <div class='hours_snippet' title='Store hours'>
        <p>
          <a class='open_text link' tabindex='1'>
            Business Hours
          </a>
        </p>
      </div>
    </>
  )
}
