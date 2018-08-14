export default (str) => {
  let res = str.match(/\.*\./g)
  let result
  if (res && res.length > 0) {
    return str.split('.')
  }
  return result
}
