// 1) GET Dom Elements
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

// 8) initialize variables
let usedPokemonIds = [];
let count = 0; // 15.3
let points = 0; //15.8
let showLoading = false;

// 2) Create function to fetch pokemon from api with and ID

async function fetchPokemonById(id) {
    showLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}

// 3)  Create a test Function to see Result of step 2 

// async function testFetch() {
//     const pokemon = await fetchPokemonById(getRandomPokemonId());
//     console.log(pokemon);
// }

// 4) call Function from Step 3

//  testFetch();

//6) function to load question with options

async function loadQuestionWithOptions() {
    if (showLoading) {
        showLoadingWindow();
        hidePuzzleWindow();
    }
    // 7) Fetch correct answer first
    let pokemonId = getRandomPokemonId();

    // 8.2) check if current question has been used
    while (usedPokemonIds.includes(pokemonId)) {
        pokemonId = getRandomPokemonId();
    }

    // 8.3) if pokemon has not been displayed it is added to usedPokemonIds and it is set as a new const
    usedPokemonIds.push(pokemonId);
    const pokemon = await fetchPokemonById(pokemonId);

    // 9) Create options array
    const options = [pokemon.name];
    const optionsIds = [pokemon.id];

    // 10) fetch additional random Pokemon names to use as options 
    while (options.length < 4) {
        let randomPokemonId = getRandomPokemonId();

        //10.1) ensure fetched option does not exist in the options list. Creates mew random id until it does not exist in optionIds
        while (optionsIds.includes(randomPokemonId)) {
            randomPokemonId = getRandomPokemonId();
        }
        optionsIds.push(randomPokemonId);

        //10.2) fetching a random pokemon with the newly made ID, and adding it to the options array.
        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;
        options.push(randomOption);

        //10.3 Test
        console.log(options);
        console.log(optionsIds);

        //16.5 turn off loading if all options have been fetched 
        if (options.length === 4) {
            showLoading = false;
        }
    }

    shuffleArray(options);

    // 13) clear any previous result and update pokemon image to fetched image url from thr sprites
    resultElement.textContent = "Who's that Pokemon?";
    pokemonImageElement.src = await pokemon.sprites.other.dream_world.front_default;

    // 14) Create options Html elements buttons from options array in the DOM
    optionsContainer.innerHTML = "";
    options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = (event) => checkAnswer(option === pokemon.name, event);
        optionsContainer.appendChild(button);
    });

    if (!showLoading) {
        hideLoadingWindow();
        showPuzzleWindow();
    }
}

// 15) Create checkAnswer() function
function checkAnswer(isCorrect, event) {
    // 15.1) check if any button is already selected, if falsy => no element => null
    const selectedButton = document.querySelector(".selected");
    // 15.2) if its been selected do nothing exit function.
    if (selectedButton) {
        return;
    }

    //15.4) else mark the clicked button as selected and increase count by 1
    event.target.classList.add("selected");
    count++;
    totalCount.textContent = count;

    if (isCorrect) {
        // 15.7) call displayedResult() function
        displayResult("You are correct!");
        // 15.8) if correct increase the points by 1
        points++;
        pointsElement.textContent = points;
        event.target.classList.add("correct");
    } else {
        displayResult("Wrong Answer :(");
        event.target.classList.add("wrong");
    }

    //15.9) load the next Question with 1.5s delay so user and read result 
    setTimeout(() => {
        showLoading = true;
        loadQuestionWithOptions();
    }, 1500)
}

// 11) initial load
loadQuestionWithOptions();

//--- UTILITY FUNCTIONS ---

// 5)  Randomize Function to the pokemon ID
function getRandomPokemonId() {
    return Math.floor(Math.random() * 151) + 1;
}

// 12.1) randomize placement of correct answer when displayed on button
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// 15.5) function to update result text and class name
function displayResult(result) {
    resultElement.textContent = result;
}

// 17) hide loading 
function hideLoadingWindow() {
    loadingContainer.classList.add("hide");
}

// 18) show loading window
function showLoadingWindow(){
    mainContainer[0].classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
}

// 19) show puzzle window
function showPuzzleWindow(){
    loadingContainer.classList.remove("show");
    mainContainer[0].classList.remove("hide");
    mainContainer[0].classList.add("show");
}

// 20) hide puzzle window
function hidePuzzleWindow(){
    mainContainer[0].classList.add("hide");
}




