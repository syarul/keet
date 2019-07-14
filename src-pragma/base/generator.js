import KeetRenderer from '../'

let timer = null

const batch = (fn, delay) => {
    clearTimeout(timer)
    timer = setTimeout(fn, delay)
}

export default async() => batch(KeetRenderer.emit.bind(KeetRenderer, 'event-hooks'), 1)