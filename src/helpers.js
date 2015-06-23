export function array_make(args) {
  return Array.prototype.slice.call(args)
}

export function microtime (seconds = true) {
  let time = new Date().getTime()
  let ms = parseInt(time / 1000, 10)
  let sec = `${(time-(ms*1000))/1000} sec`

  return seconds ? ms : sec
}
