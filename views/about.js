
const backgroundImageURLs = [
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
].map(fileName => `../public/images/${fileName}`)

setDynamicBackground(document, backgroundImageURLs)
