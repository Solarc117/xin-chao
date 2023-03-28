fetch('/.netlify/functions/verify')
  .then(async ({ status }) => {
    if (status === 401 || status === 403)
      window.location.replace(`${window.location.origin}/admin/login.html`)
    if (status !== 200)
      return alert('something went wrong, please try again later')

    const query = document.querySelector.bind(document),
      response = await fetch('/.netlify/functions/menu'),
      categories = await response.json()

    for (const { category, products } of categories) {
      const li = document.createElement('li'),
        a = document.createElement('a')

      li.classList.add('category_title')
      a.href = `#${category.toLowerCase()}`
      a.textContent = category
      li.appendChild(a)
      console.log('li:', li)
      console.log('a:', a)
      console.log(query('#category_nav').appendChild)
      query('#category_nav').appendChild(li)

      // for (const { })
    }
  })
  .catch(error => {
    console.error(error)
    alert('something went wrong, please try again later')
  })
