import React, { Component, PropTypes } from 'react'
import { saveAs } from 'file-saver'

import Sidebar  from './Sidebar'
import Editor from './Editor'
import Toolbar from './Toolbar'

export default class Tiles extends Component {
  static defaultProps = {
    map: [
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
    ],
    templates: [
      {
        "label": "Any wand",
        "type": "WAND",
        "color": "blue"
      },
      {
        "label": "Wall",
        "type": "WALL",
        "color": "brown"
      },
      {
        "label": "Any enemy",
        "type": "ENEMY",
        "color": "red"
      },
      {
        "label": "Ranged enemy",
        "type": "ENEMY",
        "attack": "RANGED",
        "color": "purple"
      }
    ],
    properties: [    
      {
        "label": "type",
        "possible": ["WAND", "WALL", "ENEMY"],
      },
      {
        "label": "sprite",
      },
      {
        "label": "scarcity",
        "range": [0, 100]
      },
      {
        "label": "rarity",
        "possible": ["COMMON", "UNIQUE", "RARE", "LEGENDARY", "MYSTIC"]
      }
    ]
  }

  constructor(props) {
    super(props)
    this.setSelectedCell = this.setSelectedCell.bind(this)
    this.setSelectedTemplate = this.setSelectedTemplate.bind(this)
    this.setSelectedProperty = this.setSelectedProperty.bind(this)
    this.setSelectedTool = this.setSelectedTool.bind(this)
    this.handleCellClick = this.handleCellClick.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.setMapName = this.setMapName.bind(this)
    this.addProperty = this.addProperty.bind(this)
    this.addTemplate = this.addTemplate.bind(this)
  }

  state = {
    map: this.props.map,
    properties: this.props.properties,
    templates: this.props.templates,
    selectedTemplate: null,
    selectedProperty: null,
    selectedCell: null,
    selectedTool: 'paint',
    mapName: ''
  }

  handleCellClick(row, column) {
    if(this.state.selectedTool === 'paint') {
      this.applySelectedTemplateToCell(row, column)
    } else if(this.state.selectedTool === 'eraser') {
      this.removePropertiesFromCell(row, column)
    }
  }

  setSelectedTemplate(selectedTemplate) {
    this.setState({selectedTemplate})
  }

  setSelectedProperty(selectedProperty) {
    this.setState({selectedProperty})
  }

  setSelectedCell(selectedCell) {
    this.setState({selectedCell})
  }

  setSelectedTool(selectedTool) {
    this.setState({selectedTool})
  }

  setMapName(mapName) {
    this.setState({mapName})
  }

  addProperty(name) {
    this.setState({properties: [...this.state.properties, name]})
  }

  addTemplate(template) {
    this.setState({templates: [...this.state.templates, template]})
  }

  removePropertiesFromCell(row, column) {
    let { map } = this.state;
    map[row][column] = {}
    this.setState({map}) 
  }

  applySelectedTemplateToCell(row, column) {
    let { map, selectedTemplate } = this.state;
    map[row][column] = {
      ...map[row][column],
      ...this.state.templates[selectedTemplate]
    }
    this.setState({map})
  }

  handleSave() {
    let file = new File([JSON.stringify(this.state.map)], this.state.mapName, {type: "application/json"});
    saveAs(file);  
  }

  render() {
    return (
      <div className="container">
        <Toolbar
          onSave={this.handleSave}
          mapName={this.state.mapName}
          setMapName={this.setMapName}
          setSelectedTool={this.setSelectedTool}
          selectedTool={this.state.selectedTool}
        />
        <div className="tiles">
          <Sidebar
            templates={this.state.templates}
            properties={this.state.properties}
            addTemplate={this.addTemplate}
            addProperty={this.addProperty}
            setSelectedTemplate={this.setSelectedTemplate}
            selectedTemplate={this.state.selectedTemplate}
            setSelectedProperty={this.setSelectedProperty}
            selectedProperty={this.state.selectedProperty}
          />
          <Editor
            map={this.state.map}
            rows={this.state.map.length}
            columns={this.state.map[0].length}
            selectedCell={this.state.selectedCell}
            onCellClick={this.handleCellClick}
          />
        </div>
      </div>        
    )
  }
}