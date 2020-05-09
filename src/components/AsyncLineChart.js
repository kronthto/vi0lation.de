import React from 'react'
import { asyncComponent } from '../vendor/react-async-component'
import LoadBlock from './LoadBlock'

const AsyncLineChart = asyncComponent({
  resolve: () => import('react-chartjs-2'),
  serverMode: 'defer',
  LoadingComponent: () => <LoadBlock height="250px" />
})

export default AsyncLineChart
