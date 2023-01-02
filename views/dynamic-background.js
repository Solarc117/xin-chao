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
        500
      )
    }

    document.querySelector(
      '.background_image'
    ).style.backgroundImage = `url('${imageURLs[imageIndex]}')`
    setTimeout(
      () =>
        document.querySelector('.background_image')?.classList.add('opaque'),
      500
    )
  }, 1000)
}
