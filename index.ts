import { dictionary } from "./vocabulary";

// Describes the data used in vocabulary.ts
export interface Word {
    readonly word: string,
    readonly definition: string;
    readonly origin?: string;
}

// General quiz variables to keep track of how things are going
let questionNumber: number = 0;
let correctAnswers: number = 0;
let totalAnswers: number = 0;
let guessStatus: boolean = false;

// DOM elements that we'll use
let wordElement: HTMLElement | null = document.getElementById("word");
let optionsElements: HTMLCollectionOf<Element> = document.getElementsByClassName("option");
let scoreElement: HTMLElement | null = document.getElementById("score");
let totalElement: HTMLElement | null = document.getElementById("total");
let definitionElement: HTMLElement | null = document.getElementById("definition-container");
let guessStatusElement: HTMLElement | null = document.getElementById("guess-status");
let wordDefinitionElement: HTMLElement | null = document.getElementById("definition-word");
let definitionDefinitionElement: HTMLElement | null = document.getElementById("definition-definition");
let originElement: HTMLElement | null = document.getElementById("origin-container");
let originDefinitionElement: HTMLElement | null = document.getElementById("definition-origin");

// Some more values we'll need
const wordCount = dictionary.length;
const optionsCount = optionsElements.length;

// Shuffle the words
function shuffleWords(array: Word[]) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

function updateOptions(currentWord: Word): void {

    // Pick optionsCount -1 of random answers
    let possibleOptions: Word[] = [];
    while (possibleOptions.length !== optionsCount - 1) {
        let randomIndex = Math.floor(Math.random() * wordCount);

        // Make sure it's not the correct answer or hasn't been picked already
        let questionFound = possibleOptions.some(el => el.word === dictionary[randomIndex].word)
        if (dictionary[randomIndex].word !== currentWord.word && !questionFound) {
            possibleOptions.push(dictionary[randomIndex]);
        }
    }
    possibleOptions.push(currentWord);
    shuffleWords(possibleOptions);

    // Update the HTML
    for (let i = 0; i < optionsCount; i++) {
        let optionsElement = optionsElements[i] as HTMLElement;
        optionsElement.textContent = possibleOptions[i].definition;
        optionsElement.classList.remove("selected");
    }
}

function showWord(): void {
    let currentWord = dictionary[questionNumber];
    if (wordElement) {
        wordElement.textContent = currentWord.word;
    }
    updateOptions(currentWord);
}

function showDefinition(): void {
    if (definitionElement && guessStatusElement && wordDefinitionElement && definitionDefinitionElement) {
        definitionElement.style.display = "block";
        if (guessStatus === true) {
            guessStatusElement.textContent = "Correct";
        }
        else {
            guessStatusElement.textContent = "Wrong";
        }

        let currentWord = dictionary[questionNumber];
        wordDefinitionElement.textContent = currentWord.word;
        definitionDefinitionElement.textContent = currentWord.definition;

        if (originElement && originDefinitionElement) {
            // Hidden by default because origin is optional
            originElement.style.display = "none";

            // If it is there though, then show it
            if (currentWord.origin) {
                originElement.style.display = "block";
                originDefinitionElement.textContent = currentWord.origin;
            }
        }
    }
}

function checkAnswer(selected: HTMLElement): void {
    totalAnswers++;
    guessStatus = false;
    if (totalElement) {
        totalElement.textContent = totalAnswers.toString();
    }

    let currentWord = dictionary[questionNumber];
    if (selected.textContent === currentWord.definition) {
        correctAnswers++;
        guessStatus = true;
        if (scoreElement) {
            scoreElement.textContent = correctAnswers.toString();
        }
    }
    showDefinition();

    // Check if we have run out of words, restart quiz if so
    if (questionNumber + 1 === wordCount) {
        questionNumber = 0;
        startQuiz();
    }
    else {
        questionNumber++;
        showWord();
    }
}

function startQuiz(): void {
    shuffleWords(dictionary);
    showWord();
}

// Setup the option / answer functionality
for (let i = 0; i < optionsCount; i++) {
    let optionsElement = optionsElements[i] as HTMLElement;
    optionsElement.addEventListener("click", function () {
        checkAnswer(this);
    });
}

// Start it for the first time
startQuiz();