import React, {Component} from 'react'


export default class about extends Component{
  render(){
    var iframestyle ={
      width: '800px',
      height: '1000px'
    }
    return(
      <div>
        <iframe style={iframestyle} src="https://docs.google.com/document/d/e/2PACX-1vTYM2SeLyJx9fJ4KY3ME9VegzLWE25M7OrqOaE9nbcHmoqPxx4zTECAOhk3KTSKtWlo8zX1GlilFgEj/pub?embedded=true"></iframe>
      </div>
    )
  }
}
