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
      const index = this.images.indexOf(this)
      // Remove image from the array once it's loaded, for memory consumption reasons.
      if (index !== -1) this.images.splice(index, 1)
    }
    this.images.push(image)
    image.src = imageSource
  }
}

preloadImages([
  './public/images/coffee.jpg',
  './public/images/hot-chocolate.jpg',
  './public/images/spring-rolls.jpg',
])
