// JavaScript for The Six Wives of Henry VIII Quiz Game

let quizData = []; 
let currentWifeIndex = 0;

function displayQuiz() {
    if (!quizData || quizData.length === 0) {
        console.error("Quiz data not loaded or empty.");
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.innerHTML = '<p style="color:red;">Quiz questions are currently unavailable. Please try again later.</p>';
        }
        return;
    }
    if (currentWifeIndex >= quizData.length) {
        console.error("currentWifeIndex is out of bounds for quizData.");
        return; 
    }

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
            button.classList.add('btn', 'btn-outline-primary', 'quiz-option-btn', 'w-100', 'mb-2');
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
    if (!quizData || quizData.length === 0) {
        console.error("handleAnswer called but quizData is not loaded.");
        return;
    }
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
    if (!quizData || quizData.length === 0) { 
        console.error("loadNextQuestion called but quizData is not loaded.");
        return;
    }
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
    const graphDisplayContainer = document.getElementById('genealogy-graph'); 

    if (typeof cytoscape === 'undefined') {
        console.error('Cytoscape.js not loaded. Cannot render graph.');
        if (graphDisplayContainer) {
            graphDisplayContainer.innerHTML = '<p style="color:red; text-align:center;">Error: Core graphing library not available. Graph cannot be displayed.</p>';
        }
        return;
    }
    // Dagre registration is now handled in DOMContentLoaded

    fetch('genealogy_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for genealogy_data.json: ' + response.statusText);
            }
            return response.json();
        })
        .then(genealogyDataExternal => {
            try {
                const cy = cytoscape({
                    container: graphDisplayContainer, 
                    elements: genealogyDataExternal, 

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
                            style: { 'background-color': '#ADD8E6', 'shape': 'round-rectangle' }
                        },
                        {
                            selector: 'node[type = "queen"]',
                            style: { 'background-color': '#FFC0CB', 'shape': 'ellipse' }
                        },
                        {
                            selector: 'node[type = "child"]',
                            style: { 'background-color': '#90EE90', 'shape': 'ellipse' }
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
                            style: { 'line-style': 'dashed', 'target-arrow-shape': 'none' }
                        }
                    ],
                    layout: { 
                        name: 'dagre',
                        rankDir: 'TB',    
                        nodeSep: 50,     
                        rankSep: 100,    
                        edgeSep: 10,     
                        spacingFactor: 1.25, 
                        fit: true,        
                        padding: 20      
                    },
                    userZoomingEnabled: true,
                    userPanningEnabled: true,
                    boxSelectionEnabled: false, 
                    autoungrabify: true 
                });
                
                cy.on('tap', 'node', function(evt){
                    const tappedNode = evt.target;
                    const nodeData = tappedNode.data();
                    let infoString = `Name: ${nodeData.name}\nType: ${nodeData.type}`;
                    alert(infoString);
                });

            } catch (error) {
                console.error("Error rendering genealogy graph with Cytoscape:", error);
                if (graphDisplayContainer) { 
                    graphDisplayContainer.innerHTML = '<p style="color:red; text-align:center;">An error occurred while rendering the family tree graph.</p>';
                }
            }
        })
        .catch(error => {
            console.error('Error loading genealogy data:', error);
            if (graphDisplayContainer) { 
                graphDisplayContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load data for the family tree. Graph cannot be displayed.</p>';
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // Register Cytoscape extensions like Dagre
    if (typeof cytoscape !== 'undefined') {
        let dagreLayout = null;
        if (typeof dagre !== 'undefined') {
            dagreLayout = dagre; // Assign global dagre
            console.log("Dagre layout extension found as global 'dagre'.");
        } else if (typeof cytoscapeDagre !== 'undefined') {
            dagreLayout = cytoscapeDagre; // Assign global cytoscapeDagre
            console.log("Dagre layout extension found as global 'cytoscapeDagre'.");
        }

        if (dagreLayout) {
            try {
                cytoscape.use(dagreLayout);
                console.log("Dagre layout registered successfully using the found extension object.");
            } catch (e) {
                console.error("Error registering Dagre layout with Cytoscape:", e);
                const quizContainer = document.getElementById('quiz-container');
                if (quizContainer) {
                    quizContainer.innerHTML = '<p style="color:red;">Critical error: Failed to initialize graph layout component. Refreshing might help.</p>';
                }
                return; // Stop further execution if registration fails
            }
        } else {
            console.error('Dagre layout extension (dagre or cytoscapeDagre) not found globally.');
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                quizContainer.innerHTML = '<p style="color:red;">Graph layout extension (Dagre) failed to load. Graph functionality will be unavailable. Please try refreshing.</p>';
            }
            return; // Stop further execution if dagre extension is not found
        }
    } else {
        console.error('Cytoscape core library not loaded by DOMContentLoaded.');
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.innerHTML = '<p style="color:red;">Main graphing library (Cytoscape) failed to load. Quiz and graph cannot be displayed. Please try refreshing.</p>';
        }
        return; // Stop further execution if cytoscape is not found
    }

    fetch('quiz_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            quizData = data; 
            displayQuiz(); 
        })
        .catch(error => {
            console.error('Error loading quiz data:', error);
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer) {
                quizContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load quiz questions. Please try refreshing the page.</p>';
            }
        });

    const nextQuestionButton = document.getElementById('next-question-btn');
    if (nextQuestionButton) {
        nextQuestionButton.addEventListener('click', loadNextQuestion);
    } else {
        console.error("#next-question-btn not found on DOMContentLoaded.");
    }
});
