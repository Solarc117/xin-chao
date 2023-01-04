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
    'Home-1.jpg',
    'Home-2.jpg',
    'Home-3.jpg',
    'store.jpg',
    'about-1.jpg',
    'about-2.jpg',
    'about-3.jpg',
    'about-4.jpg',
    'about-5.jpg',
    'about-6.jpg',
    'about-7.jpg',
    'about-8.jpg',
    'dark-logo.png',
    'light-logo.png',
  ].map(fileName => `${IMAGE_PATH}/${fileName}`)
)
