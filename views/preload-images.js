// preloadImages code from: https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript
/**
 * @param {string[]} imageSources
 */
function preloadImages(imageSources) {
  // @ts-ignore
  if (!Array.isArray(preloadImages.images)) preloadImages.images = []

  for (const imageSource of imageSources) {
    const image = new Image()
    image.onload = function () {
      const index = preloadImages.images.indexOf(this)

      // Remove image from the array once it's loaded, for memory consumption reasons.
      if (index !== -1) preloadImages.images.splice(index, 1)
    }
    image.src = imageSource
    preloadImages.images.push(image)
  }
}

// @ts-ignore
const IMAGE_PATH = document.querySelector('.preload-images')?.dataset.imagePath

// Paths are relative to the html file loading the images.
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
  ].map(fileName => `${IMAGE_PATH}/${fileName}`)
)
