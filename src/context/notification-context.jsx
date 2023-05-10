import { createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'

const NotificationContext = createContext()

export function useNotifications() {
  return useContext(NotificationContext)
}

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  function notify(message) {
    setNotifications(prior => [...prior, message])
    setTimeout(() => setNotifications(prior => prior.slice(1)), 5_000)
  }

  return (
    <NotificationContext.Provider value={notify}>
      {notifications.map((notification, i) => (
        <div className='notification' key={i}>
          {notification}
        </div>
      ))}
      {children}
    </NotificationContext.Provider>
  )
}
