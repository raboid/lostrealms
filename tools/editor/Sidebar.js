import React, { Component, PropTypes } from 'react';

export default class Sidebar extends Component {
  static propTypes = {
    templates: PropTypes.array,
    properties: PropTypes.array,
    setSelectedTemplate: PropTypes.func,
    setSelectedProperty: PropTypes.func,
    addTemplate: PropTypes.func,
    addProperty: PropTypes.func,
    selectedProperty: PropTypes.number,
    selectedTemplate: PropTypes.number
  }

  state = { 
    showTemplates: true, 
    showForm: false,
    propertyForm: {
      label: '',
    },
    templateForm: {
      label: '',
      propertySelect: '',
      properties: []
    }
  }

  constructor() {
    super()
    this.handlePropertySubmit = this.handlePropertySubmit.bind(this)
    this.handleTemplateSubmit = this.handleTemplateSubmit.bind(this)
    this.handleAddProperty = this.handleAddProperty.bind(this)
  }

  handleTemplateSubmit(event) {
    event.preventDefault()
    this.props.addTemplate({
      label: this.state.templateForm.label, 
      properties: this.state.templateForm.properties,
      color: this.state.templateForm.color
    })
    this.setState({showForm: false})
  }

  handlePropertySubmit(event) {
    event.preventDefault()
    this.props.addProperty({label: this.state.propertyForm.label})
    this.setState({showForm: false})
  }

  handleAddProperty() {
    this.setState({
      templateForm: { 
        ...this.state.templateForm, 
        propertySelect: '',
        properties: [
          ...this.state.templateForm.properties,
          { label: this.state.templateForm.propertySelect }
        ]
      }
    })
  }

  renderForm() {
    return this.state.showTemplates ? this.renderTemplateForm() : this.renderPropertyForm()
  }

  renderPropertyForm() {
    return (
      <form onSubmit={this.handlePropertySubmit}>
        <fieldset>
          <label>Property</label>
          <input onChange={event => this.setState({propertyForm: { label: event.target.value }})} />
        </fieldset>
        <button type="submit">Save Property</button>
      </form>
    )
  }

  renderTemplateForm() {
    return (
      <form onSubmit={this.handleTemplateSubmit}>
        <ul>
          {this.state.templateForm.properties.map(property => 
            <li className="list-item">{property.label}</li>
          )}
        </ul>
        <fieldset>
          <label>Property</label>
          <select 
            name="property" 
            className="required"
            value={this.state.templateForm.propertySelect}
            onChange={event => this.setState({templateForm: {...this.state.templateForm, propertySelect: event.target.value}})}
          >
            {this.props.properties.map(property =>
              <option value={property.label}>{property.label}</option>
            )}
          </select>
        </fieldset>
        <fieldset>
          <label>Label</label>
          <input
            type="text"
            onChange={event => this.setState({templateForm: {...this.state.templateForm, label: event.target.value}})}
          />
        </fieldset>
        <fieldset>
          <label>Color</label>
          <input 
            type="color" 
            onChange={event => this.setState({templateForm: {...this.state.templateForm, color: event.target.value}})} 
          />
        </fieldset>
        <button type="button" onClick={this.handleAddProperty}>Add property</button>
        <button type="submit">Save Template</button>
      </form>
    )
  }

  renderTemplates() {
    let templates = []
    for(let i=0; i < this.props.templates.length; i++) {
      templates.push(
        <div 
          className={`list-item ${this.props.selectedTemplate === i ? 'selected' : 'cursor-pointer'}`}
          onClick={() => this.props.setSelectedTemplate(i)}
        >
          {this.props.templates[i].label}
          <div className="color-square" style={{backgroundColor: this.props.templates[i].color}} />
        </div>
      )
    }
    return templates
  }

  renderProperties() {
    let properties = []
    for(let i=0; i < this.props.properties.length; i++) {
      properties.push(
        <div 
          className={`list-item ${this.props.selectedProperty === i ? 'selected' : 'cursor-pointer'}`}
          onClick={() => this.props.setSelectedProperty(i)}
        >
          {this.props.properties[i].label}
        </div>
      )
    }
    return properties
  }

  render() {
    return (
      <div className="container">
        <div className="sidebar">
          <div>
            <i className="fa fa-plus" onClick={() => this.setState({showForm: true})} />
          </div>
          <div className="toggle">
            <div 
              className={this.state.showTemplates ? 'selected' : 'cursor-pointer'}
              onClick={this.state.showTemplates ? () => {} : () => this.setState({showTemplates: true})}
            >
              Templates
            </div>
            <div 
              className={this.state.showTemplates ? 'cursor-pointer' : 'selected'}
              onClick={this.state.showTemplates ? () => this.setState({showTemplates: false}) : () => {}}
            >
              Properties
            </div>
          </div>
        </div>
        <div className="list templates">
          { 
            this.state.showForm ? this.renderForm() : 
            this.state.showTemplates ? this.renderTemplates() : this.renderProperties()
          }          
        </div>
      </div>        
    )
  }
}