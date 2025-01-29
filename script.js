let subjects = [];
let chart = null;

function addSubject() {
  const subjectsDiv = document.getElementById("subjects");
  const newSubject = document.createElement("div");
  newSubject.className = "subject";
  newSubject.innerHTML = `
    <input type="text" placeholder="Subject Name" required>
    <input type="number" step="0.01" placeholder="Marks (0-100)" min="0" max="100" required>
    <input type="number" step="1" placeholder="Credits" min="1" max="10" required>
  `;
  subjectsDiv.appendChild(newSubject);
}

document.getElementById("cgpaForm").addEventListener("submit", function (e) {
  e.preventDefault();
  calculateSGPA();
});

function getGradePoint(marks) {
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 45) return 5;
  if (marks >= 40) return 4;
  return 0;
}

function getGrade(gradePoint) {
  const gradeMap = {
    10: 'O',
    9: 'A',
    8: 'B',
    7: 'C',
    6: 'D',
    5: 'E',
    4: 'P',
    0: 'F'
  };
  return gradeMap[gradePoint] || 'F';
}

function calculateSGPA() {
  const subjectInputs = document.querySelectorAll(".subject");
  subjects = [];
  let totalCredits = 0;
  let totalGradePoints = 0;

  const gradeTableBody = document.querySelector("#gradeTable tbody");
  gradeTableBody.innerHTML = ""; 

  subjectInputs.forEach((subject) => {
    const name = subject.children[0].value;
    const marks = parseFloat(subject.children[1].value);
    const credits = parseFloat(subject.children[2].value);

    if (name && !isNaN(marks) && !isNaN(credits)) {
      const gradePoint = getGradePoint(marks);
      const grade = getGrade(gradePoint);
      subjects.push({ name, marks, credits, gradePoint, grade });
      totalGradePoints += gradePoint * credits;
      totalCredits += credits;

      
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${name}</td>
        <td>${gradePoint}</td>
        <td>${grade}</td>
      `;
      gradeTableBody.appendChild(row);
    }
  });

  const sgpa = (totalGradePoints / totalCredits).toFixed(2);
  document.getElementById("sgpaValue").textContent = sgpa;
  document.getElementById("cgpaValue").textContent = sgpa;

  updateChart();
}

function updateChart() {
  const ctx = document.getElementById("cgpaChart").getContext("2d");
  const labels = subjects.map((subject) => subject.name);
  const data = subjects.map((subject) => subject.marks);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Marks",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}