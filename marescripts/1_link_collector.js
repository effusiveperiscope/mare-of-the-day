// Lambda script to extract pony data from the list of ponies page on MLP fandom wikia. 
// Run this in the dev console after the page loads
(() => {
    const rows = document.querySelectorAll('.listofponies tr');
    const data = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 8) return; // Skip rows that don't have enough columns

        const extractHiddenText = (cell) => {
            const span = cell.querySelector('span[style*="display:none"]');
            return span ? span.innerText.trim() : "";
        };

        const extractTitle = (cell) => {
            const span = cell.querySelector('span[title]');
            return span ? span.getAttribute('title').trim() : "";
        };

        const extractLinks = (cell) => {
            return Array.from(cell.querySelectorAll('a')).map(link => ({
                text: link.innerText.trim(),
                url: link.href
            }));
        };

        const pony = {
            name: cells[0]?.innerText.trim() || "",  // Column 1: Name
            species: extractHiddenText(cells[1]) || "", // Column 2: Species (hidden span)
            age_sex: extractHiddenText(cells[2]) || "", // Column 3: Age and sex (hidden span)
            coat_color: extractTitle(cells[3]) || "",  // Column 4: Coat color (span title)
            mane_color: extractTitle(cells[4]) || "",  // Column 5: Mane color (span title)
            eye_color: extractTitle(cells[5]) || "",   // Column 6: Eye color (span title)
            first_appearance: cells[6]?.innerText.trim() || "", // Column 7: First appearance date
            description: cells[7]?.innerText.trim() || "", // Column 8: Description text
            links: extractLinks(cells[7]) // Extract links from description
        };

        data.push(pony);
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ponies.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
})();