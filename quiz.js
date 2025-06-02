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
            renderD3GenealogyGraph(); 
        }
        const allWifeArticles = document.querySelectorAll('.wife-article');
        allWifeArticles.forEach(article => {
            article.style.display = 'none';
        });
    }
}

async function renderD3GenealogyGraph() {
    const graphDisplayContainer = document.getElementById('genealogy-graph');

    if (typeof d3 === 'undefined') {
        console.error('D3.js not loaded. Cannot render graph.');
        if (graphDisplayContainer) {
            graphDisplayContainer.innerHTML = '<p style="color:red; text-align:center;">Error: Core D3 graphing library not available.</p>';
        }
        return;
    }

    if (graphDisplayContainer) {
        graphDisplayContainer.innerHTML = ''; // Clear previous content
    } else {
        console.error('#genealogy-graph container not found.');
        return;
    }

    try {
        const response = await fetch('genealogy_data.json');
        if (!response.ok) {
            throw new Error(`Network response was not ok for genealogy_data.json: ${response.statusText}`);
        }
        const rawData = await response.json();

        // Data Transformation: D3 force layout expects nodes as an array of objects.
        // Links should have source and target properties that are IDs matching node IDs.
        const nodes = rawData.nodes.map(n => ({ ...n.data })); 
        const links = rawData.edges.map(e => ({ ...e.data })); // Use IDs directly as forceLink will use id accessor

        const width = graphDisplayContainer.clientWidth || 600;
        const height = graphDisplayContainer.clientHeight || 500; 

        const svg = d3.select(graphDisplayContainer)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("width", "100%")
            .attr("height", "100%");

        const g = svg.append("g"); // Group for zoom/pan

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.relation === 'marriage' ? 70 : 150).strength(0.3))
            .force("charge", d3.forceManyBody().strength(-400)) 
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(d => (d.type === 'king' ? 45 : (d.type === 'queen' ? 35 : 25)) + 5));


        const link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => d.relation === 'marriage' ? 1.5 : 2)
            .attr("stroke", d => d.relation === 'marriage' ? "#aaa" : "#777") 
            .style("stroke-dasharray", d => d.relation === 'marriage' ? ("3, 3") : null);

        const nodeGroup = g.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .attr("data-type", d => d.type) 
            .on("click", function(event, d) {
                event.stopPropagation(); 
                let infoString = `Name: ${d.name}\nType: ${d.type}`;
                alert(infoString);
            });
        
        // Define drag handlers
        const drag = d3.drag()
            .on("start", function(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", function(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", function(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null; 
                d.fy = null;
            });
        
        // Apply drag to node groups
        nodeGroup.call(drag); 

        nodeGroup.append("circle")
            .attr("r", d => d.type === 'king' ? 40 : (d.type === 'queen' ? 30 : 20))
            .attr("fill", d => {
                if (d.type === 'king') return "#ADD8E6"; 
                if (d.type === 'queen') return "#FFC0CB"; 
                if (d.type === 'child') return "#90EE90"; 
                return "#808080"; 
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);
            
        nodeGroup.append("text")
            .text(d => d.name)
            .attr("x", 0) 
            .attr("y", d => (d.type === 'king' ? 55 : (d.type === 'queen' ? 42 : 30))) 
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "#333")
            .style("pointer-events", "none"); 

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            nodeGroup
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });

        const zoom = d3.zoom()
            .scaleExtent([0.1, 4]) 
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });
        svg.call(zoom);

    } catch (error) {
        console.error("Error rendering D3 genealogy graph:", error);
        if (graphDisplayContainer) {
            graphDisplayContainer.innerHTML = '<p style="color:red; text-align:center;">An error occurred while rendering the family tree graph with D3.</p>';
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
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
