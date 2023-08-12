document$.subscribe(() => {

    // Function to initialize Mermaid
    function initializeMermaid() {
        mermaid.initialize({
            theme: 'base',
            themeVariables: {
                pie1: '#2bc275',
                pie2: '#5f60ff',
                pie3: '#d74e26',
                pieStrokeWidth: '0px',
                textPosition: '0.5',
                pieOpacity: '1'
            }
        });

    }

    // Function to update the Mermaid graph
    function updateMermaidGraph() {

        // Fetch ratings data and generate Mermaid syntax
        const apiUrl = "https://dark-pink-prawn-wear.cyclic.app/getRatings";

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const ratings = data.ratings;

                // Count the number of each type of rating
                const promoterCount = ratings.filter(rating => rating >= 9).length;
                const passiveCount = ratings.filter(rating => rating >= 7 && rating <= 8).length;
                const detractorCount = ratings.filter(rating => rating >= 0 && rating <= 6).length;

                // Generate the updated Mermaid syntax
                const updatedMermaidSyntax = `%%{init: {'theme': 'base', 'themeVariables': { 'pie1': '#2bc275', 'pie2': '#5f60ff', 'pie3': '#d74e26', 'pieStrokeWidth': '0px', 'textPosition': '0.5', 'pieOpacity': '1'}}}%%
            pie
                "Promoter" : ${promoterCount}
                "Passive" : ${passiveCount}
                "Detractor" : ${detractorCount}`;

                // Insert the Mermaid syntax into the mermaid-container div
                const mermaidContainer = document.getElementById('mermaid-container');
                mermaidContainer.innerHTML = updatedMermaidSyntax;

                // Show total number of counts
                const countContainer = document.getElementById('count-container');
                countText = `Promoters: ${promoterCount} Passives: ${passiveCount} Detractors: ${detractorCount}</p>`;
                countContainer.innerHTML = countText;

                // Remove the 'data-processed' attribute to render mermaid again
                mermaidContainer.removeAttribute('data-processed');

                // Render the Mermaid chart
                mermaid.init(undefined, mermaidContainer);

            })
            .catch(error => {
                console.error("Error fetching ratings:", error);
            });
    }

    const liveChartUrl = 'https://manutechwriter.github.io/npstest/live-chart/';

    if (liveChartUrl && window.location.href === liveChartUrl) {
        if (document.referrer === "") {

            // Inject the Mermaid script when accessed through deep linking
            const mermaidScript = document.createElement('script');
            mermaidScript.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.3.0/dist/mermaid.min.js';
            mermaidScript.onload = () => {
                initializeMermaid();
                updateMermaidGraph();
            };
            document.head.appendChild(mermaidScript);
        } else {

            // Initialize Mermaid without injecting script
            initializeMermaid();
            updateMermaidGraph();
        }

        // Attach event listener for receiving messages
        window.addEventListener('message', event => {
            if (event.origin !== 'https://manutechwriter.github.io') {
                return; // Check the origin to ensure security
            }

            if (event.data.type === 'newRating') {
                updateMermaidGraph();

            }
        })

        window.onload = updateMermaidGraph;
    }

});
