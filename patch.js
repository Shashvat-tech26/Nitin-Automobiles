const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');

const newJS = `// ===== DATA (API) =====
  const API_URL = 'http://localhost:5000/api';
  
  let appointments = [];
  let reviews = [];
  let contacts = [];
  let services = [];
  
  // ===== INIT =====
  async function initApp() {
    await fetchData();
    setDate();
    updateDashboard();
    renderAppointments();
    renderReviews();
    renderServices();
    renderContacts();
    setDefaultDates();
  }

  async function fetchData() {
    try {
      const [aptRes, revRes, conRes, srvRes] = await Promise.all([
        fetch(API_URL + '/appointments').then(r => r.json()),
        fetch(API_URL + '/reviews').then(r => r.json()),
        fetch(API_URL + '/contact').then(r => r.json()),
        fetch(API_URL + '/services').then(r => r.json())
      ]);
      appointments = aptRes.data || [];
      reviews = revRes.data || [];
      contacts = conRes.data || [];
      services = srvRes.data || [];
    } catch (e) {
      console.error('Error fetching data', e);
      toast('Server se data load nahi ho paya!', 'red');
    }
  }

  function setDate() {
    const now = new Date();
    document.getElementById('topbar-date').textContent = now.toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    ['apt-date', 'rev-date'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = today;
    });
  }

  // ===== NAVIGATION =====
  function showPage(page, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    el.classList.add('active');
    const titles = { dashboard: 'Dashboard', appointments: 'Appointments', reviews: 'Reviews', services: 'Services', contacts: 'Contact Messages' };
    document.getElementById('page-title').textContent = titles[page] || page;
  }

  // ===== DASHBOARD =====
  function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter(a => a.date === today).length;
    const done = appointments.filter(a => a.status === 'done').length;
    const pending = appointments.filter(a => a.status === 'pending').length;

    document.getElementById('stat-today').textContent = todayApts;
    document.getElementById('stat-done').textContent = done;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-reviews').textContent = reviews.length;

    // Recent 5 appointments
    const tbody = document.getElementById('recent-appointments');
    const recent = [...appointments].slice(0, 5);
    tbody.innerHTML = recent.length ? recent.map(a => \`
      <tr>
        <td><strong>\${a.name}</strong></td>
        <td style="color:var(--muted)">\${a.car || '—'}</td>
        <td>\${a.service || '—'}</td>
        <td style="color:var(--muted)">\${fmtDate(a.date)}</td>
        <td><span class="badge badge-\${a.status}">\${statusLabel(a.status)}</span></td>
      </tr>
    \`).join('') : '<tr><td colspan="5" style="text-align:center; color:var(--muted); padding:24px;">Koi appointment nahi abhi tak</td></tr>';

    // Recent reviews
    const rtbody = document.getElementById('recent-reviews-table');
    const recentR = [...reviews].slice(0, 4);
    rtbody.innerHTML = recentR.length ? recentR.map(r => \`
      <tr>
        <td><strong>\${r.name}</strong><br><span style="font-size:12px; color:var(--muted)">\${r.location || ''}</span></td>
        <td style="color:var(--gold)">\${'★'.repeat(r.rating || r.stars || 5)}</td>
        <td style="color:var(--muted); font-size:13px;">\${(r.text || '').substring(0, 70)}\${(r.text || '').length > 70 ? '...' : ''}</td>
        <td style="color:var(--muted)">\${fmtDate(r.createdAt || r.date)}</td>
      </tr>
    \`).join('') : '<tr><td colspan="4" style="text-align:center; color:var(--muted); padding:24px;">Koi review nahi abhi tak</td></tr>';
  }

  // ===== APPOINTMENTS =====
  async function addAppointment() {
    const name = document.getElementById('apt-name').value.trim();
    const phone = document.getElementById('apt-phone').value.trim();
    if (!name) { toast('Naam daalna zaroori hai!', 'red'); return; }
    
    const apt = {
      name, phone,
      car: document.getElementById('apt-car').value.trim(),
      service: document.getElementById('apt-service').value,
      date: document.getElementById('apt-date').value,
      status: document.getElementById('apt-status').value,
      notes: document.getElementById('apt-notes').value.trim(),
    };
    
    try {
      const res = await fetch(API_URL + '/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apt)
      });
      const data = await res.json();
      if(data.success) {
        appointments.unshift(data.data);
        ['apt-name','apt-phone','apt-car','apt-notes'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('apt-service').value = '';
        document.getElementById('apt-status').value = 'pending';
        renderAppointments();
        updateDashboard();
        toast('Appointment add ho gaya! ✓');
      }
    } catch(e) {
      toast('Error saving appointment', 'red');
    }
  }

  function renderAppointments(filter = 'all') {
    const tbody = document.getElementById('appointments-table');
    let data = [...appointments];
    if (filter !== 'all') data = data.filter(a => a.status === filter);
    tbody.innerHTML = data.length ? data.map(a => \`
      <tr>
        <td><strong>\${a.name}</strong></td>
        <td><a href="tel:\${a.phone}" style="color:var(--blue); text-decoration:none;">\${a.phone || '—'}</a></td>
        <td style="color:var(--muted)">\${a.car || '—'}</td>
        <td>\${a.service || '—'}</td>
        <td style="color:var(--muted)">\${fmtDate(a.date)}</td>
        <td><span class="badge badge-\${a.status}">\${statusLabel(a.status)}</span></td>
        <td>
          <button class="action-btn success" onclick="changeStatus('\${a._id || a.id}')">Status</button>
          <button class="action-btn danger" onclick="deleteAppointment('\${a._id || a.id}')">Delete</button>
        </td>
      </tr>
    \`).join('') : \`<tr><td colspan="7" style="text-align:center; color:var(--muted); padding:24px;">Koi appointment nahi</td></tr>\`;
  }

  function filterAppointments(val) { renderAppointments(val); }

  async function changeStatus(id) {
    const apt = appointments.find(a => (a._id || a.id) === id);
    if (!apt) return;
    const order = ['pending', 'progress', 'done', 'cancelled'];
    const next = order[(order.indexOf(apt.status) + 1) % order.length];
    try {
      const res = await fetch(API_URL + '/appointments/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next })
      });
      if(res.ok) {
        apt.status = next;
        renderAppointments();
        updateDashboard();
        toast('Status update ho gaya: ' + statusLabel(next));
      }
    } catch(e) { toast('Error updating status', 'red'); }
  }

  async function deleteAppointment(id) {
    if (!confirm('Yeh appointment delete karein?')) return;
    try {
      const res = await fetch(API_URL + '/appointments/' + id, { method: 'DELETE' });
      if(res.ok) {
        appointments = appointments.filter(a => (a._id || a.id) !== id);
        renderAppointments();
        updateDashboard();
        toast('Appointment delete ho gaya!', 'red');
      }
    } catch(e) { toast('Error deleting appointment', 'red'); }
  }

  // ===== REVIEWS =====
  async function addReview() {
    const name = document.getElementById('rev-name').value.trim();
    const text = document.getElementById('rev-text').value.trim();
    if (!name || !text) { toast('Naam aur review likhna zaroori hai!', 'red'); return; }
    
    const rev = {
      name,
      location: document.getElementById('rev-location').value.trim() || 'Azamgarh, UP',
      rating: parseInt(document.getElementById('rev-stars').value),
      text
    };
    
    try {
      const res = await fetch(API_URL + '/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rev)
      });
      const data = await res.json();
      if(data.success) {
        reviews.unshift(data.data);
        ['rev-name','rev-location','rev-text'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('rev-stars').value = '5';
        renderReviews();
        updateDashboard();
        toast('Review add ho gaya! ✓');
      }
    } catch(e) { toast('Error saving review', 'red'); }
  }

  function renderReviews() {
    const container = document.getElementById('reviews-container');
    document.getElementById('review-count').textContent = \`\${reviews.length} reviews\`;
    container.innerHTML = reviews.length ? [...reviews].map(r => \`
      <div class="review-item">
        <div class="review-actions">
          <button class="action-btn danger" onclick="deleteReview('\${r._id || r.id}')">Delete</button>
        </div>
        <div class="review-stars">\${'★'.repeat(r.rating || r.stars || 5)}\${'☆'.repeat(5 - (r.rating || r.stars || 5))}</div>
        <div class="review-text-display">"\${r.text}"</div>
        <div class="review-meta"><strong>\${r.name}</strong> · \${r.location || ''} · \${fmtDate(r.createdAt || r.date)}</div>
      </div>
    \`).join('') : '<div style="padding:24px; color:var(--muted); text-align:center;">Koi review nahi abhi tak</div>';
  }

  async function deleteReview(id) {
    if (!confirm('Yeh review delete karein?')) return;
    try {
      const res = await fetch(API_URL + '/reviews/' + id, { method: 'DELETE' });
      if(res.ok) {
        reviews = reviews.filter(r => (r._id || r.id) !== id);
        renderReviews();
        updateDashboard();
        toast('Review delete ho gaya!', 'red');
      }
    } catch(e) { toast('Error deleting review', 'red'); }
  }

  // ===== SERVICES =====
  function renderServices() {
    const tbody = document.getElementById('services-table');
    tbody.innerHTML = services.map(s => \`
      <tr>
        <td><strong>\${s.name}</strong></td>
        <td style="color:var(--gold)">\${s.hindi || ''}</td>
        <td style="color:var(--muted); font-size:13px;">\${s.desc || ''}</td>
        <td><span class="badge \${s.active ? 'badge-done' : 'badge-cancelled'}">\${s.active ? 'Active' : 'Inactive'}</span></td>
        <td>
          <button class="action-btn" onclick="toggleService('\${s._id || s.id}')">\${s.active ? 'Disable' : 'Enable'}</button>
        </td>
      </tr>
    \`).join('');
  }

  async function toggleService(id) {
    try {
      const res = await fetch(API_URL + '/services/' + id + '/toggle', { method: 'PUT' });
      if(res.ok) {
        const svc = services.find(s => (s._id || s.id) === id);
        if (svc) {
          svc.active = !svc.active;
          renderServices();
          toast('Service update ho gaya! ✓');
        }
      }
    } catch(e) { toast('Error updating service', 'red'); }
  }

  // ===== CONTACTS =====
  async function addContact() {
    const name = document.getElementById('con-name').value.trim();
    const msg = document.getElementById('con-message').value.trim();
    if (!name || !msg) { toast('Naam aur message zaroori hai!', 'red'); return; }
    
    const con = {
      name,
      phone: document.getElementById('con-phone').value.trim(),
      message: msg
    };
    
    try {
      const res = await fetch(API_URL + '/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(con)
      });
      const data = await res.json();
      if(data.success) {
        contacts.unshift(data.data);
        ['con-name','con-phone','con-message'].forEach(id => document.getElementById(id).value = '');
        renderContacts();
        toast('Message save ho gaya! ✓');
      }
    } catch(e) { toast('Error saving message', 'red'); }
  }

  function renderContacts() {
    const tbody = document.getElementById('contacts-table');
    const data = [...contacts];
    tbody.innerHTML = data.length ? data.map(c => \`
      <tr>
        <td><strong>\${c.name}</strong></td>
        <td><a href="tel:\${c.phone}" style="color:var(--blue); text-decoration:none;">\${c.phone || '—'}</a></td>
        <td style="color:var(--muted); font-size:13px;">\${c.message}</td>
        <td style="color:var(--muted)">\${fmtDate(c.createdAt || c.date)}</td>
        <td>
          <button class="action-btn danger" onclick="deleteContact('\${c._id || c.id}')">Delete</button>
          \${c.phone ? \`<a href="https://wa.me/91\${c.phone.replace(/\\D/g,'')}" target="_blank" class="action-btn success" style="text-decoration:none;">WhatsApp</a>\` : ''}
        </td>
      </tr>
    \`).join('') : '<tr><td colspan="5" style="text-align:center; color:var(--muted); padding:24px;">Koi message nahi abhi tak</td></tr>';
  }

  async function deleteContact(id) {
    if (!confirm('Yeh message delete karein?')) return;
    try {
      const res = await fetch(API_URL + '/contact/' + id, { method: 'DELETE' });
      if(res.ok) {
        contacts = contacts.filter(c => (c._id || c.id) !== id);
        renderContacts();
        toast('Message delete ho gaya!', 'red');
      }
    } catch(e) { toast('Error deleting contact', 'red'); }
  }

  // ===== HELPERS =====
  function statusLabel(s) {
    return { pending: 'Pending', progress: 'In Progress', done: 'Done', cancelled: 'Cancelled' }[s] || s;
  }

  function fmtDate(d) {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch(e) { return d; }
  }

  function toast(msg, type = 'green') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = type === 'red' ? 'var(--red)' : 'var(--green)';
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 2500);
  }
</script>
</body>
</html>`;

const splitIdx = html.indexOf('// ===== DATA (localStorage) =====');
if (splitIdx > -1) {
  const newHtml = html.substring(0, splitIdx) + newJS;
  fs.writeFileSync('admin.html', newHtml);
  console.log('Successfully patched admin.html');
} else {
  console.log('Could not find split point');
}
