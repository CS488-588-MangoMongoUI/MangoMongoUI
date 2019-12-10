import React, {Component} from 'react'
import DatePicker from 'react-datepicker' //https://api.jqueryui.com/datepicker/#method-setDate
import "react-datepicker/dist/react-datepicker.css"
import Dropdown from 'react-dropdown'// Drop down from https://www.npmjs.com/package/react-dropdown
import 'react-dropdown/style.css'
//import axios from 'axios'
import querystring from 'querystring'
import Chart from 'react-apexcharts'

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
      locationtext: 'Sunnyside NB', //Start
      endLocation: '', //End
      latlon: '',
      shortdirection: '',
      direction: 'NORTH',
      date: new Date('2011/09/17'),
      enddate: new Date('2011/09/18'),
      queryType: 'speed',
      collection: 'uniondata',
      xaxis: [],
      chartdata: []
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
  onChangeEndDate = selected =>{
    this.setState({
      enddate: selected
    })
  }
  onChangeDate = selected =>{
    this.setState({
      date: selected
    })
  }
  onChangeDirection = selected =>{
    this.setState({
      direction: selected.value
    })
  }
  onChangeQueryType = selected => {
    this.setState({
      queryType: selected.value //e.target.value
    })
  }

  //This is where we want to package up are query, then send the results to the results component
  async onSubmit(e){
    e.preventDefault();
    //sample
    //http://localhost:8081/api/collections/?highway=205&queryType=speed&direction=NORTH&from=Sunnyside&to=Powell&startdate=09162011&enddate09172011
    /*
    const freeway ={
      highway: this.state.highwayname,
      locationtext: this.state.locationtext,
      endLocation: this.state.endLocation,
      date: this.state.date,
      endDate: this.state.endDate,
      queryType: this.state.queryType,

    }
    //modified for backend
    */ 
    console.log(this.state.date)
    const freeway ={
      //highway: this.state.highwayname,
      collection: this.state.collection,
      queryType: this.state.queryType,
      locationtext: this.state.locationtext,
      //endLocation: this.state.endLocation,
      startdate: new Date(this.state.date.toDateString() + ' GMT').toISOString(),
      enddate: new Date(this.state.enddate.toDateString() + 'GMT').toISOString(),
      direction: this.state.direction,
      limit : 100
    }
    
    var qs = '?' + querystring.stringify(freeway)

    console.log(qs)
    //window.open(backendIP + '/api/search/' + qs)
    await fetch(`${backendIP}/api/search/${qs}`)
      .then((data) => data.json())
      .then((res) => {
        //console.log(JSON.stringify(this.state.data[`Q${id}`]))
        this.state.chartdata = [];
        this.state.xaxis =[];
        var d;
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
