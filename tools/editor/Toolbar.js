import React, { Component, PropTypes } from 'react';

export default class Toolbar extends Component {
  static propTypes = {
    selectedTool: PropTypes.string,
    setSelectedTool: PropTypes.func,
    onSave: PropTypes.func,
    mapName: PropTypes.string,
    setMapName: PropTypes.func
  }

  getClassName(tool) {
    return this.props.selectedTool === tool ? 'selected' : 'cursor-pointer';
  }

  render() {
    return (
      <div className="toolbar">
        <div className="">
          <i title="Upload File" className="fa fa-file" onClick={() => {}} />
          <i title="Save" className="fa fa-save" onClick={() => this.props.onSave()} />
          <input value={this.props.mapName} onChange={event => this.props.setMapName(event.target.value)}/>
        </div>
        <div>
          <i 
            title="Paint" 
            className={`fa fa-paint-brush ${this.getClassName('paint')}`}
            onClick={() => this.props.setSelectedTool('paint')}
          />
          <i 
            title="Erase" 
            className={`fa fa-eraser ${this.getClassName('eraser')}`} 
            onClick={() => this.props.setSelectedTool('eraser')}
          />
          <i 
            title="Random" 
            className={`fa fa-random ${this.getClassName('random')}`}
            onClick={() => this.props.setSelectedTool('random')}
          />
          <i 
            title="Settings" 
            className={`fa fa-cog ${this.getClassName('settings')}`}
            onClick={() => this.props.setSelectedTool('settings')}
          />
        </div>
      </div>        
    )
  }
}