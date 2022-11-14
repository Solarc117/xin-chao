'use strict'
const classNames = ['coffee', 'hot_chocolate', 'spring_rolls']
let count = 0

setInterval(() => {
  document.body.classList.add(classNames[count + 1 > 2 ? 0 : count + 1])
  document.body.classList.remove(classNames[count])
  count++
  if (count > 2) count = 0
}, 2000)
