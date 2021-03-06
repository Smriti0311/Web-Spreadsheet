//-*- mode: rjsx-mode;

import SingleInput from './single-input.jsx';
import {Spreadsheet} from 'cs544-ss';
import SS from './spreadsheet.jsx';

import React from 'react';
import ReactDom from 'react-dom';


/*************************** App Component ***************************/

const STORE = window.localStorage;

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.update = this.update.bind(this);

    this.state = {
      ssName: '',
      spreadsheet: null,
    };

     
  }


  componentDidCatch(error, info) {
    console.error(error, info);
  }



     validateField(ssName){
	
	const FIELD_INFO = {
	    ssName: {
		friendlyName: 'Spreadsheet Name',
		err: val => !/^[\w\- ]+$/.test(val) && `Bad spreadsheet name "${val}": must contain only alphanumeric characters, underscore, hyphen or space.`
	    }
	};
	const info = FIELD_INFO[ssName];
	const value = ssName;
	if(isEmpty(value)) {
	    
	    return info.err(val);
	}
	if(info.err) {
	    const err = info.err(val);
	    if(err){
		return err;
	    }
	}
	return True;
     }


  async update(ssName) {
      //@TODO
            
	  //<SingleInput si={this}>;
      if(validateField(ssName) === True) {
	  alert("Valid spreadsheet name");
	  await this.props.app.readFormulas(ssName);
      }
      else {
	  // alert("Invalid spreadsheet name"+this.singleInput.error);
	  const msg = validateField(ssName);
	  alert(msg);
	  
	  }
      
      this.setState({ssName: ssName});
      const ss = <Spreadsheet ss = {ss}/>;
      this.setState({spreadsheet: ss});


      
      
  }


  render() {
    const { ssName, spreadsheet } = this.state;
    const ss =
      (spreadsheet) ?  <SS spreadsheet={spreadsheet}/> : '';
    return (
      <div>
        <SingleInput id="ssName" label="Open Spreadsheet Name"
                     value={ssName} update={this.update}/>
        {ss}
      </div>
     );
  }

}
