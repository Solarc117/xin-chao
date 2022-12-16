// preloadImages code from: https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
/**
 * @param {string[]} imageSources
 */
function preloadImages(imageSources) {
  // @ts-ignore
  if (!this.images) this.images = []
  // @ts-ignore

  for (const imageSource of imageSources) {
    const image = new Image()
    image.onload = function () {
      // @ts-ignore
      const index = this.images.indexOf(this)
      // Remove image from the array once it's loaded, for memory consumption reasons.
      // @ts-ignore
      if (index !== -1) this.images.splice(index, 1)
    }
    this.images.push(image)
    image.src = imageSource
  }
}

// Path relative to the html file loading the images; NOT the js file.
preloadImages([
  './public/images/coffee.jpg',
  './public/images/hot-chocolate.jpg',
  './public/images/spring-rolls.jpg',
])
