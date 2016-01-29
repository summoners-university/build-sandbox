import React from 'react';
import classnames from 'classnames';

export default class RuneList extends React.Component {
    render() {
        return (
            <ul className='rune-list'>
                {this.props.runes.map(this.render_li.bind(this))}
            </ul>
        )
    }

    render_li(rune) {
        let classNames = classnames('rune', {
            available: rune.count > 0,
            unavailable: rune.count == 0
        });

        return (
            <li key={rune.id}
                className={classNames}
                onClick={() => this.onSelect(rune)}>
                <span className='name'>{rune.name}</span>
                <span className='count'>{rune.count}</span>
            </li>
        )
    }

    onSelect(rune) {
        this.props.onSelect(rune);
    }
}