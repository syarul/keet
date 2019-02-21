const eventRe = /(onclick=\")(.*?)(?=\")/g

function parseEvent (base) {
  let eventList
  let id
  if (typeof base === 'string') {
    eventList = base.match(eventRe)
    console.log(eventList)
    if (eventList && eventList.length) {
      // eventList.map(ls => {
      
      // })
    }
  }
  return base
}

export {
  parseEvent as default
}