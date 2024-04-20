import React from 'react';
import {Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';


// Extend the Array prototype with SumArray method
declare global {
  interface Array<T> {
    SumArray(arr: T[]): T[];
  }
}

// Implement the SumArray method
Array.prototype.SumArray = function <T>(arr: T[]): T[] {
  const sum = this.map((num, idx) => {
    return num + arr[idx];
  });

  return sum;
};

interface Props {
  labels: string[],
  
}

export const HorizontalBarChart =(props:Props)=>{

  let max = 0
  let arr = Array.apply(null, Array(props.labels.length)).map(Number.prototype.valueOf,0);
    props.datasets.map(row =>
    {
      arr = arr.SumArray(row.data)
      return arr
    })
  max = arr.reduce((a,c)=> Math.max(a,c),0)

  const data = {
    labels: props.labels,
    datasets: props.datasets
  }

  const options = {
    responsive:true,
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    layout: { padding: 5 },
    title: {
      display: true,
      text: props.title
    },
    legend: {
        display: (props.displayLegend === false) ? (props.displayLegend) : true,
        position:(props.legend) ? (props.legend) : 'top',
    },
    scales: {
        yAxes: [{
            stacked: true,
            gridLines: {
              display: (props.yGrid === false ) ? false: true,
              drawBorder: true
            }
        }],
        xAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true,
            display: (props.xticks === false ) ? false: true,
            maxTicksLimit: 6,
            max:max,
            callback: function (value) {
              if (props.units === `perc`) return Math.round(value*100) + ' %'
              if (props.units === `thou`) return (value/1000).toFixed(0)
                return value
           }
         },
         gridLines: {
           display: (props.xGrid === false ) ? false: true,
           drawBorder: true
         }
        }]
    },plugins: {
    datalabels: {
    color: '#ffffff',
     display: true,
      formatter: function(value, context) {
        var index = context.dataIndex;
        var value = context.dataset.data[index];
        if (props.units === `perc`) return Math.round(value*100) + ' %'
        if (props.units === `perc1`) return Math.round(value*100,1) + ' %'
        if (props.units === `thou`) return (value/1000).toFixed(0)
          return value
      },
        }
      }

  }


  return(
    <Bar
    height={200}
    data={data}
    options={options} />

    )
}

export default HorizontalBarChart;
