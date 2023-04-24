import { useState } from 'preact/hooks'
import EditableProduct from './editable-product'
import { edit, deleteIcon } from '../../../assets/svgs'
import '../../../types'

/**
 * @param {{ product: Product, admin: boolean }} props
 * @returns {import('preact').Component}
 */
export default function Product({
  product: { _id, category, name, description, temperature, price },
  admin,
}) {
  const [editable, setEditable] = useState(false),
    [singlePrice, setSinglePrice] = useState(true)

  async function editProduct(event) {
    console.log(event.target)
  }
  async function deletePopUp(event) {
    console.log(event.target)
  }
  async function saveChanges(event) {
    console.log(event.target)
  }
  const symbols = {
    hot: '🔴',
    cold: '🔵',
  }

  return (
    <li className='product'>
      <header className='product_header'>
        <span className='product_name'>
          {name}
          {temperature.map((option, i) => (
            <span key={i} className='emoji' title={`avaiable ${option}`}>
              {symbols[option]}
            </span>
          ))}
        </span>
        {admin && (
          <span className='admin_buttons'>
            <img
              className='svg admin_svg'
              src={edit}
              alt='Edit'
              title={`Edit ${name}`}
              onClick={editProduct}
            />
            <img
              className='svg admin_svg'
              src={deleteIcon}
              alt='Delete'
              title={`Delete ${name}`}
              onClick={deletePopUp}
            />
          </span>
        )}
      </header>
      <hr />
      <div className='product_body'>
        <p className='product_description'>{description}</p>
        {price instanceof Object ? (
          <ul className='quantity_prices'>
            {Object.keys(price).map((quantity, i) => (
              <li key={i} className='quantity_price'>
                {quantity}: <span className='price'>{price[quantity]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span className='price'>{price}</span>
        )}
      </div>
    </li>
  )
}
