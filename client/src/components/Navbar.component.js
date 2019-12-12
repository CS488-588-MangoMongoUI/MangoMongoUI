import React, { Component } from 'react'
import {Link} from 'react-router-dom'


export default class Navbar extends Component {

  render(){
    return(
      <nav className="navbar navbar-dark bg-dark navbar navbar-expand-sm">
        <Link to='/' className="navbar-brand">ClassProject</Link>
        <div className="">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">Home </Link>
            </li>
            <li className="navbar-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
            <li className="navbar-item">
              <Link to="/ourqueries" className="nav-link">Queries</Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}
