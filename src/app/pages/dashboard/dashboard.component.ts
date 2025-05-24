import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { ApiService } from '../../services/api.service';
import ApexCharts from 'apexcharts'
import { ChartComponent } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexLegend,
  ApexFill
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: any;
  responsive: ApexResponsive[];
};

export type barChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-dashboard',
  imports: [ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  property_id: [] = []
  total_tenant = 0
  total_complaints = 0
  total_pending_rent = 0
  total_paid_rent = 0
  total_pending_complaints = 0
  total_rooms = 0
  room_pi_data = [{ id: 0, pg_name: '', total_rooms: 0, filled_rooms: 0 }]

  constructor(private api: ApiService, private GF: GlobalService) {

  }



  chartOptions: ChartOptions = {
    series: [10, 107], // default or placeholder data
    chart: {
      type: 'donut',
      width: 300,
    },
    labels: ['pgname', 'room available'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 320,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  barchartOptions: barChartOptions = {
      series: [
        {
          name: "PRODUCT A",
          data: [44, 55, 41, 67, 22, 43, 21, 49]
        },
        {
          name: "PRODUCT B",
          data: [13, 23, 20, 8, 13, 27, 33, 12]
        },
        {
          name: "PRODUCT C",
          data: [11, 17, 15, 15, 21, 14, 15, 13]
        }
      ],
      chart: {
        type: "bar",
        height: "350",
        stacked: true,
        stackType: "100%"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        categories: [
          "2011 Q1",
          "2011 Q2",
          "2011 Q3",
          "2011 Q4",
          "2012 Q1",
          "2012 Q2",
          "2012 Q3",
          "2012 Q4"
        ]
      },
      fill:{
        opacity:1
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50
      },
      plotOptions:{},
      dataLabels:{}
    };



  ngOnInit(): void {
    this.getProperty()
  }



  getProperty() {
    this.api.postApi('property-data', {}).subscribe(
      (res: any) => {
        if (res.status) {
          this.property_id = res.data.map((ele: any) => { return ele.id })
          console.log(this.property_id)
        } else {
          this.GF.showToast(res.message, 'danger')
        }
      },
      (err: any) => {
        this.GF.showToast(err.error?.message, 'danger')
      }
    )
    setTimeout(() => {
      this.getPgDetails()
    }, 1000)
  }

  getPgDetails() {

    this.api.postApi('client-dashboard-data', { properties: this.property_id }).subscribe(
      (res: any) => {
        if (res.status) {
          this.total_tenant = res.total_tenant
          this.total_complaints = res.total_complaints
          this.total_pending_rent = res.total_pending_rent
          this.total_paid_rent = res.total_paid_rent
          this.total_pending_complaints = res.total_pending_complaints
          this.total_rooms = res.total_rooms
          this.room_pi_data = res.room_pi_data
        } else {
          this.GF.showToast(res.message, 'danger')
        }
      },
      (err: any) => {
        this.GF.showToast(err.error?.message, 'danger')
      }
    )

  }

}
