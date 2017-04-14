export function generate(size, value) {
    let callback = typeof value === 'function'
        ? (e, i, a) => value(i)
        : () => value;

    return Array.apply(null, {length: size }).map(callback)
}