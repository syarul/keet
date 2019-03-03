import { Component, childLike } from '../'

export default class Artifact extends Component {
  data = {
  	name: 'baz'
  }
  change(){
    console.log(this)
    this.setData({
      name: 'ber'
    })
  }
  onChange(){
  	console.log('onChange', this.props)
  }
  render () {
    return (
      <div>
        <button onclick={this.change}> local change </button>
        <h4>{this.data.name}</h4>
        <p>props: {JSON.stringify(this.props)}</p>
      </div>
    )
  }
}