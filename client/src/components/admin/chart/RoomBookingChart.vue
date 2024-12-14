<script>
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)
export default {
  methods: {
    renderChart() {
      const ctx = this.$refs.bookingChart.getContext('2d')
      this.chartInstance = new Chart(ctx, {
        type: 'bar', // e.g., 'bar', 'line', etc.
        type: 'doughnut',
        data: {
          labels: ['Single', 'Double', 'Delux', 'Suite'],
          datasets: [
            {
              data: [1913, 859, 482, 138],
              backgroundColor: ['#8884d8', '#37DDB2', '#FFD88D', '#FF9F7B']
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          cutout: '60%'
        }
      })
    }
  },
  mounted() {
    this.renderChart()
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }
  }
}
</script>
<template>
  <!-- Room Booking Chart Card -->
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">Room Booking Chart</h2>
      <button class="period-selector">30 Days ▼</button>
    </div>

    <div class="chart-container">
      <canvas ref="bookingChart"></canvas>
    </div>

    <div class="legend-grid">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #8884d8"></div>
        <div>
          <div class="legend-text">Single</div>
          <div class="legend-value">1913 <span class="legend-percentage">58.63%</span></div>
        </div>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #37ddb2"></div>
        <div>
          <div class="legend-text">Double</div>
          <div class="legend-value">859 <span class="legend-percentage">23.94%</span></div>
        </div>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #ffd88d"></div>
        <div>
          <div class="legend-text">Delux</div>
          <div class="legend-value">482 <span class="legend-percentage">12.94%</span></div>
        </div>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #ff9f7b"></div>
        <div>
          <div class="legend-text">Suite</div>
          <div class="legend-value">138 <span class="legend-percentage">4.49%</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.25rem;
  color: #2c3e50;
  font-weight: 600;
}

.card-subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 4px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.metric-item {
  padding: 10px;
}

.metric-label {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
}

.metric-change {
  font-size: 0.875rem;
  margin-top: 4px;
}

.change-positive {
  color: #10b981;
}

.change-negative {
  color: #ef4444;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.period-selector {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-text {
  font-size: 0.875rem;
  color: #64748b;
}

.legend-value {
  font-weight: 600;
  color: #1e293b;
}

.legend-percentage {
  color: #94a3b8;
  font-size: 0.75rem;
}
</style>
