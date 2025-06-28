// Application Initialization - Alpine.js Stores and Global Setup
document.addEventListener('alpine:init', () => {
    console.log('🚀 Initializing application stores...');
    
    Alpine.store('user', {
        isAuthenticated: false,
        profile: {
            user_id: null,
            user_name: '',
            user_surname: '',
            user_email: '',
            user_type: '',
            user_created_at: null
        }
    });
    Alpine.store('brand', {
        id: null,
        name: '',
        domain: '',
        niches: [],
        last_update: null
    });
    Alpine.store('overview', {
        id: null,
        created_at: null,
        ai_seo_score: null,
        score_change_percent: null,
        ai_crawlability: {
            page_counts: {
                well_performing: null,
                underperforming: null,
                deadweight: null,
                excluded: null
            },
            well_performing_change: null
        }
    });
    
    console.log('✅ Application stores initialized');
    
    // 🆕 Load initial user data
    loadInitialUserData();
});

// Initialize user data from API
async function loadInitialUserData() {
    try {
        console.log('📡 Loading initial user data...');
        
        // Using sample user ID for MVP
        const SAMPLE_USER_ID = "00000000-0000-0000-0000-000000000003";
        
        // Call existing API function
        const data = await window.fetchInitialData(SAMPLE_USER_ID);
        
        if (data) {
            // 1. Update user store with user_info
            if (data.user_info) {
                const userStore = Alpine.store('user');
                userStore.isAuthenticated = true;
                userStore.profile.user_id = data.user_info.user_id;
                userStore.profile.user_name = data.user_info.user_name;
                userStore.profile.user_surname = data.user_info.user_surname;
                userStore.profile.user_email = data.user_info.user_email;
                userStore.profile.user_type = data.user_info.user_type;
                userStore.profile.user_created_at = data.user_info.user_created_at;
                
                console.log('👤 User loaded:', `${data.user_info.user_name} ${data.user_info.user_surname}`);
            }
            
            // 2. Update brand store with single brand
            if (data.brand_info) {
                const brandStore = Alpine.store('brand');
                brandStore.id = data.brand_info.brand_id;
                brandStore.name = data.brand_info.brand_name;
                brandStore.domain = data.brand_info.domain;
                brandStore.niches = data.brand_info.brand_niche;
                brandStore.last_update = data.brand_info.last_update;
                
                console.log('🏢 Brand loaded:', data.brand_info.brand_name);
            }
            
            // 3. Update overview store with most recent data
            if (data.overview_data && Array.isArray(data.overview_data) && data.overview_data.length > 0) {
                const overviewStore = Alpine.store('overview');
                const latestOverview = data.overview_data[0];
                
                overviewStore.id = latestOverview.overview_id;
                overviewStore.created_at = latestOverview.created_at;
                overviewStore.ai_seo_score = latestOverview.ai_seo_score;
                overviewStore.score_change_percent = latestOverview.score_change_percent;
                
                // Mock data for AI Crawlability (TODO: Replace with backend data)
                overviewStore.ai_crawlability.page_counts.well_performing = 150;
                overviewStore.ai_crawlability.page_counts.underperforming = 45;
                overviewStore.ai_crawlability.page_counts.deadweight = 20;
                overviewStore.ai_crawlability.page_counts.excluded = 10;
                overviewStore.ai_crawlability.well_performing_change = 10;
                
                console.log('📊 Overview loaded - AI SEO Score:', latestOverview.ai_seo_score);
                if (latestOverview.score_change_percent !== 0) {
                    console.log('📈 Score Change:', latestOverview.score_change_percent + '%');
                }
                console.log('📄 Crawlability Pages - Well:', overviewStore.ai_crawlability.page_counts.well_performing, 'Change:', overviewStore.ai_crawlability.well_performing_change);
            }
            
            console.log('✅ All initial data loaded successfully');
            
        } else {
            throw new Error('No data returned from API');
        }
        
    } catch (error) {
        console.error('❌ Failed to load initial user data:', error);
        Alpine.store('user').isAuthenticated = false;
    }
}
