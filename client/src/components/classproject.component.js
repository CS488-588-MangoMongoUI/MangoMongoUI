import React, {Component} from 'react'
//import Results from './data.component.js'
import DatePicker from 'react-datepicker' //https://api.jqueryui.com/datepicker/#method-setDate
import "react-datepicker/dist/react-datepicker.css"
import Dropdown from 'react-dropdown'// Drop down from https://www.npmjs.com/package/react-dropdown
import 'react-dropdown/style.css'
//import axios from 'axios'
import querystring from 'querystring'
import Chart from 'react-apexcharts'

const limitS = [{value: 1, label: 1},{value: 5, label: 5}, {value: 10, label: 10}, {value: 50, label: 50}, {value: 100, label: 100}, {value: 1000, label: 1000}, {value: 0, label: 'All'},]
const defaultLimit = limitS[4]
const a = [{ value: 'NORTH', label: 'North'}, { value: 'SOUTH', label: 'South'} ]
const detectorNB = [{ value: 'Sunnyside NB', label: 'Sunnyside'}, { value: 'Johnson Cr NB', label: 'Johnson Creek'}
, { value: 'Foster NB', label: 'Foster'}, { value: 'Powell to I-205 NB', label: 'Powell'}, { value: 'Division NB', label: 'Division'}
, { value: 'I-205 NB at Glisan', label: 'Glisan'}, { value: 'I-205 NB at Columbia', label: 'Columbia'} ]
const defaultFrom = detectorNB[0]
const detectorSB = [{ value: 'Sunnyside SB', label: 'Sunnyside'}, { value: 'Johnson Creek SB', label: 'Johnson Creek'}
, { value: 'Foster SB', label: 'Foster'}, { value: 'Powell Blvd SB', label: 'Powell'}, { value: 'Division SB', label: 'Division'}
, { value: 'Stark/Washington SB', label: 'Stark/Washington'}, { value: 'I-205 SB at Glisan', label: 'Glisan'} ,
 { value: 'I-205 SB at Columbia', label: 'Columbia'}]
const defaultTo = detectorSB[1]
const typeOfQuery = [{ value: 'speed', label: 'speed'}, { value: 'distance', label: 'distance'},
                      {value: 'Traveltime', label: 'Travel Time' }, {value: 'PeakTravel', label: 'Peak Travel Time'} ]
const defaultOption = typeOfQuery[0]
const defaultOptionA = a[0]
//const axios = require('axios')
const backendIP = 'http://34.83.87.49:8081'

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
    this.onChangeLimit = this.onChangeLimit.bind(this)

    this.state = {
      _id: '',
      highwayname: '205',
      length: 0,
      locationtext: 'Sunnyside NB', //Start
      endLocation: '', //End
      latlon: '',
      shortdirection: '',
      direction: 'NORTH',
      date: new Date('2011/09/17'),
      enddate: new Date('2011/09/18'),
      queryType: 'speed',
      collection: 'uniondata',
      limit: '100',
      chartdata: [],
      xaxis: []
    }
  }

  //Not sure if this is needed
  componentDidMount(){
  }
  

  //Handling State changes with the text boxes and date changes.
  onChangeLocationText = selected =>{this.setState({locationtext: selected.value})}
  onChangeLimit = selected =>{this.setState({limit: selected.value})}
  onChangeEndLocation = selected =>{this.setState({endLocation: selected.value})}
  onChangeEndDate(date){this.setState({enddate: date})}
  onChangeDate(date){this.setState({date: date})}
  onChangeDirection = selected =>{this.setState({direction: selected.value})}
  onChangeQueryType = selected => {this.setState({queryType: selected.value })}






  //This is where we want to package up are query, then send the results to the results component
  async onSubmit(e){
    e.preventDefault();
    //sample
    //http://localhost:8081/api/collections/?highway=205&queryType=speed&direction=NORTH&from=Sunnyside&to=Powell&startdate=09162011&enddate09172011

    //modified for backend


 
    console.log(this.state.date)
    console.log(this.state.date.toDateString() + ' GMT')

    const freeway ={
      //highway: this.state.highwayname,
      collection: this.state.collection,
      queryType: this.state.queryType,
      locationtext: this.state.locationtext,
      //endLocation: this.state.endLocation,


      startdate: new Date(this.state.date.toDateString() + ' GMT').toISOString(),
      enddate: new Date(this.state.enddate.toDateString() + ' GMT').toISOString(),
      direction: this.state.direction,
      limit: this.state.limit,
    }
    
    var qs = '?' + querystring.stringify(freeway)

    console.log(qs)
    //window.open(backendIP + '/api/search/' + qs)
    await fetch(`${backendIP}/api/search/${qs}`)
      .then((data) => data.json())
      .then((res) => {
        //console.log(JSON.stringify(this.state.data[`Q${id}`]))
        console.log(res)
          
        this.state.chartdata = [];
        this.state.xaxis =[];
        console.log(res)
        var d;
        if (res == null)
          return
        for(d of res){
          if(d.speed != null){
            this.state.chartdata.push(d.speed)
            this.state.xaxis.push(d.starttime)
            console.log(d.starttime)
          }
        }

        console.log(this.state.chartdata);
        this.forceUpdate();
    })  
  }

  render(){
    //
    this.state.options = {
        chart: {
              zoom: {
                  enabled: false
              }
          },
          dataLabels: {
              enabled: false
          },
          stroke: {
              curve: 'straight'
          },
          title: {
              text: 'Speed Query',
              align: 'left'
          },
          grid: {
              row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
              },
          },
          xaxis: {
              categories: this.state.xaxis,
              labels: {
                show : true,
                trim: true,
                hideOverlappingLabels:true,
                
              },
              
          }  
    }
    this.state.series = 
      [{
        name: "speed",
        data: this.state.chartdata
      }]
  





    return(//The copy pasta is https://github.com/beaucarnes/mern-exercise-tracker-mongodb/blob/master/src/components/create-exercise.component.js
      //Create inputs for each value that is important to create a query. 
      //input
      <div>
      <h3>Create Query of Highway database</h3>      
      <p> We want to be able to build basic queries and get results here. </p>
      <form onSubmit={this.onSubmit}>
        <div className="d-block">
        <div className="form-group"> 
          <h4>Highway Name: I-205</h4>
        </div>
        </div>
        <div className="d-inline-block pr-5">  
          <label>Select Query Type </label>
          <Dropdown options={typeOfQuery} onChange={this.onChangeQueryType} value={defaultOption} placeholder="Select an option" />
        </div>
        <div className="d-inline-block pr-5">  
          <label>Query Limit</label>
          <Dropdown options={limitS} onChange={this.onChangeLimit} value={defaultLimit} placeholder="Select an option" />
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
          <label className="pr-2">End Date(Latest 11/15/2011): </label>
          <DatePicker selected={this.state.enddate} onChange={this.onChangeEndDate} />
        </div>
        <div className="form-group">
          <input type="submit" value="Get results" className="btn btn-primary" />
        </div>
      </form>
      <div>
        <Chart options={this.state.options} series={this.state.series} type="line" height="350" />
      </div>
    </div>
    )
  }
}
