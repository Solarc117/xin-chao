import { useMenu } from '../../context/client-context'
import Product from './product'
import Footer from '../footer'
import { about8 } from '../../assets/images'
import '../../css/menu.css'

export default function Menu() {
  const [categories] = useMenu(),
    categoryNames = Array.isArray(categories)
      ? categories.map(({ category }) => category)
      : [],
    categoryId = name => name.toLowerCase().replace(/\s/g, '_')

  return (
    <>
      <div
        className='background_image opaque'
        style={{ backgroundImage: `url(${about8})` }}
      />
      {Array.isArray(categories) ? (
        <main className='main menu_main'>
          <header className='menu_header'>
            <ul className='menu_categories'>
              {categories.map(({ category }, i) => (
                <li className='category_title' key={i}>
                  <a href={`#${categoryId(category)}`}>{category}</a>
                </li>
              ))}
            </ul>
          </header>
          <hr class='category_nav_hr' />
          <section class='menu_section'>
            {categories.map(({ category, products }, i) => (
              <>
                <section
                  className='category'
                  id={categoryId(category)}
                  key={i}
                ></section>
                <h2>{category}</h2>
                <ul className='category_products'>
                  {products.map((product, i) => (
                    <Product product={product} key={i} />
                  ))}
                </ul>
              </>
            ))}
          </section>

          <Footer />
        </main>
      ) : (
        <div>Could not fetch menu, please try again later.</div>
      )}
    </>
  )
}
