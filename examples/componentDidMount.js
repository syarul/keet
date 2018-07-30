import Keet from '../'
import { getId } from '../components/utils'

class App extends Keet {
   componentDidMount(){
   	 this.isMounted = true
   }
}

const app = new App()

app.mount('test').link('app')

console.assert(app.isMounted === true, 'link, componentDidMount')

export default app





