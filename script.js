const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const heroSearchButton = document.getElementById('heroSearchButton');
const searchResultsContainer = document.getElementById('searchResults');
const recipeDetailsModal = document.getElementById('recipeDetailsModal');
const recipeTitleElement = document.getElementById('recipeTitle');
const recipeInstructionsElement = document.getElementById('recipeInstructions');
const closeModalButton = recipeDetailsModal.querySelector('.close-button');
const mealDBApiUrl = 'https://www.themealdb.com/api/json/v1/1/';

function showLoadingSkeleton() {
    searchResultsContainer.style.display = 'none';
    document.getElementById('loadingSkeleton').style.display = 'grid';
}

function hideLoadingSkeleton() {
    document.getElementById('loadingSkeleton').style.display = 'none';
    searchResultsContainer.style.display = 'grid';
}

async function fetchMeals(query) {
    try {
        showLoadingSkeleton(); // Show loader
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a 2-second delay
        const response = await fetch(`${mealDBApiUrl}search.php?s=${query}`);
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error fetching meals:', error);
        displayError('Failed to fetch meals. Please try again later.');
        return null;
    } finally {
        hideLoadingSkeleton(); // Hide loader
    }
}
