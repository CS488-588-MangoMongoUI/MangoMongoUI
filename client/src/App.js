import React , {Component} from 'react'; 
//import './App.css';
import { BrowserRouter as Router, Route} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import classproject from './components/classproject.component';
import about from './components/About.component';
import Navbar from './components/Navbar.component';
import queries from './components/queries.component';
 


function App(){
  return (
    <Router>
      <Navbar />
      <div className="container">
      <Route path="/" exact component={classproject} />
      <Route path="/about" component ={about} />
      <Route path="/ourqueries" component ={queries} />
      </div>
    </Router>
  );
}




export default App;
