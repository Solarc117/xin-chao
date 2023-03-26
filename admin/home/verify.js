fetch('/.netlify/functions/verify')
  .then(response => response.json())
  .then(data => {
    console.log('data:', data)
  })
  .catch(console.error)
