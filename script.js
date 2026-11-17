let students = JSON.parse(localStorage.getItem('students')) || [];
let editIndex = null;

const form = document.getElementById('studentForm');
const list = document.getElementById('studentList');
const search = document.getElementById('searchInput');

function render() { // рендер
  list.innerHTML = '';
  const query = search.value.toLowerCase();

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    const allInfo = (student.fullName + ' ' + student.group + ' ' + student.email).toLowerCase();
    if (!allInfo.includes(query)) {
      continue;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.fullName}</td>
      <td>${student.group}</td>
      <td>${student.email}</td>
      <td>
        <button onclick="editStudent(${i})">Изменить</button>
        <button onclick="deleteStudent(${i})">Удалить</button>
      </td>
    `;

    list.append(tr);
  }
}

function save() {
  localStorage.setItem('students', JSON.stringify(students));
}

form.onsubmit = function(event) { // Добавление и сохранение
  event.preventDefault();

  const studentData = {
    fullName: document.getElementById('fullName').value,
    group: document.getElementById('group').value,
    email: document.getElementById('email').value
  };

  if (editIndex === null) {
    students.push(studentData);
  } else {
    students[editIndex] = studentData;
    editIndex = null;
  }

  form.reset();
  save();
  render();
};

function editStudent(index) { // Редакт и удаление
  const student = students[index];

  document.getElementById('fullName').value = student.fullName;
  document.getElementById('group').value = student.group;
  document.getElementById('email').value = student.email;

  editIndex = index;
}

function deleteStudent(index) {
  students.splice(index, 1);

  if (editIndex === index) {
    editIndex = null;
    form.reset();
  }

  save();
  render();
}

search.oninput = render;
render(); // рендер
