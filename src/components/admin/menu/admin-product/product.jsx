import { edit, deleteIcon } from '../../../../assets/svgs'
import '../../../../types'

/**
 * @param {{
 *  product: Product,
 *  admin: boolean,
 *  setEditable: import('preact/hooks').StateUpdater
 * }} props
 * @returns {import('preact').Component}
 */
export default function Product({
  product: { _id, category, name, description, temperature, price },
  admin,
  setEditable,
}) {
  const symbols = {
    hot: '🔴',
    cold: '🔵',
  }

  async function confirmDeletion(event) {
    if (!confirm(`Are you sure you wish to delete ${name}?`)) return

    let response
    try {
      response = await fetch('/.netlify/functions/item', {
        method: 'DELETE',
        body: JSON.stringify({ _id }),
      })
    } catch (error) {
      console.error(error)

      // TODO: notify user.
      return alert(`Could not delete ${name}`)
    }

    const result = await response.json()

    if (response.status !== 200) {
      console.error(result)
      return alert(`Could not delete ${name}`)
    }

    console.log(result)
    alert(`✅ ${name} deleted!`)
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
              onClick={() => setEditable(true)}
            />
            <img
              className='svg admin_svg'
              src={deleteIcon}
              alt='Delete'
              title={`Delete ${name}`}
              onClick={confirmDeletion}
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
                {quantity}: <span className='price'>${price[quantity]}</span>
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
