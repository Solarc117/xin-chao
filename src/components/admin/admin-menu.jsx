import Loading from '../loading'
import AdminProduct from './menu/admin-product'
import '../../css/admin-home.css'

export default function AdminMenu({ categories }) {
  const categoryNames = categories.map(({ category }) => category),
    categoryId = name => name.toLowerCase().replace(/\s/g, '_')

  return (
    <>
      <header class='menu_header'>
        <ul class='menu_categories'>
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
                <AdminProduct
                  product={product}
                  key={i}
                  categories={categoryNames}
                />
              ))}
            </ul>
          </>
        ))}
      </section>
    </>
  )
}
