import React, {Component} from 'react'
import axios from 'axios'
var q3png = require('./q3.png');
const backendIP = 'http://34.83.87.49:8081';

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
          Hello World
          
        </header>
        <body>
          
          Q1: {this.state.data.Q1} <br /> <br/>
          Q2: {this.state.data.Q2} <br /> <br/>
          Q3: <img src ={q3png} style = {q3style} alt ="q3image"></img> <br /> <br/>
          Q4: {this.state.data.Q4} <br /> <br/>
          Q5: {this.state.data.Q5} <br /> <br/>
          Q6: {this.state.data.Q6} <br /> <br/>
          

        </body>
      </div>
    );
  }
  
  getProjectQuery(id){

    fetch(`${backendIP}/api/query/${id}`)
    .then((data) => data.json())
    .then((res) => {
      var result = this.state.data;
      result[`Q${id}`] = res.data.scriptPrints;
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
