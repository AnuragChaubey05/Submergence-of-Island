let myChartInstance = null;
let myChartInstance1 = null;

function clickDashboard() {
    document.getElementById('c4').style.display = 'none';
    document.getElementById('c3').style.display = 'flex';
    document.getElementById('c5').style.display = 'none';
    setActiveNav('nav-dashboard');
}

function clickPrediction() {
    document.getElementById('c4').style.display = 'flex';
    document.getElementById('c3').style.display = 'none';
    document.getElementById('c5').style.display = 'none';
    setActiveNav('nav-prediction');
}

function clickInsights() {
    document.getElementById('c4').style.display = 'none';
    document.getElementById('c3').style.display = 'none';
    document.getElementById('c5').style.display = 'flex';
    setActiveNav('nav-insights');
}

function setActiveNav(activeId) {
    const navIds = ['nav-prediction', 'nav-dashboard', 'nav-insights'];
    navIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === activeId) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    });
}

// Function to filter data up to specified year
function filterDataByYear(data, year) {
    return data.filter(item => {
        const parts = item.year.split('-');
        if (parts.length < 3) return false;
        return parseInt(parts[2]) <= year;
    });
}

// Function to plot graph using Chart.js
function plotGraph() {
    let inputElement = document.getElementById('input-year');
    let selectedOption = inputElement.options[inputElement.selectedIndex];
    let yearText = selectedOption.innerText;

    if (yearText === 'Select the Year') {
        alert('Please select a valid year.');
        return;
    }

    let year = parseInt(yearText);

    document.getElementById('f3').style.display = 'flex';
    document.getElementById('f4').style.display = 'flex';
    document.getElementById('f5').style.display = 'flex';

    // Update the explanations dynamically based on the selected year
    document.getElementById('chart-desc').innerHTML = 
        `<strong>Chart Purpose (Historical trend):</strong> This chart visualizes the cumulative historical sea level rise from 1992 up to the year <strong>${year}</strong>. ` +
        `Over this timeline, the data indicates a clear, non-stationary upward trend, primarily driven by glacier shrinkage and thermal expansion of oceans. ` +
        `By <strong>${year}</strong>, sea levels have reached significant positive anomalies, illustrating a persistent global threat to coral atolls like Lakshadweep.`;

    document.getElementById('chart1-desc').innerHTML = 
        `<strong>Chart Purpose (2024 - Target projection):</strong> This chart zooms in specifically on the short-term prediction window starting from 2024 to <strong>${year}</strong>. ` +
        `The slope of this chart reveals the immediate rate of sea level change. Selecting the target year <strong>${year}</strong> illustrates the velocity of rise, indicating ` +
        `coastal zones will face elevated risk levels of saltwater intrusion and tidal submergence if baseline trends persist.`;

    // Fetch the CSV file
    fetch('sea_level_rise.csv')
        .then(response => response.text())
        .then(data => {
            // Parse CSV data
            const rows = data.split('\n');
            const parsedData = [];

            rows.forEach(row => {
                const columns = row.split(',');
                if (columns.length < 2) return;
                
                const dateStr = columns[0].trim();
                const val = parseFloat(columns[1]);
                if (dateStr === "Month" || isNaN(val)) return;

                parsedData.push({
                    year: dateStr,
                    value: val
                });
            });

            // Filter data for the first graph until the selected year
            const years = [];
            const values = [];

            parsedData.forEach(item => {
                const parts = item.year.split('-');
                if (parts.length >= 3 && parseInt(parts[2]) <= year) {
                    years.push(item.year);
                    values.push(item.value);
                }
            });

            // Destroy existing chart instance before creating a new one
            if (myChartInstance) {
                myChartInstance.destroy();
            }

            const ctx = document.getElementById('myChart').getContext('2d');
            myChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Sea Level Rise (mm)',
                        data: values,
                        backgroundColor: 'rgba(6, 182, 212, 0.15)',
                        borderColor: '#06b6d4',
                        borderWidth: 2,
                        pointRadius: 1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: '#9ca3af'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#9ca3af',
                                maxTicksLimit: 15
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#f3f4f6',
                                font: {
                                    family: 'Outfit'
                                }
                            }
                        }
                    }
                }
            });

            // Filter data for the second graph starting from year 2024 to the selected year
            const filteredData2024 = parsedData.filter(item => {
                const parts = item.year.split('-');
                if (parts.length < 3) return false;
                const itemYear = parseInt(parts[2]);
                return itemYear >= 2024 && itemYear <= year;
            });

            const years2024 = [];
            const values2024 = [];

            filteredData2024.forEach(item => {
                years2024.push(item.year);
                values2024.push(item.value);
            });

            // Destroy existing chart instance before creating a new one
            if (myChartInstance1) {
                myChartInstance1.destroy();
            }

            const ctx1 = document.getElementById('myChart1').getContext('2d');
            myChartInstance1 = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: years2024,
                    datasets: [{
                        label: 'Immediate Projected Rise (mm)',
                        data: values2024,
                        backgroundColor: 'rgba(249, 115, 22, 0.15)',
                        borderColor: '#f97316',
                        borderWidth: 2.5,
                        pointRadius: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: '#9ca3af'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#9ca3af'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#f3f4f6',
                                font: {
                                    family: 'Outfit'
                                }
                            }
                        }
                    }
                }
            });
        })           
        .catch(error => console.error('Error fetching or parsing CSV file:', error));

    // Prediction API (Adaptive local EEL / Vercel Serverless Function)
    if (typeof eel !== 'undefined' && typeof eel.glacier === 'function') {
        eel.glacier(year)((loss_SIE) => {
            document.querySelector('.f3').innerHTML = `Glacier Melted: <strong>${loss_SIE}</strong> million Square Kilometer`;
        });
    } else {
        fetch(`/api/glacier?year=${year}`)
            .then(response => response.json())
            .then(data => {
                const loss_SIE = data.loss_SIE;
                document.querySelector('.f3').innerHTML = `Glacier Melted: <strong>${loss_SIE}</strong> million Square Kilometer`;
            })
            .catch(error => {
                console.error('Error fetching prediction:', error);
                document.querySelector('.f3').innerHTML = `Glacier Melted: <span style="color:var(--accent-orange)">Service offline</span>`;
            });
    }
}
