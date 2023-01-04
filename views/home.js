const images = ['Home-1.jpg', 'Home-2.jpg', 'Home-3.jpg'].map(
  fileName => `../public/images/${fileName}`
)

setDynamicBackground(document, images)
