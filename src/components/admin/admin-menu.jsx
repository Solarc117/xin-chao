import EditableProduct from './menu/editable-product'
import '../../css/admin-home.css'

export default function AdminMenu({ categories }) {
  const categoryNames = categories.map(category => category._id),
    product = categories[0].products[0]

  return (
    <>
      <EditableProduct categories={categoryNames} product={product} />

      {/* <header class='menu_header'>
        <ul class='menu_categories'></ul>
      </header>
      <hr class='category_nav_hr' />
      <section class='menu_section'></section> */}
    </>
  )
}
