// Overview Page Component
function overviewApp() {
    return {
        // Page state
        loading: true,
        
        // Real data from stores
        stats: {
            aiSeoScore: 0,
            brandName: '',
            lastUpdated: '',
            totalQueries: 0
        },
        
        // Component lifecycle
        init() {
            console.log('📊 Overview page initialized');
            this.loadOverviewData();
        },
        
        // Load page data from Alpine stores
        loadOverviewData() {
            // Get data from Alpine stores
            const userStore = this.$store.user;
            const brandStore = this.$store.brand;
            const overviewStore = this.$store.overview;
            
            // Check if data is available
            if (userStore.isAuthenticated && overviewStore.ai_seo_score !== null) {
                this.stats = {
                    aiSeoScore: overviewStore.ai_seo_score,
                    brandName: brandStore.name || 'Your Brand',
                    lastUpdated: this.formatDate(overviewStore.created_at),
                    totalQueries: 1 // Since we have one overview record
                };
                
                this.loading = false;
                console.log('📈 Overview data loaded - AI SEO Score:', this.stats.aiSeoScore);
                
            } else {
                // If no data available, wait and try again
                setTimeout(() => {
                    this.loadOverviewData();
                }, 100);
            }
        },
        
        // Format date helper
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }
}
