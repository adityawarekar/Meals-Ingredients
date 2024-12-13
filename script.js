const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Check if dark mode is already enabled in localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
}

// Event listener for dark mode toggle
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save the user's preference in localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.removeItem('darkMode');
    }
});

// Get meal list that matches with the ingredients
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-btn">Get Recipe</a>
                        </div>
                        <div class="meal-rating">
                            <span class="fa fa-star" data-value="1"></span>
                            <span class="fa fa-star" data-value="2"></span>
                            <span class="fa fa-star" data-value="3"></span>
                            <span class="fa fa-star" data-value="4"></span>
                            <span class="fa fa-star" data-value="5"></span>
                        </div>
                    </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
            addStarListeners();  // Add star click functionality
        });
}

// Get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

// Create a modal for recipe
function mealRecipeModal(meal) {
    meal = meal[0];
    let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
        <h3>Instruction:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="">
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Videos</a>
    </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Add event listeners to the rating stars
function addStarListeners() {
    const stars = document.querySelectorAll('.meal-rating .fa-star');
    stars.forEach(star => {
        star.addEventListener('click', function () {
            const rating = this.getAttribute('data-value');
            saveMealRating(this.closest('.meal-item').dataset.id, rating);
            updateStarRating(this.closest('.meal-item'), rating);
        });
    });
}

// Save rating (in localStorage or to a database)
function saveMealRating(mealId, rating) {
    console.log(`Saved rating ${rating} for meal ${mealId}`);
    // Implement actual saving mechanism here
}

// Update the star rating UI based on selection
function updateStarRating(mealItem, rating) {
    const stars = mealItem.querySelectorAll('.meal-rating .fa-star');
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= rating) {
            star.classList.add('checked');
        } else {
            star.classList.remove('checked');
        }
    });
}
