function alias(aliasName) {
    return function(cls, originalName, props) {
        cls[aliasName] = props.value;
    }
}

class Subscriber {
    constructor(id, event, callback) {
        this.id = id;
        this.event = event;
        this.callback = callback;
    }

    destroy() {
    }

    trigger(...args) {
        this.callback(...args);
    }
}

/**
 *
 * @class EventHub
 */
export default class EventHub {

    id;
    subscribers = [];
    nextid = 1;

    constructor(id = null) {
        this.id = id;
    }

    nextSubscriberID() {
        return this.nextid++;
    }

    @alias('on')
    subscribe(event, callback) {
        if(typeof event === 'function' && !callback) {
            callback = event;
            event = null;
        }

        let subscriber = new Subscriber(this.nextSubscriberID(), event, callback);
        subscriber.destroy = this.destroy.bind(this, subscriber);

        this.subscribers.push(subscriber);

        return subscriber;
    }

    @alias('fire')
    trigger(event, ...args) {
        this.subscribers
            .filter(s => s.event === null || event === null || s.event == event)
            .forEach(s => s.trigger(...args));
    }

    destroy(subscriber) {
        this.subscribers = this.subscribers
            .filter(s => s.id != subscriber.id);
    }
}