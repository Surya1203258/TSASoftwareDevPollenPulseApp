var key ='AIzaSyA9OpCxWQrLaG8W7dFTcTBTU-dZQLwT9QI'
var googlemapsapisrc='https://maps.googleapis.com/maps/api/js?key='+key+'&libraries=visualization'

document.getElementById('googlemapsapi').src=googlemapsapisrc;
                        document.getElementById('googlemapsapi').src;
let map;
let currentPollenType = 'GRASS_UPI';

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: { lat: 0, lng: 0} // Center of the World
    });

    addPollenHeatmap(currentPollenType); // Default to Grass Pollen
}

async function showMap() { //need to install async await to run
    const place = document.getElementById('cityInput').value;
    if (!place) {
        alert('Please enter a place name');
        return;
    }
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${key}`;
   
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK') {
        alert('Could not find location');
        return;
    }

    const location = geocodeData.results[0].geometry.location;
    const bounds = geocodeData.results[0].geometry.bounds
        ? new google.maps.LatLngBounds(
            geocodeData.results[0].geometry.bounds.southwest,
            geocodeData.results[0].geometry.bounds.northeast
          )
        : new google.maps.LatLngBounds(
            geocodeData.results[0].geometry.viewport.southwest,
            geocodeData.results[0].geometry.viewport.northeast
          );

    map.fitBounds(bounds);
    map.setCenter(location);
    addPollenHeatmap(currentPollenType);
    getPollenForecast(place);
}

function addPollenHeatmap(pollenType) {
    map.overlayMapTypes.clear();  
   
    const imageMapType = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
            return `https://pollen.googleapis.com/v1/mapTypes/${pollenType}/heatmapTiles/${zoom}/${coord.x}/${coord.y}?key=${key}`;
        },
        tileSize: new google.maps.Size(256, 256),
        opacity: 0.5
    });

    map.overlayMapTypes.insertAt(0, imageMapType);

    // Check tile availability
    const sampleTileUrl = imageMapType.getTileUrl({ x: 0, y: 0 }, map.getZoom());

   
    fetch(sampleTileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Tile not available');
            }
            console.log('Tile available:', sampleTileUrl);
        })
        .catch(error => {
            console.error('Tile fetch error:', error);
            alert('Pollen data not available for this region.');
        });
}

function changePollenType(pollenType) {
    currentPollenType = pollenType;
    addPollenHeatmap(pollenType);
}

// Initialize the map when the page loads
window.onload = initMap;
const fakeAnswers = {
    "what is pollen": "Pollen is a fine powder produced by plants for reproduction. It plays a crucial role in determining crop yields and plant health. Understanding pollen levels helps farmers optimize planting schedules and allows landscapers to select plant species suited to local conditions.",
    "what is an allergy": "An allergy is an immune system reaction to a substance that is usually harmless, like pollen, pet dander, or certain foods. When a person with an allergy comes into contact with the allergen, their immune system mistakenly identifies it as a threat and releases chemicals like histamine. This causes symptoms such as sneezing, itching, swelling, or even more severe reactions.",
    "how does this app use pollen data": "The app analyzes real-time pollen data to allow farmers to see which plants are suitable to plant. It also helps landscapers choose plant species that thrive in specific seasons while minimizing allergenic impact. If you are a farmer and landscaper who needs help interpreting what these different pollen levels mean, just ask!",
    "how does pollen affect plant growth": "High pollen levels indicate active pollination, which can improve crop yields for pollinator-dependent plants. However, excessive pollen can also mean increased competition from weeds. You can aks about how the amount of each one of our three types of pollen will affect farming and landscaping.",
    "how can tree pollen affect farming": "Tree pollen levels are highest in spring, making it a key period for orchard pollination. The is when fruit trees like apples, cherries, and almonds should be planted or pollinated to maximize yield. Look at this map to find your region to see whether or not the tree pollination levels are good for you to farm these trees.",
    "how can tree pollen help farming": "Tree pollen levels are highest in spring, making it a key period for orchard pollination. The is when fruit trees like apples, cherries, and almonds should be planted or pollinated to maximize yield. Look at this map to find your region to see whether or not the tree pollination levels are good for you to farm these trees.",
    "how can tree pollen affect landscaping": "Tree pollen levels are highest in spring, making it a key period for orchard pollination. The is when fruit trees like apples, cherries, and almonds should be planted or pollinated to maximize yield. Look at this map to find your region to see whether or not the tree pollination levels are good for you to farm these trees.",
    "how does grass pollen affect farming": "Grass pollen peaks in late spring and early summer, which is crucial for farmers growing hay, wheat, and other grasses. The app helps determine when to plant and harvest to align with pollen cycles for better productivity.",
    "how does weed pollen affect crop growth": "Weed pollen, which is most prevalent in late summer and fall, can indicate aggressive weed competition. Farmers and landscapers can use the app to predict peak weed pollination periods and take preventive measures like strategic planting or weed control.",
    "how can pollen data help landscapers": "The app helps landscapers select plant species that reduce allergenic impact while supporting ecological balance. It  provides seasonal insights with live pollen levels for planting schedules.",
    "what trees should be planted to minimize pollen allergies in urban areas": "Trees like dogwood, magnolia, and cherry produce less allergenic pollen and are recommended for urban spaces. The app suggests ideal planting times based on pollen levels to promote healthier city environments.",
    "how can I stop allergies when landscaping": "Trees like dogwood, magnolia, and cherry produce less allergenic pollen and are recommended for urban spaces. The app suggests ideal planting times based on pollen levels to promote healthier city environments.",
    "how can grass pollen influence park landscaping": "Some grasses release high amounts of pollen, leading to allergies. The app by showing active pollen levels helps landscapers choose low-pollen grass varieties and determine the best times for seeding and maintenance.",
    "when is pollen season, and how does it affect planting": "Tree pollen dominates in spring, grass pollen in late spring and summer, and weed pollen in late summer to fall. The app provides forecasts to help farmers and landscapers plan around these cycles.",
    "when is pollen season": "Tree pollen dominates in spring, grass pollen in late spring and summer, and weed pollen in late summer to fall. The app provides forecasts to help farmers and landscapers plan around these cycles.",
    "How does pollen affect planting": "Tree pollen dominates in spring, grass pollen in late spring and summer, and weed pollen in late summer to fall. The app provides forecasts to help farmers and landscapers plan around these cycles.",
};
function cleanInput(input) {
    return input.toLowerCase().replace(/[^\w\s]/gi, ''); // Converts to lowercase and removes punctuation
}

function getFakeAnswer() {
    const userInput = document.getElementById('fakeUserInput').value;
    const cleanedInput = cleanInput(userInput);
    const chatBox = document.getElementById('fakeChatBox');

    const userMessage = document.createElement('div');
    userMessage.textContent = `You: ${userInput}`;
    userMessage.style.margin = "10px 0";
    chatBox.appendChild(userMessage);

    const aiMessage = document.createElement('div');
    aiMessage.textContent = `AI: ${fakeAnswers[cleanedInput] || "I don't understand that question."}`;
    aiMessage.style.margin = "10px 0";
    aiMessage.style.fontWeight = "bold";
    chatBox.appendChild(aiMessage);

    document.getElementById('fakeUserInput').value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
}