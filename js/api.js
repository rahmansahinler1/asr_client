window.fetchInitialData = async function(userID) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/get/init', {
            method: 'POST',
            body: JSON.stringify({ user_id: userID }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch initial data');
        }

        const data = await response.json();

        if (!data) {
            console.error('Initial data could not be fetched');
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching initial dashboard data:', error);
        return null;
    }
};