class Pipe {
    constructor(initial) {
        this.value_ = initial;
    }

    pipe(fn, ...args) {
        this.value_ = fn.apply(null, [this.value_].concat(args));
        return this;
    }

    close() {
        return this.value_;
    }
    value() {
        return this.value_;
    }
}

function pipe(initial) {
    return new Pipe(initial);
}

function flow(value, ...funcs) {
    return funcs.reduce((value, fn) => Array.isArray(fn) ? fn[0](...[value].concat(fn.slice(1))) : fn(value), value);
}

const pipes = { open: pipe, flow };

export { pipe, flow };
export default pipes;