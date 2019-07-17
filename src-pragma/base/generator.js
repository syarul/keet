import KeetRenderer from '../'

let timer = null

const batch = (fn, delay) => {
    clearTimeout(timer)
    timer = setTimeout(fn, delay)
}

export default async vNode => {
	batch(KeetRenderer.emit.bind(KeetRenderer, 'event-rendered', vNode), 1)
}