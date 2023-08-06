let ads = [];

const portfolioSection = document.getElementById('portfolio');
const adForm = document.getElementById('ad-form');
const exportButton = document.getElementById('export-btn');
const importInput = document.getElementById('import-input');

function displayAds() {
    portfolioSection.innerHTML = '';
    ads.forEach((ad) => {
        const adRow = document.createElement('tr');
        adRow.innerHTML = `
            <td>${ad.name}</td>
            <td><a href="${ad.link}" target="_blank">${ad.link}</a></td>
            <td>${ad.category}</td>
            <td>
                <button class="edit btn btn-primary btn-sm" data-id="${ad.id}">Edit</button>
                <button class="delete btn btn-danger btn-sm" data-id="${ad.id}">Delete</button>
            </td>
        `;
        portfolioSection.appendChild(adRow);
    });
    saveAdsToLocalStorage();
}

function addAd(name, link, category) {
    const newAd = {
        id: Date.now(),
        name: name,
        link: link,
        category: category
    };
    ads.push(newAd);
    displayAds();
}

function deleteAd(adId) {
    ads = ads.filter((ad) => ad.id !== adId);
    displayAds();
}

function editAd(adId, newName, newLink, newCategory) {
    const adIndex = ads.findIndex((ad) => ad.id === adId);
    if (adIndex !== -1) {
        ads[adIndex].name = newName;
        ads[adIndex].link = newLink;
        ads[adIndex].category = newCategory;
        displayAds();
    }
}

function saveAdsToLocalStorage() {
    localStorage.setItem('ads', JSON.stringify(ads));
}

function loadAdsFromLocalStorage() {
    const storedAds = localStorage.getItem('ads');
    if (storedAds) {
        ads = JSON.parse(storedAds);
        displayAds();
    }
}

function exportAds() {
    const data = JSON.stringify(ads);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ads.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importAds(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const importedAds = JSON.parse(event.target.result);
        ads = importedAds;
        displayAds();
    };
    reader.readAsText(file);
}

adForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const adName = document.getElementById('ad-name').value;
    const adLink = document.getElementById('ad-link').value;
    const adCategory = document.getElementById('ad-category').value;
    addAd(adName, adLink, adCategory);
    adForm.reset();
});

portfolioSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        const adId = parseInt(e.target.getAttribute('data-id'));
        deleteAd(adId);
    } else if (e.target.classList.contains('edit')) {
        const adId = parseInt(e.target.getAttribute('data-id'));
        const ad = ads.find((ad) => ad.id === adId);
        if (ad) {
            const newName = prompt('Enter the new Ad Name:', ad.name);
            const newLink = prompt('Enter the new Ad Link:', ad.link);
            const newCategory = prompt('Enter the new Ad Category:', ad.category);
            if (newName && newLink && newCategory) {
                editAd(adId, newName, newLink, newCategory);
            }
        }
    }
});

exportButton.addEventListener('click', exportAds);
importInput.addEventListener('change', importAds);

// Load ads from localStorage on page load
loadAdsFromLocalStorage();
