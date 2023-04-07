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
      return alert('something went wrong, please try again later')

    const response = await fetch('/.netlify/functions/menu'),
      itemCategories = await response.json(),
      query = document.querySelector.bind(document),
      queryAll = document.querySelectorAll.bind(document),
      newElement = document.createElement.bind(document),
      [categoryNav, menuSection, categoryOptions] = [
        '#category_nav',
        '#menu_section',
        '#category_options',
      ].map(query),
      optionElementsHTML = ''

    if (itemCategories.serverError) {
      console.error(itemCategories.serverError)
      return alert('something went wrong, please try again later')
    }
    sessionStorage.setItem(
      'items',
      JSON.stringify(itemCategories.map(category => category.products).flat())
    )

    // New item button.
    function displayAddItemForm(event) {
      const form = query('#edit_form')
      form.removeAttribute('hidden')
    }
    const addCategoryItemButton = newElement('button'),
      hr = query('.category_nav_')
    addCategoryItemButton.classList.add('add_category_item')
    addCategoryItemButton.textContent = 'Add New Item'
    addCategoryItemButton.addEventListener('click', displayAddItemForm)
    menuSection.parentNode.insertBefore(addCategoryItemButton, menuSection)

    for (const { category, products } of itemCategories) {
      const [navTitle, categorySection, optionElement] = [
          'li',
          'section',
          'option',
        ].map(newElement),
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
                      <span
                        class="admin_button item_delete_button emoji"
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
                        ? `
                        <ul class="quantity_prices">
                          ${Object.keys(price)
                            .map(
                              quantity => `
                                <li class="quantity_price">${quantity}: $${price[quantity]}</li>`
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

      // Item form option tags.
      optionElement.setAttribute('value', categoryId)
      optionElement.textContent = category
      categoryOptions?.appendChild(optionElement)
    }

    // Item form - price section.
    const quantitiesFieldset = query('#quantity_prices_fieldset')
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
    for (const id of ['#single_price_option', '#multiple_price_option'])
      query(id)?.addEventListener('change', switchPriceOption)
    query('#add_quantity_button')?.addEventListener(
      'click',
      addQuantityPricePair
    )

    // Handle item form submit.
    function addItem(event) {
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
      const data = new FormData(event.target)
      let object = {}
      for (const [key, value] of data)
        switch (key) {
          case 'hot':
          case 'cold':
            if (!Array.isArray(object.temperature)) object.temperature = []

            object.temperature.push(key)
            break
          case 'price_option':
            if (value.includes('multiple'))
              object.price = getQuantityPrices(quantitiesFieldset)

            break
          default:
            object[key] = value
        }

      console.log('object:', object)
    }
    query('#edit_form').addEventListener('submit', addItem)
  })
  .catch(error => {
    console.error(error)
    alert('something went wrong, please try again later')
  })
