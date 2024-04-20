import React from 'react'
import { Scatter } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-annotation';
import { ChartData, ChartOptions } from 'chart.js';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(CategoryScale);
// Register the plugin to all charts:
Chart.register(ChartDataLabels);


interface props {
    data: ChartData<"scatter", {
        x: any;
        y: any;
    }[], any>
    labelColors: string[];
    closePairs: {
        names: string[];
    }[];
    ticks: number[];
    xTitle?:string;
    yTitle?:string;
    min:number;
    max:number
}

const ScatterChart = ({data,closePairs,labelColors,ticks,xTitle,yTitle,min,max}:props) => {

 

    const options: ChartOptions<"scatter"> = {
        responsive:true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
      animation: {
        duration: 0, 
      },
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          ticks: {
            display: true,
            callback: function (value, index, values) {
              if (typeof value === "number") {
                if (ticks.indexOf(value) == -1) {
                  return "";
                }
                return value;
              }
            },
          },
          grid: { 
            display: true, 
            drawTicks:true,
        },
          title: {
            display: true,
            text:xTitle,
            align:"center",
            color:"gray",
            font:{
                size:18,
                weight:400
            },
          },
          max,
          min,
        },
        y: {
          type: "linear",
          position: "left",
          ticks: {
            color:"black",
            font:{
                weight:400
            },
            display: true,
            callback: function (value, index, values) {
              if (typeof value === "number") {
                if (ticks.indexOf(value) == -1) {
                  return "";
                }
                return value;
              }
            },
          },
          grid: { 
            display: true,
            drawTicks:true,
        },
          title: {
            display: true,
            text: yTitle,
            font:{
                size:18,
                weight:400
            },
             align:"center",
             color:"gray"
          },
          max,
          min,
        },
      },
      plugins: {
        tooltip:{
            enabled:true
           },
        legend: {
          display: false,
        },
        datalabels: {
          color: (context: any) => labelColors[context.dataIndex],
          formatter: function (value, context: any) {
            return context?.chart?.data?.labels?.[context.dataIndex] || "";
          },
          anchor: (context: any) =>
            context?.chart?.data?.labels?.[context.dataIndex]?.length === 2
              ? "center"
              : "end",
          align: function (context: any) {
            const name = context?.chart?.data?.labels?.[context.dataIndex]
            if (name.length === 2) return "center"
            const index = closePairs.findIndex(pair => pair.names.includes(name));
            if (index === -1 ) return "end"
            const position = closePairs[index].names.indexOf(name)
            switch (position) {
              case 0:
                return 'end';
              case 1:
                return 'right';
              case 2:
                return 'left';
              case 3:
                return 'bottom';
              default:
                return 'top';
            }
          },
  
          offset: 1,
        },
      },
    };

  return (

  <Scatter
  data={data}
  height={600}
  options={options}
  />
)}


export default ScatterChart
