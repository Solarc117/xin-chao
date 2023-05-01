import { useState } from 'preact/hooks'
import Product from './admin-product/product'
import EditableProduct from './admin-product/editable-product'

export default function AdminProduct({ product, categories }) {
  const [editable, setEditable] = useState(false)

  return editable ? (
    <EditableProduct product={product} categories={categories} setEditable={setEditable} />
  ) : (
    <Product product={product} admin={true} setEditable={setEditable} />
  )
}
