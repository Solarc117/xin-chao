import { useState } from 'preact/hooks'
import QuantityPricePair from './quantity-price'

export default function EditableProduct({
  product: { _id, category, name, description, temperature, price },
}) {
  const [singlePrice, setSinglePrice] = useState(true),
    quantityPricePairs =
      price instanceof Object
        ? Object.keys(price).map(key => [key, price[key]])
        : null

  console.log('quantityPricePairs:', quantityPricePairs)

  return (
    <form className='product'>
      <header className='product_header'>
        <input
          name='name'
          type='text'
          className='product_name'
          placeholder='Name...'
          defaultValue={name}
        />
        <label className='temperature_checkbox_label'>
          <input
            type='checkbox'
            name='hot'
            defaultChecked={temperature?.includes('hot')}
          />
          Hot
        </label>
        <label className='temperature_checkbox_label'>
          <input
            type='checkbox'
            name='cold'
            defaultChecked={temperature?.includes('cold')}
          />
          Cold
        </label>

        <button type='button' onClick={saveChanges}>
          Save
        </button>
      </header>
      <hr />
      <div className='product_body'>
        <textarea name='description' defaultValue={description} />

        <fieldset className='price_fieldset'>
          <legend>Price Options</legend>
          <label>
            Single Price
            <input
              type='radio'
              name='price_option'
              value='single_price'
              className='price_option'
              // onClick={() => (!singlePrice ? setSinglePrice(true) : '')}
            />
          </label>
          <label>
            Price Per Quantity
            <input
              type='radio'
              name='price_option'
              value='multiple_prices'
              className='price_option'
              // onClick={() => (singlePrice ? setSinglePrice(false) : '')}
            />
          </label>
          <hr />
          <label>
            Price:
            <input
              type='number'
              name='price'
              className='single_price'
              step='0.01'
              min='0.01'
              placeholder='4.99'
              required
              defaultValue={!(price instanceof Object) ? price : void 0}
              disabled={singlePrice}
            />
          </label>
          <fieldset
            className='quantity_prices_fieldset'
            disabled={!singlePrice}
          >
            <legend>Price Per Quantity:</legend>
            <fieldset className='quantity_price_pair'>
              <label>
                Quantity:
                <input
                  type='text'
                  placeholder='8oz'
                  maxLength='15'
                  defaultValue={quantityPricePairs?.[0][0] || void 0}
                  required
                />
              </label>
              <label>
                Price:
                <input
                  type='number'
                  step='0.01'
                  min='0.01'
                  placeholder='4.99'
                  defaultValue={quantityPricePairs?.[0][1] || void 0}
                  required
                />
              </label>
            </fieldset>
            {Array.isArray(quantityPricePairs) &&
              quantityPricePairs.slice(1).map(([quantity, price], i) => (
                <fieldset
                  key={i}
                  className=' quantity_price_pair additional_pair '
                >
                  <label>
                    Quantity:
                    <input
                      type='text'
                      placeholder='8oz'
                      defaultValue={quantity}
                    />
                  </label>
                  <label>
                    Price:
                    <input
                      type='number'
                      step='0.01'
                      min='0.01'
                      placeholder='4.99'
                      defaultValue={quantityPricePairs?.[0][1] || void 0}
                      required
                    />
                  </label>
                </fieldset>
              ))}
          </fieldset>
        </fieldset>

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
    </form>
  )
}
