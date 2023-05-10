import { useState } from 'preact/hooks'
import { useMenu } from '../../context/client-context'
import { useNotifications } from '../../context/notification-context'
import Loading from '../loading'
import AdminProduct from './menu/admin-product'
import '../../css/menu.css'
import '../../css/admin-home.css'

export default function AdminMenu({ categories }) {
  const [, updateMenu] = useMenu(),
    [addingProduct, setAddingProduct] = useState(false),
    [singlePrice, setSinglePrice] = useState(true),
    [quantityPricePairs, setQuantityPricePairs] = useState([['', '']]),
    [loading, setLoading] = useState(false),
    notify = useNotifications(),
    categoryNames = [
      'Coffee',
      'Non-Coffee',
      'Milk Teas',
      'Specialty Sodas',
      'Smoothies',
      'Appetizers',
      'Other',
    ],
    categoryId = name => name.toLowerCase().replace(/\s/g, '_')

  /**
   * @param {Event} event
   */
  async function submitProduct(event) {
    event.preventDefault()

    setLoading(true)
    setAddingProduct(false)

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
        method: 'POST',
        body: JSON.stringify({ item }),
      })
    } catch (error) {
      console.error(error)
      notify('❌ Error adding item, please try again later')
      setLoading(false)
      return setAddingProduct(false)
    }

    if (response.status !== 200) {
      notify('❌ Could not add item, please try again later')
      setLoading(false)
      return setAddingProduct(false)
    }

    notify('✅ product added!')
    setLoading(false)
    setAddingProduct(false)
    const { insertedId } = await response.json()
    item._id = insertedId
    updateMenu(item, 'add')
  }

  return (
    <>
      {loading && <Loading />}
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
      {addingProduct ? (
        <form className='product product_form' onSubmit={submitProduct}>
          <button
            type='button'
            className='button'
            onClick={() => setAddingProduct(false)}
          >
            Close
          </button>
          <header className='product_header product_form_header'>
            <input
              name='name'
              type='text'
              className='product_name product_form_name'
              placeholder='Name...'
              required
            />
            <div className='temperature_checkbox_labels'>
              <label className='temperature_checkbox_label'>
                <input type='checkbox' name='hot' />
                🔴Hot
              </label>
              <label className='temperature_checkbox_label'>
                <input type='checkbox' name='cold' />
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
            />

            <label className='category_selection'>
              Category:
              <select name='category' className='form_input' required>
                {categoryNames.map((categoryName, i) => (
                  <option key={i} value={categoryName}>
                    {categoryName}
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
                  onClick={() => setSinglePrice(true)}
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
                  />
                </label>
              ) : (
                <fieldset className='quantity_prices_fieldset form_quantities_fieldset'>
                  {quantityPricePairs.map(([quantity, price], i) => (
                    <fieldset
                      key={i}
                      className={`quantity_price_pair form_quantity_pair ${
                        i > 1 && 'additional_pair'
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
            Add Product
          </button>
        </form>
      ) : (
        <button
          className='button add_product_button'
          type='button'
          onClick={() => setAddingProduct(true)}
        >
          Add Product
        </button>
      )}
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
                  {...{
                    product,
                    key: i,
                    categoryNames,
                  }}
                />
              ))}
            </ul>
          </>
        ))}
      </section>
    </>
  )
}
