const map = query('.map'),
    service = new google.maps.places.PlacesService(map)

  //   service.getDetails(
  //   {
  //     placeId: 'ChIJawKDKGBlcVMRqEUhscr_ATk',
  //     fields: ['opening_hours'],
  //   },
  //   (place, status) => {
  //     if (status !== google.maps.places.PlacesServiceStatus.OK)
  //       return console.error('cannot fetch store hours:', status)

  //     console.log('place:', place)
  //   }
  // )
