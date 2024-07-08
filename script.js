// script.js

let unit = 'm';
let precision = 0.01;
let calibrationData = [];

document.addEventListener('DOMContentLoaded', () => {
  const configForm = document.getElementById('config');
  const calibrationTable = document.getElementById('calibration-table');
  const addDataButton = document.getElementById('add-data');
  const calculateButton = document.getElementById('calculate');
  const resultsSection = document.getElementById('results');
  const calibrationResultElement = document.getElementById('calibration-value');
  const uncertaintyResultElement = document.getElementById('uncertainty-value');

  configForm.addEventListener('submit', (e) => {
    e.preventDefault();
    unit = document.getElementById('unit').value;
    precision = parseFloat(document.getElementById('precision').value);
  });

  addDataButton.addEventListener('click', () => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input type="number" value="0" step="${precision}"></td>
      <td><input type="number" value="0" step="${precision}"></td>
      <td>0</td>
    `;
    calibrationTable.tBodies[0].appendChild(newRow);
  });

  calculateButton.addEventListener('click', () => {
    calibrationData = [];
    const rows = calibrationTable.tBodies[0].rows;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const realValue = parseFloat(row.cells[0].children[0].value);
      const measuredValue = parseFloat(row.cells[1].children[0].value);
      const difference = measuredValue - realValue;
      row.cells[2].textContent = difference.toFixed(2);
      calibrationData.push({ realValue, measuredValue, difference });
    }

    const meanDifference = calibrationData.reduce((acc, current) => acc + current.difference, 0) / calibrationData.length;
    const calibrationResult = meanDifference;
    const uncertainty = calculateCalibration(calibrationData);

    calibrationResultElement.textContent = calibrationResult.toFixed(2);
    uncertaintyResultElement.textContent = uncertainty.toFixed(2);
  });
});

function calculateCalibration(data) {
  // Calcular a média das diferenças
  const meanDifference = data.reduce((acc, current) => acc + current.difference, 0) / data.length;

  // Calcular a soma dos quadrados das diferenças em relação à média
  const sumSquares = data.reduce((acc, current) => {
    const diff = current.difference - meanDifference;
    return acc + diff * diff;
  }, 0);

  // Calcular a incerteza (desvio padrão)
  const uncertainty = Math.sqrt(sumSquares / (data.length - 1));

  return uncertainty;
}