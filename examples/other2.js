import { Component, pragma } from '../'

// let p = new pragma

export default class Other extends Component {
  // constructor(){
  // 	super()
  // 	console.log(pragma)
  // }
  render ({change}) {
    return (
      <div>
        <h1> Other </h1>
        { change ? <div>hello original (foo)</div> : null}
      </div>
    )
  }
}