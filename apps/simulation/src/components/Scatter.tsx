import React from 'react'
import { Scatter } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-annotation';


const align = ['left','bottom','top','right','45']

const ScatterChart = (props) => {

  let distance = 0.5
  if (props.clusterDistance) distance = props.clusterDistance
  let datas = props.datasets[0].data
  datas.map((row,id) => {
                       datas[id]['label']=props.labels[id]
                       datas[id]['align']='top'
                       })
  let c = 0
  datas.map((row,id) => datas.map((row1,id1) => {
            if (id < id1){
                        const x = row.x-row1.x
                        const y = row.y-row1.y
                        const sq = Math.sqrt(x**2+y**2)
                        if (sq < distance){
                                      if (datas[id]['cluster']){
                                                datas[id1]['cluster'] = datas[id]['cluster']
                                                const position = datas[id]['align']
                                                if (position === 'bottom') {
                                                   datas[id1]['align'] = 'left'
                                                } else if (position === 'left'){
                                                  if(row.x>row1.x){
                                                    datas[id]['align']='right'
                                                    datas[id1]['align']='left'
                                                  } else{
                                                    datas[id1]['align']='right'
                                                    datas[id]['align']='left'
                                                  }
                                                } else if (position === 'right'){
                                                  datas[id1]['align']='45'
                                                }

                                      } else if (datas[id1]['cluster']){
                                                datas[id]['cluster'] = datas[id1]['cluster']
                                                const position = datas[id1]['align']
                                                if (position === 'bottom') {
                                                   datas[id]['align'] = 'left'
                                                } else if (position === 'left'){
                                                  if(row.x>row1.x){
                                                    datas[id]['align']='right'
                                                    datas[id1]['align']='left'
                                                  } else{
                                                    datas[id1]['align']='right'
                                                    datas[id]['align']='left'
                                                  }
                                                } else if (position === 'right'){
                                                  datas[id]['align']='45'
                                                }
                                      } else {
                                                c++
                                                datas[id]['cluster']=c
                                                datas[id1]['cluster']=c
                                                if(row.y>row1.y){
                                                  datas[id1]['align']='bottom'
                                                } else{
                                                  datas[id]['align']='bottom'
                                                }
                                               }
                                    }
                        }
           }) )


  let annotations =[]
   props.ticks.map(row => annotations.push({
                       drawTime: 'afterDraw',
                       type: 'line',
                       mode: 'horizontal',
                       scaleID: 'y-axis-1',
                       value: row,
                      //  borderColor: grey[500],
                       borderWidth: 0.5,
                       label: {
                           enabled: false,
                       }
                   }))

   props.ticks.map(row => annotations.push({
                       drawTime: 'afterDraw',
                       type: 'line',
                       mode: 'vertical',
                       scaleID: 'x-axis-1',
                       value: row,
                      //  borderColor: grey[500],
                       borderWidth: 0.5,
                       label: {
                           enabled: false,
                       }
                      }))

  const data = {
    labels: props.labels,
    datasets: props.datasets
  }

  const options = {
    responsive:true,
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    layout: { padding: 10 },
    tooltips: {
    callbacks: {
          title: function(tooltipItems, data) {
            return '';
          },
          label: function(tooltipItem, data) {
            return data.labels[tooltipItem.index];
          }
        }
     },
  legend: {
   display: false
     },
  scales: {
    yAxes: [{
      scaleLabel: {
              display: (props.yLabel) ? true : false,
              labelString: props.yLabel,
              fontSize:18,
              fontStyle: "bold",
              // fontColor: grey[500]
            },
        ticks: {
          fontStyle: "bold",
          fontColor: 'black',
          beginAtZero: false,
          max : Math.max(...props.ticks),
          min: Math.min(...props.ticks),
          callback: function(value, index, values) {
            if(props.ticks.indexOf(value) == -1){ return ''; }
                  return  value;
        }},
       gridLines: {
               display: true,
               drawBorder: true,
               borderDash: [8, 4]
             }
      }],
    xAxes: [{
      scaleLabel: {
        display: (props.xLabel) ? true : false,
        labelString: props.xLabel,
        fontSize:18,
        fontStyle: "bold",
        // fontColor: grey[500],
      },
      type: 'linear',
      position: 'bottom',
    ticks: {
          fontStyle: "bold",
          fontColor: 'black',
           beginAtZero: false,
           max : Math.max(...props.ticks),
           min: Math.min(...props.ticks),
            callback: function(value, index, values) {
              if(props.ticks.indexOf(value) == -1){ return ''; }
                    return  value;
          }},
    gridLines: {
      display: true,
      drawBorder: true,
      borderDash: [8, 4]
    }
        }],
        },
    annotation: {
    annotations: annotations
             },
  plugins: {
      datalabels: {
          formatter: function(value,context) {
              return context.chart.data.labels[context.dataIndex];
          },
          color: props.datasets[0].pointBackgroundColor,
          align: datas.map(row => row.align),
          offset: props.labels.map(row => 5),
      }
  }
}

  return (

  <Scatter
  data={data}
  height={500}
  options={options}
  />
)}


export default ScatterChart
