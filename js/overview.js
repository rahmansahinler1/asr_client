// Overview Page Component
function overviewApp() {
    return {
        // Page state
        loading: true,
        
        // Static data (no API yet)
        stats: {
            totalQueries: 0,
            visibilityScore: 0,
            brandMentions: 0,
            competitorComparison: 0
        },
        
        // Component lifecycle
        init() {
            console.log('📊 Overview page initialized');
            this.loadOverviewData();
        },
        
        // Load page data (static for now)
        loadOverviewData() {
            // Simulate loading delay
            setTimeout(() => {
                // Static demo data
                this.stats = {
                    totalQueries: 1250,
                    visibilityScore: 87,
                    brandMentions: 45,
                    competitorComparison: 23
                };
                
                this.loading = false;
                console.log('📈 Overview data loaded');
            }, 500);
        }
    }
}
