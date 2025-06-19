// Pure SPA Router - No DOM manipulation
function appRouter() {
    return {
        // Current page state
        currentPage: 'overview',
        
        // Initialize router
        init() {
            console.log('🚀 Router initialized');
            this.handleInitialRoute();
            
            // Listen for browser back/forward buttons
            window.addEventListener('popstate', () => {
                this.handleBrowserNavigation();
            });
        },
        
        // Navigate to a specific page
        navigateTo(pageName) {
            console.log(`📍 Navigating to: ${pageName}`);
            
            // Update current page (Alpine.js will handle UI updates)
            this.currentPage = pageName;
            
            // Update browser URL (without page reload)
            window.history.pushState({}, '', `#${pageName}`);
        },
        
        // Handle initial page load
        handleInitialRoute() {
            const hash = window.location.hash.slice(1) || 'overview';
            this.currentPage = hash;
        },
        
        // Handle browser navigation (back/forward)
        handleBrowserNavigation() {
            const hash = window.location.hash.slice(1) || 'overview';
            this.currentPage = hash;
        }
    }
}
