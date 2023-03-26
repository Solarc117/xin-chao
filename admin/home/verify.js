fetch('/.netlify/functions/verify')
  .then(({ status }) => {
    if (status === 401 || status === 403)
      window.location.replace(`${window.location.origin}/admin/`)
  })
  .catch(console.error)
