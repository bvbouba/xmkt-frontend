import React from 'react'
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';

interface props {
  data: ChartData<"line", any[], string>;  
  title: string;
  max: number;

}
const MultiAxisLine = ({data,title,max}:props) => {


  const options: ChartOptions<'line'> = {
    responsive:true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          drawOnChartArea:false,
        },
        ticks:{
          padding: 10,
        },
        offset:true
      },
      y:{
        position:'left',
        grid:{
            display: true,
            drawOnChartArea:false,
          },
        ticks:{
          padding:10,
          maxTicksLimit: 6,
        callback: function(value:any) {
          return Math.round(value) 
      }
        },
        max:1.2*max,
        beginAtZero:true
      },
      y1:{
        display:false,
        position:"right",
        grid:{
          display: true,
          drawOnChartArea:false,
        },
        ticks:{
          padding:10,
            display: true,
            maxTicksLimit: 6,
            callback: function(value:any) {
                return Math.round(value*100) + "%"
            }
        }
        
      }
  },
    plugins : {
      legend:{
        display:true,
        labels: {
          boxHeight:1,
       },
      },
      title:{
        text:title,
        display:true
      },
      datalabels: {
        display: false,
         anchor: 'end',
         align: 'center',
         formatter: function(value, context) {
           var index = context.dataIndex;
           var num:any = context.dataset.data[index];
               value = Math.round(num*100) + ' %'
             return value
         },
           }
    }
  }


  return (

  <Line
  data={data}
  height={250}
  options={options}
  />
)}

export default MultiAxisLine
