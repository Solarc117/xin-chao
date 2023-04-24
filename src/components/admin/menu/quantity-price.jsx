/**
 * @param {{ quantity: string, price: string | number, additional: boolean }} props
 * @returns {import('preact').Component}
 */
export default function QuantityPricePair({ quantity, price, additional }) {
  return (
    <fieldset
      className={`quantity_price_pair ${
        additional === true ? 'additional_pair' : ''
      }`}
    >
      <label>
        Quantity:
        <input
          type='text'
          placeholder='8oz'
          maxLength='15'
          defaultValue={quantity || void 0}
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
          defaultValue={price || void 0}
          required
        />
      </label>
    </fieldset>
  )
}
