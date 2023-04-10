window.removeParentOnClick = function (event) {
  const parent = event.target.parentElement
  parent.remove()
}

fetch('/.netlify/functions/verify')
  .then(async ({ status }) => {
    if (status === 401 || status === 403)
      return window.location.replace(
        `${window.location.origin}/admin/login.html`
      )
    if (status !== 200)
      return notify('❌ Something went wrong, please try again later')

    const response = await fetch('/.netlify/functions/menu'),
      itemCategories = await response.json()

    const query = document.querySelector.bind(document),
      queryAll = document.querySelectorAll.bind(document),
      newElement = document.createElement.bind(document)

    const [categoryNav, menuSection, categoryOptions] = [
        '#category_nav',
        '#menu_section',
        '#category_options',
      ].map(query),
      optionElementsHTML = ''

    if (itemCategories.serverError) {
      console.error(itemCategories.serverError)
      return notify('❌ Something went wrong, please try again later')
    }
    localStorage.setItem(
      'items',
      JSON.stringify(itemCategories.map(category => category.products).flat())
    )

    for (const { category, products } of itemCategories) {
      const [navTitle, categorySection] = ['li', 'section'].map(newElement),
        categoryId = category.toLowerCase().replace(/\s/g, '_')

      // Category navigation.
      navTitle.classList.add('category_title')
      navTitle.innerHTML = `<a href="#${categoryId}">${category}</a>`
      categoryNav.appendChild(navTitle)

      // Items.
      categorySection.id = categoryId
      categorySection.classList.add('category')
      categorySection.innerHTML = `
        <h2>${category}</h2>
        <ul class="category_items">
          ${products
            .map(
              ({ _id, name, description, price, temperature }) =>
                `<li class="item" id="${_id}">
                  <header class="item_header">
                    <span class="item_name">${
                      temperature.length === 0
                        ? name
                        : name +
                          temperature
                            .map(
                              option =>
                                `<span class="emoji" title="Available ${option}">${
                                  option === 'hot' ? '🔥' : '❄️'
                                }</span>`
                            )
                            .join('')
                    }</span>
                    <span class="admin_buttons">
                      <span
                        class="admin_button item_edit_button emoji"
                        title="Edit ${name}"
                      >
                      ✏️
                      </span>
                    </span>
                  </header>
                  <hr />
                  <div class="item_body">
                    <p class="item_description">${description}</p>
                    ${
                      price instanceof Object
                        ? `
                        <ul class="quantity_prices">
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
            )
            .join(' ')}
          </ul>`
      menuSection.appendChild(categorySection)

      const optionElement = newElement('option')
      // Item form option tags.
      optionElement.setAttribute('value', category)
      optionElement.textContent = category
      categoryOptions?.appendChild(optionElement)
    }

    // EDIT FORM.
    function displayAddItemForm() {
      editForm.removeAttribute('hidden')
    }
    function hideAddItemForm() {
      editForm.setAttribute('hidden', 'hidden')
    }
    function switchPriceOption(event) {
      const { target } = event,
        singlePriceInput = query('#single_price')

      if (target.id === 'single_price_option') {
        singlePriceInput.removeAttribute('disabled')
        return quantitiesFieldset.setAttribute('disabled', true)
      }

      singlePriceInput.setAttribute('disabled', true)
      quantitiesFieldset.removeAttribute('disabled')
    }
    function addQuantityPricePair() {
      const newField = newElement('fieldset')

      newField.classList.add('quantity_price_pair')
      newField.innerHTML = `<label>
          Quantity:
          <input 
            type="text" 
            placeholder="8oz" 
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
            required 
          />
        </label>
       <button class="remove_quantity_button" type="button" onclick="removeParentOnClick(event)">Remove Quantity</button>`

      quantitiesFieldset.insertBefore(
        newField,
        quantitiesFieldset.lastElementChild
      )
    }
    async function addItem(event) {
      function getQuantityPrices(quantityPricesParent) {
        const pricesPerQuantity = {}

        for (const child of quantityPricesParent.children) {
          if (!/fieldset/i.test(child.tagName)) continue

          const [text, number] = Array.from(child.children),
            [quantity, price] = [text, number].map(
              element => element.children[0].value
            )

          pricesPerQuantity[quantity] = price
        }

        return pricesPerQuantity
      }
      event.preventDefault()
      const formdata = new FormData(event.target)
      let item = {}
      for (const [key, value] of formdata)
        switch (key) {
          case 'hot':
          case 'cold':
            if (!Array.isArray(item.temperature)) item.temperature = []

            item.temperature.push(key)
            break
          case 'price_option':
            if (value.includes('multiple'))
              item.price = getQuantityPrices(quantitiesFieldset)

            break
          default:
            item[key] = value
        }

      const response = await fetch('/.netlify/functions/item', {
        method: 'POST',
        body: JSON.stringify(item),
      })
      if (response.status === 409)
        return notify('❌ An item with that name already exists')

      const data = await response.json()

      if (data.acknowledged === true && typeof data.insertedId === 'string') {
        hideAddItemForm()
        editForm.reset()
        return notify('✅ Item created!')
      }
      if (data.error) console.error(data.error)
      notify('❌ Something went wrong, please try again later')
    }
    // New item button.
    const addCategoryItemButton = newElement('button'),
      hr = query('.category_nav_')
    addCategoryItemButton.classList.add('add_category_item')
    addCategoryItemButton.textContent = 'Add New Item'
    addCategoryItemButton.addEventListener('click', displayAddItemForm)
    menuSection.parentNode.insertBefore(addCategoryItemButton, menuSection)
    const editForm = query('#edit_form'),
      closeEditFormButton = query('#edit_form button')
    // Button to close form.
    closeEditFormButton.addEventListener('click', hideAddItemForm)
    // Edit form - price section interactivity.
    const quantitiesFieldset = query('#quantity_prices_fieldset')
    for (const id of ['#single_price_option', '#multiple_price_option'])
      query(id)?.addEventListener('change', switchPriceOption)
    query('#add_quantity_button')?.addEventListener(
      'click',
      addQuantityPricePair
    )
    // Handle item form submit.
    editForm.addEventListener('submit', addItem)
  })
  .catch(error => {
    console.error(error)
    notify('❌ Something went wrong, please try again later')
  })
