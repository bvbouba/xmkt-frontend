import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(CategoryScale);
// Register the plugin to all charts:
Chart.register(ChartDataLabels);

interface props {
    data: ChartData<"doughnut", number[], string>;
    title: string;
    inPercent?: boolean | undefined;
    legendDisplay?:boolean
}

const DoughnutChart = ({data,title,legendDisplay=true,inPercent}:props) => {

    const options : ChartOptions<'doughnut'> = {
        responsive:true,
       maintainAspectRatio: false,
        plugins : {
          tooltip:{
            enabled:false
           },
          legend:{
            display: (legendDisplay) ? true : false,
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle', 
              boxWidth: 10,
              padding: 15, 
          },
          },
          title:{
            text:title,
            display:true
          },
          datalabels: {
            color: "#ffffff",
            display: true,
             formatter: function(value, context) {
                
                if (value === 0) return ''
               var index = context.dataIndex;
               var num:any = context.dataset.data[index]
               
               if(inPercent) {

                if (typeof num === 'number') {
                    const total = (context.dataset?.data as number[]).reduce(
                      (acc, val) => acc + val,
                      0
                    );
                    const percentage = (num / total) * 100;
                    return percentage.toFixed(0) + ' %';
                  } else {
                    // Handle other cases (e.g., Point or [number, number]) if needed
                    return 'N/A';
                  }
               }  {
                const rounded = Math.round(num);
                if( rounded === 0) return num.toFixed(1)
                return rounded
               }
               
             },
               }
        }
      }


    return (
      <Doughnut
      data={data}
      height={200}
      options={options}
      />)
  }

export default DoughnutChart
