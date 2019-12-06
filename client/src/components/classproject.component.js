import React, {Component} from 'react'
import DatePicker from 'react-datepicker' //https://api.jqueryui.com/datepicker/#method-setDate
import "react-datepicker/dist/react-datepicker.css"
import Dropdown from 'react-dropdown'// Drop down from https://www.npmjs.com/package/react-dropdown
import 'react-dropdown/style.css'
//import axios from 'axios'


const a = [{ value: 'NORTH', label: 'North'}, { value: 'SOUTH', label: 'South'} ]
const detectorNB = [{ value: 'Sunnyside NB', label: 'Sunnyside'}, { value: 'Johnson Cr NB', label: 'Johnson Creek'}
, { value: 'Foster NB', label: 'Foster'}, { value: 'Powell to I-205 NB', label: 'Powell'}, { value: 'Division NB', label: 'Division'}
, { value: 'I-205 NB at Glisan', label: 'Glisan'}, { value: 'I-205 NB at Columbia', label: 'Columbia'} ]
const defaultFrom = detectorNB[0]
const detectorSB = [{ value: 'Sunnyside SB', label: 'Sunnyside'}, { value: 'Johnson Creek SB', label: 'Johnson Creek'}
, { value: 'Foster SB', label: 'Foster'}, { value: 'Powell Blvd SB', label: 'Powell'}, { value: 'Division SB', label: 'Division'}
, { value: 'Stark/Washington SB', label: 'Stark/Washington'}, { value: 'I-205 SB at Glisan', label: 'Glisan'} ,
 { value: 'I-205 SB at Columbia', label: 'Columbia'}]
const defaultTo = detectorSB[0]
const typeOfQuery = [{ value: 'speed', label: 'speed'}, { value: 'distance', label: 'distance'},
                      {value: 'Traveltime', label: 'Travel Time' }, {value: 'PeakTravel', label: 'Peak Travel Time'} ]
const defaultOption = typeOfQuery[0]
const defaultOptionA = a[0]
const axios = require('axios')
export default class classproject extends Component{
  constructor(props) {
    super(props)


    //If adding more changes create more of these
    this.onChangeLocationText = this.onChangeLocationText.bind(this)
    this.onChangeDate = this.onChangeDate.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChangeDirection = this.onChangeDirection.bind(this)
    this.onChangeEndLocation = this.onChangeEndLocation.bind(this)
    this.onChangeEndDate = this.onChangeEndDate.bind(this)


    this.state = {
      _id: '',
      highwayname: '205',
      detectorid: 0,
      milepost: 0,
      stationid: 0,
      detectorclass: 0,
      lanenumber: 0,
      upstream: 0,
      downstream: 0,
      stationclass: 0,
      numberlanes: 0,
      length: 0,
      locationtext: '', //Start
      endLocation: '', //End
      latlon: '',
      shortdirection: '',
      direction: '',
      date: new Date(),
      endDate: new Date(),
      queryType: 'Speed',
    }
  }

  componentDidMount(){
    //This is the default values that I'm placing, need to connect to database
    // this.setState({
    //   _id: ['5db'],
    //   highwayname: '205-North',
    //   lanenumber: 1,
    //   numberlanes: 3, 
    //   length: .97,
    //   locationtext: 'Sunnyside',
    //   date: new Date()
    //   //Keep adding more code for each of the fields
    // })

  }
  
  //Copy and paste this for all the things that we want to change wtih a text box
  onChangeLocationText = selected =>{
    this.setState({
      locationtext: selected.value
    })
  }
  onChangeEndLocation = selected =>{
    this.setState({
      endLocation: selected.value
    })
  }
  onChangeEndDate(date){
    this.setState({
      endDate: date
    })
  }
  onChangeDate(date){
    this.setState({
      date: date
    })
  }
  onChangeDirection = selected =>{
    this.setState({
      shortdirection: selected.value
    })
  }
  onChangeQueryType = selected => {
    this.setState({
      queryType: selected.value //e.target.value
    })
  }

  //This is where we want to package up are query, then send the results to the results component
  onSubmit(e){
    e.preventDefault();
    //sample
    //http://localhost:8081/api/collections/?highway=205&queryType=speed&direction=NORTH&from=Sunnyside&to=Powell&startdate=09162011&enddate09172011

    const freeway ={
      highway: this.state.highwayname,
      locationtext: this.state.locationtext,
      endLocation: this.state.endLocation,
      date: this.state.date,
      endDate: this.state.endDate,
      queryType: this.state.queryType,

    }
    // axios.get('http://localhost:5000',{ 
    //   params: { 
    //     speed: (2011, 9, 21, 0,0,0)
    //   }
    // })
    //   .then(res => console.log(res.data))
    //   .catch(error => console.log(error))

//We grab all the data, then we need to send it to the results child.
    console.log(freeway)
    //window.location = '/results'
  }


  render(){
    return(//The copy pasta is https://github.com/beaucarnes/mern-exercise-tracker-mongodb/blob/master/src/components/create-exercise.component.js
      //Create inputs for each value that is important to create a query. 
      //input
      <div>
      <h3>Create Query of Highway database</h3>      

      <p> We want to be able to build basic queries and get results here. </p>
      
      
      <form onSubmit={this.onSubmit}>
        <div className="d-block">
        <div className="form-group"> 
          <label>Highway Name</label>
          <input type="text"
            required
            className="form-control"
            value={this.state.highwayname}
            onChange={this.onChangeLocationText} /> {/*This is the wrong onChange method. Change later */}
        </div>
        </div>
        <div className="d-inline-block pr-5">  
          <label>Select Query Type </label>
          <Dropdown options={typeOfQuery} onChange={this.onChangeQueryType} value={defaultOption} placeholder="Select an option" />
        </div>
        <div className="d-inline-block pr-5">  
          <label>Select Direction</label>
          <Dropdown options={a} onChange={this.onChangeDirection} value={defaultOptionA} placeholder="Select an option" />
        </div>
        <div className="d-inline-block pr-5">  
          <label>From </label>
          <Dropdown options={detectorNB} onChange={this.onChangeLocationText} value={defaultFrom} placeholder="Select an option" />
        </div>
        <div className="d-inline-block pr-5">  
          <label>To </label>
          <Dropdown options={detectorSB} onChange={this.onChangeEndLocation} value={defaultTo} placeholder="Select an option" />
        </div>
        <div className="d-block"> 
          <label className="pr-1">Start Date(Earliest 9/15/2011): </label>
          <DatePicker selected={this.state.date} onChange={this.onChangeDate} />
        </div>
        <div className="d-block"> 
          <label className="pr-2">End Date(latest EOF 2015): </label>
          <DatePicker selected={this.state.date} onChange={this.onChangeEndDate} />
        </div>
        <div className="form-group">
          <input type="submit" value="Get results" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}
