// function to resolve ternary operation

const test = str => str === '\'\'' || str === '""' || str === 'null' ? '' : str

export default function (input) {
  if (input.match(/([^?]*)\?([^:]*):([^;]*)|(\s*=\s*)[^;]*/g)) {
    let t = input.split('?')
    let condition = t[0]
    let leftHand = t[1].split(':')[0]
    let rightHand = t[1].split(':')[1]

    // check the condition fulfillment

    if (this[condition]) {
      return {
        value: test(leftHand),
        state: condition
      }
    } else {
      return {
        value: test(rightHand),
        state: condition
      }
    }
  } else return false
}
