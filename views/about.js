/**
 * @param {Document} document
 * @param {string[]} imageURLs
 */
function setDynamicBackground(document, imageURLs) {
  let imageIndex = 0,
    showBody = true

  setInterval(() => {
    imageIndex++
    if (imageIndex > imageURLs.length - 1) imageIndex = 0
    showBody = !showBody

    if (showBody) {
      document.body.style.backgroundImage = `url('${imageURLs[imageIndex]}')`
      return setTimeout(
        () =>
          document
            .querySelector('.background_image')
            ?.classList.remove('opaque'),
        1000
      )
    }

    document.querySelector(
      '.background_image'
    ).style.backgroundImage = `url('${imageURLs[imageIndex]}')`
    setTimeout(
      () =>
        document.querySelector('.background_image')?.classList.add('opaque'),
      1000
    )
  }, 2000)
}
const backgroundImageURLs = [
  'about-1.jpg',
  'about-2.jpg',
  'about-3.jpg',
  'about-4.jpg',
  'about-5.jpg',
  'about-6.jpg',
  'about-7.jpg',
  'about-8.jpg',
].map(fileName => `../images/${fileName}`)

setDynamicBackground(document, backgroundImageURLs)
