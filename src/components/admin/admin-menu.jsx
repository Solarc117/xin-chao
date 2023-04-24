import EditableProduct from './menu/editable-product'
import '../../css/admin-home.css'

export default function AdminMenu({ categories }) {
  const firstProduct = categories[0]

  return (
    <>
      <EditableProduct product={firstProduct} />

      {/* <header class='menu_header'>
        <ul class='menu_categories'></ul>
      </header>
      <hr class='category_nav_hr' />
      <section class='menu_section'></section> */}
    </>
  )
}
