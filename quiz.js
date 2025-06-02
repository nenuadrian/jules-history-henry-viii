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

const genealogyData = {
    nodes: [
        { data: { id: 'henry_viii', name: 'Henry VIII', type: 'king' } },
        { data: { id: 'catherine_o_a', name: 'Catherine of Aragon', type: 'queen' } },
        { data: { id: 'mary_i', name: 'Mary I', type: 'child' } },
        { data: { id: 'anne_b', name: 'Anne Boleyn', type: 'queen' } },
        { data: { id: 'elizabeth_i', name: 'Elizabeth I', type: 'child' } },
        { data: { id: 'jane_s', name: 'Jane Seymour', type: 'queen' } },
        { data: { id: 'edward_vi', name: 'Edward VI', type: 'child' } },
        { data: { id: 'anne_o_c', name: 'Anne of Cleves', type: 'queen' } },
        { data: { id: 'catherine_h', name: 'Catherine Howard', type: 'queen' } },
        { data: { id: 'catherine_p', name: 'Catherine Parr', type: 'queen' } }
    ],
    edges: [
        // Marriages
        { data: { id: 'm_h8_coa', source: 'henry_viii', target: 'catherine_o_a', relation: 'marriage' } },
        { data: { id: 'm_h8_ab', source: 'henry_viii', target: 'anne_b', relation: 'marriage' } },
        { data: { id: 'm_h8_js', source: 'henry_viii', target: 'jane_s', relation: 'marriage' } },
        { data: { id: 'm_h8_aoc', source: 'henry_viii', target: 'anne_o_c', relation: 'marriage' } },
        { data: { id: 'm_h8_ch', source: 'henry_viii', target: 'catherine_h', relation: 'marriage' } },
        { data: { id: 'm_h8_cp', source: 'henry_viii', target: 'catherine_p', relation: 'marriage' } },
        // Parent-Child
        { data: { id: 'pc_h8_mary_i', source: 'henry_viii', target: 'mary_i', relation: 'parent_child' } },
        { data: { id: 'pc_coa_mary_i', source: 'catherine_o_a', target: 'mary_i', relation: 'parent_child' } },
        { data: { id: 'pc_h8_elizabeth_i', source: 'henry_viii', target: 'elizabeth_i', relation: 'parent_child' } },
        { data: { id: 'pc_ab_elizabeth_i', source: 'anne_b', target: 'elizabeth_i', relation: 'parent_child' } },
        { data: { id: 'pc_h8_edward_vi', source: 'henry_viii', target: 'edward_vi', relation: 'parent_child' } },
        { data: { id: 'pc_js_edward_vi', source: 'jane_s', target: 'edward_vi', relation: 'parent_child' } }
    ]
};

let currentWifeIndex = 0;

function displayQuiz() {
    const currentWife = quizData[currentWifeIndex];
    const nextQuestionButton = document.getElementById('next-question-btn'); 

    const allWifeArticles = document.querySelectorAll('.wife-article');
    allWifeArticles.forEach(article => {
        article.style.display = 'none';
    });
    const currentWifeArticle = document.getElementById(currentWife.wifeId);
    if (currentWifeArticle) {
        currentWifeArticle.style.display = 'block';
    }

    const quizQuestionElement = document.getElementById('quiz-question');
    if (quizQuestionElement) {
        quizQuestionElement.textContent = currentWife.question;
    }

    const quizOptionsElement = document.getElementById('quiz-options');
    if (quizOptionsElement) {
        quizOptionsElement.innerHTML = ''; 
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
    const nextQuestionButton = document.getElementById('next-question-btn'); 

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
            quizContainer.innerHTML = '<h2>Quiz Complete! View the Tudor Family Tree:</h2><div id="genealogy-graph-container"><div id="genealogy-graph"></div></div>';
            renderGenealogyGraph(); 
        }
        const allWifeArticles = document.querySelectorAll('.wife-article');
        allWifeArticles.forEach(article => {
            article.style.display = 'none';
        });
    }
}

function renderGenealogyGraph() {
    if (typeof cytoscape === 'undefined') {
        console.error('Cytoscape.js not loaded. Please include it in your HTML.');
        const graphContainer = document.getElementById('genealogy-graph');
        if(graphContainer) {
            graphContainer.innerHTML = '<p style="color:red; text-align:center;">Error: Graphing library (Cytoscape.js) not loaded.</p>';
        }
        return;
    }

    try {
        const cy = cytoscape({
            container: document.getElementById('genealogy-graph'),
            elements: genealogyData,

            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#808080', 
                        'label': 'data(name)',
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'font-size': '10px', 
                        'width': '80px',  
                        'height': '80px', 
                        'padding': '10px', 
                        'text-wrap': 'wrap', 
                        'text-max-width': '70px' 
                    }
                },
                {
                    selector: 'node[type = "king"]',
                    style: {
                        'background-color': '#ADD8E6', 
                        'shape': 'round-rectangle' 
                    }
                },
                {
                    selector: 'node[type = "queen"]',
                    style: {
                        'background-color': '#FFC0CB', 
                        'shape': 'ellipse' 
                    }
                },
                {
                    selector: 'node[type = "child"]',
                    style: {
                        'background-color': '#90EE90', 
                        'shape': 'ellipse' 
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#b3b3b3', 
                        'curve-style': 'bezier', 
                        'target-arrow-shape': 'triangle',
                        'target-arrow-color': '#b3b3b3'
                    }
                },
                {
                    selector: 'edge[relation = "marriage"]',
                    style: {
                        'line-style': 'dashed',
                        'target-arrow-shape': 'none' 
                    }
                }
            ],

            layout: {
                name: 'dagre',
                rankDir: 'TB',    
                nodeSep: 60,      
                rankSep: 120,     
                edgeSep: 15,      
                spacingFactor: 1.2, 
                fit: true,        
                padding: 20       
            },
            // User interaction options (defaults are generally true, but can be explicit)
            userZoomingEnabled: true,
            userPanningEnabled: true,
            boxSelectionEnabled: false, // Usually not needed for simple viewing
            autoungrabify: true // Makes nodes not grabbable by default
        });
        
        // Add basic interactivity: Node tap event
        cy.on('tap', 'node', function(evt){
            const tappedNode = evt.target;
            const nodeData = tappedNode.data();
            let infoString = `Name: ${nodeData.name}\nType: ${nodeData.type}`;
            
            // Future enhancement: Could add more details from nodeData if available
            // e.g., if (nodeData.birthDate) infoString += `\nBorn: ${nodeData.birthDate}`;

            alert(infoString);
        });

    } catch (error) {
        console.error("Error rendering genealogy graph:", error);
        const graphContainer = document.getElementById('genealogy-graph');
        if(graphContainer) {
            graphContainer.innerHTML = '<p style="color:red; text-align:center;">Error rendering graph. Check console for details.</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const nextQuestionButton = document.getElementById('next-question-btn');

    if (nextQuestionButton) {
        nextQuestionButton.addEventListener('click', loadNextQuestion);
    } else {
        console.error("Next Question button not found on DOMContentLoaded, cannot attach listener.");
    }

    displayQuiz();
});
