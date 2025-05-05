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

async function fetchRecipeDetails(mealId) {
    try {
        const response = await fetch(`${mealDBApiUrl}lookup.php?i=${mealId}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        displayError('Failed to fetch recipe details. Please try again.');
        return null;
    }
}

function displayMeals(meals) {
    searchResultsContainer.innerHTML = ''; // Clear previous results
    //heroContent.innerHTML = '';
    if (meals && meals.length > 0) {
        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('meal-card');
            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
            mealCard.addEventListener('click', () => openRecipeDetails(meal.idMeal));
            searchResultsContainer.appendChild(mealCard);
        });
    } else {
        searchResultsContainer.innerHTML = '<p>No recipes found for your search query.</p>';
    }
}

function displayRecipeDetails(recipe) {
    if (recipe) {
        recipeTitleElement.textContent = recipe.strMeal;

        // Display Ingredients
        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = 'Ingredients:';
        recipeInstructionsElement.appendChild(ingredientsTitle);

        const ingredientsList = document.createElement('ul');
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "" && measure && measure.trim() !== "") {
                const listItem = document.createElement('li');
                listItem.textContent = `${measure} ${ingredient}`;
                ingredientsList.appendChild(listItem);
            }
        }
        recipeInstructionsElement.appendChild(ingredientsList);

        // Display Instructions
        const instructionsTitle = document.createElement('h3');
        instructionsTitle.textContent = 'Instructions:';
        recipeInstructionsElement.appendChild(instructionsTitle);

        const instructionsParagraph = document.createElement('p');
        instructionsParagraph.textContent = recipe.strInstructions;
        recipeInstructionsElement.appendChild(instructionsParagraph);

        recipeDetailsModal.style.display = 'block';
    } else {
        displayError('Could not load recipe details.');
    }
}

function openRecipeDetails(mealId) {
    // Clear previous content in the modal
    recipeInstructionsElement.innerHTML = '';
    fetchRecipeDetails(mealId).then(displayRecipeDetails);
}

function closeRecipeDetails() {
    recipeDetailsModal.style.display = 'none';
}

function displayError(message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = `Error: ${message}`;
    searchResultsContainer.innerHTML = ''; // Clear previous results
    searchResultsContainer.appendChild(errorElement);
    console.error(message);
}

function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        fetchMeals(query).then(displayMeals);
    } else {
        searchResultsContainer.innerHTML = '<p>Please enter a meal or ingredient to search.</p>';
    }
}

// Event listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

heroSearchButton.addEventListener('click', () => {
    searchInput.focus();
});

closeModalButton.addEventListener('click', closeRecipeDetails);

window.addEventListener('click', (event) => {
    if (event.target === recipeDetailsModal) {
        closeRecipeDetails();
    }
});