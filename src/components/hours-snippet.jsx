import { useHours } from '../context/client-context'
import { Fragment } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import '../css/hours-snippet.css'

/**
 * @param {array} periods
 * @returns {boolean}
 */
function storeIsOpen(periods) {
  if (!Array.isArray(periods)) return null

  const weekdayAndTime = new Intl.DateTimeFormat('en-CA', {
      hour12: false,
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'America/Edmonton',
    }).format(new Date()),
    // @ts-ignore
    currentHours = +weekdayAndTime.match(/\d+(?=\:)/)[0],
    // @ts-ignore
    currentMinutes = +weekdayAndTime.match(/:\d+/)[0].substring(1),
    hoursToday =
      periods[
        [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
          // @ts-ignore
        ].indexOf(weekdayAndTime.match(/^[a-z]+/i)[0])
      ],
    { time: openTime } = hoursToday.open,
    { time: closeTime } = hoursToday.close,
    openHours = +openTime.substring(0, 2),
    openMinutes = +openTime.substring(2),
    closeHours = +closeTime.substring(0, 2),
    closeMinutes = +closeTime.substring(2)

  return (
    (currentHours > openHours && currentHours < closeHours) ||
    (currentHours === openHours && currentMinutes >= openMinutes) ||
    (currentHours === closeHours && currentMinutes < closeMinutes)
  )
}

/**
 * @param {{ hours: object }} props
 * @returns {import('preact').Component}
 */
export default function HoursSnippet({ showHours, toggleSnippets }) {
  const hours = useHours(),
    [open, setOpen] = useState(storeIsOpen(hours?.periods)),
    hoursSnippet = useRef(null),
    storeHours = useRef(null)

  useEffect(() => {
    const checkIfOpenInterval = setInterval(
      () => setOpen(storeIsOpen(hours?.periods)),
      60_000
    )

    /**
     * @param {{ target: EventTarget }} event
     * @returns {Function} The cleanup function.
     */
    function toggleStoreHours({ target }) {
      if (hoursSnippet.current.contains(target)) return toggleSnippets('hours')

      const { current } = storeHours
      if (!current.contains(target) && current.classList.contains('show'))
        toggleSnippets()
    }
    document.body.addEventListener('click', toggleStoreHours)

    return () => {
      clearInterval(checkIfOpenInterval)
      document.body.removeEventListener('click', toggleStoreHours)
    }
  }, [])

  setTimeout(() => setOpen(storeIsOpen(hours?.periods)), 1_000)

  return (
    <>
      <section
        id='store_hours'
        class={`store_hours ${showHours ? 'show' : 'hide'}`}
        ref={storeHours}
      >
        {Array.isArray(hours?.weekdayText) ? (
          hours.weekdayText.map((hours, i) => (
            <Fragment key={i}>
              <li>{hours}</li>
              <br />
            </Fragment>
          ))
        ) : (
          <p>
            For up to date hours, please search our&nbsp;
            <a
              class='link'
              href='https://www.google.com/search?q=xin+chao+coffee+calgary+hours'
              target='_blank'
              rel='noreferrer'
              tabindex={showHours ? '-1' : '1'}
            >
              Google hours
            </a>
            , or call the store.
          </p>
        )}
      </section>
      <div class='hours_snippet' title='Store hours' ref={hoursSnippet}>
        {open !== null && (
          <svg id='snippet_svg' class='snippet_svg'>
            <circle
              class={`snippet_circle ${open ? 'open' : 'closed'}`}
              cx='10'
              cy='10'
              r='10'
            />
          </svg>
        )}
        <p>
          {open === true ? 'Open - ' : open === false ? 'Closed - ' : ''}
          <a class='open_text link' tabindex='1'>
            Business Hours
          </a>
        </p>
      </div>
    </>
  )
}
