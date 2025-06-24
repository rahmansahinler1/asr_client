// Overview Page Component
function overviewApp() {
    return {
        chart: null,
        
        init() {
            // Create chart when component initializes and data is available
            if (this.$store.overview.ai_seo_score !== null) {
                this.createChart();
            }
            
            // Watch for data changes
            this.$watch('$store.overview.ai_seo_score', (score) => {
                if (score !== null) {
                    this.createChart();
                }
            });
        },
        
        createChart() {
            const score = this.$store.overview.ai_seo_score;
            if (score === null || typeof Chart === 'undefined') return;
            
            const canvas = this.$refs.aiSeoCanvas;
            if (!canvas) return;
            
            // Clean up existing chart
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
            
            const ctx = canvas.getContext('2d');
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#f8696b');    // Red
            gradient.addColorStop(0.5, '#fddc5c');  // Yellow  
            gradient.addColorStop(1, '#94c45b');    // Green
            
            // Chart data: score portion + remaining portion
            const chartData = [score, 100 - score];
            const chartColors = [gradient, '#e9ecef'];
            
            this.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: chartData,
                        backgroundColor: chartColors,
                        borderWidth: 4,
                        cutout: '60%'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    rotation: -135,       // Start position like before
                    circumference: 270,   // 270 degrees like before
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    animation: {
                        animateRotate: true,
                        duration: 800
                    }
                }
            });
        },
        
        getScoreStatus(score) {
            if (score >= 80) return 'Excellent';
            if (score >= 60) return 'Good';
            if (score >= 40) return 'Average';
            return 'Poor';
        },
        
        destroy() {
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
        }
    }
}