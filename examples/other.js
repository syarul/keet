// file main.js
import Keet from '../'

class Other extends Keet {}

const other = new Other()

setTimeout(() => other.inform('other'), 2000)

export default other
