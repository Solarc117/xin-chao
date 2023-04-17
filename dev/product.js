class Product {
  constructor({ _id, name, description, category, price, temperature }) {
    this.id = _id
    this.name = name
    this.description = description
    this.category = category
    this.price = price
    this.temperature = temperature
  }

  editForm = 'editForm'
  popUp = 'popUp'

  #hooks() {
    window[this.editForm] = function (
      clickEvent,
      { id, name, description, category, price, temperature }
    ) {}

    window[this.popUp] = function (clickEvent, productId) {}
  }

  render() {
    if (!window[this.editForm] || !window[this.popUp]) this.#hooks()

    const { id, name, description, category, price, temperature } = this,
      symbols = {
        hot: '🔴',
        cold: '🔵',
      }

    return `<li class="item" id="${id}">
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
                      <img 
                        class="svg admin_svg" 
                        src="../../svgs/edit.svg"
                        alt="Edit button"
                        title="Edit ${name}"
                        data-id="${id}"
                        onclick="${this.editForm}(event)"
                      />
                       <img
                        class="svg admin_svg"
                        src="../../svgs/delete.svg"
                        alt="Delete button"
                        title="Delete ${name}"
                        data-id="${id}"
                        data-name="${name}"
                        onclick="${this.popUp}(event, ${id})"
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
}
