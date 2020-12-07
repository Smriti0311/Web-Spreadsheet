//-*- mode: rjsx-mode;

import {indexToRowSpec, indexToColSpec} from 'cs544-ss';
import popupMenu from '../lib/menu.jsx';
import SingleInput from './single-input.jsx';

import React from 'react';
import ReactDom from 'react-dom';


/************************ Spreadsheet Component ************************/

const [ N_ROWS, N_COLS ] = [ 10, 10 ];
const ROW_HDRS = Array.from({length: N_ROWS}).map((_, i) => indexToRowSpec(i));
const COL_HDRS = Array.from({length: N_COLS}).
  map((_, i) => indexToColSpec(i).toUpperCase());

export default class Spreadsheet extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
	  counter: new Spreadsheet(),
	  error:' ',
	  formula: ''

      };

      this.onFocus = this.onFocus.bind(this);
      this.onContextMenu = this.onContextMenu.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      
  }

    //@TODO
    onFocus(event) {
	alert("Tried to focus");
	event.preventDefault();
	this.setState({ formula: props.formula });
    }

    onContextMenu(event) {
	alert("tried context menu");
	event.preventDefault();
    }

    onSubmit(event) {
	alert('submitted form for table');
	event.preventdefault();
    }

    

  render() {
      //return '';
      
      return (
	  

	  <table className="ss">
	    <thead>
	      <tr>
		<th>{this.name}</th>
		<th>A</th>
		<th>B</th>
		<th>C</th>
		<th>D</th>
		<th>E</th>
		<th>F</th>
		<th>G</th>
		<th>H</th>
		<th>I</th>
		<th>J</th>
	      </tr>
	    </thead>
	  </table>
	  
	  



      );
      
      
  }

}

function SSCell(props) {
  const { cellId, formula, value, onContextMenu, onFocus,
          className, tabIndex } = props;
  return (
    <td onContextMenu={onContextMenu}
        data-cellid={cellId}
        onFocus={onFocus}
        className={className}
        tabIndex={tabIndex}
        title={formula ?? ''}>
      {value ?? ''}
    </td>
  );
}
