import React from 'react';
import { Line, Bar ,HorizontalBar} from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const labelString = (yaxis,percent) => {
  if(percent) return ''
  if(yaxis === 0) return 'in millions $'
  if(yaxis === 1) return '$'
  if(yaxis === 2) return 'in thousands units'
  if(yaxis === 4) return 'in millions $'
  if(yaxis === 5) return ''

  return ''
           }

const adjustMax =(yaxis,max)=>{
  if (yaxis === 0 || yaxis === 2) return Math.round(1.2*max/100,0)*100
  if (yaxis === 1 ) return 1.2*max
    }

 const datasetKeyProvider=()=>{
     return btoa(Math.random()).substring(0,12)
 }

export const LineChart =({datasets,labels,title,percent,yaxis})=>{
  const data = {
  labels: labels,
  datasets: datasets,
}

const options = {
  tooltips: {enabled: false},
  hover: {mode: null},
  legend: {
        display: true,
        position: 'top',
        labels: {
           usePointStyle: true,
           padding:20
        },
      },
  responsive:true,
  maintainAspectRatio: false,
  title: {
    display: true,
    text: title,
    fontSize:25,
  },
  scales: {
      yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            maxTicksLimit: 6,
            padding: 25,
            callback: function(value) {
               if(percent){
                 return value + "%"
               } else{
                 if (yaxis === 0) {
                 return value/1000
               } else {
                 return value
               }
               }
           }
          },
          gridLines: {
            drawBorder: false,
          },
        scaleLabel: {
        display: true,
        labelString: labelString(yaxis,percent),
        fontStyle:'italic',
        fontSize:15,
        padding: 8
      }
      }],
      xAxes: [{
        gridLines: {
          display: false,
        },
        offset: true
      }]
  },
    plugins:
    {
      datalabels: {
    color: 'black',
    anchor: 'end',
    align: 'end',
    display: false,
    formatter: function(value, context) {
      var index = context.dataIndex;
      var value = context.dataset.data[index];
        return value
    },
      }}
}

  return(

        <Line height={400} data={data} options={options} datasetKeyProvider={datasetKeyProvider}/>
    )
}


export const BarChart =({datasets,labels,title,percent,yaxis,max,datadisplay})=>{
const data = {
  labels: labels,
  datasets: datasets
};
const options = {
  tooltips: {enabled: false},
  hover: {mode: null},
  responsive:true,
  maintainAspectRatio: false,
  legend: {
        display: false
     },
     title: {
     display: true,
     text: title,
     fontSize:25,
      },
    scales: {
        yAxes: [{
          afterTickToLabelConversion: function(scaleInstance) {
          scaleInstance.ticks[0] = null;
          scaleInstance.ticksAsNumbers[0] = null;
        },
            ticks: {
              beginAtZero: true,
              display: true,
              max : adjustMax(yaxis,max),
              callback: function(value, index, values) {
                 if(percent){
                   return value + "%"
                 } else{
                   if (yaxis === 0) {
                   return value/1000
                 } else {
                   return value
                 }
                 }
             }
            },
            gridLines: {
              display: true,
              drawBorder: false
            },
            scaleLabel: {
            display: true,
            labelString: labelString(yaxis,percent),
            fontStyle:'italic',
            fontSize:15,
            padding: 8
          }
        }],
        xAxes: [{
          gridLines: {
            display: false,
          },
        }]
    },
    plugins:{
      datalabels: {
      color: 'black',
      anchor: 'end',
      align: 'end',
       display: datadisplay,
        formatter: function(value, context) {
          var index = context.dataIndex;
          var value = context.dataset.data[index];
            return Math.round(value)
        },
          }
    }
}

  return(
    <Bar height={400} data={data} options={options} />

    )
}


export const HorizonBarChart =({datasets,labels,title,percent,yaxis,max})=>{

  const getTicks =()=>{
    if(percent){
      return ({
        beginAtZero: true,display: true, maxTicksLimit: 6, max: 100,
        callback: function(value, index, values) {return value + "%"}
           })
     }else {
       return({
           beginAtZero: true,display: true, maxTicksLimit: 6,
           callback: function(value, index, values) {if (yaxis === 0) {return value/1000
              } else {return value}}
              })
           }}

const data = {
    labels: labels,
    datasets: datasets
  };

  const options = {
    tooltips: {enabled: false},
    hover: {mode: null},
    responsive:true,
    maintainAspectRatio: false,
    title: {
    display: true,
    text: title,
    fontSize:25,
     },
    scales: {
      yAxes: [
        {
          stacked: true,
         },
      ],
      xAxes: [
        {
          stacked: true,
          ticks: getTicks(),
         scaleLabel: {
         display: true,
         labelString: labelString(yaxis,percent),
         fontStyle:'italic',
         fontSize:15,
         padding: 8
       }
        },
      ],
    },
    plugins: {
    datalabels: {
     display: true,
      color:'#ffffff',
      formatter: function(value, context) {
        var index = context.dataIndex;
        var value = context.dataset.data[index];
          return (Math.round(value))
      },
        }
      }
  }


  return(
    <HorizontalBar height={400} data={data} options={options} />

    )
}
