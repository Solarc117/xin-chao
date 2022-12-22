// preloadImages code from: https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
/**
 * @param {string[]} imageSources
 */
function preloadImages(imageSources) {
  // @ts-ignore
  if (!Array.isArray(this.images)) this.images = []
  // @ts-ignore

  for (const imageSource of imageSources) {
    const image = new Image()
    image.onload = () => {
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
// @ts-ignore
const IMAGE_PATH = document.querySelector('.preload-images')?.dataset.imagePath

// Paths relative to the html file loading the images.
preloadImages(
  [
    'coffee.jpg',
    'coffee2.jpg',
    'coffee3.jpg',
    'condensed-milk-coffee.jpg',
    'croissant.jpg',
    'hot-chocolate.jpg',
    'lemonade.jpg',
    'lemonade2.jpg',
    'spring-rolls.jpg',
    'store.jpg',
  ].map(fileName => `${IMAGE_PATH}/${fileName}`)
)
