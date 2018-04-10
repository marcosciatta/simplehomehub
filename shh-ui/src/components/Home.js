import React from 'react'
import DeviceList from './DeviceList'

const Home = () => (
  <div className="row">
    <div className="col-md-12 m-0 p-0">
      <div className="d-block p-2 bg-light text-white text-right">
        <button type="button" className="btn btn-success">Add New Devices</button>
      </div>
    </div>
    <DeviceList/>
  </div>
)

export default Home
