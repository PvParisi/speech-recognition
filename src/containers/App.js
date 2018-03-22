import React, { Component } from 'react';
import './App.css';
import 'tachyons';
import Menu from '../components/Menu';
import {meals} from '../meals';

import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';

class App extends Component {
  constructor() {
    super()
    this.state = {
      meals: [],
      text: '',
      streamObj: null
    }
  }

  componentDidMount() {
    this.setState({meals});
    this.startListening();
  }

  componentDidUpdate() {
    const result = meals.map(val => val.name.toLowerCase());
    console.log(result);
    const resStr = this.state.text.toLowerCase().trim();
    console.log(resStr);

    if(resStr === 'start'){
      document.getElementsByClassName('App-content')[0].scrollIntoView({behavior: 'smooth'});
      return;
    }

    if(resStr === 'order') {
      this.placeOrder();
    }

    if (result.includes(resStr)) {
      console.log('found in menu');
    }
    else {
      console.log('not found in menu');
    }
  }

  startListening() {
    fetch('http://localhost:3002/api/speech-to-text/token')
      .then(function(response) {
          return response.text();
      }).then((token) => {
        console.log('token is', token)
        var stream = recognizeMic({
            token: token,
            objectMode: true, // send objects instead of text
            extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
            format: false // optional - performs basic formatting on the results such as capitals an periods
        });

        stream.on('data', (data) => {
          this.setState({
            text: data.alternatives[0].transcript,
            streamObj: stream
          });
        });

        stream.on('error', function(err) {
            console.log(err);
        });
      }).catch(function(error) {
          console.log(error);
      });
  }

  placeOrder() {
    if (this.state.streamObj != null) {
      this.state.streamObj.stop();
      this.setState({
        streamObj: null
      });
    }
  }

  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <h1 className="App-title f1">Speech Recognition</h1>
        </header> */}
        <section className="App-content">
          <Menu meals={meals}/>
          {/* <button className="float" onClick={this.onListenClick.bind(this)}><i className="fas fa-microphone" aria-hidden="true"></i></button> */}
          <div style={{fontSize: '40px'}}>{this.state.text}</div>
        </section>
      </div>
    );
  }
}

export default App;
