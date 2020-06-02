// import { stringify } from "javascript-stringify";

export async function createStackedBarsUrl(title: string, labels: string[], datasets: Array<{label:string, data:number[]}>) {
    const chart : any = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: []
        },
        options: {
          title: {
            display: true,
            text: 'trader registration',
          },
          legend: { position: 'bottom' },
          scales: {
            xAxes: [{stacked: true}],
            yAxes: [{stacked: true}],
          },
        }
      };

      if (datasets) {
          datasets.forEach((ds: any) => {
            chart.data.datasets.push({
                label: ds.label,
                data: ds.data
            });
          });
      }

      return createChartUrl(chart);
}

export async function createDoughnutUrl(title: string, total: number, labels: string[], data: number[]) {
      const chart: any = {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            borderColor: ['#22B003','#8AA2B0', '#78DCF4'],
            backgroundColor: ['#22B003','#8AA2B0', '#78DCF4'],
            borderAlign: 'inner'
          }]
        },
        options: {     
            cutoutPercentage:75,
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            },
            title: {
              display: true,
              text: ' '
            },
            plugins: {
                legend: false,
                doughnutlabel: {
                labels: [
                    {
                        text: '' + total,
                        font: {size: '18' }
                    },
                    {
                        text: '',
                        font:  { size: '5' }
                    },
                    {
                        text: title,
                        font: {size: '12' }
                    }                    
                ]},
                outlabels: {
                    text: '%l %v (%p)',
                    color: 'white',
                    stretch: 20,
                    font: {
                        resizable: true,
                        minSize: 12,
                        maxSize: 18
                    }
                }
            }      
        }
      }

      return createChartUrl(chart);
}

export function createChartUrl(chart: any) {
    return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chart))}`;
}