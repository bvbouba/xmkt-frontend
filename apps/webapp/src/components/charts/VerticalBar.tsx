import React from 'react'
import { Bar } from 'react-chartjs-2';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';
import { formatPrice } from '@/lib/utils';
Chart.register(CategoryScale);
// Register the plugin to all charts:
Chart.register(ChartDataLabels);

interface props {
  data: ChartData<"bar", number[], string>; 
    title: string;
    inPercent?: boolean | undefined;
    legend?:boolean
}

const VerticalBar = ({data,title,inPercent,legend}:props) => {
  
  const options: ChartOptions<'bar'> =  {
    responsive:true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    scales: {
      x: {
        grid: {
          display: false,
          drawOnChartArea:false,
        },
        ticks:{
            padding: 10,
        }
      },
      y:{
        max: 1.2* data.datasets.reduce((a,c) => Math.max(a,Math.max(...c.data)),0),
        ticks:{
          display:false
        },
        grid:{
          display: false,
        }
      }
  },
    plugins : {
      tooltip:{
        enabled:false
       },
      legend:{
        display:legend? true:false
      },
      title:{
        text:title,
        display:true
      },
      datalabels: {
        color: 'black',
        anchor: function(context) {
          const value = context.dataset.data[context.dataIndex];
          const numValue = typeof value === 'number' ? value : null;
          return numValue !== null && numValue < 0 ? 'start' : 'end';
        },
        align: 'end',
         display: true,
          formatter: function(value, context) {
            var index = context.dataIndex;
            var num:any = context.dataset.data[index];
            if (inPercent){
              return Math.round(num*100) + ' %' ;
            } 
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
  />
)}

export default VerticalBar


export const options = ({
  percent,
  title,
  legend,
  horizontal,
  yAxisDisplay = true,
  y1AxisDisplay = false,
  inThousand
}: {
  percent?: boolean;
  title?: string;
  legend?: boolean;
  horizontal?: boolean;
  yAxisDisplay?: boolean;
  y1AxisDisplay?: boolean;
  inThousand?:boolean;
}): ChartOptions<"bar"> => ({
  maintainAspectRatio: false,
  indexAxis: horizontal ? "y" : "x",
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      display: yAxisDisplay,
      ticks: {
        callback: function (value: any) {
          if (percent) return Math.round(value * 100) + "%";
          if (inThousand) return formatPrice(Math.round(value/1000));
          return value;
        },
      },
    },
    y1: {
      display: y1AxisDisplay,  // Disable the secondary y-axis
    },
  },
  plugins: {
    tooltip:{
      enabled:false
     },
    legend: {
      display: legend === true ? true : false,
    },
    title: {
      text: title ?? "",
      display: true,
    },
    datalabels: {
      display: true,
      color: "#ffffff",
      formatter: function (value, context) {
        var index = context.dataIndex;
        if (percent) {
          if (value == 0) {
            return "";
          }
          if (Math.floor(value) > 1) {
            return formatPrice(Math.round(value));
          }
          return Math.round(value * 100) + " %";
        }
        if (inThousand) return formatPrice(Math.round(value/1000));

        return context.dataset.data[index];
      },
    },
  },
});
