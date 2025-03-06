document.getElementById('f3').style.display = 'none'
document.getElementById('f4').style.display = 'none'
document.getElementById('f5').style.display = 'none'

function clickDashboard() {
    document.getElementById('c4').style.display = 'none'
    document.getElementById('c3').style.display = 'flex'
}

function clickPrediction() {
    document.getElementById('c4').style.display = 'flex'
    document.getElementById('c3').style.display = 'none'
}

// Function to filter data up to specified year
function filterDataByYear(data, year) {
    return data.filter(item => parseInt(item.year.split('-')[2]) <= year);
}

// Function to plot graph using Chart.js
function plotGraph() {

    document.getElementById('f3').style.display = 'flex'
    document.getElementById('f4').style.display = 'block'
    document.getElementById('f5').style.display = 'block'

    let inputElement = document.getElementById('input-year');
    let selectedOption = inputElement.options[inputElement.selectedIndex];
    let year = parseInt(selectedOption.innerText);

    if (year == 'Select the Year') {
        console.log('year')
    } else {
        // Fetch the CSV file
        fetch('sea_level_rise.csv')
            .then(response => response.text())
            .then(data => {
                // Parse CSV data
                const rows = data.split('\n');
                const parsedData = [];

                rows.forEach(row => {
                    const columns = row.split(',');
                    // Assuming the first column is date and the second column is value
                    parsedData.push({
                        year: columns[0],
                        value: parseFloat(columns[1])
                    });
                });

                // Filter data for the first graph until the selected year
                const years = [];
                const values = [];

                parsedData.forEach(item => {
                    if (parseInt(item.year.split('-')[2]) <= year) {
                        years.push(item.year);
                        values.push(item.value);
                    }
                });

                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: years,
                        datasets: [{
                            label: 'Data',
                            data: values,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                // Filter data for the second graph starting from year 2024 to the selected year
                const filteredData2024 = parsedData.filter(item => parseInt(item.year.split('-')[2]) >= 2024 && parseInt(item.year.split('-')[2]) <= year);

                const years2024 = [];
                const values2024 = [];

                filteredData2024.forEach(item => {
                    years2024.push(item.year);
                    values2024.push(item.value);
                });

                const ctx1 = document.getElementById('myChart1').getContext('2d');
                const myChart1 = new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: years2024,
                        datasets: [{
                            label: 'Data',
                            data: values2024,
                            backgroundColor: 'rgba(255, 128, 0, 0.2)',
                            borderColor: 'rgba(255, 128, 0, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                    
                });
            })           
            .catch(error => console.error('Error fetching or parsing CSV file:', error));
    }

    // ELL section
    eel.glacier(year)((loss_SIE) => {
    // console.log(loss_SIE)

    const glacierMelting = loss_SIE

    document.querySelector('.f3').innerHTML = `Glacier Melted: ${glacierMelting} million Square Kilometer`
    });

}
