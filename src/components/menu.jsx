import Footer from './footer'

export default function Menu({ menu: categories }) {
  const categoryNames = categories.map(({ category }) => category),
    categoryId = name => name.toLowerCase().replace(/\s/g, '_')

  return (
    <>
      <main className='main menu_main'>Menu</main>
      <Footer />
    </>
  )
}
