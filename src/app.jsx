import Router from 'preact-router'
import Header from './components/header'
import Nav from './components/nav'
import Home from './components/home'
import About from './components/about'
import Contact from './components/contact'
import Admin from './components/admin'
import HoursSnippet from './components/hours-snippet'
import './css/home.css'

export default function App() {
  return (
    <>
      <div class='gradient_container' />
      <Header />
      <Nav />
      <Router>
        <Home path='/' />
        <About path='/about' />
        <Contact path='/contact' />
        <Admin path='/admin' />
      </Router>
      <HoursSnippet />
    </>
  )
}
