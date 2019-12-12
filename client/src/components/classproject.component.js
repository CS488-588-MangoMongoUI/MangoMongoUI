import React, {Component} from 'react'
//import Results from './data.component.js'
import DatePicker from 'react-datepicker' //https://api.jqueryui.com/datepicker/#method-setDate
import "react-datepicker/dist/react-datepicker.css"
import Dropdown from 'react-dropdown'// Drop down from https://www.npmjs.com/package/react-dropdown
import 'react-dropdown/style.css'
//import axios from 'axios'
import querystring from 'querystring'

//import ReactTooltip from 'react-tooltip' //https://www.npmjs.com/package/react-tooltip
import Chart from 'react-apexcharts'
const limitS = [{value: '5', label: 5}, {value: '10', label: 10}, {value: '50', label: 50}, {value: '100', label: 100}, {value: '1000', label: 1000}]

const a = [{ value: 'NORTH', label: 'North'}, { value: 'SOUTH', label: 'South'} ]
const detectorNB = [{ value: 'Sunnyside NB', label: 'Sunnyside'}, { value: 'Johnson Cr NB', label: 'Johnson Creek'}
, { value: 'Foster NB', label: 'Foster'}, { value: 'Powell to I-205 NB', label: 'Powell'}, { value: 'Division NB', label: 'Division'}
, { value: 'I-205 NB at Glisan', label: 'Glisan'}, { value: 'I-205 NB at Columbia', label: 'Columbia'} ]
const detectorSB = [{ value: 'Sunnyside SB', label: 'Sunnyside'}, { value: 'Johnson Creek SB', label: 'Johnson Creek'}
, { value: 'Foster SB', label: 'Foster'}, { value: 'Powell Blvd SB', label: 'Powell'}, { value: 'Division SB', label: 'Division'}
, { value: 'Stark/Washington SB', label: 'Stark/Washington'}, { value: 'I-205 SB at Glisan', label: 'Glisan'} ,
 { value: 'I-205 SB at Columbia', label: 'Columbia'}]

const typeOfQuery = [{ value: 'speed', label: 'speed'}, { value: 'distance', label: 'distance'},
                      {value: 'Traveltime', label: 'Travel Time' }, {value: 'PeakTravel', label: 'Peak Travel Time'} ]


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
    this.onChangeQueryType = this.onChangeQueryType.bind(this)

    this.state = {
      // _id: '',
      // highwayname: '205',
      // length: 0,
      // locationtext: 'Sunnyside NB', //Start
      // endLocation: '', //End
      // latlon: '',
      // shortdirection: '',
      // direction: 'NORTH',
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
  onChangeLimit = limit =>{this.setState({limit: limit.value })}
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

    const freeway = {
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
    const speed = { locationtext : this.state.locationtext, startdate: this.state.date.toDateString(), direction: this.state.direction, limit: this.state.limit}
    const distance = { locationtext : this.state.locationtext, endLocation: this.state.endLocation, direction: this.state.direction}
    const travelTime = { locationtext : this.state.locationtext, endLocation: this.state.endLocation}
    var qs = '?'
    /*
    if(this.state.queryType === "speed"){
      qs.append(querystring.stringify(speed)) 
    }else if(this.state.queryType === "distance"){
      qs.append(querystring.stringify(distance)) 
    }else if(this.state.queryType === "TravelTime"){
      qs.append(querystring.stringify(travelTime)) 
    }
    */
    qs = qs + querystring.stringify(freeway) 

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
        var d, type;
        if(this.state.queryType === "speed"){
          type = 'speed';
        }else if(this.state.queryType === "distance"){
          //type = 'distance'
        }else if(this.state.queryType === "TravelTime"){
          //
        }
        if (res == null)
          return
        for(d of res){
          if(d[`${type}`] != null){
            this.state.chartdata.push(d[`${type}`])
            this.state.xaxis.push(d.starttime)
            console.log(d.starttime)
          }
        }

        console.log(this.state.chartdata)
        this.forceUpdate()
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
                show : false,
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
      //
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
          <a data-tip="Inputs you need for each query. <br/> Speed: Direction, Starting Point, Start Date <br/> Distance: Direction, Start Point, End Point <br/> Travel Time: Start Point, End Point ">Select Query Type</a>

          <Dropdown  data-tip="Hi" options={typeOfQuery} onChange={this.onChangeQueryType} value={this.state.queryType} placeholder="Type" />
        </div>
        <div className="d-inline-block pr-5">  
          <label>Query Limit</label>
          <Dropdown options={limitS} onChange={this.onChangeLimit} value={this.state.limit} placeholder="How many results?" />
          {console.log(this.state.limit)}
        </div>
        <div className="d-inline-block pr-5">  
          <label>Select Direction</label>
          <Dropdown options={a} onChange={this.onChangeDirection} value={this.state.direction} placeholder="Which way?" />
        </div>
        <div className="d-inline-block pr-5">  
          <label>From </label>
          <Dropdown options={detectorNB} onChange={this.onChangeLocationText} value={this.state.locationtext} placeholder="Starting Point" />
        </div>
        <div className="d-inline-block pr-5">  
          <label>To </label>
          <Dropdown options={detectorSB} onChange={this.onChangeEndLocation} value={this.state.endLocation} placeholder="Ending Point" />
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
        {this.state.queryType === "speed" &&
          <p>Speed Query Results.</p>
        }
        {this.state.queryType === "distance" &&
          <p>Distance Query</p>
        }
        {this.state.queryType === "Traveltime" &&
          <p>Travel Time Query</p>
        }
        {this.state.queryType === "PeakTravel" &&
          <p>Peak Travel Time</p>
        }
      </div>
      <div><Chart options={this.state.options} series={this.state.series} type="line" height="350" /></div>
    </div>
    )
  }
}

