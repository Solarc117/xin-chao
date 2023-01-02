const images = [
  'home-1.png',
  'home-2.png',
  'home-3.png',
].map(fileName => `../public/images/${fileName}`)

setDynamicBackground(document, images)
