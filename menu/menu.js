import messages from '../messages.json'
const randomMessage = messages[Math.floor(Math.random() * messages.length)]
notify(randomMessage)

fetch('/.netlify/functions/menu')
  .then(response => response.json())
  .then(categories => {
  })
  .catch(error => {
    console.error(error)
    notify('❌ Could not fetch menu; please refer to our Google images or try again later')
  })

// fetch('/.netlify/functions/verify')
//   .then(async ({ status }) => {
//     1
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
//     localStorage.setItem(
//       'items',
//       JSON.stringify(itemCategories.map(category => category.products).flat())
//     )

//     const query = document.querySelector.bind(document),
//       queryAll = document.querySelectorAll.bind(document),
//       newElement = document.createElement.bind(document)

//     const [categoryNav, menuSection, categoryOptions] = [
//         '#category_nav',
//         '#menu_section',
//         '#category_options',
//       ].map(query),
//       optionElementsHTML = ''

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
//       for (const element of queryAll('.additional_pair')) element.remove()
//     }
//     function hideAndResetForm() {
//       form.setAttribute('hidden', 'hidden')
//       resetForm()
//     }
//     function switchPriceOption(event) {
//       const { target } = event,
//         singlePriceInput = query('#single_price')

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
//                 for (const child of query('#quantity_prices_fieldset')
//                   .children) {
//                   if (!/fieldset/i.test(child.tagName)) continue

//                   const [text, number] = Array.from(child.children),
//                     [quantity, price] = [text, number].map(
//                       element => element.children[0].value
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
//           query(`[id="${id}"]`).outerHTML = liElementFromProduct(newItem, true)
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

//     const form = query('#item_form'),
//       closeFormButton = query('#close_form_button')
//     // Button to close form.
//     closeFormButton.addEventListener('click', hideAndResetForm)
//     // Edit form - price section interactivity.
//     const quantitiesFieldset = query('#quantity_prices_fieldset')
//     for (const id of ['#single_price_option', '#multiple_price_option'])
//       query(id)?.addEventListener('change', switchPriceOption)
//     query('#add_quantity_button')?.addEventListener('click', () =>
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

//       query('input[name="name"]').value = name
//       query('textarea[name="description"]').value = description
//       query('select[name="category"]').value = category

//       if (typeof price === 'string') {
//         query('input[value="single_price"]').checked = true
//         query('input[name="price"]').value = price
//       } else {
//         query('input[value="multiple_prices"]').checked = true
//         const fieldset = query('#quantity_prices_fieldset')
//         fieldset.disabled = false
//         query('input[name="price"]').disabled = true

//         const quantityPriceArrays = Object.entries(price),
//           [firstQuantity, firstPrice] = quantityPriceArrays.shift(),
//           firstText = query('#quantity_prices_fieldset input[type="text"]'),
//           firstNumber = query('#quantity_prices_fieldset input[type="number"]')
//         firstText.value = firstQuantity
//         firstNumber.value = firstPrice

//         for (const [quantity, price] of quantityPriceArrays)
//           addQuantityPricePair({ [quantity]: price })
//       }

//       for (const temperature of temperatures)
//         query(`input[value="${temperature}"]`).checked = true
//     }

//     for (const button of queryAll('.item_edit_button')) {
//       const id = button.dataset.id,
//         items = JSON.parse(localStorage.getItem('items'))
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
//         <button type="button" class="close_pop_up_button">Close</button>
//         <button type="button" class="delete">Delete</button>
//       </p>`
//     }
//   })
//   .catch(error => {
//     console.error(error)
//     notify('❌ Something went wrong, please try again later')
//   })
