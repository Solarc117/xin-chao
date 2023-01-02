function adjustTimeZone() {
  const date = new Date(),
    offsetMinutes = date.getTimezoneOffset(),
    clientMinutes = date.getHours() * 60 + date.getMinutes(),
    localMinutesInUTC = clientMinutes + offsetMinutes,
    xinChaoOpeningMinutes = 570,
    xinChaoClosingMinutes = 1_200

  console.log('offsetMinutes:', offsetMinutes)
  console.log('clientMinutes:', clientMinutes)
  console.log('localMinutesInUTC:', localMinutesInUTC)

  console.log(
    'open:',
    localMinutesInUTC > xinChaoOpeningMinutes &&
      localMinutesInUTC < xinChaoClosingMinutes
  )

  // To convert UTC hours to MDT hours, add 17.
  // 02:30 UTC is 19:30 MDT
  // In minutes:
  // UTC -> MDT: add 1020.
  // 150 UTC is 1170 MDT.
  // clientmins + timezoneoffsetmins = UTC mins
  // Client Mins --+gettimezoneoffset--> UTC Mins --+1020--> MDT Mins
  // "Math.floor(MDTMins / 60)":"(MDTMins % 60)"
  // 09:30 MDT -> 16:30 UTC
  // 20:00 MDT -> 03:00 UTC
}
