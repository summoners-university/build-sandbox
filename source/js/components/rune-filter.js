import React from 'react';
import classnames from 'classnames';

export default class RuneFilters extends React.Component {

    constructor(...args) {
        super(...args);

        this.state = {
            type: null,
            visible: false
        };
    }

    render() {
        let classNames = classnames('rune-filter', {
            visible: this.state.visible,
            hidden: !this.state.visible
        });

        return (
            <div className='rune-filter-container'>
                <button className='button' onClick={() => this.toggle()}>Filters</button>
                <div className={classNames}>
                    <ul className='type'>
                        <li><label>Type</label></li>
                        {['Mark', 'Glyph', 'Seal', 'Quint'].map(this.render_li.bind(this))}
                    </ul>
                </div>
            </div>
        )
    }

    render_li(type) {
        let classNames = classnames('option', { active: type.toLowerCase() == this.state.type });
        let onClick = () => this.select('type', type.toLowerCase());
        return <li className={classNames} onClick={onClick}>{type}s</li>;
    }

    select(name, value) {
        if(this.state[name] == value) {
            value = null;
        }

        this.onChange(name, value);
    }

    toggle() {
        this.setState({ visible: !this.state.visible })
    }

    onChange(name, value) {
        this.setState({
            [name]: value
        }, () => {
            this.props.onChange(name, value, this.state)
        });
    }
}