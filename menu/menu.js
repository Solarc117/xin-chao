import messages from '../messages.json'

const query = document.querySelector.bind(document),
  queryAll = document.querySelectorAll.bind(document),
  element = document.createElement.bind(document)

class ClientMenu {
  itemKey = 'items'

  /** @returns {boolean} An indicator of whether the menu is stored after the operation. */
  async storeMenuIfNotStored() {
    if (typeof sessionStorage.getItem(this.itemKey) === 'string') return true
    notify(messages[Math.floor(Math.random() * messages.length)])

    let categories
    try {
      categories = await fetch('/.netlify/functions/menu').then(response =>
        response.json()
      )
    } catch (error) {
      console.error(error)
      return false
    }

    sessionStorage.setItem(this.itemKey, JSON.stringify(categories))
    return true
  }

  /**
   *
   * @param {{ _id: string, name: string, description: string, price: number | string | object, temperature: ('hot' | 'cold') [] }} product The product object from which to construct the li's outerHTML.
   * @param {boolean} admin An indicator of whether to generate a li item for the admin page, with edit options. Defaults to false.
   * @returns {string} The li element's outerHTML.
   */
  liElementFromProduct(product, admin = false) {
    const { _id, name, description, price, temperature } = product,
      emojis = {
        hot: '🔥',
        cold: '❄️',
      }

    return `<li class="item" id="${_id}">
                  <header class="item_header">
                    <span class="item_name">${
                      temperature.length === 0
                        ? name
                        : name +
                          temperature
                            .map(
                              option =>
                                `<span class="emoji" title="Available ${option}">${emojis[option]}</span>`
                            )
                            .join('')
                    }</span>
                    ${
                      admin
                        ? `<span class="admin_buttons">
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
                    </span>`
                        : ''
                    }
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
    const menuIsStored = await this.storeMenuIfNotStored()

    if (!menuIsStored)
      return notify(
        '❌ Could not fetch menu; please refer to our Google images or try again later'
      )

    const itemCategories = JSON.parse(sessionStorage.getItem(this.itemKey))

    for (const { category, products } of itemCategories) {
      const categoryId = category.toLowerCase().replace(/\s/g, '_')

      // Category navigation.
      const categoryNav = query('#category_nav'),
        navTitle = element('li')
      navTitle.classList.add('category_title')
      navTitle.innerHTML = `<a href="#${categoryId}">${category}</a>`
      categoryNav.appendChild(navTitle)

      // Items.
      const menuSection = query('#menu_section'),
        categorySection = element('section')
      categorySection.id = categoryId
      categorySection.classList.add('category')
      categorySection.innerHTML = `<h2>${category}</h2>
      <ul class="category_items">
      ${products
        .map(product => this.liElementFromProduct(product, false))
        .join(' ')}
        </ul>`
      menuSection.appendChild(categorySection)

      const categoryOptions = query('#category_options'),
        optionElement = element('option')
      // Item form option tags.
      optionElement.setAttribute('value', category)
      optionElement.textContent = category
      categoryOptions?.appendChild(optionElement)
    }
  }
}

new ClientMenu().initializePage()
