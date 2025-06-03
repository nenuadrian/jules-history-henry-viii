// JavaScript for The Six Wives of Henry VIII Quiz Game

const quizTransitionDuration = 300; // milliseconds
let quizData = []; 
let currentWifeIndex = 0;

function displayQuiz() {
    const quizQuestionElement = document.getElementById('quiz-question');
    const quizOptionsElement = document.getElementById('quiz-options');
    const quizFeedbackElement = document.getElementById('quiz-feedback');
    const nextQuestionButton = document.getElementById('next-question-btn');
    
    // --- Identify current visible elements to fade out ---
    const wifeArticles = document.querySelectorAll('.wife-article');
    let previousWifeArticle = null;
    wifeArticles.forEach(article => {
        // Check if article is currently considered visible (either display:block or already fading in)
        if (article.style.display === 'block' || article.classList.contains('fade-in')) { 
            previousWifeArticle = article;
        }
    });

    // Elements that will be part of the fade animation
    const elementsToAnimate = [
        {el: quizQuestionElement, needsContentUpdate: true},
        {el: quizOptionsElement, needsContentUpdate: true},
        {el: previousWifeArticle, needsContentUpdate: false} 
    ];
    
    const showNewContent = () => {
        if (!quizData || quizData.length === 0) { // Guard against no data
            console.error("Quiz data not loaded or empty for showNewContent.");
            if (quizQuestionElement) quizQuestionElement.textContent = "Quiz data failed to load.";
            if (quizOptionsElement) quizOptionsElement.innerHTML = "";
            return;
        }
        if (currentWifeIndex >= quizData.length) {
            console.log("Quiz data exhausted, should proceed to completion screen if not already there.");
            // This case should ideally be handled by loadNextQuestion calling renderD3GenealogyGraph
            return; 
        }
        const currentWife = quizData[currentWifeIndex];

        wifeArticles.forEach(article => {
            article.style.display = 'none';
            article.classList.remove('fade-in', 'fade-out', 'visible'); 
            article.style.opacity = ''; // Reset opacity
        });

        const currentWifeArticle = document.getElementById(currentWife.wifeId);
        if (currentWifeArticle) {
            currentWifeArticle.style.opacity = '0';
            currentWifeArticle.style.display = 'block';
            void currentWifeArticle.offsetWidth; 
            currentWifeArticle.classList.add('fade-in');
            currentWifeArticle.classList.add('visible'); 
        }

        if (quizQuestionElement) {
            quizQuestionElement.textContent = currentWife.question;
            quizQuestionElement.style.opacity = '0';
            void quizQuestionElement.offsetWidth; 
            quizQuestionElement.classList.add('fade-in');
        }

        if (quizOptionsElement) {
            quizOptionsElement.innerHTML = ''; 
            currentWife.options.forEach(optionText => {
                const button = document.createElement('button');
                button.classList.add('btn', 'btn-outline-primary', 'quiz-option-btn', 'w-100', 'mb-2'); 
                button.textContent = optionText;
                button.disabled = false; // Ensure buttons are enabled for new question
                button.addEventListener('click', function() { handleAnswer(this.textContent); });
                quizOptionsElement.appendChild(button);
            });
            quizOptionsElement.style.opacity = '0';
            void quizOptionsElement.offsetWidth; 
            quizOptionsElement.classList.add('fade-in');
        }
        
        if (quizFeedbackElement) {
            quizFeedbackElement.textContent = '';
            quizFeedbackElement.style.opacity = '1'; 
            quizFeedbackElement.classList.remove('fade-out', 'fade-in');
        }

        if (nextQuestionButton) {
            nextQuestionButton.style.display = 'none'; 
            nextQuestionButton.classList.remove('fade-in');
            nextQuestionButton.disabled = false; // Ensure it's enabled
        }
    };

    let isInitialDisplay = true;
    elementsToAnimate.forEach(item => {
        if(item.el && (item.el.classList.contains('fade-in') || item.el.classList.contains('visible'))) {
            isInitialDisplay = false;
        }
    });
     // Special check for quizQuestionElement as it might not have 'visible' but indicates non-initial state
    if (quizQuestionElement && quizQuestionElement.textContent !== "Question will appear here." && !isInitialDisplay) {
        if(quizQuestionElement.classList.contains('fade-in')) isInitialDisplay = false;
    }


    [quizQuestionElement, quizOptionsElement].forEach(el => {
        if(el) {
            el.classList.remove('fade-in', 'fade-out');
            el.style.opacity = ''; // Reset opacity before animation
        }
    });
    if(previousWifeArticle){
        previousWifeArticle.classList.remove('fade-in', 'fade-out', 'visible');
        previousWifeArticle.style.opacity = '';
    }


    if (!isInitialDisplay) {
        elementsToAnimate.forEach(item => {
            if (item.el) {
                item.el.classList.remove('fade-in'); 
                item.el.classList.add('fade-out');   
            }
        });
        setTimeout(showNewContent, quizTransitionDuration);
    } else { 
        showNewContent(); 
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

    // Disable all option buttons after an answer is chosen
    const optionButtons = document.querySelectorAll('.quiz-option-btn');
    optionButtons.forEach(button => {
        button.disabled = true;
    });

    if (selectedOptionText === currentWife.correctAnswer) {
        quizFeedbackElement.textContent = "Correct!";
        quizFeedbackElement.style.color = "green";
        nextQuestionButton.style.display = "block";
        // Optional: Animate in the next question button
        nextQuestionButton.style.opacity = '0';
        void nextQuestionButton.offsetWidth;
        nextQuestionButton.classList.add('fade-in');

    } else {
        quizFeedbackElement.textContent = "Incorrect. Try the next question when ready, or study this wife's info!";
        quizFeedbackElement.style.color = "red";
        // Show next question button even if incorrect, to allow moving on.
        nextQuestionButton.style.display = "block"; 
        nextQuestionButton.style.opacity = '0';
        void nextQuestionButton.offsetWidth;
        nextQuestionButton.classList.add('fade-in');
    }
}

function loadNextQuestion() {
    currentWifeIndex++;
    if (!quizData || quizData.length === 0) { 
        console.error("loadNextQuestion called but quizData is not loaded.");
        return;
    }

    // Before calling displayQuiz for the next question, ensure option buttons are re-enabled.
    // displayQuiz itself will create new buttons which are enabled by default.
    // However, if we were re-using buttons, we'd need to enable them here.

    if (currentWifeIndex < quizData.length) {
        displayQuiz();
    } else { // Quiz is complete
        const quizContainer = document.getElementById('quiz-container');
        const quizQuestionElement = document.getElementById('quiz-question');
        const quizOptionsElement = document.getElementById('quiz-options');
        const quizFeedbackElement = document.getElementById('quiz-feedback'); 
        const nextQuestionButton = document.getElementById('next-question-btn');

        const wifeArticles = document.querySelectorAll('.wife-article');
        let lastWifeArticle = null;
        wifeArticles.forEach(article => {
            if (article.style.display === 'block' || article.classList.contains('visible')) {
                lastWifeArticle = article;
            }
        });

        const elementsToFadeOut = [quizQuestionElement, quizOptionsElement, quizFeedbackElement, lastWifeArticle, nextQuestionButton].filter(el => el);

        elementsToFadeOut.forEach(el => {
            if (el) { // Ensure element exists before trying to manipulate classes
                el.classList.remove('fade-in'); 
                el.classList.add('fade-out');
            }
        });

        setTimeout(() => {
            if (quizContainer) { 
                quizContainer.innerHTML = '<h2>Quiz Complete! View the Tudor Family Tree:</h2><div id="genealogy-graph-container"><div id="genealogy-graph"></div></div>';
                renderD3GenealogyGraph();
            }
             // Ensure all wife articles are definitively hidden after transition,
            // though setting innerHTML of quizContainer should remove them if they were inside it.
            // This is more of a safeguard if articles were outside quizContainer.
            document.querySelectorAll('.wife-article').forEach(article => {
                article.style.display = 'none';
                article.classList.remove('visible', 'fade-in', 'fade-out'); // Reset all animation/visibility classes
                article.style.opacity = ''; // Reset direct opacity styles
            });
        }, quizTransitionDuration); 
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
        graphDisplayContainer.innerHTML = ''; 
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
 
        const nodes = rawData.nodes.map(n => ({ ...n.data })); 
        const links = rawData.edges.map(e => ({ ...e.data })); 

        const width = graphDisplayContainer.clientWidth || 600;
        const height = graphDisplayContainer.clientHeight || 500; 

        const svg = d3.select(graphDisplayContainer)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("width", "100%")
            .attr("height", "100%");

        const g = svg.append("g"); 

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
            // Initial call to displayQuiz is made here after data is loaded
            // It will use the new animation logic.
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
