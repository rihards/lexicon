'use strict';

var dictionary = [
    {
        word: 'hagriography',
        definition: 'A biography that treats its subject with undue reverence.',
        origin: 'The combining form -graphy comes from Greek graphein, meaning "to write." Hagio- comes from a Greek word that means "saintly" or "holy."',
    },
    {
        word: 'abnegation',
        definition: 'The action of renouncing or rejecting something',
    },
    {
        word: 'vituperate',
        definition: 'Blame or insult (someone) in strong or violent language',
        origin: 'mid 16th century: from Latin vituperat- "censured, disparaged".',
    },
    {
        word: 'opprobrium',
        definition: 'Harsh criticism or censure',
        origin: 'mid 17th century: from Latin, literally "infamy", from opprobrum, from ob- "against" + probrum "disgraceful act"'
    },
    {
        word: 'wiseacre',
        definition: 'A person with an affectation of wisdom or knowledge, regarded with scorn or irritation by others; a know-all',
    },
    {
        word: 'ameliorate',
        definition: 'Make (something bad or unsatisfactory) better',
    },
    {
        word: 'casuistry',
        definition: 'The use of clever but unsound reasoning, especially in relation to moral questions; sophistry',
    },
    {
        word: 'replete',
        definition: 'Filled or well-supplied with something',
    },
    {
        word: 'efface',
        definition: 'Make oneself appear insignificant or inconspicuous',
    },
    {
        word: 'mendacity',
        definition: 'Untruthfulness; lying',
    },
    {
        word: 'vertiginous',
        definition: 'Extremely high or steep',
    },
    {
        word: 'recalcitrant',
        definition: 'Having an obstinately uncooperative attitude towards authority or discipline',
    },
    {
        word: 'elide',
        definition: 'To suppress or alter, to leave out of consideration',
    },
    {
        word: 'dialectical',
        definition: 'Relating to the logical discussion of ideas and opinions',
    },
    {
        word: 'dyspeptic',
        definition: 'Having indigestion or a consequent air of irritable bad temper',
    },
    {
        word: 'exegesis',
        definition: 'Critical explanation or interpretation of a text, especially of scripture',
    },
    {
        word: 'hermeneutic',
        definition: 'Concerning interpretation, especially of the Bible or literary texts',
        origin: 'late 17th century: from Greek hermēneutikos, from hermēneuein "interpret"'
    },
    {
        word: 'vociferous',
        definition: 'Expressing or characterized by vehement opinions; loud and forceful',
    },
    {
        word: 'lickspittle',
        definition: 'A person who behaves obsequiously to those in power',
    },
    {
        word: 'obsequious',
        definition: 'Obedient or attentive to an excessive or servile degree',
        origin: 'late 15th century (not depreciatory in sense in early use): from Latin obsequiosus, from obsequium "compliance", from obsequi "follow, comply with"',
    },
];

// General quiz variables to keep track of how things are going
var questionNumber = 0;
var correctAnswers = 0;
var totalAnswers = 0;
var guessStatus = false;
// DOM elements that we'll use
var wordElement = document.getElementById("word");
var optionsElements = document.getElementsByClassName("option");
var scoreElement = document.getElementById("score");
var totalElement = document.getElementById("total");
var definitionElement = document.getElementById("definition-container");
var guessStatusElement = document.getElementById("guess-status");
var wordDefinitionElement = document.getElementById("definition-word");
var definitionDefinitionElement = document.getElementById("definition-definition");
var originElement = document.getElementById("origin-container");
var originDefinitionElement = document.getElementById("definition-origin");
// Some more values we'll need
var wordCount = dictionary.length;
var optionsCount = optionsElements.length;
// Shuffle the words
function shuffleWords(array) {
    var _a;
    var currentIndex = array.length;
    while (currentIndex !== 0) {
        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        _a = [array[randomIndex], array[currentIndex]], array[currentIndex] = _a[0], array[randomIndex] = _a[1];
    }
}
function updateOptions(currentWord) {
    // Pick optionsCount -1 of random answers
    var possibleOptions = [];
    var _loop_1 = function () {
        var randomIndex = Math.floor(Math.random() * wordCount);
        // Make sure it's not the correct answer or hasn't been picked already
        var questionFound = possibleOptions.some(function (el) { return el.word === dictionary[randomIndex].word; });
        if (dictionary[randomIndex].word !== currentWord.word && !questionFound) {
            possibleOptions.push(dictionary[randomIndex]);
        }
    };
    while (possibleOptions.length !== optionsCount - 1) {
        _loop_1();
    }
    possibleOptions.push(currentWord);
    shuffleWords(possibleOptions);
    // Update the HTML
    for (var i = 0; i < optionsCount; i++) {
        var optionsElement = optionsElements[i];
        optionsElement.textContent = possibleOptions[i].definition;
        optionsElement.classList.remove("selected");
    }
}
function showWord() {
    var currentWord = dictionary[questionNumber];
    if (wordElement) {
        wordElement.textContent = currentWord.word;
    }
    updateOptions(currentWord);
}
function showDefinition() {
    if (definitionElement && guessStatusElement && wordDefinitionElement && definitionDefinitionElement) {
        definitionElement.style.display = "block";
        if (guessStatus === true) {
            guessStatusElement.textContent = "Correct";
        }
        else {
            guessStatusElement.textContent = "Wrong";
        }
        var currentWord = dictionary[questionNumber];
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
function checkAnswer(selected) {
    totalAnswers++;
    guessStatus = false;
    if (totalElement) {
        totalElement.textContent = totalAnswers.toString();
    }
    var currentWord = dictionary[questionNumber];
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
function startQuiz() {
    shuffleWords(dictionary);
    showWord();
}
// Setup the option / answer functionality
for (var i = 0; i < optionsCount; i++) {
    var optionsElement = optionsElements[i];
    optionsElement.addEventListener("click", function () {
        checkAnswer(this);
    });
}
// Start it for the first time
startQuiz();
