import '../../types.js'
import messages from '../../messages.json'

class Page {
  /**
   * Returns the first Element within the document that matches the specified selector.
   * @param {string} selector - A DOMString containing one or more selectors to match.
   * @returns {Element | null} - An Element object representing the first element in the document that matches the specified set of CSS selectors, or null if no matches are found.
   */
  query = document.querySelector.bind(document)

  /**
   * Returns an element with the specified ID.
   * @param {string} id - The ID of the element to find.
   * @returns {Element | null} The element with the specified ID or null if no such element exists.
   */
  queryId = document.getElementById.bind(document)

  /**
   * Returns a static NodeList representing a list of elements matching the specified group of selectors.
   * @param {string} selector - A DOMString containing one or more selectors to match.
   * @returns {NodeList | null} - A NodeList object representing a list of elements in the document that match the specified set of CSS selectors.
   */
  queryAll = document.querySelectorAll.bind(document)

  /**
   * Creates an this.element with the specified tag name.
   * @param {string} tagName - A string that specifies the type of this.element to be created.
   * @returns {Element} - The created Element object.
   */
  element = document.createElement.bind(document)
}

class AdminHome extends Page {
  constructor({
    itemKey,
    adminLoginPath,
    categoryNavId,
    menuSectionId,
    categoryOptionsId,
    displayFunctionName,
    popUp: {
      popUpId,
      displayPopUpFunction,
      popUpCancelButtonId,
      popUpDeleteButtonId,
    },
  }) {
    super()
    this.adminLoginPath = adminLoginPath
    this.categoryNav = this.query(`#${categoryNavId}`)
    this.menuSection = this.query(`#${menuSectionId}`)
    this.categoryOptions = this.query(`#${categoryOptionsId}`)
    this.displayFunctionName = displayFunctionName

    this.popUpId = popUpId
    this.displayPopUpFunction = displayPopUpFunction
    this.popUpCancelButtonId = popUpCancelButtonId
    this.popUpDeleteButtonId = popUpDeleteButtonId
  }

  /**
   * Redirects client to login page if the authentication request fails (different from the request returning an unauthorized or forbidden code; server error).
   * @returns {boolean} An indicator of whether the client could be authenticated or not (due to a server error; if request shows client is explicitly missing credentials, they are redirected).
   */
  async #authenticate() {
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
  async #storeMenuIfNotStored() {
    if (typeof sessionStorage.getItem(ITEM_KEY) === 'string') return true
    notify(messages[Math.floor(Math.random() * messages.length)])

    let categories
    try {
      categories = await fetch('/.netlify/functions/menu').then(response =>
        response.json()
      )
      sessionStorage.setItem(ITEM_KEY, JSON.stringify(categories))
    } catch (error) {
      console.error(error)
      return false
    }

    return true
  }

  #initializeDeleteItemPopUp() {
    const popUp = this.element('div')
    document.body.appendChild(popUp)
    popUp.outerHTML = `<div 
      id="${this.popUpId}" 
      class="delete_product_pop_up"
      hidden
    >
      <span></span>
      <div class="pop_up_buttons">
        <button id="${this.popUpCancelButtonId}" class="cancel_button">Cancel</button>
        <button id="${this.popUpDeleteButtonId}" class="delete_button">Delete</button>
      </div>
    </div>`

    function hidePopUp(popUpId, deleteButtonId) {
      const deletePopUp = document.querySelector(`#${popUpId}`),
        span = document.querySelector(`#${popUpId} span`),
        deleteButton = document.querySelector(`#${deleteButtonId}`)

      deletePopUp.setAttribute('hidden', true)
      span.textContent = ''
      delete deleteButton.dataset.product_id
    }

    this.queryId(this.popUpCancelButtonId).addEventListener('click', () =>
      hidePopUp(this.popUpId, this.popUpDeleteButtonId)
    )
  }

  /**
   *
   * @param {Product} product The product object from which to construct the li's outerHTML.
   * @param {boolean} admin An indicator of whether to generate a li item for the admin page, with edit options. Defaults to false.
   * @returns {string} The li element's outerHTML.
   */
  #liElementFromProduct(product) {
    const { _id, name, description, price, temperature } = product,
      symbols = {
        hot: '🔴',
        cold: '🔵',
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
                                  `<span class="emoji" title="Available ${option}">${symbols[option]}</span>`
                              )
                              .join('')
                      }
                    </span>
                    <span class="admin_buttons">
                      ${
                        ''
                        //   `<span
                        // class="admin_button emoji"
                        // data-id="${_id}"
                        // title="Edit ${name}"
                        // onclick="${this.displayFunctionName}(event)"
                        // ></span>`
                      }
                      <img 
                        class="svg admin_svg" 
                        src="../../svgs/edit.svg"
                        alt="Edit button"
                        title="Edit ${name}"
                        data-id="${_id}"
                        onclick="${this.displayFunctionName}(event)"
                      />
                      ${
                        ''
                        //     `<span
                        //   class="admin_button emoji"
                        //   data-id="${_id}"
                        //   data-name="${name}"
                        //   title="Delete ${name}"
                        //   onclick="${this.displayPopUpFunction}(event, ${this.popUpId}, ${this.popUpDeleteButtonId})"
                        //   >
                        //   ❌
                        // </span>`
                      }
                       <img
                        class="svg admin_svg"
                        src="../../svgs/delete.svg"
                        alt="Delete button"
                        title="Delete ${name}"
                        data-id="${_id}"
                        data-name="${name}"
                        onclick="${this.displayPopUpFunction}(event, ${
      this.popUpId
    }, ${this.popUpDeleteButtonId})"
                      />
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

  async initialize() {
    if (!(await this.#authenticate()))
      return notify('❌ Something went wrong, please try again later')

    if (!(await this.#storeMenuIfNotStored()))
      return notify(
        '❌ Could not fetch menu; please refer to our Google page or try again later'
      )

    this.#initializeDeleteItemPopUp()

    window[this.displayPopUpFunction] = function (
      {
        target: {
          dataset: { name, id },
        },
      },
      popUp,
      deleteButton
    ) {
      const span = popUp.children[0]

      span.textContent = `Are you sure you wish to delete ${name}?`
      deleteButton.dataset.product_id = id
      popUp.removeAttribute('hidden')
    }

    const addProductButton = this.element('button')
    this.menuSection.parentNode.insertBefore(addProductButton, this.menuSection)
    addProductButton.outerHTML = `<div 
        class="add_product_button" 
        onclick="${this.displayFunctionName}(event)"
      >
        Add A Product
      </div>`

    const itemCategories = JSON.parse(sessionStorage.getItem(ITEM_KEY))

    for (const { category, products } of itemCategories) {
      const categoryId = category.toLowerCase().replace(/\s/g, '_')

      // Category navigation.
      const navTitle = this.element('li')
      this.categoryNav.appendChild(navTitle)
      navTitle.outerHTML = `<li class="category_title">
        <a href="#${categoryId}">${category}</a>
      </li>`

      // Products.
      const categorySection = this.element('section')
      this.menuSection.appendChild(categorySection)
      categorySection.outerHTML = `<section id="${categoryId}" class="category">
        <h2>${category}</h2>
        <ul class="category_items">
        ${products
          .map(product => this.#liElementFromProduct(product))
          .join(' ')}
        </ul>
      </section>`
    }
  }
}

/**
 * The admin product edit/submit form.
 */
class AdminForm extends Page {
  constructor({
    formId,
    formChildrenIds: {
      quantitiesFieldset,
      categoryOptions,
      singlePriceOption,
      multiplePriceOption,
      singlePriceInputId,
    },
    displayFunctionName,
    hideFunctionName,
  }) {
    super()
    this.formId = formId
    this.quantitiesFieldsetId = quantitiesFieldset
    this.categoryOptionsId = categoryOptions
    this.singlePriceOptionId = singlePriceOption
    this.multiplePriceOptionId = multiplePriceOption
    this.singlePriceInputId = singlePriceInputId
    this.displayFunctionName = displayFunctionName
    this.hideFunctionName = hideFunctionName
  }

  apiURL = '/.netlify/functions'
  removeParentFunction = 'removeParent'
  switchPriceFunction = 'switchPriceOption'
  addQuantityPriceFunction = 'addQuantityPricePair'

  resetForm() {
    const form = this.queryId(this.formId)
    form.reset()
    form.removeAttribute('data-id')
    for (const element of this.queryAll('.additional_pair')) element.remove()
  }

  formatProductData(form) {
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
      body = JSON.stringify(this.formatProductData(target))

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
  async editItemById(submitEvent) {
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
  async deleteItemById(clickEvent) {
    const { product_id } = clickEvent.target.dataset

    console.log('id:', id)

    try {
      const response = await fetch('/.netlify/functions/item', {
          method: 'DELETE',
          body: JSON.stringify({ id }),
        }),
        result = await response.json()

      console.log('result:', result)
    } catch (error) {
      console.error(error)
      return notify('❌ Could not delete item, please try again later')
    }
  }

  initialize() {
    const self = this

    window[self.displayFunctionName] = function (event) {
      const form = self.queryId(self.formId)
      form.removeAttribute('hidden')

      const { id } = event.target.dataset
      for (const { products } of JSON.parse(sessionStorage.getItem(ITEM_KEY)))
        for (const product of products)
          if (product._id === id) {
            const {
              name,
              description,
              category,
              price,
              temperature: temperatures,
            } = product

            self.query('input[name="name"]').value = name
            self.query('textarea[name="description"]').value = description
            self.query('select[name="category"]').value = category
            if (typeof price === 'string') {
              self.query('input[value="single_price"]').checked = true
              self.query('input[name="price"]').value = price
            } else {
              self.query('input[value="multiple_prices"]').checked = true
              const fieldset = self.queryId(self.quantitiesFieldsetId)
              fieldset.disabled = false
              self.query('input[name="price"]').disabled = true

              const quantityPriceArrays = Object.entries(price),
                [firstQuantity, firstPrice] = quantityPriceArrays.shift(),
                firstText = self.query(
                  `#${self.quantitiesFieldsetId} input[type="text"]`
                ),
                firstNumber = self.query(
                  `#${self.quantitiesFieldsetId} input[type="number"]`
                )
              firstText.value = firstQuantity
              firstNumber.value = firstPrice

              for (const [quantity, price] of quantityPriceArrays)
                window[self.addQuantityPriceFunction]({ [quantity]: price })
            }

            for (const temperature of temperatures)
              self.query(`input[value="${temperature}"]`).checked = true
          }
    }

    window[self.hideFunctionName] = function () {
      const form = self.queryId(self.formId)
      self.resetForm()
      form.setAttribute('hidden', true)
    }

    window[self.switchPriceFunction] = function ({ target }) {
      const singlePriceInput = self.queryId(self.singlePriceInputId),
        quantitiesFieldset = self.queryId(self.quantitiesFieldsetId)

      if (target.id === 'single_price_option') {
        singlePriceInput.removeAttribute('disabled')
        return quantitiesFieldset.setAttribute('disabled', true)
      }

      singlePriceInput.setAttribute('disabled', true)
      quantitiesFieldset.removeAttribute('disabled')
    }

    window[self.addQuantityPriceFunction] = function (quantityPrice) {
      window[self.removeParentFunction] = function ({ target }) {
        target.parentElement.remove()
      }

      let quantity, price
      if (quantityPrice instanceof Object)
        [[quantity, price]] = Object.entries(quantityPrice)

      const newField = self.element('fieldset'),
        quantitiesFieldset = self.queryId(self.quantitiesFieldsetId)
      quantitiesFieldset.insertBefore(
        newField,
        quantitiesFieldset.lastElementChild
      )
      newField.outerHTML = `<fieldset class="quantity_price_pair additional_pair">
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
        onclick="${self.removeParentFunction}(event)"
      >
        Remove Quantity
      </button>
        </fieldset>`
    }

    const adminForm = this.element('form')
    document.body.appendChild(adminForm)
    adminForm.outerHTML = `<form id="${this.formId}" class="admin_form" hidden>
        <button type="button" onclick="${
          this.hideFunctionName
        }(event)">Close</button>

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
          <select class="form_input" name="category" id="${
            this.categoryOptions
          }" required>
            <option value selected>Please select a category</option>
            ${JSON.parse(sessionStorage.getItem('items'))
              .map(
                ({ category }) =>
                  `<option value="${category}">${category}</option>`
              )
              .join('')}
          </select>
        </label>
        <fieldset class="price_fieldset">
          <legend>Price Options</legend>
          <label>
            <input type="radio" name="price_option" value="single_price" id="${
              this.singlePriceOptionId
            }" class="price_option" onclick="${
      this.switchPriceFunction
    }(event)" checked /> Single
          </label>
          <label>
            <input type="radio" name="price_option" value="multiple_prices" id="${
              this.multiplePriceOptionId
            }" class="price_option" onclick="${
      this.switchPriceFunction
    }(event)"/> Multiple
          </label>
          <hr />
          <label>
            Price:<br />
            <input type="number" name="price" class="single_price" id="${
              this.singlePriceInputId
            }" step="0.01" min="0.01" placeholder="$4.99" required />
          </label>
          <fieldset class="quantity_prices_fieldset" id="${
            this.quantitiesFieldsetId
          }" disabled>
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
            <button class="add_quantity_button" type="button" onclick="${
              this.addQuantityPriceFunction
            }(event)">Add Quantity</button>
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
}

const ITEM_KEY = 'items'

const adminFormSettings = {
    formId: 'admin_form',
    formChildrenIds: {
      quantitiesFieldset: 'quantity_prices_fieldset',
      categoryOptions: 'category_options',
      singlePriceOption: 'single_price_option',
      multiplePriceOption: 'multiple_price_option',
      singlePriceInputId: 'single_price',
    },
    displayFunctionName: 'displayForm',
    hideFunctionName: 'hideForm',
  },
  adminForm = new AdminForm(adminFormSettings)

const adminHomeSettings = {
    adminLoginPath: '/admin/',
    categoryNavId: 'category_nav',
    menuSectionId: 'menu_section',
    categoryOptionsId: 'category_options',
    displayFunctionName: adminForm.displayFunctionName,
    popUp: {
      popUpId: 'delete_product_pop_up',
      displayPopUpFunction: 'displayPopUp',
      popUpCancelButtonId: 'cancel_pop_up_button',
      popUpDeleteButtonId: 'delete_product',
    },
  },
  adminHome = new AdminHome(adminHomeSettings)

adminHome.initialize()
adminForm.initialize()

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
//                         class="admin_button product_edit_button emoji"
//                         data-id="${_id}"
//                         title="Edit ${name}"
//                       >
//                       ✏️
//                       </span>
//                       <span
//                         class="admin_button product_delete_button emoji"
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
//       form.setAttribute('hidden', true)
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
// resetForm()
// form.removeAttribute('hidden')
// form.removeEventListener('submit', ItemAPI.editItemById)
// form.addEventListener('submit', ItemAPI.addItem)
//     }
// const addItemButton = newElement('button')
// addItemButton.id = 'add_product_button'
// addItemButton.classList.add('add_product_button')
// addItemButton.textContent = 'Add New Item'
// addItemButton.addEventListener('click', displayAddItemForm)
// menuSection.parentNode.insertBefore(addItemButton, menuSection)

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

// if (typeof price === 'string') {
//   this.query('input[value="single_price"]').checked = true
//   this.query('input[name="price"]').value = price
// } else {
//   this.query('input[value="multiple_prices"]').checked = true
//   const fieldset = this.query('#quantity_prices_fieldset')
//   fieldset.disabled = false
//   this.query('input[name="price"]').disabled = true

//   const quantityPriceArrays = Object.entries(price),
//     [firstQuantity, firstPrice] = quantityPriceArrays.shift(),
//     firstText = this.query('#quantity_prices_fieldset input[type="text"]'),
//     firstNumber = this.query('#quantity_prices_fieldset input[type="number"]')
//   firstText.value = firstQuantity
//   firstNumber.value = firstPrice

//   for (const [quantity, price] of quantityPriceArrays)
//     addQuantityPricePair({ [quantity]: price })
// }

// for (const temperature of temperatures)
//   this.query(`input[value="${temperature}"]`).checked = true
//     }

//     for (const button of this.queryAll('.product_edit_button')) {
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
