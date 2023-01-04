function adjustTimeZone() {
  const date = new Date(),
    UTCMinutes = date.getUTCHours() * 60 + date.getUTCMinutes(),
    xinChaoOpeningMinutesInUTC = 990,
    xinChaoClosingMinutesInUTC = 240

  console.log(
    'closed:',
    xinChaoClosingMinutesInUTC <= UTCMinutes &&
      UTCMinutes <= xinChaoOpeningMinutesInUTC
  )

  // To convert UTC hours to MDT hours, add 7.
  // 02:30 UTC is 19:30 MDT
  // In minutes:
  // UTC -> MDT: add 1020.
  // 150 UTC is 1170 MDT.
  // clientmins + timezoneoffsetmins = UTC mins
  // Client Mins --+gettimezoneoffset--> UTC Mins --+1020--> MDT Mins
  //                                     UTC Mins <--(-1020)-- MDT Mins
  // "Math.floor(MDTMins / 60)":"(MDTMins % 60)"
  // 09:30 MDT -> 16:30 UTC
  // 20:00 MDT -> 03:00 UTC
}
function getUTCMinutes() {
  const date = new Date()

  return date.getUTCHours() * 60 + date.getUTCMinutes()
}

console.log('getUTCMinutes:', getUTCMinutes())
adjustTimeZone()
