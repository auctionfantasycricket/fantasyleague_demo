import React from 'react'
import { NavBar } from '../components/NavBar';
import { Banner } from '../components/Banner';
import {Carousels} from '../components/Carousels';

const HomePage = () => {
  return (
    <div>
        <NavBar/>
        <Banner/>
        <Carousels />
    </div>
  )
}

export default HomePage