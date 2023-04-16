import '../../types.js'
import messages from '../../messages.json'

/**
 * A browser page.
 */
class Page {
  /**
   * Returns the first this.Element within the document that matches the specified selector.
   * @param {string} selector - A DOMString containing one or more selectors to match.
   * @returns {this.Element | null} - An this.Element object representing the first this.element in the document that matches the specified set of CSS selectors, or null if no matches are found.
   */
  query = document.querySelector.bind(document)

  /**
   * Returns a static NodeList representing a list of elements matching the specified group of selectors.
   * @param {string} selector - A DOMString containing one or more selectors to match.
   * @returns {NodeList | null} - A NodeList object representing a list of elements in the document that match the specified set of CSS selectors.
   */
  queryAll = document.querySelectorAll.bind(document)

  /**
   * Creates an this.element with the specified tag name.
   * @param {string} tagName - A string that specifies the type of this.element to be created.
   * @returns {this.Element} - The created this.Element object.
   */
  element = document.createElement.bind(document)
}

/**
 * The admin home page.
 */
class AdminHome extends Page {
  constructor(
    itemKey,
    adminLoginPath,
    categoryNavId,
    menuSectionId,
    categoryOptionsId,
    itemDeletePopUpId
  ) {
    super()
    this.itemKey = itemKey
    this.adminLoginPath = adminLoginPath
    this.categoryNav = this.query(`#${categoryNavId}`)
    this.menuSection = this.query(`#${menuSectionId}`)
    this.categoryOptions = this.query(`#${categoryOptionsId}`)
    this.popUpId = itemDeletePopUpId
  }

  /**
   * Redirects client to login page if the authentication request fails (different from the request returning an unauthorized or forbidden code; server error).
   * @returns {boolean} An indicator of whether the client could be authenticated or not (due to a server error; if request shows client is explicitly missing credentials, they are redirected).
   */
  async authenticate() {
    let response
    try {
      response = await fetch('/.netlify/functions/verify')
    } catch (error) {
      console.error(error)
      return false
    }
    const { status } = response

    if (status === 401 || status === 403)
      return window.location.replace(
        `${window.location.origin}${this.adminLoginPath}`
      )

    return status === 200
  }

  /** @returns {boolean} An indicator of whether the menu is stored after the operation. */
  async storeMenuIfNotStored() {
    if (typeof sessionStorage.getItem(this.itemKey) === 'string') return true
    notify(messages[Math.floor(Math.random() * messages.length)])

    let categories
    try {
      categories = await fetch('/.netlify/functions/menu').then(response =>
        response.json()
      )
      sessionStorage.setItem(this.itemKey, JSON.stringify(categories))
    } catch (error) {
      console.error(error)
      return false
    }

    return true
  }

  initializeDeleteItemPopUp() {
    const popUp = this.element('div')
    document.body.appendChild(popUp)
    popUp.outerHTML = `<div 
      id="${this.popUpId}" 
      class="delete_product_pop_up"
    >
      <span></span>
      <div class="pop_up_buttons">
        <button id="cancel_pop_up_button" class="cancel_button">Cancel</button>
        <button id="delete_product" class="delete_button">Delete</button>
      </div>
    </div>`

    function hidePopUp(popUpId) {
      const deletePopUp = document.querySelector(`#${popUpId}`),
        span = document.querySelector(`#${popUpId} span`)

      deletePopUp.setAttribute('hidden', 'hidden')
      span.textContent = ''
    }
    const cancelButtonId = 'cancel_pop_up_button'
    this.query(`#${cancelButtonId}`).addEventListener('click', () =>
      hidePopUp(this.popUpId)
    )
  }

  displayDeletePopUp(productName, productId) {
    const popUp = this.query(`#${this.popUpId}`),
      span = this.query(`#${this.popUpId} span`)

    span.textContent = `Are you sure you wish to delete ${productName}?`

    const deleteButton = this.query(
      `#${this.popUpId} button:contains('Delete')`
    )
    deleteButton.dataset.product_id = productId
  }

  /**
   *
   * @param {Product} product The product object from which to construct the li's outerHTML.
   * @param {boolean} admin An indicator of whether to generate a li item for the admin page, with edit options. Defaults to false.
   * @returns {string} The li this.element's outerHTML.
   */
  liElementFromProduct(product) {
    const { _id, name, description, price, temperature } = product,
      emojis = {
        hot: '🔥',
        cold: '❄️',
      }

    return `<li class="item" id="${_id}">
                  <header class="item_header">
                    <span class="item_name">
                      ${
                        temperature.length === 0
                          ? name
                          : name +
                            temperature
                              .map(
                                option =>
                                  `<span class="emoji" title="Available ${option}">${emojis[option]}</span>`
                              )
                              .join('')
                      }
                    </span>
                    <span class="admin_buttons">
                      <span
                        class="admin_button item_edit_button emoji"
                        data-id="${_id}"
                        title="Edit ${name}"
                      >
                      ✏️
                      </span> 
                      <span
                        class="admin_button item_delete_button emoji"
                        data-id="${_id}"
                        title="Delete ${name}"
                      >
                      ❌
                      </span>
                    </span>
                  </header>
                  <hr />
                  <div class="item_body">
                    <p class="item_description">${description}</p>
                    ${
                      price instanceof Object
                        ? `<ul class="quantity_prices">
                          ${Object.keys(price)
                            .map(
                              quantity => `
                                <li class="quantity_price">${quantity}: <span class="price">$${price[quantity]}</span></li>`
                            )
                            .join('')}
                        </ul>`
                        : `<span class="price">${price}</span>`
                    }
                  </div>
            </li>`
  }

  async initializePage() {
    if (!(await this.authenticate()))
      return notify('❌ Something went wrong, please try again later')

    if (!(await this.storeMenuIfNotStored()))
      return notify(
        '❌ Could not fetch menu; please refer to our Google page or try again later'
      )

    this.initializeDeleteItemPopUp()

    const itemCategories = JSON.parse(sessionStorage.getItem(this.itemKey))

    for (const { category, products } of itemCategories) {
      const categoryId = category.toLowerCase().replace(/\s/g, '_')

      // Category navigation.
      const navTitle = this.element('li')
      this.categoryNav.appendChild(navTitle)
      navTitle.outerHTML = `<li class="category_title">
        <a href="#${categoryId}">${category}</a>
      </li>`

      // Items.
      const categorySection = this.element('section')
      this.menuSection.appendChild(categorySection)
      categorySection.outerHTML = `<section id="${categoryId}" class="category">
        <h2>${category}</h2>
        <ul class="category_items">
        ${products
          .map(product => this.liElementFromProduct(product, true))
          .join(' ')}
        </ul>
      </section>`

      // Item form option tags.
      const optionElement = this.element('option')
      this.categoryOptions.appendChild(optionElement)
      optionElement.outerHTML = `<option value="${category}">${category}</option>`
    }
  }
}

/**
 * The admin product edit/submit form.
 */
class AdminForm {
  constructor(formId, quantitiesFieldsetId) {
    window.removeParentOnClick = event => event.target.parentElement.remove()

    this.formId = formId
    this.quantitiesFieldsetId = quantitiesFieldsetId
  }

  initializeForm() {
    const adminForm = this.element('form')
    adminForm.outerHTML = `<form id="${this.formId}" class="admin_form" hidden>
        <button type="button" id="close_form_button">Close</button>

        <label>
          Name:<br />
          <input class="form_input" type="text" name="name" placeholder="Name" maxlength="30" required />
        </label>

        <label>
          Description:<br />
          <textarea class="form_input" name="description" placeholder="Description" maxlength="120"></textarea>
        </label>

        <label>
          Category:<br />
          <select class="form_input" name="category" id="category_options" required>
            <option value selected>Please select a category</option>
          </select>
        </label>

        <fieldset class="price_fieldset">
          <legend>Price Options</legend>
          <label>
            <input type="radio" name="price_option" value="single_price" id="single_price_option" class="price_option" checked /> Single
          </label>
          <label>
            <input type="radio" name="price_option" value="multiple_prices" id="multiple_price_option" class="price_option" /> Multiple
          </label>
          <hr />
          <label>
            Price:<br />
            <input type="number" name="price" class="single_price" id="single_price" step="0.01" min="0.01" placeholder="$4.99" required />
          </label>
          <fieldset class="quantity_prices_fieldset" id="quantity_prices_fieldset" disabled>
            <legend>Price Per Quantity:</legend>
            <fieldset class="quantity_price_pair">
              <label>
                Quantity:
                <input type="text" placeholder="8oz" required />
              </label>
              <label>
                Price:
                <input type="number" pattern="^\$?\d+\.?\d{0,2}?$" step="0.01" min="0.01" placeholder="$5.99" required />
              </label>
            </fieldset>
            <button class="add_quantity_button" id="add_quantity_button">Add Quantity</button>
          </fieldset>
        </fieldset>

        <fieldset class="temperature_fieldset">
          <legend>Temperature Options</legend>
          <label>
            Hot 🔥
            <input type="checkbox" name="hot" value="hot" />
          </label>
          <label>
            Cold ❄️
            <input type="checkbox" name="cold" value="cold" />
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </form>`
  }

  resetForm() {
    const form = this.query(this.formId)
    form.reset()
  }

  addQuantityPricePair(price, quantity) {
    const newField = this.element('fieldset')
    newFieldset.outerHTML = `<fieldset class="quantity_price_pair additional_pair">
      <label>
        Quantity:
        <input
          type="text"
          placeholder="8oz"
          ${typeof quantity === 'string' ? `value="${quantity}"` : ''}
          required
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          pattern="^\$?\d+\.?\d{0,2}?$"
          step="0.01"
          min="0.01"
          placeholder="$5.99"
          ${typeof price === 'string' ? `value="${price}"` : ''}
          required
        />
      </label>
      <button 
        class="remove_quantity_button" 
        type="button" 
        onclick="removeParentOnClick(event)"
      >
        Remove Quantity
      </button>
    </fieldset>`

    const quantitiesFieldset = this.query(`#${this.quantitiesFieldsetId}`)
    quantitiesFieldset.insertBefore(
      newField,
      quantitiesFieldset.lastElementChild
    )
  }
}

class ProductAPI {
  constructor(apiUrl) {
    this.apiUrl = apiUrl
  }

  formatItemData(form) {
    const formData = new FormData(form)
    let item = {
      temperature: [],
    }

    for (const [key, value] of formData)
      switch (key) {
        case 'hot':
        case 'cold':
          item.temperature.push(key)
          break
        case 'price_option':
          if (!value.includes('multiple')) break

          if (!item.price) item.price = {}
          for (const child of this.query('#quantity_prices_fieldset')
            .children) {
            if (!/fieldset/i.test(child.tagName)) continue

            const [text, number] = Array.from(child.children),
              [quantity, price] = [text, number].map(
                element => element.children[0].value
              )

            item.price[quantity] = price
          }

          break
        default:
          item[key] = value
      }

    return item
  }

  /** @param {SubmitEvent} submitEvent */
  async addItem(submitEvent) {
    submitEvent.preventDefault()
    const { target } = submitEvent,
      body = JSON.stringify(this.formatItemData(target))

    const response = await fetch('/.netlify/functions/item', {
      method: 'POST',
      body,
    })
    if (response.status === 409)
      return notify('❌ An item with that name already exists')

    const data = await response.json()

    if (data.acknowledged === true && typeof data.insertedId === 'string') {
      hideAndResetForm()
      return notify('✅ Item created!')
    }
    if (data.error) console.error(data.error)
    notify('❌ Something went wrong, please try again later')
  }
  /** @param {SubmitEvent} submitEvent */
  static async editItemById(submitEvent) {
    submitEvent.preventDefault()
    const { target } = submitEvent,
      id = target.dataset.id,
      item = ProductAPI.formatItemData(target)

    try {
      const response = await fetch('/.netlify/functions/item', {
          method: 'PATCH',
          body: JSON.stringify({ id, item }),
        }),
        { value: newItem } = await response.json()

      if (response.status !== 200) {
        console.error(data)
        return notify('❌ Something went wrong, please try again later')
      }

      notify('✅ Item Updated!')
      this.query(`[id="${id}"]`).outerHTML = liElementFromProduct(newItem, true)
      hideAndResetForm()
    } catch (error) {
      console.error(error)
      return notify('❌ Something went wrong, please try again later')
    }
  }
  /** @param {PointerEvent} clickEvent */
  static async deleteItemById(clickEvent) {
    const { id } = clickEvent.target.dataset

    try {
      const response = await fetch('/.netlify/functions/item', {
          method: 'DELETE',
          body: JSON.stringify({ id }),
        }),
        result = await response.json()
    } catch (error) {
      console.error(error)
      return notify('❌ Could not delete item, please try again later')
    }
  }
}

const adminHome = new AdminHome(
  'items',
  '/admin/',
  'category_nav',
  'menu_section',
  'category_options',
  'delete_product_pop_up'
)

adminHome.initializePage()

// fetch('/.netlify/functions/verify')
//   .then(async ({ status }) => {
//     if (status === 401 || status === 403)
//       return window.location.replace(
//         `${window.location.origin}/admin/login.html`
//       )
//     if (status !== 200)
//       return notify('❌ Something went wrong, please try again later')

//     const response = await fetch('/.netlify/functions/menu'),
//       itemCategories = await response.json()

//     if (response.status === 500) {
//       console.error(itemCategories.error)
//       return notify('❌ Something went wrong, please try again later')
//     }
//     sessionStorage.setItem('items', JSON.stringify(itemCategories))

//     const this.query = document.querySelector.bind(document),
//       this.queryAll = document.querySelectorAll.bind(document),
//       newElement = document.createElement.bind(document)

//     const [categoryNav, menuSection, categoryOptions] = [
//       '#category_nav',
//       '#menu_section',
//       '#category_options',
//     ].map(this.query)

//     function liElementFromProduct(
//       { _id, name, description, price, temperature },
//       admin = false
//     ) {
//       const emojis = {
//         hot: '🔥',
//         cold: '❄️',
//       }

//       return `<li class="item" id="${_id}">
//                   <header class="item_header">
//                     <span class="item_name">${
//                       temperature.length === 0
//                         ? name
//                         : name +
//                           temperature
//                             .map(
//                               option =>
//                                 `<span class="emoji" title="Available ${option}">${emojis[option]}</span>`
//                             )
//                             .join('')
//                     }</span>
//                     ${
//                       admin
//                         ? `<span class="admin_buttons">
//                       <span
//                         class="admin_button item_edit_button emoji"
//                         data-id="${_id}"
//                         title="Edit ${name}"
//                       >
//                       ✏️
//                       </span>
//                       <span
//                         class="admin_button item_delete_button emoji"
//                         data-id="${_id}"
//                         title="Delete ${name}"
//                       >
//                       ❌
//                       </span>
//                     </span>`
//                         : ''
//                     }
//                   </header>
//                   <hr />
//                   <div class="item_body">
//                     <p class="item_description">${description}</p>
//                     ${
//                       price instanceof Object
//                         ? `<ul class="quantity_prices">
//                           ${Object.keys(price)
//                             .map(
//                               quantity => `
//                                 <li class="quantity_price">${quantity}: <span class="price">$${price[quantity]}</span></li>`
//                             )
//                             .join('')}
//                         </ul>`
//                         : `<span class="price">${price}</span>`
//                     }
//                   </div>
//                 </li>`
//     }

//     for (const { category, products } of itemCategories) {
//       const [navTitle, categorySection] = ['li', 'section'].map(newElement),
//         categoryId = category.toLowerCase().replace(/\s/g, '_')

//       // Category navigation.
//       navTitle.classList.add('category_title')
//       navTitle.innerHTML = `<a href="#${categoryId}">${category}</a>`
//       categoryNav.appendChild(navTitle)

//       // Items.
//       categorySection.id = categoryId
//       categorySection.classList.add('category')
//       categorySection.innerHTML = `<h2>${category}</h2>
//         <ul class="category_items">
//           ${products
//             .map(product => liElementFromProduct(product, true))
//             .join(' ')}
//         </ul>`
//       menuSection.appendChild(categorySection)

//       const optionElement = newElement('option')
//       // Item form option tags.
//       optionElement.setAttribute('value', category)
//       optionElement.textContent = category
//       categoryOptions?.appendChild(optionElement)
//     }

//     // EDIT FORM.
//     function resetForm() {
//       form.reset()
//       form.removeAttribute('data-id')
//       for (const this.element of this.queryAll('.additional_pair')) this.element.remove()
//     }
//     function hideAndResetForm() {
//       form.setAttribute('hidden', 'hidden')
//       resetForm()
//     }
//     function switchPriceOption(event) {
//       const { target } = event,
//         singlePriceInput = this.query('#single_price')

//       if (target.id === 'single_price_option') {
//         singlePriceInput.removeAttribute('disabled')
//         return quantitiesFieldset.setAttribute('disabled', true)
//       }

//       singlePriceInput.setAttribute('disabled', true)
//       quantitiesFieldset.removeAttribute('disabled')
//     }
//     function addQuantityPricePair(quantityPrice) {
//       const newField = newElement('fieldset')
//       let quantity, price
//       if (quantityPrice instanceof Object)
//         [[quantity, price]] = Object.entries(quantityPrice)

//       newField.classList.add('quantity_price_pair')
//       newField.classList.add('additional_pair')
//       newField.innerHTML = `<label>
//           Quantity:
//           <input
//             type="text"
//             placeholder="8oz"
//             ${typeof quantity === 'string' ? `value="${quantity}"` : ''}
//             required
//           />
//         </label>
//         <label>
//           Price:
//           <input
//             type="number"
//             pattern="^\$?\d+\.?\d{0,2}?$"
//             step="0.01"
//             min="0.01"
//             placeholder="$5.99"
//             ${typeof price === 'string' ? `value="${price}"` : ''}
//             required
//           />
//         </label>
//        <button class="remove_quantity_button" type="button" onclick="removeParentOnClick(event)">Remove Quantity</button>`

//       quantitiesFieldset.insertBefore(
//         newField,
//         quantitiesFieldset.lastElementChild
//       )
//     }
//     class ItemAPI {
//       static apiUrl = '/.netlify/functions/item'
//       static formatItemData(form) {
//         const formData = new FormData(form)
//         let item = {
//           temperature: [],
//         }

//         for (const [key, value] of formData)
//           switch (key) {
//             case 'hot':
//             case 'cold':
//               item.temperature.push(key)
//               break
//             case 'price_option':
//               if (value.includes('multiple')) {
//                 if (!item.price) item.price = {}
//                 for (const child of this.query('#quantity_prices_fieldset')
//                   .children) {
//                   if (!/fieldset/i.test(child.tagName)) continue

//                   const [text, number] = Array.from(child.children),
//                     [quantity, price] = [text, number].map(
//                       this.element => this.element.children[0].value
//                     )

//                   item.price[quantity] = price
//                 }
//               }
//               break
//             default:
//               item[key] = value
//           }

//         return item
//       }
//       /** @param {SubmitEvent} submitEvent */
//       static async addItem(submitEvent) {
//         submitEvent.preventDefault()
//         const { target } = submitEvent,
//           body = JSON.stringify(ItemAPI.formatItemData(target))

//         const response = await fetch('/.netlify/functions/item', {
//           method: 'POST',
//           body,
//         })
//         if (response.status === 409)
//           return notify('❌ An item with that name already exists')

//         const data = await response.json()

//         if (data.acknowledged === true && typeof data.insertedId === 'string') {
//           hideAndResetForm()
//           return notify('✅ Item created!')
//         }
//         if (data.error) console.error(data.error)
//         notify('❌ Something went wrong, please try again later')
//       }
//       /** @param {SubmitEvent} submitEvent */
//       static async editItemById(submitEvent) {
//         submitEvent.preventDefault()
//         const { target } = submitEvent,
//           id = target.dataset.id,
//           item = ItemAPI.formatItemData(target)

//         try {
//           const response = await fetch('/.netlify/functions/item', {
//               method: 'PATCH',
//               body: JSON.stringify({ id, item }),
//             }),
//             { value: newItem } = await response.json()

//           if (response.status !== 200) {
//             console.error(data)
//             return notify('❌ Something went wrong, please try again later')
//           }

//           notify('✅ Item Updated!')
//           this.query(`[id="${id}"]`).outerHTML = liElementFromProduct(newItem, true)
//           hideAndResetForm()
//         } catch (error) {
//           console.error(error)
//           return notify('❌ Something went wrong, please try again later')
//         }
//       }
//       /** @param {PointerEvent} clickEvent */
//       static async deleteItemById(clickEvent) {
//         const { id } = clickEvent.target.dataset

//         try {
//           const response = await fetch('/.netlify/functions/item', {
//               method: 'DELETE',
//               body: JSON.stringify({ id }),
//             }),
//             result = await response.json()
//         } catch (error) {
//           console.error(error)
//           return notify('❌ Could not delete item, please try again later')
//         }
//       }
//     }
//     // Add item button.
//     function displayAddItemForm() {
//       resetForm()
//       form.removeAttribute('hidden')
//       form.removeEventListener('submit', ItemAPI.editItemById)
//       form.addEventListener('submit', ItemAPI.addItem)
//     }
//     const addItemButton = newElement('button')
//     addItemButton.id = 'add_item_button'
//     addItemButton.classList.add('add_item_button')
//     addItemButton.textContent = 'Add New Item'
//     addItemButton.addEventListener('click', displayAddItemForm)
//     menuSection.parentNode.insertBefore(addItemButton, menuSection)

//     const form = this.query('#admin_form'),
//       closeFormButton = this.query('#close_form_button')
//     // Button to close form.
//     closeFormButton.addEventListener('click', hideAndResetForm)
//     // Edit form - price section interactivity.
//     const quantitiesFieldset = this.query('#quantity_prices_fieldset')
//     for (const id of ['#single_price_option', '#multiple_price_option'])
//       this.query(id)?.addEventListener('change', switchPriceOption)
//     this.query('#add_quantity_button')?.addEventListener('click', () =>
//       addQuantityPricePair()
//     )
//     // Set form to patch instead of post on item_edit button click, and fill with the data of the object selected.
//     function displayEditItemForm(item, id) {
//       if (!item instanceof Object || typeof id !== 'string') return

//       resetForm()
//       form.removeAttribute('hidden')
//       form.removeEventListener('submit', ItemAPI.addItem)
//       form.addEventListener('submit', ItemAPI.editItemById)
//       form.dataset.id = id

//       const {
//         name,
//         description,
//         category,
//         price,
//         temperature: temperatures,
//       } = item

//       this.query('input[name="name"]').value = name
//       this.query('textarea[name="description"]').value = description
//       this.query('select[name="category"]').value = category

//       if (typeof price === 'string') {
//         this.query('input[value="single_price"]').checked = true
//         this.query('input[name="price"]').value = price
//       } else {
//         this.query('input[value="multiple_prices"]').checked = true
//         const fieldset = this.query('#quantity_prices_fieldset')
//         fieldset.disabled = false
//         this.query('input[name="price"]').disabled = true

//         const quantityPriceArrays = Object.entries(price),
//           [firstQuantity, firstPrice] = quantityPriceArrays.shift(),
//           firstText = this.query('#quantity_prices_fieldset input[type="text"]'),
//           firstNumber = this.query('#quantity_prices_fieldset input[type="number"]')
//         firstText.value = firstQuantity
//         firstNumber.value = firstPrice

//         for (const [quantity, price] of quantityPriceArrays)
//           addQuantityPricePair({ [quantity]: price })
//       }

//       for (const temperature of temperatures)
//         this.query(`input[value="${temperature}"]`).checked = true
//     }

//     for (const button of this.queryAll('.item_edit_button')) {
//       const id = button.dataset.id,
//         items = JSON.parse(sessionStorage.getItem('items'))
//           .map(category => category.products)
//           .flat()
//       let item
//       for (const currentItem of items)
//         if (currentItem._id === id) item = currentItem

//       button.addEventListener('click', event =>
//         displayEditItemForm(item, event.target.dataset.id)
//       )
//     }

//     // Delete item buttons.
//     function displayDeletePopUp(itemName, itemId) {
//       const deletePopUp = newElement('div')
//       deletePopUp.id = 'delete_pop_up'
//       deletePopUp.classList.add('delete_pop_up')
//       deletePopUp.innerHTML = `<p class="warning">
//         ⚠️ Are you sure you wish to delete ${itemName}?
//         <button type="button" class="cancel_pop_up_button">Close</button>
//         <button type="button" class="delete">Delete</button>
//       </p>`
//     }
//   })
//   .catch(error => {
//     console.error(error)
//     notify('❌ Something went wrong, please try again later')
//   })
