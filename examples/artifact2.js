import { Component, childLike } from '../'

export default class Artifact extends Component {
  state = {
  	value: 'baz'
  }
  change(){
    this.setState({
      value: this.state.value === 'baz' ? 'ber' : 'baz'
    })
  }
  render ({name}, {value}) {
    return (
      <div>
        <button onclick={this.change}> local change </button>
        <h4>{value}</h4>
        <p>props: {JSON.stringify(this.props)} {name}</p>
      </div>
    )
  }
}