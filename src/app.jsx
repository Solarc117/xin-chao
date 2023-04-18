import Router from 'preact-router'
import Header from './components/header'
import Nav from './components/nav'
import Home from './components/home'
import About from './components/about'
import HoursSnippet from './components/hours-snippet'
import './css/home.css'

export default function App() {
  return (
    <>
      <div class='gradient_container'></div>
      <div class='background_image'></div>
      <Header />
      <Nav />
      <main className='main'>
        <Router>
          <Home path='/' />
          <About path='/about' />
        </Router>
      </main>
      <HoursSnippet />
    </>
  )
}
