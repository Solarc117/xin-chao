/**
 * @param {Document} document
 */
function setDynamicBackground(document) {
  const backgroundImages = [
    'about-1.jpg',
    'about-2.jpg',
    'about-3.jpg',
    'about-4.jpg',
    'about-5.jpg',
    'about-6.jpg',
    'about-7.jpg',
    'about-8.jpg',
    'about-9.jpg',
    'about-10.jpg',
    'about-11.jpg',
    'about-12.jpg',
  ].map(fileName => `url('../public/images/${fileName}')`)
  let count = 0

  setInterval(() => {
    count++
    if (count > backgroundImages.length - 1) count = 0

    document.body.style.backgroundImage = backgroundImages[count]
  }, 2000)
}

setDynamicBackground(document)
