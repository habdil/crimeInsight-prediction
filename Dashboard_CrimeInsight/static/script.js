// Inisialisasi peta
let map = L.map('crimeMap').setView([-6.2088, 106.8456], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Data untuk grafik dan peta
const crimeData = {
    labels: ['JAKARTA BARAT', 'JAKARTA PUSAT', 'JAKARTA SELATAN', 'JAKARTA TIMUR', 'JAKARTA UTARA'],
    datasets: [{
        label: 'Jumlah Kasus',
        data: [51, 17, 59, 88, 23],
        backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
        ]
    }]
};

const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Tren Kriminalitas 2023',
        data: [10, 15, 20, 18, 25, 30, 35, 40, 38, 35, 30, 28],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};

const correlationData = {
    labels: ['Waktu', 'Pengangguran', 'Kepadatan Penduduk', 'Bulan', 'Hari'],
    datasets: [{
        label: 'Korelasi dengan Kriminalitas',
        data: [0.67, -0.11, 0.3, 0.57, 0.2],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
};

// Fungsi untuk membuat grafik
function createCharts() {
    new Chart(document.getElementById('crimeChart').getContext('2d'), {
        type: 'bar',
        data: crimeData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Distribusi Kasus per Wilayah' }
            }
        }
    });

    new Chart(document.getElementById('trendChart').getContext('2d'), {
        type: 'line',
        data: trendData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Tren Kriminalitas Bulanan' }
            }
        }
    });

    new Chart(document.getElementById('correlationChart').getContext('2d'), {
        type: 'radar',
        data: correlationData,
        options: {
            elements: { line: { borderWidth: 3 } },
            plugins: {
                title: { display: true, text: 'Korelasi Faktor dengan Kriminalitas' }
            }
        }
    });
}

// Fungsi untuk membuat peta
function createMap() {
    const jakartaRegions = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {"name": "Jakarta Utara", "crimeCount": 23},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [106.7776, -6.0857], [106.9690, -6.0857],
                        [106.9690, -6.1384], [106.7776, -6.1384]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {"name": "Jakarta Timur", "crimeCount": 88},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [106.8620, -6.1800], [107.0200, -6.1800],
                        [107.0200, -6.3700], [106.8620, -6.3700]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {"name": "Jakarta Selatan", "crimeCount": 59},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [106.7400, -6.2200], [106.9000, -6.2200],
                        [106.9000, -6.3900], [106.7400, -6.3900]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {"name": "Jakarta Barat", "crimeCount": 51},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [106.6800, -6.1200], [106.8000, -6.1200],
                        [106.8000, -6.2500], [106.6800, -6.2500]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {"name": "Jakarta Pusat", "crimeCount": 17},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [106.8000, -6.1500], [106.8700, -6.1500],
                        [106.8700, -6.2200], [106.8000, -6.2200]
                    ]]
                }
            }
        ]
    };

    function getColor(count) {
        return count > 80 ? '#800026' :
               count > 60 ? '#BD0026' :
               count > 40 ? '#E31A1C' :
               count > 20 ? '#FC4E2A' :
               count > 10 ? '#FD8D3C' :
                            '#FEB24C';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.crimeCount),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    L.geoJSON(jakartaRegions, {
        style: style,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<b>${feature.properties.name}</b><br>Jumlah Kasus: ${feature.properties.crimeCount}`);
        }
    }).addTo(map);

    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 10, 20, 40, 60, 80];
        const labels = [];
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
}

// Fungsi untuk melakukan prediksi
async function predictCrime() {
    try {
        const response = await fetch('/predict');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result || typeof result !== 'object') {
            throw new Error('Respons tidak valid dari server');
        }

        displayPredictionResult(result);
    } catch (error) {
        console.error('Error:', error);
        alert(`Terjadi kesalahan saat melakukan prediksi: ${error.message}`);
    }
}

// Fungsi untuk menampilkan hasil prediksi
function displayPredictionResult(result) {
    const predictionResult = document.getElementById('predictionResult');
    
    let html = '<h3>Hasil Prediksi</h3>';

    const predictions = result['2024'];
    html += `<h4>Prediksi untuk tahun 2024 bulan Juni:</h4><ul>`;
    for (const [region, prediction] of Object.entries(predictions)) {
        html += `<li>${region}: ${prediction.toFixed(2)} kasus</li>`;
    }
    html += '</ul>';

    predictionResult.innerHTML = html;
}

// Fungsi untuk memperbarui statistik
function updateStats() {
    document.getElementById('totalCrimes').innerText = '328';
    document.getElementById('predictionAccuracy').innerText = '56.72%';
    document.getElementById('crimeReduction').innerText = '-15%';
}

// Inisialisasi dashboard
document.addEventListener('DOMContentLoaded', function() {
    createCharts();
    createMap();
    updateStats();
    predictCrime();  // Langsung melakukan prediksi saat halaman dimuat
});