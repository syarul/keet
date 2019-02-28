import Keet, { childLike } from '../'

@childLike()
export default class App extends Keet {
  data = {
  	name: 'bar'
  }
  change(){
    this.setData({
      name: 'ber'
    })
  }
  componentDidMount(){
  	console.log(2)
  }
  componentWillMount(){
  	console.log(1)
  }
  render () {
    return (
      <div id="up">
        <h4>{this.data.name}</h4>
      </div>
    )
  }
}