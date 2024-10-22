import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(CategoryScale);
// Register the plugin to all charts:
Chart.register(ChartDataLabels);

interface Props {
    data: ChartData<"bar", number[], string>;
  title: string;
  inPercent?: boolean | undefined;
  yGrid?:boolean;
  xGrid?:boolean;
  stacked?:boolean;
  inThousand?:boolean;
  legendPos?:"top" | "left" | "right" | "bottom" | "center" ;
  legendDisplay?:boolean
}


// @ts-ignore
Array.prototype.SumArray = function (arr) {

  var sum = this.map(function (num, idx) {
    return num + arr[idx];
  });

  return sum;
}

const HorizontalBar = ({ data, title, inPercent,inThousand,legendPos,legendDisplay=true,yGrid,xGrid,stacked}: Props) => {
  console.log(inPercent)
  let max = 0
  let arr = Array.apply(null, Array(data.labels?.length)).map(Number.prototype.valueOf,0);
    data.datasets.map(row =>
    {
      // @ts-ignore
      arr = arr.SumArray(row.data)
      return arr
    })
  if (stacked) {
    max = arr.reduce((a,c)=> Math.max(a,c),0)
  }else {
    max = data.datasets.reduce((a,c) => Math.max(a,Math.max(...c.data)),0)
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y', // This makes the chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: legendDisplay ? true :false,
        position: legendPos ? legendPos : 'top',
      },
      title: {
        text: title,
        display: true,
      },
      datalabels: {
        color: '#ffffff',
        display: true,
        formatter: function (value, context) {
          if (value === 0) return '';
          const index = context.dataIndex;
          const num: any = context.dataset.data[index];
          
          if (inPercent) return Math.round(num*100) + ' %'
            return Math.round(num)
        },
      },
    },
    scales: {
      y: {
        stacked:stacked? true:false,
        beginAtZero: true,
        grid:{
            display: (yGrid === false ) ? false: true,
        }
      },
      x:{
        max,
        stacked:stacked? true:false,
        grid:{
          display: (xGrid === false ) ? false: true,
      },
        ticks: {
            maxTicksLimit: 6,
            callback: function (value:any) {
              if (inPercent) return Math.round(value*100) + ' %'
              if (inThousand) return (value/1000).toFixed(0)
                return Math.round(value)
           }
         },
      }
    },
  };

  return (
    <Bar
      data={data}
      height={200}
      options={options}
    />
  );
};

export default HorizontalBar