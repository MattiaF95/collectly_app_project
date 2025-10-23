import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CollectionService } from '../../core/services/collection.service';
import { Collection } from '../../core/models/collection.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgApexchartsModule,
  ],
  template: `
    <div class="statistics-container">
      <h1>Statistiche Collezioni</h1>

      <div class="stats-grid">
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>collections</mat-icon>
              Totale Collezioni
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ totalCollections }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>inventory_2</mat-icon>
              Totale Oggetti
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ totalItems }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>euro</mat-icon>
              Valore Totale
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">€{{ totalValue.toFixed(2) }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>shopping_cart</mat-icon>
              Spesa Totale
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">€{{ totalCost.toFixed(2) }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Distribuzione per Tipo</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <apx-chart
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [xaxis]="chartOptions.xaxis"
            [dataLabels]="chartOptions.dataLabels"
            [grid]="chartOptions.grid"
            [stroke]="chartOptions.stroke"
            [title]="chartOptions.title"
            [fill]="chartOptions.fill"
            [markers]="chartOptions.markers"
          ></apx-chart>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .statistics-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      h1 {
        margin-bottom: 2rem;
        color: #333;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      mat-card {
        mat-card-header {
          mat-card-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1rem;
            color: #666;

            mat-icon {
              color: #3498db;
            }
          }
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #2c3e50;
          margin-top: 1rem;
        }
      }

      .chart-card {
        margin-top: 2rem;

        mat-card-content {
          padding: 1rem 0;
        }
      }
    `,
  ],
})
export class StatisticsComponent implements OnInit {
  private collectionService = inject(CollectionService);

  totalCollections = 0;
  totalItems = 0;
  totalValue = 0;
  totalCost = 0;

  chartOptions: ChartOptions = {
    series: [
      {
        name: 'Oggetti',
        data: [],
      },
    ],
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: [],
    },
    title: {
      text: 'Numero oggetti per tipo collezione',
      align: 'left',
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    fill: {
      colors: ['#3498db'],
    },
    markers: {
      size: 1,
    },
    yaxis: {
      title: {
        text: 'Numero Oggetti',
      },
    },
  };

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.collectionService.getCollections().subscribe({
      next: (collections: Collection[]) => {
        this.totalCollections = collections.length;
        this.totalItems = collections.reduce(
          (sum, c) => sum + (c.itemCount || 0),
          0
        );
        this.totalValue = collections.reduce(
          (sum, c) => sum + (c.totalValue || 0),
          0
        );
        this.totalCost = collections.reduce(
          (sum, c) => sum + (c.totalCost || 0),
          0
        );

        // Prepara dati per il grafico
        const typeMap = new Map<string, number>();
        collections.forEach((c) => {
          const current = typeMap.get(c.type) || 0;
          typeMap.set(c.type, current + (c.itemCount || 0));
        });

        this.chartOptions.xaxis.categories = Array.from(typeMap.keys());
        this.chartOptions.series = [
          {
            name: 'Oggetti',
            data: Array.from(typeMap.values()),
          },
        ];
      },
      error: (error) => {
        console.error('Errore caricamento statistiche:', error);
      },
    });
  }
}
