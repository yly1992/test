import { Component, OnInit } from '@angular/core';
import {Chart} from "angular-highcharts";

@Component({
  selector: 'app-chart-demo',
  template: `<button (click)="add()" )> add point!</button>
  <div [chart] = "chart"></div>
  `,
  styleUrls: ['./chart-demo.component.css']
})
export class ChartDemoComponent implements OnInit {

  chart = new Chart({
    chart:{
      type:'line'
    },
    title:{
      text: 'linechart'
    },
    credits:{
      enabled: false
    },
    series:[{
      name: 'lind 1',
      data:[10,20,30,40]
    }]
  });

  add(){
    this.chart.addPoint(Math.floor(Math.random() * 10))
  }

  constructor() { }

  ngOnInit() {
  }

}
