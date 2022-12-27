/**
 * @param {Document} document
 */
function setDynamicBackground(document) {
  const backgroundImages = [
    "url('../public/images/about-1.jpg')",
    "url('../public/images/about-2.jpg')",
    "url('../public/images/about-3.jpg')",
    "url('../public/images/about-4.jpg')",
    "url('../public/images/about-5.jpg')",
    "url('../public/images/about-6.jpg')",
    "url('../public/images/about-7.jpg')",
    "url('../public/images/about-8.jpg')",
    "url('../public/images/about-9.jpg')",
    "url('../public/images/about-10.jpg')",
    "url('../public/images/about-11.jpg')",
  ]
  let count = 0

  setInterval(() => {
    count++
    if (count > backgroundImages.length - 1) count = 0

    document.body.style.backgroundImage = backgroundImages[count]
  }, 2000)
}

setDynamicBackground(document)
