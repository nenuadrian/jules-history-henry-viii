// JavaScript for The Six Wives of Henry VIII Quiz Game

const quizTransitionDuration = 300; // milliseconds
let quizData = [];
let currentWifeIndex = 0;
let userQuizLog = []; // Initialize log for user's answers

function displayQuiz() {
    const quizQuestionElement = document.getElementById('quiz-question');
    const quizOptionsElement = document.getElementById('quiz-options');
    const quizFeedbackElement = document.getElementById('quiz-feedback');
    const nextQuestionButton = document.getElementById('next-question-btn');

    const wifeArticles = document.querySelectorAll('.wife-article');
    let previousWifeArticleToFade = null;

    wifeArticles.forEach(article => {
        const style = window.getComputedStyle(article);
        if (style.display === 'block' && (style.opacity === '1' || article.classList.contains('fade-in'))) {
            previousWifeArticleToFade = article;
        }
    });

    const isQuestionAreaPopulated = quizQuestionElement && quizQuestionElement.textContent !== "Question will appear here." && quizQuestionElement.textContent !== "";

    const elementsToFadeOut = [quizQuestionElement, quizOptionsElement, previousWifeArticleToFade].filter(el => el);

    const setupAndFadeInNewContent = () => {
        if (!quizData || currentWifeIndex >= quizData.length) {
            console.log("Quiz data exhausted or not loaded; proceeding to completion/graph.");
            return;
        }

        const currentWifeData = quizData[currentWifeIndex];
        const newWifeArticle = document.getElementById(currentWifeData.wifeId);

        wifeArticles.forEach(article => {
            article.style.display = 'none';
            article.classList.remove('fade-in', 'fade-out', 'visible');
            article.style.opacity = '';
        });

        if (newWifeArticle) {
            newWifeArticle.classList.remove('fade-out');
            newWifeArticle.style.opacity = '0';
            newWifeArticle.style.display = 'block';
            newWifeArticle.classList.add('visible');
            void newWifeArticle.offsetWidth;
            newWifeArticle.classList.add('fade-in');
        }

        if (quizQuestionElement) {
            quizQuestionElement.textContent = currentWifeData.question;
            quizQuestionElement.classList.remove('fade-out');
            quizQuestionElement.style.opacity = '0';
            void quizQuestionElement.offsetWidth;
            quizQuestionElement.classList.add('fade-in');
        }

        if (quizOptionsElement) {
            quizOptionsElement.innerHTML = '';
            currentWifeData.options.forEach(optionText => {
                const button = document.createElement('button');
                button.classList.add('btn', 'btn-outline-primary', 'quiz-option-btn', 'w-100', 'mb-2');
                button.textContent = optionText;
                button.disabled = false;
                button.addEventListener('click', function() { handleAnswer(this.textContent); });
                quizOptionsElement.appendChild(button);
            });
            quizOptionsElement.classList.remove('fade-out');
            quizOptionsElement.style.opacity = '0';
            void quizOptionsElement.offsetWidth;
            quizOptionsElement.classList.add('fade-in');
        }

        if (quizFeedbackElement) {
            quizFeedbackElement.textContent = '';
            quizFeedbackElement.style.opacity = '1';
            quizFeedbackElement.classList.remove('fade-out','fade-in');
        }
        if (nextQuestionButton) {
            nextQuestionButton.style.display = 'none';
            nextQuestionButton.classList.remove('fade-in');
            nextQuestionButton.disabled = false;
        }
    };

    const isFirstDisplay = !isQuestionAreaPopulated && !previousWifeArticleToFade;

    if (isFirstDisplay) {
        setupAndFadeInNewContent();
    } else {
        elementsToFadeOut.forEach(el => {
            el.classList.remove('fade-in');
            el.classList.add('fade-out');
            if (el.classList.contains('wife-article')) {
                el.classList.remove('visible');
            }
        });
        setTimeout(setupAndFadeInNewContent, quizTransitionDuration);
    }
}


function handleAnswer(selectedOptionText) {
    if (!quizData || quizData.length === 0) {
        console.error("handleAnswer called but quizData is not loaded.");
        return;
    }
    const currentWifeData = quizData[currentWifeIndex];
    const quizFeedbackElement = document.getElementById('quiz-feedback');
    const nextQuestionButton = document.getElementById('next-question-btn');

    if (!quizFeedbackElement || !nextQuestionButton) {
        console.error("Feedback or Next Question button element not found!");
        return;
    }

    const optionButtons = document.querySelectorAll('.quiz-option-btn');
    optionButtons.forEach(button => {
        button.disabled = true;
    });

    const isCorrect = selectedOptionText === currentWifeData.correctAnswer;

    userQuizLog.push({
        question: currentWifeData.question,
        userAnswer: selectedOptionText,
        correctAnswer: currentWifeData.correctAnswer,
        isCorrect: isCorrect,
        wifeId: currentWifeData.wifeId
    });

    if (isCorrect) {
        quizFeedbackElement.textContent = "Correct!";
        quizFeedbackElement.style.color = "green";
    } else {
        quizFeedbackElement.textContent = "Incorrect. Try the next question when ready, or study this wife's info!";
        quizFeedbackElement.style.color = "red";
    }

    nextQuestionButton.style.display = "block";
    nextQuestionButton.style.opacity = '0';
    void nextQuestionButton.offsetWidth;
    nextQuestionButton.classList.add('fade-in');
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
        const quizQuestionElement = document.getElementById('quiz-question');
        const quizOptionsElement = document.getElementById('quiz-options');
        const quizFeedbackElement = document.getElementById('quiz-feedback');
        const nextQuestionButton = document.getElementById('next-question-btn');

        const wifeArticles = document.querySelectorAll('.wife-article');
        let lastWifeArticle = null;
        wifeArticles.forEach(article => {
            const style = window.getComputedStyle(article);
            if (style.display === 'block' && (style.opacity === '1' || article.classList.contains('fade-in'))) {
                lastWifeArticle = article;
            }
        });

        const elementsToFadeOut = [quizQuestionElement, quizOptionsElement, quizFeedbackElement, lastWifeArticle, nextQuestionButton].filter(el => el);

        elementsToFadeOut.forEach(el => {
            if (el) {
                el.classList.remove('fade-in');
                el.classList.add('fade-out');
            }
        });

        setTimeout(() => {
            if (quizContainer) {
                quizContainer.innerHTML = '<h2>Quiz Complete! View the Tudor Family Tree & Summary:</h2>' +
                                          '<div id="genealogy-graph-container"><div id="genealogy-graph"></div></div>' +
                                          '<div id="quiz-summary-container"></div>';

                renderD3GenealogyGraph();

                displayQuizSummary(userQuizLog);
            }
            document.querySelectorAll('.wife-article').forEach(article => {
                article.style.display = 'none';
                article.classList.remove('visible', 'fade-in', 'fade-out');
                article.style.opacity = '';
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

        const nodes = rawData.nodes.map(n => {
            const nodeData = { ...n.data };
            // Assign rank based on ID for specific known individuals for more control
            switch (nodeData.id) {
                case 'edmund_tudor': case 'margaret_beaufort': case 'edward_iv': case 'elizabeth_woodville':
                    nodeData.rank = 0; break;
                case 'henry_vii': case 'elizabeth_of_york':
                    nodeData.rank = 1; break;
                case 'henry_viii':
                    nodeData.rank = 2; nodeData.type = nodeData.type || 'king'; break;
                case 'mary_tudor_sister_h8': case 'charles_brandon':
                    nodeData.rank = 2; nodeData.type = nodeData.type || 'noble_ancestor'; break;
                case 'catherine_o_a': case 'anne_b': case 'jane_s': case 'anne_o_c': case 'catherine_h': case 'catherine_p':
                    nodeData.rank = 3; nodeData.type = nodeData.type || 'queen'; break;
                case 'frances_brandon': case 'henry_grey':
                    nodeData.rank = 3; nodeData.type = nodeData.type || 'noble_ancestor'; break;
                case 'mary_i': case 'elizabeth_i': case 'edward_vi':
                    nodeData.rank = 4; nodeData.type = nodeData.type || 'child'; break;
                case 'lady_jane_grey':
                    nodeData.rank = 4; nodeData.type = nodeData.type || 'monarch_successor_claimant'; break;
                default:
                    // Fallback based on existing type if not ID-matched
                    if (nodeData.type === 'king_ancestor' || nodeData.type === 'queen_ancestor') nodeData.rank = 1; // Generalize other ancestors
                    else if (nodeData.type === 'noble_ancestor') nodeData.rank = 2; // Other nobles
                    else {
                        console.warn(`Node ${nodeData.id} not explicitly ranked by ID or general type, assigning fallback rank 5.`);
                        nodeData.rank = 5;
                    }
                    break;
            }
            return nodeData;
        });

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

        const Y_SEPARATION_FACTOR = 120;
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links)
                              .id(d => d.id)
                              .distance(d => d.relation === 'marriage' ? 60 : 90)
                              .strength(d => d.relation === 'marriage' ? 0.1 : 0.4))
            .force("charge", d3.forceManyBody().strength(-450))
            .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
            .force("collide", d3.forceCollide().radius(d =>
                (d.type === 'king' ? 40 :
                (d.type === 'queen' ? 30 :
                (d.type === 'child' || d.type === 'monarch_successor_claimant' ? 20 :
                (d.type === 'king_ancestor' || d.type === 'queen_ancestor' ? 30 : 25) // Radii for ancestors
                ))) + 12)
            )
            .force("yPos", d3.forceY().y(d => d.rank * Y_SEPARATION_FACTOR).strength(0.4));


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
            .attr("r", d =>
                (d.type === 'king' ? 40 :
                (d.type === 'queen' ? 30 :
                (d.type === 'child' || d.type === 'monarch_successor_claimant' ? 20 :
                (d.type === 'king_ancestor' || d.type === 'queen_ancestor' ? 30 : 25) // Radii for ancestors
                )))
            )
            .attr("fill", d => {
                if (d.type === 'king') return "#ADD8E6";
                if (d.type === 'queen') return "#FFC0CB";
                if (d.type === 'child' || d.type === 'monarch_successor_claimant') return "#90EE90";
                if (d.type === 'king_ancestor') return "#B0E0E6"; // Lighter blue for king ancestors
                if (d.type === 'queen_ancestor') return "#FFDAB9"; // Peach for queen ancestors
                if (d.type === 'noble_ancestor') return "#D3D3D3"; // Light grey for other nobles
                return "#808080";
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);

        nodeGroup.append("text")
            .text(d => d.name)
            .attr("x", 0)
            .attr("y", d => { // Adjust y based on new radii
                if (d.type === 'king') return 55; // radius 40
                if (d.type === 'queen') return 42; // radius 30
                if (d.type === 'child' || d.type === 'monarch_successor_claimant') return 30; // radius 20
                if (d.type === 'king_ancestor' || d.type === 'queen_ancestor') return 42; // radius 30
                return 35; // radius 25 (noble_ancestor and default)
            })
            .attr("text-anchor", "middle")
            .style("font-size", "9px") // Slightly smaller for potentially more text
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

function displayQuizSummary(log) {
    const summaryContainer = document.getElementById('quiz-summary-container');
    if (!summaryContainer) {
        console.error('Quiz summary container not found.');
        return;
    }
    summaryContainer.innerHTML = '';

    const wivesHeader = document.createElement('h3');
    wivesHeader.className = 'mt-4 mb-3 text-center';
    wivesHeader.textContent = "The Six Wives: A Recap";
    summaryContainer.appendChild(wivesHeader);

    const allWivesArticlesContainer = document.createElement('div');
    allWivesArticlesContainer.id = 'all-wives-recap';
    allWivesArticlesContainer.classList.add('row');
    summaryContainer.appendChild(allWivesArticlesContainer);

    if (quizData && quizData.length > 0) {
        quizData.forEach(wifeDataEntry => {
            const wifeCardCol = document.createElement('div');
            wifeCardCol.className = 'col-md-6 col-lg-4 mb-4';

            const wifeCard = document.createElement('div');
            wifeCard.className = 'card h-100';

            const wifeCardBody = document.createElement('div');
            wifeCardBody.className = 'card-body';

            const wifeNameHeader = document.createElement('h5');
            wifeNameHeader.className = 'card-title';
            let displayName = wifeDataEntry.name || wifeDataEntry.wifeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            wifeNameHeader.textContent = displayName;

            const wifeBio = document.createElement('p');
            wifeBio.className = 'card-text small';
            wifeBio.textContent = wifeDataEntry.bio || `Details for ${displayName} would appear here. The original detailed article content is not directly available in quizData for this summary view.`;

            const wifeFate = document.createElement('p');
            wifeFate.className = 'card-text small fw-bold';
            wifeFate.textContent = `Fate: ${wifeDataEntry.fate || "Specific fate details not available in current quiz data."}`;

            wifeCardBody.appendChild(wifeNameHeader);
            wifeCardBody.appendChild(wifeBio);
            wifeCardBody.appendChild(wifeFate);
            wifeCard.appendChild(wifeCardBody);
            wifeCardCol.appendChild(wifeCard);
            allWivesArticlesContainer.appendChild(wifeCardCol);
        });
    } else {
        allWivesArticlesContainer.innerHTML = '<p class="text-center">Wife information could not be loaded for the recap.</p>';
    }

    const logHeader = document.createElement('h3');
    logHeader.className = 'mt-5 mb-3 text-center';
    logHeader.textContent = "Your Quiz Performance";
    summaryContainer.appendChild(logHeader);

    const logList = document.createElement('ul');
    logList.className = 'list-group';
    summaryContainer.appendChild(logList);

    if (log && log.length > 0) {
        log.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';

            let content = `
                <p class="mb-1"><strong>Question:</strong> ${entry.question}</p>
                <p class="mb-1">Your answer: <span class="fw-bold">${entry.userAnswer}</span></p>
            `;
            if (entry.isCorrect) {
                content += `<p class="mb-0 text-success"><strong>Correct!</strong></p>`;
                listItem.classList.add('list-group-item-success');
            } else {
                content += `<p class="mb-0 text-danger"><strong>Incorrect.</strong> Correct answer: <span class="fw-bold">${entry.correctAnswer}</span></p>`;
                listItem.classList.add('list-group-item-danger');
            }
            listItem.innerHTML = content;
            logList.appendChild(listItem);
        });
    } else {
        const noLogItem = document.createElement('li');
        noLogItem.className = 'list-group-item';
        noLogItem.textContent = 'No quiz history was recorded.';
        logList.appendChild(noLogItem);
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
