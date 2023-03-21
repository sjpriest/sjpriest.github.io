document.addEventListener('DOMContentLoaded', function () {
    // Initialize map
    const map = L.map('map').setView([44.0, -71.0], 7);

    // Add base map layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create separate layers for each state's ski resorts
    const vtLayer = L.layerGroup();
    const nhLayer = L.layerGroup();
    const meLayer = L.layerGroup();

    const createResortInfoHTML = (resort) => {
        return `
            <h2>${resort.name}</h2>
            <img class="sidebar-image" src="${resort.imageUrl}" alt="${resort.name}">
            <p>Address: ${resort.address}</p>
            <p>Website: <a href="${resort.website}" target="_blank">${resort.website}</a></p>
            <label>
                <input type="checkbox" class="visited-checkbox" data-resort-id="${resort.id}" ${resort.visited ? 'checked' : ''}>
                Visited
            </label>
        `;
    };

    // Function to add markers to the respective layer
    const addMarkersToLayer = (resorts, layer) => {
        resorts.forEach(resort => {
            const marker = L.marker(resort.coordinates, {icon: resort.visited ? redIcon : blueIcon});
            resort.marker = marker;
            marker.on('click', () => {
                const sidebar = document.getElementById('sidebar');
                const sidebarContent = document.getElementById('sidebar-content');
                sidebarContent.innerHTML = createResortInfoHTML(resort);
                sidebar.style.transform = 'translateX(0)';
                document.querySelectorAll('.visited-checkbox').forEach((checkbox) => {
                    checkbox.removeEventListener('change', handleVisitedChange);
                    checkbox.addEventListener('change', handleVisitedChange);
                });
            });
            layer.addLayer(marker);
        });
    };

    // Add markers for ski resorts to their respective layers
    addMarkersToLayer(skiResorts.vt, vtLayer);
    addMarkersToLayer(skiResorts.nh, nhLayer);
    addMarkersToLayer(skiResorts.me, meLayer);

    // Add layers to the map initially
    vtLayer.addTo(map);
    nhLayer.addTo(map);
    meLayer.addTo(map);

    // Filter button functionality
    const vtButton = document.getElementById('vtButton');
    const nhButton = document.getElementById('nhButton');
    const meButton = document.getElementById('meButton');

    vtButton.addEventListener('click', () => {
        if (map.hasLayer(vtLayer)) {
            map.removeLayer(vtLayer);
        } else {
            map.addLayer(vtLayer);
        }
    });

    nhButton.addEventListener('click', () => {
        if (map.hasLayer(nhLayer)) {
            map.removeLayer(nhLayer);
        } else {
            map.addLayer(nhLayer);
        }
    });

    meButton.addEventListener('click', () => {
        if (map.hasLayer(meLayer)) {
            map.removeLayer(meLayer);
        } else {
            map.addLayer(meLayer);
        }
    });

    const closeSidebarButton = document.getElementById('close-sidebar');
    closeSidebarButton.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.style.transform = 'translateX(100%)';
    });
});

// Add ski resorts
const skiResorts = {
    vt: [
        {
            id: 1,
            name: "Okemo Mountain Resort",
            coordinates: [43.40409529730757, -72.71637989144716],
            imageUrl: "06.jpg",
            address: "77 Okemo Ridge Rd, Ludlow, VT 05149",
            website: "https://www.okemo.com/",
            visited: false
        },
        {
            id: 2,
            name: "Resort 2",
            coordinates: [44.234, -72.234],
            imageUrl: "05.jpg",
            address: "77 Okemo Ridge Rd, Ludlow, VT 05149",
            website: "https://www.okemo.com/",
            visited: false
        }
        // Add more Vermont ski resorts here
    ],
    nh: [
        {
            id: 3,
            name: "Resort 3",
            coordinates: [44.345, -71.345],
            imageUrl: "04.jpg",
            address: "77 Okemo Ridge Rd, Ludlow, VT 05149",
            website: "https://www.okemo.com/",
            visited: false
        },
        {
            id: 4,
            name: "Resort 4",
            coordinates: [44.456, -71.456],
            imageUrl: "03.jpg",
            address: "77 Okemo Ridge Rd, Ludlow, VT 05149",
            website: "https://www.okemo.com/",
            visited: false
        }
        // Add more New Hampshire ski resorts here
    ],
    me: [
        {
            id: 5,
            name: "Resort 5",
            coordinates: [44.567, -70.567],
            imageUrl: "02.jpg",
            address: "77 Okemo Ridge Rd, Ludlow, VT 05149",
            website: "https://www.okemo.com/",
            visited: false
        },
        {
            id: 6,
            name: "Resort 6",
            coordinates: [44.678, -70.678],
            imageUrl: "01.jpg",
            address: "77 Okemo Ridge Rd, Ludlow, VT 05149",
            website: "https://www.okemo.com/",
            visited: false
        }
        // Add more Maine ski resorts here
    ]
};

const handleVisitedChange = (event) => {
    const checkbox = event.target;
    const resortId = parseInt(checkbox.dataset.resortId);
    
    let resort;
    for (const state in skiResorts) {
        resort = skiResorts[state].find((r) => r.id === resortId);
        if (resort) {
            break;
        }
    }

    if (resort) {
        resort.visited = checkbox.checked;

        const marker = resort.marker;
        if (resort.visited) {
            marker.setIcon(redIcon);
        } else {
            marker.setIcon(blueIcon);
        }
    }
};

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});