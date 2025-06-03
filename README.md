# Tudor History Quiz & Genealogy Explorer

This project is an interactive web application that tests your knowledge about the six wives of King Henry VIII and displays a genealogical tree of the Tudor family upon quiz completion. It features a modern, minimal UI with a historical touch.

## Key Features

*   **Interactive Quiz:** Answer questions about each of Henry VIII's six wives.
*   **Animated Transitions:** Smooth fade-in/fade-out animations between quiz questions.
*   **Dynamic Genealogical Graph:**
    *   Displayed after successfully completing the quiz.
    *   Rendered using D3.js with a force-directed layout, adjusted for a hierarchical appearance.
    *   Includes key ancestors of Henry VIII (parents, grandparents) and related figures like Lady Jane Grey to illustrate broader family connections.
    *   Interactive: Supports panning, zooming, and dragging nodes (nodes return to their rank).
    *   Click on nodes (individuals) to see basic information.
*   **Post-Quiz Summary:**
    *   **Wives Recap:** Displays information cards for all six wives. (Current biographical details are placeholders in the JavaScript data and can be expanded).
    *   **Performance Log:** Shows a detailed list of questions asked, your answers, and whether they were correct.
*   **Responsive Design:** Utilizes Bootstrap 5 for layout and responsiveness.
*   **Custom UI Theme:** A modern and minimal design with sharp corners, subtle shadows, a deep blue and gold color palette, and custom typography (Montserrat and Playfair Display).
*   **About Page:** Provides information about the website.
*   **Externalized Data:** Quiz questions and genealogy data are loaded from local JSON files (`quiz_data.json`, `genealogy_data.json`).

## Technologies & Libraries Used

*   HTML5
*   CSS3 (including CSS Custom Properties/Variables)
*   JavaScript (ES6+)
*   Bootstrap 5 (Core framework and grid system)
*   D3.js (v7, for data visualization - genealogy graph)
*   Google Fonts (Montserrat and Playfair Display)

## File Structure Overview

*   `index.html`: The main page hosting the quiz, graph, and summary.
*   `about.html`: The "About" page.
*   `style.css`: Contains all custom styles, including the UI theme, component styling (Bootstrap overrides, quiz elements, D3 graph elements), and animations.
*   `quiz.js`: Core JavaScript file handling:
    *   Quiz logic and progression.
    *   Question transition animations.
    *   Fetching and processing `quiz_data.json` and `genealogy_data.json`.
    *   Rendering the D3.js genealogy graph.
    *   Displaying the post-quiz summary.
    *   Event handling.
*   `quiz_data.json`: Stores the questions, options, and correct answers for the quiz.
*   `genealogy_data.json`: Stores the nodes (individuals like Henry VIII, his wives, children, key ancestors, and related figures) and edges (relationships) for the D3.js family tree.
*   `images/`: Currently unused directory (initially intended for static images).

## How to View

1.  Clone or download the repository.
2.  Open the `index.html` file in a modern web browser that supports ES6 JavaScript.
    *   Note: Due to browser security restrictions (CORS policy), fetching local JSON files (`quiz_data.json`, `genealogy_data.json`) using the `fetch` API might not work if you simply open `index.html` directly from the file system (`file:///...`).
    *   **For best results, serve the files through a local web server.** Many simple HTTP servers are available (e.g., Python's `http.server`, Node.js `serve` or `http-server`, VS Code Live Server extension).

## Future Enhancements (Potential)

*   Populate full biographical details for each wife in the summary section.
*   Add more detailed information display for D3 graph node clicks (e.g., using a custom tooltip/modal instead of an alert).
*   Expand the quiz question bank.
*   Incorporate images into the D3 graph nodes or summary cards.
