import { useState } from 'preact/hooks'
import Product from '../../menu/product'
import EditableProduct from './editable-product'

export default function AdminProduct({ product, categoryNames }) {
  const [editable, setEditable] = useState(false)

  return editable ? (
    <EditableProduct
      {...{
        product,
        categoryNames,
        setEditable,
      }}
    />
  ) : (
    <Product
      {...{
        product,
        admin: true,
        setEditable,
      }}
    />
  )
}
