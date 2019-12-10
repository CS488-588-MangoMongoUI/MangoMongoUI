import React, {Component} from 'react'
import axios from 'axios'
var q3png = require('./q3.png');
const backendIP = 'http://34.83.87.49:8081';
const reactStringReplace = require('react-string-replace');

export default class queries extends Component{
state = {
    data: [],
    loaded: false
  }

  //Button Click
  componentDidMount(){
    this.loaded = true;
    for(let i = 1 ; i <= 6; i ++){
      this.getProjectQuery(i);
      console.log(i);
    }
    
  }

  render(){
    var q3style = {
	height: '500px',
	width: '700px',
    }
    return (
      <div>
        <header>
      
          
        </header>
        <body>
          
          Q1: {reactStringReplace(this.state.data.Q1, "\n", (match,i) =>(
          <br />))}<br /><br/> 
          Q2: {reactStringReplace(this.state.data.Q2, "\n", (match,i) =>(
          <br />))}<br /><br/>
          Q3: <img src ={q3png} style = {q3style} alt ="q3image"></img> <br /> <br/>
          Q4: {reactStringReplace(this.state.data.Q4, "\n", (match,i) =>(
              <br />))}<br /><br/>
          Q5: {reactStringReplace(this.state.data.Q5, "\n", (match,i) =>(
          <br />))}<br /><br/>
          Q6: {reactStringReplace(this.state.data.Q6, "\n", (match,i) =>(
              <br />))}<br /><br/>
          

        </body>
      </div>
    );
  }
  
  async getProjectQuery(id){

    await fetch(`${backendIP}/api/query/${id}`)
    .then((data) => data.json())
    .then((res) => {
      var result = this.state.data;
      if(res.data != null){
        result[`Q${id}`] = res.data.scriptPrints;
      }
      this.setState({data: result})
      //console.log(JSON.stringify(this.state.data[`Q${id}`]))
      console.log(result);
    })  
   
  }

  getDataFromDb(){
    fetch(backendIP + '/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({data: res.data}));
  }


}
