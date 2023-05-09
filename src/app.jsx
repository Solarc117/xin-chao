import { useState, useEffect } from 'preact/hooks'
import ClientDataProvider from './context/client-context'
import NotificationProvider from './context/notification-context'
import Router from 'preact-router'
import HeaderNav from './components/header-nav'
import Home from './components/home'
import About from './components/about'
import Contact from './components/contact'
import Menu from './components/menu/menu'
import Admin from './components/admin'
import HoursSnippet from './components/hours-snippet'
import './css/home.css'

const categoryNames = [
  'Coffee',
  'Non-Coffee',
  'Milk Teas',
  'Specialty Sodas',
  'Smoothies',
  'Appetizers',
  'Other',
]

export default function App() {
  const [showHours, setShowHours] = useState(null),
    [showNav, setShowNav] = useState(null),
    [gradient, setGradient] = useState(false)

  /**
   * @param {'nav' | 'hours'} [component] The component to toggle. None if components are to be hidden.
   */
  function toggleSnippets(component) {
    const off = prior => (prior === null ? null : false)

    if (component === 'nav') {
      setShowNav(true)
      setShowHours(off)
      return setGradient(true)
    }
    if (component === 'hours') {
      setShowHours(true)
      setShowNav(off)
      return setGradient(true)
    }

    setShowNav(off)
    setShowHours(off)
    setGradient(false)
  }

  return (
    <ClientDataProvider>
      <NotificationProvider>
        <div class={`gradient_container ${gradient && 'dark'}`} />
        <HeaderNav
          {...{
            toggleSnippets,
            showNav,
          }}
        />
        <Router>
          <Home path='/' />
          <About path='/about' />
          <Contact path='/contact' />
          <Menu path='/menu' />
          <Admin path='/admin' />
        </Router>
        <HoursSnippet
          {...{
            showHours,
            toggleSnippets,
          }}
        />
      </NotificationProvider>
    </ClientDataProvider>
  )
}
