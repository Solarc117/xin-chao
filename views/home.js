/**
 * @param {Document} document
 */
function setDynamicBackground(document) {
  const backgroundImages = [
    "url('./public/images/coffee.jpg')",
    "url('./public/images/hot-chocolate.jpg')",
    "url('./public/images/spring-rolls.jpg')",
  ]
  let count = 0

  setInterval(() => {
    count++
    if (count > 2) count = 0

    document.body.style.backgroundImage = backgroundImages[count]
  }, 2000)
}

setDynamicBackground(document)


