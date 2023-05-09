import { home1, home2, home3 } from '../assets/images'
import DynamicBackground from './dynamic-background'
import Footer from './footer'
import '../css/home.css'

const images = [home1, home2, home3]

export default function Home() {
  return (
    <>
      <DynamicBackground images={images} />
      <main className='main home_main'>
        <div className='home_menu_container'>
          <a class='home_menu' href='/menu'>
            Menu
          </a>
        </div>
        <Footer />
      </main>
    </>
  )
}
