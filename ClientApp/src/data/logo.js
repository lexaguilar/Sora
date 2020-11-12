
import React from 'react'
export const logo = <img className="nav-panel-logo" width={150} src={require('../svg/logo2.png')} />
export const colorNavBar = layout => layout == 'conta' ? '#ffd333' : layout == 'inv' ? '#03A9F4' : '#4CAF50';