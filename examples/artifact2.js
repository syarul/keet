import { Component, pragma } from '../'

import Inner from './inner'

// let p = new pragma

export default class Artifact extends Component {
  // constructor(){
  //   super()
  //   // console.log(p)
  // }
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
        <Inner />
      </div>
    )
  }
}