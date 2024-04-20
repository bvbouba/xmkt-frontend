import React from 'react'
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(CategoryScale);
// Register the plugin to all charts:
Chart.register(ChartDataLabels);


interface props {
  data: ChartData<"line", any[], string>;
  title: string;
  titlePosition?:"left" | "top" | "right" | "bottom";
  stacked?:boolean;
  xGrid?:boolean;
  yGrid?:boolean;
  inPercent?:boolean;
  inThousand?:boolean;
  xTicks?:boolean;
  yTicks?:boolean;
  yTitle?:string

}

const LineChart = ({data,title,titlePosition,stacked,yGrid=true,inPercent,inThousand,yTitle="",xTicks=true,xGrid=false,yTicks=true}:props) => {
  
  const options : ChartOptions<'line'> = {
    responsive:true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: (xGrid) ? true : false,
          drawOnChartArea:false,
        },
        offset:true,
        ticks:{
          padding: 10,
          display: (xTicks) ? true : false,
        }
      },
      y:{
        title: {
          display: true,
          text: yTitle,
           align:"center",
           color:"gray"
        },
        stacked: (stacked) ? true : false,
        grid:{
            display: (yGrid) ? true : false,
            drawOnChartArea:(yGrid) ? true : false,
          },
        ticks:{
          padding: 10,
          display: (yTicks) ? true : false,
          maxTicksLimit: 6,
         callback: function(value:any) {
          if (inPercent) return Math.round(value*100) + ' %'
          if (inThousand) return Math.round(value/1000)
             return value
        }
        },
        beginAtZero:true
      },
  },
    plugins : {
      legend:{
        display:true,
        labels: {
          boxHeight:1
       },
      },
      title:{
        text:title,
        display:title? true:false,
        position: (titlePosition) ? titlePosition : 'top',
      },
      datalabels: {
        display: false,
         anchor: 'end',
         align: 'top',
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


export default LineChart
