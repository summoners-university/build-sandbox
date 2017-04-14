export function tracelog(message) {
    console.log('origin:' + arguments.callee.caller.name, message);
}