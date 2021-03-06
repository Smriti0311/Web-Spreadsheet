//-*- mode: rjsx-mode;

import React from 'react';
import ReactDom from 'react-dom';

/** Component which displays a single input widget having the following
 *  props:
 *
 *    `id`:     The id associated with the <input> element.
 *    `value`:  An initial value for the widget (defaults to '').
 *    `label`:  The label displayed for the widget.
 *    `update`: A handler called with the `value` of the <input>
 *              widget whenever it is blurred or its containing
 *              form submitted.
 */
export default class SingleInput extends React.Component {

  constructor(props) {
    super(props);

      this.state = {
	  value: '',
          error: ''
      };
      this.id = props.id;
      this.value = props.value;
      this.label = props.label;
     
      this.parentUpdate = props.update;
      
      this.onChange = this.onChange.bind(this);
      this.onBlurOnSubmit = this.onBlurOnSubmit.bind(this);
  }

    //@TODO
    
    onChange(event){
	this.setState({ value: event.target.value});
    }

    

    onBlurOnSubmit(event){
	
	try {
	//alert("OnBlur or onSubmit was run");
	this.parentUpdate(this.state.value);
	    event.preventDefault();
	}
	catch(err){
	    const msg = (err.message) ? err.message : 'web service error';
	    this.setState({error: msg});
	}
    }

  render() {
      return(
	  <form onBlur={this.onBlurOnSubmit} onSubmit={this.onBlurOnSubmit}>
	    <label htmlFor="ssName">Open Spreadsheet Name</label>
	    <span>
	      <input type="text" label={this.label} id={this.id}  value={this.state.value} onChange={this.onChange}></input>
		<br/>
		<span className="error" error={this.state.error}>
		</span>
	    </span>
	  </form>
      );
  }
}

