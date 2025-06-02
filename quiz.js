// JavaScript for The Six Wives of Henry VIII Quiz Game

const quizData = [
    {
        wifeId: "catherine-of-aragon",
        question: "What was Catherine of Aragon's country of origin?",
        options: ["Spain", "France", "Portugal", "Germany"],
        correctAnswer: "Spain"
    },
    {
        wifeId: "anne-boleyn",
        question: "Which future monarch was Anne Boleyn's daughter?",
        options: ["Mary I", "Elizabeth I", "Victoria", "Jane Grey"],
        correctAnswer: "Elizabeth I"
    },
    {
        wifeId: "jane-seymour",
        question: "What was the name of Jane Seymour's son, Henry VIII's male heir?",
        options: ["Arthur", "Henry IX", "Edward VI", "James"],
        correctAnswer: "Edward VI"
    },
    {
        wifeId: "anne-of-cleves",
        question: "Why was Henry VIII's marriage to Anne of Cleves annulled?",
        options: ["Her political alliances", "Her inability to have children", "Henry found her unattractive", "She was already married"],
        correctAnswer: "Henry found her unattractive"
    },
    {
        wifeId: "catherine-howard",
        question: "Catherine Howard was a cousin to which other of Henry VIII's wives?",
        options: ["Catherine of Aragon", "Anne Boleyn", "Jane Seymour", "Anne of Cleves"],
        correctAnswer: "Anne Boleyn"
    },
    {
        wifeId: "catherine-parr",
        question: "How many times had Catherine Parr been widowed before marrying Henry VIII?",
        options: ["Never", "Once", "Twice", "Three times"],
        correctAnswer: "Twice"
    }
];

let currentWifeIndex = 0;
// DOM element variables will be defined inside DOMContentLoaded

function displayQuiz() {
    const currentWife = quizData[currentWifeIndex];
    const nextQuestionButton = document.getElementById('next-question-btn'); // Defined here or passed as arg

    // Display Wife's Information
    const allWifeArticles = document.querySelectorAll('.wife-article');
    allWifeArticles.forEach(article => {
        article.style.display = 'none';
    });
    const currentWifeArticle = document.getElementById(currentWife.wifeId);
    if (currentWifeArticle) {
        currentWifeArticle.style.display = 'block';
    }

    // Display Question
    const quizQuestionElement = document.getElementById('quiz-question');
    if (quizQuestionElement) {
        quizQuestionElement.textContent = currentWife.question;
    }

    // Display Answer Options
    const quizOptionsElement = document.getElementById('quiz-options');
    if (quizOptionsElement) {
        quizOptionsElement.innerHTML = ''; // Clear previous options
        currentWife.options.forEach(optionText => {
            const button = document.createElement('button');
            button.textContent = optionText;
            button.classList.add('quiz-option-btn');
            button.disabled = false; 
            button.addEventListener('click', function() { 
                handleAnswer(this.textContent); 
            });
            quizOptionsElement.appendChild(button);
        });
    }

    // Reset Feedback and Next Button
    const quizFeedbackElement = document.getElementById('quiz-feedback');
    if (quizFeedbackElement) {
        quizFeedbackElement.textContent = '';
    }
    if (nextQuestionButton) { 
        nextQuestionButton.style.display = 'none';
    }
}

function handleAnswer(selectedOptionText) {
    const currentWife = quizData[currentWifeIndex];
    const quizFeedbackElement = document.getElementById('quiz-feedback');
    const nextQuestionButton = document.getElementById('next-question-btn'); // Defined here or passed as arg

    if (!quizFeedbackElement || !nextQuestionButton) {
        console.error("Feedback or Next Question button element not found!");
        return;
    }

    if (selectedOptionText === currentWife.correctAnswer) {
        quizFeedbackElement.textContent = "Correct!";
        quizFeedbackElement.style.color = "green";
        nextQuestionButton.style.display = "block";

        const optionButtons = document.querySelectorAll('.quiz-option-btn');
        optionButtons.forEach(button => {
            button.disabled = true;
        });
    } else {
        quizFeedbackElement.textContent = "Incorrect. Please try again.";
        quizFeedbackElement.style.color = "red";
    }
}

function loadNextQuestion() {
    currentWifeIndex++;
    if (currentWifeIndex < quizData.length) {
        displayQuiz();
    } else {
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.innerHTML = '<h2>Quiz Complete! Well done!</h2>';
        }
        const allWifeArticles = document.querySelectorAll('.wife-article');
        allWifeArticles.forEach(article => {
            article.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM element references here
    const nextQuestionButton = document.getElementById('next-question-btn');
    // Other elements like quizQuestionElement, quizOptionsElement, quizFeedbackElement
    // are typically accessed within the functions that use them (displayQuiz, handleAnswer).
    // If they were needed for setup here, they would be defined.

    // Add event listeners here
    if (nextQuestionButton) {
        nextQuestionButton.addEventListener('click', loadNextQuestion);
    } else {
        console.error("Next Question button not found on DOMContentLoaded, cannot attach listener.");
    }

    // Initial call to display the first question
    displayQuiz();
});
