document.addEventListener('DOMContentLoaded', () => {setupDatabasePage();});

function setupDatabasePage() 
{
    const weightClasses = [
      { division: "Flyweight", minWeight: 56.7, maxWeight: 61.2 },
      { division: "Bantamweight", minWeight: 61.2, maxWeight: 65.8 },
      { division: "Featherweight", minWeight: 65.8, maxWeight: 70.3 },
      { division: "Lightweight", minWeight: 70.3, maxWeight: 77.1 },
      { division: "Welterweight", minWeight: 77.1, maxWeight: 83.9 },
      { division: "Middleweight", minWeight: 83.9, maxWeight: 93.0 },
      { division: "Light Heavyweight", minWeight: 93.0, maxWeight: 120.2 },
      { division: "Heavyweight", minWeight: 120.2, maxWeight: 200.5 }
    ];
  
    const dropdownTitle = document.querySelector('.nav-link.dropdown-toggle');
    const weightClassesContainer = document.querySelector('.weight-classes');
  
    weightClasses.forEach(weightClass => 
    {
      const weightButton = document.createElement('a');
      weightButton.classList.add('dropdown-item');
      weightButton.innerText = `${weightClass.division} (${weightClass.minWeight}-${weightClass.maxWeight} kg)`;
      weightButton.onclick = () => 
      {
        filterFightersByWeight(weightClass.minWeight, weightClass.maxWeight);
        dropdownTitle.innerText = weightClass.division;
      };
      weightClassesContainer.appendChild(weightButton);
    });
  
    fetch('UFC_fighters.json')
      .then(response => response.json())
      .then(data => 
      {
        window.allFighters = data;
        displayFighters(data);
      })
      .catch(error => console.error('Error loading JSON:', error));
  
    document.querySelector('.filter-reset').onclick = () => {
      displayFighters(window.allFighters);
      dropdownTitle.innerText = "Filter by Weight Class";
      document.querySelector('.filter-min-wins').value = '';
      document.querySelector('.filter-max-wins').value = '';
      document.querySelector('.filter-name').value = '';
    };
  
    document.querySelector('.filter-min-wins').addEventListener('input', applyFilters);
    document.querySelector('.filter-max-wins').addEventListener('input', applyFilters);
    document.querySelector('.filter-name').addEventListener('input', applyFilters);
}
  
function displayFighters(fighters) 
{
    const fightersContainer = document.querySelector('.fighters-list');
    fightersContainer.innerHTML = '';
    fighters.forEach(fighter => 
    {
      const fighterRow = document.createElement('tr');
      fighterRow.innerHTML = `
        <td>${fighter.name}</td>
        <td>${fighter.nickname || 'N/A'}</td>
        <td>${fighter.wins}</td>
        <td>${fighter.losses}</td>
        <td>${fighter.weight_in_kg || 'N/A'}</td>
        <td>${fighter.height_cm || 'N/A'}</td>
        <td>${fighter.reach_in_cm || 'N/A'}</td>
      `;
      fightersContainer.appendChild(fighterRow);
    });
}
  
function filterFightersByWeight(minWeight, maxWeight) 
{
    const filteredFighters = window.allFighters.filter(fighter => fighter.weight_in_kg >= minWeight && fighter.weight_in_kg < maxWeight);
    displayFighters(filteredFighters);
}
  
function applyFilters() 
{
    const minWins = parseInt(document.querySelector('.filter-min-wins').value) || 0;
    const maxWins = parseInt(document.querySelector('.filter-max-wins').value) || Infinity;
    const nameFilter = document.querySelector('.filter-name').value.toLowerCase();
  
    const filteredFighters = window.allFighters.filter(fighter => fighter.wins >= minWins && fighter.wins <= maxWins && 
        fighter.name.toLowerCase().startsWith(nameFilter)
    );
    displayFighters(filteredFighters);
}

document.addEventListener('DOMContentLoaded', () => 
{
    const ctx = document.getElementById('winChart').getContext('2d');
    let chart;
    const weightClasses = 
    {
      "FLYWEIGHT": { minWeight: 56.7, maxWeight: 61.2 },
      "BANTAMWEIGHT": { minWeight: 61.2, maxWeight: 65.8 },
      "FEATHERWEIGHT": { minWeight: 65.8, maxWeight: 70.3 },
      "LIGHTWEIGHT": { minWeight: 70.3, maxWeight: 77.1 },
      "WELTERWEIGHT": { minWeight: 77.1, maxWeight: 83.9 },
      "MIDDLEWEIGHT": { minWeight: 83.9, maxWeight: 93.0 },
      "LIGHT HEAVYWEIGHT": { minWeight: 93.0, maxWeight: 120.2 },
      "HEAVYWEIGHT": { minWeight: 120.2, maxWeight: 200.5 }
    };
  
    function updateChart(dataType, weightCategory) 
    {
      fetch('UFC_fighters.json')
        .then(response => response.json())
        .then(data => 
        {
          if(weightCategory !== "all") 
          {
            const { minWeight, maxWeight } = weightClasses[weightCategory];
            data = data.filter(fighter => fighter.weight_in_kg >= minWeight && fighter.weight_in_kg <= maxWeight);
          }
          data.sort((a, b) => (b[dataType] || 0) - (a[dataType] || 0));

          const topFighters = data.slice(0, 10);
          const labels = topFighters.map(fighter => fighter.name);
          const chartData = topFighters.map(fighter => fighter[dataType] || 0);
  
          if(chart) chart.destroy();
          chart = new Chart(ctx, 
          {
            type: 'bar',
            data: 
            {
              labels: labels,
              datasets: 
              [{
                label: `Top 10 by ${dataType.replace(/_/g, ' ').toUpperCase()} (${weightCategory === 'all' ? 'All Weights' : weightCategory})`,
                data: chartData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }]
            },
            options: 
            {
              responsive: true,
              scales: {y: {beginAtZero: true}}
            }
          });
        })
        .catch(error => console.error('Error loading JSON:', error));
    }
  
    updateChart('wins', 'all');
    document.getElementById('dataSelect').addEventListener('change', (event) => 
    {
      const selectedWeight = document.getElementById('weightSelect').value;
      updateChart(event.target.value, selectedWeight);
    });
  
    document.getElementById('weightSelect').addEventListener('change', (event) => 
    {
      const selectedData = document.getElementById('dataSelect').value;
      updateChart(selectedData, event.target.value);
    });
});