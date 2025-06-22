// Overview Page Component
function overviewApp() {
    return {
        aiSeoChart: {
            instance: null,
            initialized: false
        },
        init() {
            // Visual check to initialize chart
            this.$watch('$el.offsetParent', (visible) => {
                if (visible && !this.aiSeoChart.initialized) {
                    this.initializeChart();
                }
            });
            // Data check to initialize chart
            this.$watch('$store.overview.ai_seo_score', (score) => {
                if (score !== null && this.$el.offsetParent) {
                    this.initializeChart();
                }
            });
        },
        
        initializeChart() {
            if (this.aiSeoChart.initialized) {
                this.updateChart();
                return;
            }
            
            const score = this.$store.overview.ai_seo_score;
            if (score === null) {
                return;
            }
            
            if (typeof Chart === 'undefined') {
                setTimeout(() => this.initializeChart(), 500);
                return;
            }
            
            requestAnimationFrame(() => {
                this.createAiSeoChart();
            });
        },
        
        createAiSeoChart() {
            const score = this.$store.overview.ai_seo_score;
            
            let canvas = this.$refs.aiSeoCanvas;
            if (!canvas) {
                canvas = this.$el.querySelector('canvas[x-ref="aiSeoCanvas"]');
            }
            
            if (!canvas) {
                console.error('❌ Canvas element not found!');
                return;
            }
            
            const rect = canvas.getBoundingClientRect();
            
            if (rect.width === 0 || rect.height === 0) {
                console.warn('⚠️ Canvas not visible, retrying...');
                setTimeout(() => this.createAiSeoChart(), 200);
                return;
            }
            
            if (this.aiSeoChart.instance) {
                try {
                    this.aiSeoChart.instance.destroy();
                    this.aiSeoChart.instance = null;
                } catch (e) {
                    console.warn('Chart destroy warning:', e.message);
                }
            }
            
            let scoreColor = '#dc3545'; // Red
            if (score >= 80) scoreColor = '#198754'; // Green
            else if (score >= 60) scoreColor = '#ffc107'; // Yellow
            
            try {
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error('❌ Could not get 2D context from canvas');
                    return;
                }
                
                this.aiSeoChart.instance = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [score, 100 - score],
                            backgroundColor: [scoreColor, '#e9ecef'],
                            borderWidth: 0,
                            cutout: '70%'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        },
                        animation: {
                            animateRotate: true,
                            animateScale: false,
                            duration: 1000
                        }
                    }
                });
                
                this.aiSeoChart.initialized = true;
                
            } catch (error) {
                console.error('❌ Chart creation error:', error);
                console.error('Error stack:', error.stack);
                this.aiSeoChart.initialized = false;
            }
        },
        
        updateChart() {
            if (!this.aiSeoChart.instance) {
                this.createAiSeoChart();
                return;
            }
            
            const score = this.$store.overview.ai_seo_score;
            
            let scoreColor = '#dc3545'; // Red
            if (score >= 80) scoreColor = '#198754'; // Green
            else if (score >= 60) scoreColor = '#ffc107'; // Yellow
            
            this.aiSeoChart.instance.data.datasets[0].data = [score, 100 - score];
            this.aiSeoChart.instance.data.datasets[0].backgroundColor[0] = scoreColor;
            this.aiSeoChart.instance.update();
        },
        
        getScoreStatus(score) {
            if (score >= 80) return 'Excellent';
            if (score >= 60) return 'Good';
            return 'Needs Improvement';
        },
        
        destroy() {
            if (this.aiSeoChart.instance) {
                try {
                    this.aiSeoChart.instance.destroy();
                    this.aiSeoChart.instance = null;
                    this.aiSeoChart.initialized = false;
                } catch (e) {
                    console.warn('Cleanup warning:', e.message);
                }
            }
        }
    }
}