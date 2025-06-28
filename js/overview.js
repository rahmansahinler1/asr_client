// Overview Page Component
function overviewApp() {
    return {
        chart: null,
        crawlabilityChart: null,
        
        init() {
            // Create charts when component initializes and data is available
            if (this.$store.overview.ai_seo_score !== null) {
                this.createAISEOChart();
            }
            
            if (this.$store.overview.ai_crawlability.page_counts.well_performing !== null) {
                this.createCrawlabilityChart();
            }
            
            // Watch for data changes
            this.$watch('$store.overview.ai_seo_score', (score) => {
                if (score !== null) {
                    this.createAISEOChart();
                }
            });
            
            this.$watch('$store.overview.ai_crawlability.page_counts', (pageData) => {
                if (pageData && pageData.well_performing !== null) {
                    this.$nextTick(() => {
                        this.createCrawlabilityChart();
                    });
                }
            }, { deep: true });
        },
        
        createAISEOChart() {
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
        
        createCrawlabilityChart() {
            const pageData = this.$store.overview.ai_crawlability.page_counts;
            if (!pageData.well_performing || typeof Chart === 'undefined') return;
            
            const canvas = this.$refs.aiCrawlabilityCanvas;
            if (!canvas) return;
            
            // Clean up existing chart
            if (this.crawlabilityChart) {
                this.crawlabilityChart.destroy();
                this.crawlabilityChart = null;
            }
            
            const ctx = canvas.getContext('2d');
            
            // Chart data: page counts for each category
            const chartData = [
                pageData.well_performing,
                pageData.underperforming,
                pageData.deadweight,
                pageData.excluded
            ];
            
            const chartColors = [
                '#94c45b',  // Green - Well performing
                '#fddc5c',  // Yellow - Underperforming  
                '#f8696b',  // Red - Deadweight
                '#e9ecef'   // Gray - Excluded
            ];
            
            this.crawlabilityChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Well performing', 'Underperforming', 'Deadweight', 'Excluded'],
                    datasets: [{
                        data: chartData,
                        backgroundColor: chartColors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }, // We have custom legend
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.raw + ' pages';
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        duration: 800
                    }
                }
            });
        },
        
        destroy() {
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
            if (this.crawlabilityChart) {
                this.crawlabilityChart.destroy();
                this.crawlabilityChart = null;
            }
        }
    }
}