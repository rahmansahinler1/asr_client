// Overview Page Component - SIMPLIFIED with DOM ready
function overviewApp() {
    return {
        // ================================
        // CHART MANAGEMENT ONLY
        // ================================
        aiSeoChart: {
            instance: null
        },
        
        // ================================
        // COMPONENT LIFECYCLE
        // ================================
        init() {
            console.log('📊 Overview page initialized - DOM is ready');
            console.log('Current store values:');
            console.log('User authenticated:', this.$store.user.isAuthenticated);
            console.log('AI SEO Score:', this.$store.overview.ai_seo_score);
            console.log('Brand name:', this.$store.brand.name);
            
            // Watch for store data and create chart when ready
            this.$watch('$store.overview.ai_seo_score', (score) => {
                console.log('👀 AI SEO Score changed:', score);
                if (score !== null) {
                    // Wait for Alpine to show the content
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.createAiSeoChart();
                        }, 100);
                    });
                }
            });
            
            // Try to create chart immediately if data exists
            if (this.$store.overview.ai_seo_score !== null) {
                console.log('🎯 Data available, creating chart immediately');
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.createAiSeoChart();
                    }, 100);
                });
            }
        },
        
        // ================================
        // CHART CREATION ONLY
        // ================================
        createAiSeoChart() {
            const score = this.$store.overview.ai_seo_score;
            
            console.log('🎨 Creating chart with score:', score);
            
            const canvas = this.$refs.aiSeoCanvas;
            console.log('Canvas element found:', !!canvas);
            
            if (!canvas) {
                console.error('❌ Canvas not found in $refs');
                console.log('Available $refs:', Object.keys(this.$refs || {}));
                return;
            }
            
            // Check if canvas is visible
            const rect = canvas.getBoundingClientRect();
            console.log('Canvas dimensions:', rect.width, 'x', rect.height);
            console.log('Canvas in viewport:', rect.width > 0 && rect.height > 0);
            
            if (rect.width === 0 || rect.height === 0) {
                console.warn('⚠️ Canvas not visible, retrying in 200ms...');
                setTimeout(() => {
                    this.createAiSeoChart();
                }, 200);
                return;
            }
            
            console.log('✅ Canvas found and visible, creating Chart.js instance...');
            
            // Destroy existing chart
            if (this.aiSeoChart.instance) {
                console.log('🗑️ Destroying existing chart');
                try {
                    this.aiSeoChart.instance.destroy();
                } catch (e) {
                    console.log('Chart destroy error (ignoring):', e.message);
                }
            }
            
            // Determine color based on score
            let scoreColor = '#dc3545'; // Red
            if (score >= 80) scoreColor = '#198754'; // Green
            else if (score >= 60) scoreColor = '#ffc107'; // Yellow
            
            try {
                this.aiSeoChart.instance = new Chart(canvas, {
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
                        }
                    }
                });
                
                console.log('✅ Chart created successfully!');
                
            } catch (error) {
                console.error('❌ Chart creation error:', error);
                console.error('Error details:', error.stack);
            }
        },
        
        // ================================
        // UTILITY METHODS
        // ================================
        getScoreStatus(score) {
            if (score >= 80) return 'Excellent';
            if (score >= 60) return 'Good';
            return 'Needs Improvement';
        }
    }
}
