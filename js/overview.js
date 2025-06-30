// Overview Page Component
function overviewApp() {
    return {
        chart: null,
        crawlabilityChart: null,
        totalMentionsChart: null,
        
        init() {
            // Use $nextTick to ensure DOM is ready before creating charts
            this.$nextTick(() => {
                this.initializeCharts();
            });
            
            // Watch for data changes
            this.$watch('$store.overview.ai_seo_score', (score) => {
                if (score !== null) {
                    this.$nextTick(() => {
                        this.createAISEOChart();
                    });
                }
            });
            
            this.$watch('$store.overview.ai_crawlability.page_counts', (pageData) => {
                if (pageData && pageData.well_performing !== null) {
                    this.$nextTick(() => {
                        this.createCrawlabilityChart();
                    });
                }
            }, { deep: true });
            
            // Single watcher for total mentions chart - watches both dependencies
            this.$watch(() => ({
                linkMentions: this.$store.overview.total_mentions.link_mentions,
                niches: this.$store.brand.niches
            }), (newVal) => {
                if (newVal.linkMentions !== null && newVal.niches && newVal.niches.length > 0) {
                    this.$nextTick(() => {
                        this.createTotalMentionsChart();
                    });
                }
            }, { deep: true });
        },
        
        initializeCharts() {
            // Create charts when component initializes and data is available
            if (this.$store.overview.ai_seo_score !== null) {
                this.createAISEOChart();
            }
            
            if (this.$store.overview.ai_crawlability.page_counts.well_performing !== null) {
                this.createCrawlabilityChart();
            }
            
            if (this.$store.overview.total_mentions.link_mentions !== null && 
                this.$store.brand.niches && this.$store.brand.niches.length > 0) {
                this.createTotalMentionsChart();
            }
        },
        
        createAISEOChart() {
            const score = this.$store.overview.ai_seo_score;
            if (score === null || typeof Chart === 'undefined') return;
            
            const canvas = this.$refs.aiSeoCanvas;
            if (!canvas) {
                console.warn('AI SEO Canvas not available yet');
                return;
            }
            
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
            if (!canvas) {
                console.warn('AI Crawlability Canvas not available yet');
                return;
            }
            
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
        
        createTotalMentionsChart() {
            const linkMentions = this.$store.overview.total_mentions.link_mentions;
            const referenceMentions = this.$store.overview.total_mentions.reference_mentions;
            const niches = this.$store.brand.niches;
            
            if (!linkMentions || !referenceMentions || !niches || typeof Chart === 'undefined') return;
            
            // Ensure data arrays match niches length
            if (linkMentions.length !== niches.length || referenceMentions.length !== niches.length) {
                console.warn('Total mentions data length does not match niches length');
                return;
            }
            
            const canvas = this.$refs.totalMentionsCanvas;
            if (!canvas) {
                console.warn('Total Mentions Canvas not available yet');
                return;
            }
            
            // Clean up existing chart
            if (this.totalMentionsChart) {
                this.totalMentionsChart.destroy();
                this.totalMentionsChart = null;
            }
            
            const ctx = canvas.getContext('2d');
            
            this.totalMentionsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: niches,
                    datasets: [
                        {
                            label: 'Link Mentions',
                            data: linkMentions,
                            backgroundColor: '#fddc5c',
                            borderColor: '#fddc5c',
                            borderWidth: 1
                        },
                        {
                            label: 'Reference Mentions',
                            data: referenceMentions,
                            backgroundColor: '#f4a261',
                            borderColor: '#f4a261',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    categoryPercentage: 0.8,
                    barPercentage: 0.6,
                    scales: {
                        x: {
                            stacked: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    size: 12
                                }
                            }
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            grid: {
                                color: '#e9ecef'
                            },
                            ticks: {
                                stepSize: 1,
                                font: {
                                    size: 12
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // We have custom legend
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                title: function(context) {
                                    return context[0].label;
                                },
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.raw;
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 800,
                        easing: 'easeInOutQuart'
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
            if (this.totalMentionsChart) {
                this.totalMentionsChart.destroy();
                this.totalMentionsChart = null;
            }
        }
    }
}