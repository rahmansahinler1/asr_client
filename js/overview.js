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
            
            try {
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error('❌ Could not get 2D context from canvas');
                    return;
                }

                const gradient = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
                gradient.addColorStop(0, '#f8696b');
                gradient.addColorStop(0.5, '#fddc5c');
                gradient.addColorStop(1, '#94c45b');

                const colors = [gradient, gradient, gradient, '#e9ecef'];

                if (score <= 33) {
                    data = [
                        score,
                        0,
                        0,
                        100 - score
                    ];
                } else if (score <= 66) {
                    data = [
                        33,
                        score - 33,
                        0,
                        100 - score
                    ];
                } else {
                    data = [
                        33,
                        33,
                        score - 66,
                        100 - score
                    ];
                }
                
                this.aiSeoChart.instance = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: data,
                            backgroundColor: colors,
                            borderColor: '#ffffff',
                            borderWidth: 0,
                            cutout: '65%'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        rotation: -135,
                        circumference: 270,
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        },
                        animation: {
                            animateRotate: true,
                            animateScale: false,
                            duration: 1200
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
            
            this.createAiSeoChart();
        },
        
        getScoreStatus(score) {
            if (score >= 80) return 'Excellent';
            if (score >= 60) return 'Good';
            if (score >= 40) return 'Average';
            return 'Poor';
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