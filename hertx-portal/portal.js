// Supabase Configuration
const supabaseUrl = 'https://jazvlukzbwiaxexdwvgb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphenZsdWt6YndpYXhleGR3dmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjM3NzgsImV4cCI6MjEwNDAzOTc3OH0.Yi_Z0nsQfHEXDEZniq4fAVQceowPGuFVzQqzQ0p8HXY';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginMsg = document.getElementById('loginMsg');

const addWorkBtn = document.getElementById('addWorkBtn');
const addMsg = document.getElementById('addMsg');
const workList = document.getElementById('workList');

// Check Auth State on Load
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    showDashboard();
  } else {
    showLogin();
  }
});

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    showDashboard();
  } else {
    showLogin();
  }
});

function showLogin() {
  loginScreen.style.display = 'flex';
  dashboardScreen.style.display = 'none';
}

function showDashboard() {
  loginScreen.style.display = 'none';
  dashboardScreen.style.display = 'flex';
  fetchWorks();
}

// Login
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  loginMsg.innerText = 'Loading...';
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    loginMsg.innerText = error.message;
  } else {
    loginMsg.innerText = '';
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
});

// Fetch Works
async function fetchWorks() {
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching works:', error);
    return;
  }
  
  workList.innerHTML = '';
  if(data.length === 0) {
    workList.innerHTML = '<p style="color:#666;">No works found. Add one above or seed the database!</p>';
    
    // Add a temporary seed button if empty
    const seedBtn = document.createElement('button');
    seedBtn.className = 'cta__btn';
    seedBtn.innerText = 'Seed Initial Data';
    seedBtn.onclick = seedData;
    workList.appendChild(seedBtn);
    return;
  }
  
  data.forEach(work => {
    const row = document.createElement('div');
    row.className = 'work-row';
    row.innerHTML = `
      <div class="work-info">
        <h4>${work.title}</h4>
        <p>${work.category.toUpperCase()} | ${work.size_class}</p>
      </div>
      <button class="btn-danger" onclick="deleteWork('${work.id}')">Delete</button>
    `;
    workList.appendChild(row);
  });
}

// Add Work
addWorkBtn.addEventListener('click', async () => {
  const title = document.getElementById('workTitle').value;
  const category = document.getElementById('workCategory').value;
  const desc = document.getElementById('workDesc').value;
  const img = document.getElementById('workImg').value;
  const url = document.getElementById('workUrl').value;
  const size = document.getElementById('workSize').value;
  
  if(!title || !img) {
    addMsg.innerText = 'Title and Image URL are required!';
    addMsg.style.color = '#ff3366';
    return;
  }
  
  addMsg.innerText = 'Adding...';
  addMsg.style.color = 'var(--teal)';
  
  const { error } = await supabase
    .from('works')
    .insert([
      { title, category, description: desc, image_url: img, url, size_class: size }
    ]);
    
  if(error) {
    addMsg.innerText = error.message;
    addMsg.style.color = '#ff3366';
  } else {
    addMsg.innerText = 'Added successfully!';
    document.getElementById('workTitle').value = '';
    document.getElementById('workDesc').value = '';
    document.getElementById('workImg').value = '';
    document.getElementById('workUrl').value = '';
    fetchWorks();
    
    setTimeout(() => { addMsg.innerText = ''; }, 3000);
  }
});

// Delete Work (Global function so inline onclick works)
window.deleteWork = async (id) => {
  if(!confirm('Are you sure you want to delete this project?')) return;
  
  const { error } = await supabase
    .from('works')
    .delete()
    .eq('id', id);
    
  if(error) {
    alert('Error deleting: ' + error.message);
  } else {
    fetchWorks();
  }
};

// Seed Data
async function seedData() {
  addMsg.innerText = 'Seeding data...';
  const response = await fetch('/works_migration.json');
  const worksData = await response.json();
  
  const { error } = await supabase
    .from('works')
    .insert(worksData);
    
  if(error) {
    addMsg.innerText = 'Error seeding: ' + error.message;
    addMsg.style.color = '#ff3366';
  } else {
    addMsg.innerText = 'Seed successful!';
    fetchWorks();
  }
}
