  const STORAGE_KEY = 'students_data';
  let students = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const form = document.getElementById('studentForm');
  const studentIdInput = document.getElementById('studentId');
  const fullNameInput = document.getElementById('fullName');
  const groupInput = document.getElementById('group');
  const emailInput = document.getElementById('email');
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const searchInput = document.getElementById('searchInput');
  const studentList = document.getElementById('studentList');
  const emptyMessage = document.getElementById('emptyMessage');

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  function renderStudents() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = students.filter(s =>
      s.fullName.toLowerCase().includes(query) ||
      s.group.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    );

    studentList.innerHTML = '';

    if (filtered.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }

    emptyMessage.style.display = 'none';

    filtered.forEach(student => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(student.fullName)}</td>
        <td>${escapeHtml(student.group)}</td>
        <td>${escapeHtml(student.email)}</td>
        <td class="actions">
          <button class="btn-edit" onclick="editStudent('${student.id}')">Изменить</button>
          <button class="btn-delete" onclick="deleteStudent('${student.id}')">Удалить</button>
        </td>
      `;
      studentList.appendChild(tr);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = studentIdInput.value;
    const studentData = {
      id: id || Date.now().toString(),
      fullName: fullNameInput.value.trim(),
      group: groupInput.value.trim(),
      email: emailInput.value.trim()
    };

    if (id) {
      students = students.map(s => s.id === id ? studentData : s);
      resetForm();
    } else {
      students.push(studentData);
      form.reset();
    }

    saveToStorage();
    renderStudents();
  });

  window.editStudent = function(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    studentIdInput.value = student.id;
    fullNameInput.value = student.fullName;
    groupInput.value = student.group;
    emailInput.value = student.email;

    submitBtn.textContent = 'Сохранить изменения';
    cancelBtn.style.display = 'inline-block';
    fullNameInput.focus();
  };

  window.deleteStudent = function(id) {
    students = students.filter(s => s.id !== id);
    if (studentIdInput.value === id) resetForm();
    saveToStorage();
    renderStudents();
  };

  function resetForm() {
    form.reset();
    studentIdInput.value = '';
    submitBtn.textContent = 'Добавить студента';
    cancelBtn.style.display = 'none';
  }

  cancelBtn.addEventListener('click', resetForm);
  searchInput.addEventListener('input', renderStudents);

  renderStudents();