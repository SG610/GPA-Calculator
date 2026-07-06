let subjects = [];
let future = [];

/* ADD SUBJECT */
function addSubject() {
    const name = document.getElementById("subject").value;
    const credits = Number(document.getElementById("credits").value);
    const grade = Number(document.getElementById("grade").value);

    if (!name.trim() || isNaN(credits)) return;

    if (credits < 1 || credits > 10) {
        alert("Credits must be between 1 and 10");
        return;
    }

    let totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

    if (totalCredits + credits > 30) {
        alert("Max allowable credits is 30");
        return;
    }

    subjects.push({ name, credits, grade });

    document.getElementById("subject").value = "";
    document.getElementById("credits").value = "";

    updateUI();
}

/* DELETE SUBJECT */
function deleteSubject(i) {
    subjects.splice(i, 1);
    updateUI();
}

/* RENDER SUBJECTS */
function renderSubjects() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    subjects.forEach((s, i) => {
        list.innerHTML += `
        <tr>
            <td>${s.name}</td>
            <td>${s.credits}</td>
            <td>${gradeToLetter(s.grade)}</td>
            <td><button onclick="deleteSubject(${i})">❌</button></td>
        </tr>`;
    });
}

/* GRADE */
function gradeToLetter(g) {
    if (g === 10) return "S";
    if (g === 9) return "A";
    if (g === 8) return "B";
    if (g === 7) return "C";
    if (g === 6) return "D";
    if (g === 5) return "E";
    return "F";
}

/* GPA */
function calculateGPA() {
    let credits = 0;
    let points = 0;

    subjects.forEach(s => {
        credits += s.credits;
        points += s.credits * s.grade;
    });

    return credits ? points / credits : 0;
}

/* CGPA */
function calculateCGPA() {
    let gpa = calculateGPA();

    let semCredits = subjects.reduce((s, x) => s + x.credits, 0);

    let futureCredits = 0;
    let futurePoints = 0;

    future.forEach(f => {
        futureCredits += f.credits;
        futurePoints += f.credits * f.gpa;
    });

    let totalCredits = semCredits + futureCredits;
    let totalPoints = (gpa * semCredits) + futurePoints;

    return totalCredits ? totalPoints / totalCredits : 0;
}

/* ADD FUTURE */
function addFuture() {
    const sem = Number(document.getElementById("futureSem").value);
    const credits = Number(document.getElementById("futureCredits").value);
    const gpa = Number(document.getElementById("futureGpa").value);

    if (sem < 1 || sem > 8) {
        alert("Semester must be 1 to 8");
        return;
    }

    if (credits < 1 || credits > 30) {
        alert("Credits must be 1 to 30");
        return;
    }

    if (gpa < 0 || gpa > 10) {
        alert("GPA must be 0 to 10");
        return;
    }

    if (future.some(f => Number(f.sem) === sem)) {
        alert("Semester already exists");
        return;
    }

    future.push({ sem, credits, gpa });

    document.getElementById("futureSem").value = "";
    document.getElementById("futureCredits").value = "";
    document.getElementById("futureGpa").value = "";

    updateUI();
}

/* DELETE FUTURE */
function deleteFuture(i) {
    future.splice(i, 1);
    updateUI();
}

/* RENDER FUTURE */
function renderFuture() {
    const list = document.getElementById("futureList");
    list.innerHTML = "";

    future.sort((a, b) => a.sem - b.sem);

    future.forEach((f, i) => {
        list.innerHTML += `
        <tr>
            <td>${f.sem}</td>
            <td>${f.credits}</td>
            <td>${f.gpa}</td>
            <td><button onclick="deleteFuture(${i})">❌</button></td>
        </tr>`;
    });
}

/* SUBJECTS DUE */
function calculateDueSubjects() {
    return subjects.filter(s => s.grade === 0).length;
}

/* UPDATE UI */
function updateUI() {
    renderSubjects();
    renderFuture();

    document.getElementById("gpa").innerText = calculateGPA().toFixed(2);
    document.getElementById("cgpa").innerText = calculateCGPA().toFixed(2);
    document.getElementById("projected").innerText = calculateCGPA().toFixed(2);
    document.getElementById("dueSubjects").innerText = calculateDueSubjects();
}

/* RESET */
function resetAll() {
    subjects = [];
    future = [];
    updateUI();
}