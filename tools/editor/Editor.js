import React, { Component, PropTypes } from 'react';

export default class Editor extends Component {
  static propTypes = {
    rows: PropTypes.number,
    columns: PropTypes.number,
    map: PropTypes.array,
    onCellClick: PropTypes.func
  }

  renderCellsForRow(row) {
    let cells = [];
    for(let column=0; column < this.props.columns; column++) {
      cells.push(
        <div 
          className="cell cursor-pointer" 
          style={{backgroundColor: this.props.map[row][column].color || undefined}}
          onClick={() => this.props.onCellClick(row, column)}
        />
      );
    }
    return cells;
  }

  renderRows() {
    let rows = [];
    for(let row=0; row < this.props.rows; row++) {
      rows.push(
        <div className="row">
          {this.renderCellsForRow(row)}
        </div>
      );
    }

    return rows;
  }

  render() {
    return (
      <div className="container editor">
        {this.renderRows()}
      </div>        
    );
  }
}