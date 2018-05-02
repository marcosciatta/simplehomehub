import React, { Component } from 'react';

class DeviceList extends Component
{
  state = {
    response: false
  };

  callApi = async () => {
    // const response = await fetch('http://localhost:3000/api/components');
    // const body = await response.json();
    // if (response.status !== 200) throw Error(body.message);
    // console.log(body);
    // return body;
  };

  componentDidMount() {
    // this.callApi()
    //   .then(res => this.setState({ response: res.express }))
    //   .catch(err => console.log(err));
  }

  render(){

    return <ul>
      {this.state.response && this.state.response.map(function(obj){
        console.log('is obje');
        console.log(obj);
        console.log('endobje');
      return <li key={ obj.short_name }><img src={obj.icon}/>{obj.name}</li>;
    })}
  </ul>

  }

}
export default DeviceList;
