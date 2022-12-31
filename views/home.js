const images = [
  'coffee.jpg',
  'coffee2.jpg',
  'coffee3.jpg',
  'condensed-milk-coffee.jpg',
  'croissant.jpg',
  'hot-chocolate.jpg',
  'lemonade.jpg',
  'lemonade2.jpg',
  'spring-rolls.jpg',
].map(fileName => `../public/images/${fileName}`)

setDynamicBackground(document, images)
