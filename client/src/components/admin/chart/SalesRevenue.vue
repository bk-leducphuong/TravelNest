<script>
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)
export default {
  props: {
    dailyRevenue: Array,
    startDate: Date,
    endDate: Date
  },
  data() {
    return {
      dailyRevenueLabels: [],
      dailyRevenueData: []
    }
  },
  watch: {
    startDate() {
      this.dailyRevenueLabels = this.createLabels()
      this.dailyRevenueData = this.createData()
      this.renderChart()
    },
  },
  methods: {
    createLabels() {
      const labels = []
      const startDate = this.startDate
      const endDate = this.endDate
      // loop from startDate to endDate
      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        labels.push(date.toLocaleDateString('vi-VN').split('/').slice(0, 2).join('/'))
      }
      return labels
    },
    createData() {
      const data = []    
      const startDate = this.startDate
      const endDate = this.endDate
      // loop from startDate to endDate
      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const revenueDays = this.dailyRevenue.find(
          (revenue) => revenue.date === date.toISOString().slice(0, 10)
        )
        if (revenueDays) {
          data.push(revenueDays.revenue)
        } else {
          data.push(0)
        }
      }
      return data
    },
    renderChart() {
      const revenueCtx = this.$refs.revenueChart.getContext('2d')
      this.chartInstance = new Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: this.dailyRevenueLabels,
          datasets: [
            {
              data: this.dailyRevenueData,
              backgroundColor: '#8884d8',
              borderRadius: 4,
              barThickness: 12
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
          scales: {
            y: {
              display: false
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      })
    },
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }
  }
}
</script>
<template>
  <!-- Sales Revenue Card -->
  <div class="card">
    <div class="card-header">
      <div>
        <h2 class="card-title">Sales Revenue</h2>
        <p class="card-subtitle">In last 30 days revenue from rent.</p>
      </div>
      <button class="period-selector">
        <span>Info</span>
      </button>
    </div>

    <div class="metrics-grid">
      <div class="metric-item">
        <div class="metric-label">Monthly</div>
        <div class="metric-value">9.28K</div>
        <div class="metric-change change-positive">↑ 4.63%</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">Weekly</div>
        <div class="metric-value">2.69K</div>
        <div class="metric-change change-negative">↓ 1.92%</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">Daily (Avg)</div>
        <div class="metric-value">0.94K</div>
        <div class="metric-change change-positive">↑ 3.45%</div>
      </div>
    </div>

    <div class="chart-container">
      <canvas ref="revenueChart"></canvas>
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
