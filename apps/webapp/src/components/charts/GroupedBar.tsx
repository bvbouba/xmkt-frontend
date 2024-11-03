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
    legendPos?:"top" | "right" | "bottom" | "left" | "center",
}
const GroupedBar = ({data,title,stacked,yGrid,inPercent,legendPos}:props) => {

//   // Extract the data arrays from each dataset
// const allData = data.datasets.flatMap(dataset => dataset.data);

// // Find the maximum value
// const maxValue = Math.max(...allData);


    const options : ChartOptions<'bar'>  = {
        responsive:true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
         scales: {
             y: {
                stacked: (stacked) ? true : false,
                 ticks: {
                   display: true,
                   color: function(context) {
                    if (context.tick && context.tick.value === context.chart.scales.y.max) {
                        return 'white';
                    }
                },
                callback: function (value:any) {
                  if (inPercent) return Math.round(value*100) + ' %'
                    return Math.round(value)
               }   
              },
                 beginAtZero: true,
                 grid: {
                   display: true,
                   drawOnChartArea:(yGrid) ? true : false,
                   color: function(context) {
                    if (context.tick && context.tick.value === context.chart.scales.y.max) {
                        return 'rgba(0, 0, 0, 0)';
                    }
                    return '#e0e0e0';
                }
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
              labels: {
                usePointStyle: true,
                pointStyle: 'circle', 
                boxWidth: 10,
                padding: 15, 
            },
          },
           title:{
             text:(title) ? title : '',
             display:title? true:false
           },
           datalabels: {
            color: function (context) {
              const value = context.dataset.data[context.dataIndex];
              const numValue = typeof value === 'number' ? value : null;
              if (numValue !== null && numValue < 5 && !inPercent) return "black"
              else if (numValue !== null && numValue < 0.05 && inPercent) return "black"

              return "white"
                     },
            anchor: (stacked) ? 'center' : 'end',
            align: (stacked) ? 'center' : 'start',
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
