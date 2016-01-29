import React from 'react';
import datastore, { EventNames } from 'datastores/runepage';
import RuneList from 'components/rune-list';
import RuneFilter from 'components/rune-filter';
import Stats from 'components/stats';

function concat(...arrays) {
    return arrays.reduce((final, array) => {
        return final.concat(array);
    }, []);
}

export default class RunePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = datastore.data;

        datastore.on(EventNames.DATA_UPDATED, state => {
            this.setState(state);
        });
    }

    render() {
        return (
            <div className='rune-page'>
                <div className='row-5'>
                    <div className='col-1 relative'>
                        <RuneFilter onChange={this.onFiltersUpdated.bind(this)} />
                        <label>Available</label>
                        <RuneList runes={this.state.runes} onSelect={datastore.add} />
                    </div>

                    <div className='col-1'>
                        <label>Marks</label>
                        <RuneList runes={this.state.marks} onSelect={datastore.remove}/>
                    </div>
                    <div className='col-1'>
                        <label>Seals</label>
                        <RuneList runes={this.state.seals} onSelect={datastore.remove}/>
                    </div>
                    <div className='col-1'>
                        <label>Glyphs</label>
                        <RuneList runes={this.state.glyphs} onSelect={datastore.remove}/>
                    </div>
                    <div className='col-1'>
                        <label>Quints</label>
                        <RuneList runes={this.state.quints} onSelect={datastore.remove}/>
                    </div>

                    <div className='col-1'>
                        <label>Quints</label>
                        <Stats runes={ concat(this.state.marks, this.state.seals, this.state.glyphs, this.state.quints) } />
                    </div>
                </div>
            </div>
        )
    }

    onFiltersUpdated(name, value, filters) {
        datastore.trigger(EventNames.FILTERS_UPDATED, filters);
    }
}