// ----------------- NAVIGATION -----------------
function hideAll() {
  document.querySelectorAll('section').forEach(s => {
    s.classList.add('hidden');   // hide all sections
    s.classList.remove('active'); // remove active
  });
}

function showLoginPage() {
  hideAll();
  const login = document.getElementById('loginPage');
  login.classList.remove('hidden');
  login.classList.add('active');
}

function showRegisterPage() {
  hideAll();
  const register = document.getElementById('registerPage');
  register.classList.remove('hidden');
  register.classList.add('active');
}

function showTerminalDashboard() {
  hideAll();
  const terminal = document.getElementById('terminalDashboard');
  terminal.classList.remove('hidden');
  terminal.classList.add('active');

  const terminalLines = document.getElementById('terminalLines');
  terminalLines.innerHTML = '';

  const lines = [
    '================== SYSTEM TERMINAL ==================',
    `User: ${window.currentUser.username}`,
    `Login Time: ${new Date().toLocaleString()}`,
    'Type "help" for available commands',
    '===================================================='
  ];

  lines.forEach((text, i) => {
    const line = document.createElement('div');
    line.textContent = text;
    line.classList.add('terminal-line');
    setTimeout(() => terminalLines.appendChild(line), i * 200);
  });
}

const parentElement = document.getElementById('myContainer');
const terminalText = document.createElement('input');

 const outputDiv = document.createElement('div');
  outputDiv.className = "dText"
  outputDiv.setAttribute('id', 'output');
  parentElement.appendChild(outputDiv);

const storedValues = [];


terminalText.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const value = terminalText.value.trim();
    if (value !== "") {
      storedValues.push(value); // store the value
      terminalText.value = ""; // clear input
      displayValues(); // update UI
    }
  }
});

function displayValues() {
  outputDiv.innerHTML = "<b> </b><br>" + storedValues.join("<br>");
}


    terminalText.setAttribute('type', 'text');
    terminalText.setAttribute('id', 'terminalText');
    terminalText.setAttribute('placeholder', 'Enter text here');

    parentElement.appendChild(terminalText);

 

function showAdminPanel() {
  hideAll();
  const admin = document.getElementById('adminPanel');
  admin.classList.remove('hidden');
  admin.classList.add('active');
  loadUsers();
}

function goBack() {
  hideAll();
  const landing = document.getElementById('landingPage');
  landing.classList.add('active');
  landing.classList.remove('hidden');
}

// ----------------- REGISTER -----------------
async function registerUser(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!username || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    alert(data.message || data.error);

    if (data.message && data.message.includes('Admin')) {
      window.currentUser = { username, isAdmin: true };
      showAdminPanel();
    } else if (!data.error) goBack();
  } catch (err) {
    console.error(err);
    alert("Registration failed.");
  }
}

// ----------------- LOGIN -----------------
async function loginUser(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    window.currentUser = data.user;
    if (data.user.isAdmin) showAdminPanel();
    else showTerminalDashboard();
  } catch (err) {
    console.error(err);
    alert("Login failed.");
  }
}

// ----------------- ADMIN PANEL -----------------
async function loadUsers() {
  try {
    const res = await fetch('/api/users');
    const users = await res.json();
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.filter(u => !u.isAdmin).forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.status}</td>
        <td>
          ${user.status === 'pending' ? `
            <button onclick="updateStatus('${user.id}', 'approved')">Approve</button>
            <button onclick="updateStatus('${user.id}', 'denied')">Deny</button>
          ` : `<button onclick="updateStatus('${user.id}', 'banned')">Ban</button>
               <button onclick="updateStatus('${user.id}', 'approved')">unban</button>`
          }
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load users.");
  }
}

async function updateStatus(id, status) {
  try {
    await fetch(`/api/users/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadUsers();
  } catch (err) {
    console.error(err);
    alert("Failed to update user status.");
  }
}

// ----------------- LOGOUT -----------------
function logout() {
  window.currentUser = null;
  goBack();
}
