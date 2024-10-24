import React from 'react'
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { CategoryScale, ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from "chart.js/auto";


Chart.register(CategoryScale);
// Register the plugin to all charts:
Chart.register(ChartDataLabels);

interface props {
    data: ChartData<"bar", any[], string>
    title:string;
    stacked?:boolean;
    yGrid?:boolean;
    inPercent?:boolean;
    legendPos?:"top" | "right" | "bottom" | "left" | "center"
}
const GroupedBar = ({data,title,stacked,yGrid,inPercent,legendPos}:props) => {

  // Extract the data arrays from each dataset
const allData = data.datasets.flatMap(dataset => dataset.data);

// Find the maximum value
const maxValue = Math.max(...allData);


    const options : ChartOptions<'bar'>  = {
        responsive:true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
         scales: {
             y: {
              max:1.2*maxValue,
                stacked: (stacked) ? true : false,
                 ticks: {
                   display: false,
                 },
                 beginAtZero: true,
                 grid: {
                   display: true,
                   drawOnChartArea:(yGrid) ? true : false,
                 }
             },
             x: {
              stacked: (stacked) ? true : false,
               grid: {
                 display: false,
                 drawOnChartArea:false,
               },
               ticks:{
                padding: 10,
              },
              offset: true
             }
         },
         plugins : {
           tooltip:{
             enabled:false
            },
            legend: {
              display: true,
              position:(legendPos) ? (legendPos) : 'top',
          },
           title:{
             text:(title) ? title : '',
             display:title? true:false
           },
           datalabels: {
            color: (stacked) ? 'white' : 'black',
            anchor: (stacked) ? 'center' : 'end',
            align: (stacked) ? 'center' : 'end',
              display: true,
               formatter: function(value, context) {
                 var index = context.dataIndex;
                 var num:any = context.dataset.data[index];
                 if (value === 0) return ''
                 if (inPercent) return Math.round(num*100) + ' %'
                   return Math.round(num)
               },
                 }
               }
         }

    return (
      <Bar
      data={data}
      height={200}
      options={options}
      />)

}

export default GroupedBar
