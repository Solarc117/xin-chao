fetch('/.netlify/functions/verify')
  .then(async ({ status }) => {
    if (status === 401 || status === 403)
      return window.location.replace(`${window.location.origin}/admin/login.html`)
    if (status !== 200)
      return alert('something went wrong, please try again later')

    const response = await fetch('/.netlify/functions/menu'),
      categories = await response.json(),
      [categoryNav, menuSection] = ['#category_nav', '#menu_section'].map(s =>
        document.querySelector(s)
      )

    for (const { category, products } of categories) {
      const [navTitle, categorySection] = ['li', 'section'].map(n =>
          document.createElement(n)
        ),
        categoryId = category.toLowerCase().replace(/\s/g, '_')

      navTitle.classList.add('category_title')
      navTitle.innerHTML = `<a href="#${categoryId}">${category}</a>`
      categoryNav.appendChild(navTitle)
 
      categorySection.id = categoryId
      categorySection.classList.add('category')
      categorySection.innerHTML = `
        <h2>${category}</h2>
        <ul class="category_items">
          ${products
            .map(
              ({ name, description, price, temperature }) =>
                `<li class="item">
                  <header class="item_header">
                    <span class="item_name">${name}</span>
                    ${
                      temperature.length > 0
                        ? `<span class="svgs">
                        ${temperature
                          .map(
                            option => `<img 
                              class="svg" 
                              src="../../svgs/${option}.svg" 
                              alt="${option}"
                              title="Available ${option}"
                            />`
                          )
                          .join(' ')}
                        </span>`
                        : ''
                    }
                      ${
                        typeof price === 'string'
                          ? `<span class="price">${price}</span>`
                          : ''
                      }
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
                        : ''
                    }
                  </div>
                </li>`
            )
            .join(' ')}
        </ul>`
      menuSection.appendChild(categorySection)
    }
  })
  .catch(error => {
    console.error(error)
    alert('something went wrong, please try again later')
  })
