import { useMenu } from '../../../context/client-context'
import { useNotifications } from '../../../context/notification-context'
import { useState } from 'preact/hooks'
import Loading from '../../loading'

/**
 * Only renders when the stateful editable value is true in its parent - should only ever use setEditable to set editable to false.
 * @param {{ categoryNames: string[], product: object, setEditable: import('preact/hooks').StateUpdater<boolean>}} param0
 * @returns {import('preact').Component}
 */
export default function EditableProduct({
  categoryNames,
  product: { _id, name, description, category, temperature, price },
  setEditable,
}) {
  const [singlePrice, setSinglePrice] = useState(!(price instanceof Object)),
    [quantityPricePairs, setQuantityPricePairs] = useState(
      !(price instanceof Object)
        ? [['', '']]
        : Object.keys(price).map(key => [key, price[key]])
    ),
    [loading, setLoading] = useState(false),
    [, updateMenu] = useMenu(),
    notify = useNotifications()

  async function saveChanges(event) {
    event.preventDefault()

    setLoading(true)

    const data = Object.fromEntries(new FormData(event.target).entries()),
      item = {
        name: data.name,
        description: data.description,
        category: data.category,
        temperature: ['hot', 'cold'].filter(key => key in data),
        price:
          'price' in data
            ? (+data.price).toFixed(2)
            : (() => {
                const prices = {}

                for (const quantityKey of Object.keys(data).filter(key =>
                  key.startsWith('quantity')
                )) {
                  const index = quantityKey.at(-1),
                    quantity = data[quantityKey],
                    price = (+data[`price${index}`]).toFixed(2)
                  prices[quantity] = price
                }

                return prices
              })(),
      }

    let response, result
    try {
      response = await fetch('/.netlify/functions/item', {
        method: 'PATCH',
        body: JSON.stringify({ _id, item }),
      })
      result = await response.json()
    } catch (error) {
      console.error(error)
      notify('❌ Error updating item, please try again later')
      setLoading(false)
      return setEditable(false)
    }

    const statusType = +`${response.status}`[0]

    if (statusType !== 2) {
      if (statusType === 4) {
        console.error(result.error)
        notify(`❌ Could not update item: ${result.error}`)
      } else notify('❌ Could not update product - please try again later')

      setLoading(false)
      return setEditable(false)
    }

    const { value: updatedProduct } = result

    notify('✅ Product updated!')
    setLoading(false)
    setEditable(false)
    updateMenu(
      updatedProduct,
      'update',
      category === updatedProduct.category ? void 0 : category
    )
  }

  return (
    <>
      {loading && <Loading />}
      <form className='product product_form' onSubmit={saveChanges}>
        <button
          type='button'
          className='button'
          onClick={() => setEditable(false)}
        >
          Close
        </button>
        <header className='product_header product_form_header'>
          <input
            name='name'
            type='text'
            className='product_name product_form_name'
            placeholder='Name...'
            defaultValue={name}
            required
          />
          <div className='temperature_checkbox_labels'>
            <label className='temperature_checkbox_label'>
              <input
                type='checkbox'
                name='hot'
                defaultChecked={temperature?.includes('hot')}
              />
              🔴Hot
            </label>
            <label className='temperature_checkbox_label'>
              <input
                type='checkbox'
                name='cold'
                defaultChecked={temperature?.includes('cold')}
              />
              🔵Cold
            </label>
          </div>
        </header>
        <hr />
        <div className='product_body'>
          <textarea
            className='product_form_description'
            name='description'
            placeholder='Product description (optional)'
            defaultValue={description}
          />

          <label className='category_selection'>
            Category:
            <select name='category' className='form_input' required>
              {categoryNames.map((currentCategory, i) => (
                <option
                  key={i}
                  value={currentCategory}
                  selected={currentCategory === category}
                >
                  {currentCategory}
                </option>
              ))}
            </select>
          </label>

          <fieldset className='product_form_price_fieldset'>
            <legend>Price Options</legend>
            <label>
              <input
                type='radio'
                name='price_option'
                value='single_price'
                className='price_option product_form_price_option'
                defaultChecked={singlePrice}
                onClick={() => (!singlePrice ? setSinglePrice(true) : '')}
              />
              Single Price
            </label>
            <label>
              <input
                type='radio'
                name='price_option'
                value='multiple_prices'
                className='price_option product_form_price_option'
                defaultChecked={!singlePrice}
                onClick={() => (singlePrice ? setSinglePrice(false) : '')}
              />
              Per Quantity
            </label>
            <hr />
            {singlePrice ? (
              <label className='single_price_label'>
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
                />
              </label>
            ) : (
              <fieldset className='quantity_prices_fieldset form_quantities_fieldset'>
                {quantityPricePairs.map(([quantity, price], i) => (
                  <fieldset
                    key={i}
                    className={`quantity_price_pair form_quantity_pair ${
                      i > 1 ? 'additional_pair' : ''
                    }`}
                  >
                    <label>
                      Quantity:
                      <input
                        type='text'
                        name={`quantity${i}`}
                        placeholder='8oz'
                        value={quantity}
                        onChange={({ target: { value } }) =>
                          setQuantityPricePairs(prior => [
                            ...prior.slice(0, i),
                            [value, prior[i][1]],
                            ...prior.slice(i + 1),
                          ])
                        }
                        required
                      />
                    </label>
                    <label>
                      Price:
                      <input
                        type='number'
                        name={`price${i}`}
                        step='0.01'
                        min='0.01'
                        placeholder='4.99'
                        value={price}
                        onChange={({ target: { value } }) =>
                          setQuantityPricePairs(prior => [
                            ...prior.slice(0, i),
                            [prior[i][0], value],
                            ...prior.slice(i + 1),
                          ])
                        }
                        required
                      />
                    </label>
                    {i !== 0 && (
                      <button
                        type='button'
                        className='button'
                        onClick={() =>
                          setQuantityPricePairs(prior =>
                            prior.filter((_, index) => index !== i)
                          )
                        }
                      >
                        Remove Quantity
                      </button>
                    )}
                  </fieldset>
                ))}
                {quantityPricePairs.length <= 4 && (
                  <button
                    className='button'
                    type='button'
                    onClick={() =>
                      setQuantityPricePairs(prior => [...prior, ['', '']])
                    }
                  >
                    Add Quantity
                  </button>
                )}
              </fieldset>
            )}
          </fieldset>
        </div>
        <button type='submit' className='button'>
          Save
        </button>
      </form>
    </>
  )
}
