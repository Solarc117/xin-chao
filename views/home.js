/**
 * @param {Document} document
 */
function setDynamicBackground(document) {
  const backgroundImages = [
    "url('../public/images/coffee.jpg')",
    "url('../public/images/coffee2.jpg')",
    "url('../public/images/coffee3.jpg')",
    "url('../public/images/condensed-milk-coffee.jpg')",
    "url('../public/images/croissant.jpg')",
    "url('../public/images/hot-chocolate.jpg')",
    "url('../public/images/lemonade.jpg')",
    "url('../public/images/lemonade2.jpg')",
    "url('../public/images/spring-rolls.jpg')",
  ]
  let count = 0

  setInterval(() => {
    count++
    if (count > backgroundImages.length - 1) count = 0

    document.body.style.backgroundImage = backgroundImages[count]
  }, 2000)
}

setDynamicBackground(document)


