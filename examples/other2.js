import { Component } from '../'

export default class Other extends Component {
  render () {

    const {
      change
    } = this.props
    console.log(change)
    return (
      <div>
        <h1> Other </h1>
        { change ? <div>hello original (foo)</div> : null}
      </div>
    )
  }
}