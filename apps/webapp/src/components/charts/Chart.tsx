import { ChartDataType } from 'types';
import { Bar, Line } from 'react-chartjs-2';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import 'chartjs-plugin-datalabels';
import { ChartData, ChartOptions } from 'chart.js';
Chart.register(CategoryScale);
// Register the plugin to all charts:
Chart.register(ChartDataLabels);



export const ChartX = ({chartType,data,options,title,displayType}:ChartDataType) => {
    
    const datalabelsConfig = options.plugins?.datalabels;
    const chartOptions :ChartOptions<"bar"|"line"> = {
        ...options,
        plugins:{
            ...options.plugins,
            title:{
                text:title,
                display:true
              },
            datalabels:{
                ...datalabelsConfig,
                formatter: function(value:number, context:any) {
                    var index = context.dataIndex;
                    var dataValue = context.dataset.data[index];
                      switch (displayType) {
                        case "basic1":
                            return dataValue
                        case "basic1":
                            return Math.round(dataValue)               
                        case "percentage":
                            return Math.round(dataValue*100) + ' %'
                        case "label":
                            return context.dataset.label;
                        default:
                            break;
                      }
                      return dataValue
                  }
            }
            
        }
    
    };
    switch (chartType) {
    case 'bar':
      return <Bar
                    data={data as ChartData<'bar', number[], string>}
                    height={500}
                    options={chartOptions}
                    />;
    
    case 'line':
      return  <Line
                    data={data as ChartData<'line', number[], string>}
                    height={500}
                    options={chartOptions}
            />;;
  
  }
};

export default ChartX;
