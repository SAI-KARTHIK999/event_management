/* =========================================
   GFG CLUB — script.js
   ========================================= */

(function () {
  'use strict';

  var API_BASE = 'http://localhost:3000';

  /* =========================================
     DARK MODE TOGGLE
     ========================================= */
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon      = document.getElementById('themeIcon');
  const htmlEl         = document.documentElement;

  const savedTheme = localStorage.getItem('gfg-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('gfg-theme', next);
    });
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    }
  }

  /* =========================================
     GLOBAL NAVBAR AUTH STATE & AUTO-REDIRECT
     ========================================= */
  function syncAuthState() {
    const token = localStorage.getItem('gfg-token');
    const pathname = window.location.pathname;
    const isAuthPage = pathname.endsWith('login.html') || pathname.endsWith('signup.html');
    
    if (token) {
      if (isAuthPage) {
        window.location.replace('dashboard.html');
        return;
      }
      const loginLink = document.querySelector('a.btn-login[href="login.html"]');
      const signupLink = document.querySelector('a.btn-signup[href="signup.html"]');
      
      if (loginLink) {
        const li = loginLink.closest('li');
        if (li) {
          li.classList.add('dropdown');
          li.innerHTML = `
            <a class="nav-link nav-link-custom dropdown-toggle d-flex align-items-center gap-2" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="padding: 0.25rem 0.5rem;">
               <div class="rounded-circle d-flex justify-content-center align-items-center" style="width: 32px; height: 32px; background: var(--green-light); color: var(--green-primary); font-weight: 600;">
                 <i class="bi bi-person-fill"></i>
               </div>
               <span class="d-none d-lg-block fw-medium">Profile</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="profileDropdown" style="background:var(--card-bg); margin-top:0.5rem; border-radius:0.75rem;">
              <li><h6 class="dropdown-header text-muted">My Account</h6></li>
              <li><a class="dropdown-item py-2" href="dashboard.html"><i class="bi bi-speedometer2 me-2 text-primary"></i> Dashboard</a></li>
              <li><a class="dropdown-item py-2" href="#"><i class="bi bi-gear me-2 text-secondary"></i> Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item py-2 text-danger" href="#" id="globalSignOutBtn"><i class="bi bi-box-arrow-right me-2"></i> Sign Out</a></li>
            </ul>
          `;
          
          setTimeout(() => {
            const btn = document.getElementById('globalSignOutBtn');
            if (btn) {
              btn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('gfg-token');
                localStorage.removeItem('gfg-role');
                localStorage.removeItem('gfg-user');
                window.location.href = 'login.html';
              });
            }
          }, 0);
        }
      }
      if (signupLink && signupLink.parentElement) {
        signupLink.parentElement.style.display = 'none';
      }
    }
  }
  document.addEventListener('DOMContentLoaded', syncAuthState);
  syncAuthState(); // Run immediately in case script is loaded at end of body

  /* =========================================
     ACTIVE NAV LINK
     ========================================= */
  const navLinks = document.querySelectorAll('.nav-link-custom');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (l) { l.classList.remove('active-nav'); });
      this.classList.add('active-nav');
    });
  });

  /* =========================================
     STAT COUNTER ANIMATION (index.html only)
     ========================================= */
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
          const suffix = el.textContent.replace(/[0-9]/g, '');
          let current  = 0;
          const step   = Math.ceil(target / 60);
          const timer  = setInterval(function () {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 20);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  animateCounters();

  /* =========================================
     PASSWORD VISIBILITY TOGGLE
     ========================================= */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.pw-toggle');
    if (!btn) return;
    const targetId = btn.getAttribute('data-target');
    const input    = document.getElementById(targetId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type       = isPassword ? 'text' : 'password';
    const icon       = btn.querySelector('i');
    if (icon) {
      icon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
    }
  });

  /* =========================================
     ROLE TOGGLE (signup & login pages)
     ========================================= */
  function initRoleToggle(toggleId, formMap) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;

    const btns = toggle.querySelectorAll('.role-btn');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const role = btn.getAttribute('data-role');

        Object.keys(formMap).forEach(function (key) {
          const form = document.getElementById(formMap[key]);
          if (!form) return;
          if (key === role) {
            form.classList.remove('d-none');
            clearFormErrors(form);
          } else {
            form.classList.add('d-none');
            clearFormErrors(form);
          }
        });
      });
    });
  }

  initRoleToggle('signupRoleToggle', {
    participant: 'participantSignupForm',
    admin:       'adminSignupForm'
  });

  initRoleToggle('loginRoleToggle', {
    participant: 'participantLoginForm',
    admin:       'adminLoginForm'
  });

  /* =========================================
     FORM VALIDATION HELPERS
     ========================================= */
  function clearFormErrors(form) {
    form.querySelectorAll('.form-input').forEach(function (input) {
      input.classList.remove('is-invalid');
    });
    form.querySelectorAll('.invalid-feedback-custom').forEach(function (el) {
      el.classList.remove('visible');
    });
  }

  function validateField(input) {
    const wrapper  = input.closest('[class*="col-"]');
    const feedback = wrapper ? wrapper.querySelector('.invalid-feedback-custom') : null;
    let   valid    = true;

    if (input.hasAttribute('required') && !input.value.trim()) {
      valid = false;
    } else if (input.type === 'email' && input.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(input.value.trim())) valid = false;
    } else if (input.type === 'tel' && input.value.trim()) {
      const telRe = /^\+?[\d\s\-()]{7,15}$/;
      if (!telRe.test(input.value.trim())) valid = false;
    }

    if (!valid) {
      input.classList.add('is-invalid');
      if (feedback) feedback.classList.add('visible');
    } else {
      input.classList.remove('is-invalid');
      if (feedback) feedback.classList.remove('visible');
    }

    return valid;
  }

  function validateForm(form) {
    let allValid = true;
    form.querySelectorAll('.form-input').forEach(function (input) {
      if (input.offsetParent !== null) {
        if (!validateField(input)) allValid = false;
      }
    });
    return allValid;
  }

  document.addEventListener('blur', function (e) {
    if (e.target.classList.contains('form-input')) {
      validateField(e.target);
    }
  }, true);

  /* =========================================
     FORM SUBMIT — collect & log payload
     ========================================= */
  function collectFormData(form) {
    const data = {};
    form.querySelectorAll('.form-input').forEach(function (input) {
      if (!input.name) return;
      if (input.tagName === 'SELECT') {
        data[input.name] = input.value ? parseInt(input.value, 10) || input.value : '';
      } else if (input.type === 'password') {
        data[input.name] = input.value;
      } else {
        data[input.name] = input.value.trim();
      }
    });
    return data;
  }

  function showToast(message, type) {
    const toastEl  = document.getElementById('successToast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toastEl || !toastMsg) return;

    toastMsg.textContent = message;
    toastEl.className    = 'toast align-items-center border-0 ' +
      (type === 'error' ? 'text-bg-danger' : 'text-bg-success');

    const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
    bsToast.show();
  }

  /* =========================================
     BUTTON LOADING STATE
     ========================================= */
  function setButtonLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Please wait…';
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || btn.textContent;
    }
  }

  /* =========================================
     STORE AUTH (JWT + profile to localStorage)
     ========================================= */
  function storeAuth(tokenObj, profile, role) {
    localStorage.setItem('gfg-token', tokenObj.token);
    localStorage.setItem('gfg-role', role);
    localStorage.setItem('gfg-user', JSON.stringify(profile));
  }

  /* =========================================
     API POST HELPER
     ========================================= */
  function apiPost(endpoint, payload) {
    return fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(function (res) {
      return res.json().then(function (data) {
        data._ok = res.ok;
        return data;
      });
    });
  }

  /* =========================================
     SIGNUP — PARTICIPANT  →  POST /users/register
     ========================================= */
  (function () {
    var form = document.getElementById('participantSignupForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) {
        showToast('Please fill in all required fields correctly.', 'error');
        return;
      }
      var btn = form.querySelector('[type="submit"]');
      setButtonLoading(btn, true);
      apiPost('/users/register', collectFormData(form))
        .then(function (data) {
          if (data._ok) {
            showToast('Account created! Redirecting to login…', 'success');
            setTimeout(function () { window.location.href = 'login.html'; }, 1500);
          } else {
            showToast((data.error && data.error.message) ? data.error.message : 'Registration failed. Please try again.', 'error');
          }
        })
        .catch(function () {
          showToast('Network error. Please check your connection.', 'error');
        })
        .finally(function () {
          setButtonLoading(btn, false);
        });
    });
  }());

  /* =========================================
     SIGNUP — ADMIN  →  POST /admin/onboard
     ========================================= */
  (function () {
    var form = document.getElementById('adminSignupForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) {
        showToast('Please fill in all required fields correctly.', 'error');
        return;
      }
      var btn = form.querySelector('[type="submit"]');
      setButtonLoading(btn, true);
      apiPost('/admin/onboard', collectFormData(form))
        .then(function (data) {
          if (data._ok) {
            showToast('Admin account created! Redirecting to login…', 'success');
            setTimeout(function () { window.location.href = 'login.html'; }, 1500);
          } else {
            showToast((data.error && data.error.message) ? data.error.message : 'Onboarding failed. Please try again.', 'error');
          }
        })
        .catch(function () {
          showToast('Network error. Please check your connection.', 'error');
        })
        .finally(function () {
          setButtonLoading(btn, false);
        });
    });
  }());

  /* =========================================
     LOGIN — PARTICIPANT  →  POST /users/login
     ========================================= */
  (function () {
    var form = document.getElementById('participantLoginForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) {
        showToast('Please fill in all required fields correctly.', 'error');
        return;
      }
      var btn = form.querySelector('[type="submit"]');
      setButtonLoading(btn, true);
      apiPost('/users/login', collectFormData(form))
        .then(function (data) {
          if (data._ok) {
            storeAuth(data.data.token, data.data.user, 'user');
            showToast('Logged in! Redirecting…', 'success');
            setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
          } else {
            showToast((data.error && data.error.message) ? data.error.message : 'Login failed. Check your credentials.', 'error');
          }
        })
        .catch(function () {
          showToast('Network error. Please check your connection.', 'error');
        })
        .finally(function () {
          setButtonLoading(btn, false);
        });
    });
  }());

  /* =========================================
     LOGIN — ADMIN  →  POST /admin/login
     ========================================= */
  (function () {
    var form = document.getElementById('adminLoginForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) {
        showToast('Please fill in all required fields correctly.', 'error');
        return;
      }
      var btn = form.querySelector('[type="submit"]');
      setButtonLoading(btn, true);
      apiPost('/admin/login', collectFormData(form))
        .then(function (data) {
          if (data._ok) {
            storeAuth(data.data.token, data.data.admin, 'admin');
            showToast('Logged in! Redirecting…', 'success');
            setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
          } else {
            showToast((data.error && data.error.message) ? data.error.message : 'Login failed. Check your credentials.', 'error');
          }
        })
        .catch(function () {
          showToast('Network error. Please check your connection.', 'error');
        })
        .finally(function () {
          setButtonLoading(btn, false);
        });
    });
  }());

  /* =========================================
     DASHBOARD LOGIC (Admin & User)
     ========================================= */
  window.initDashboard = function() {
    // Determine Role
    const role = localStorage.getItem('gfg-role') || 'user';
    const userJson = localStorage.getItem('gfg-user');
    let user = {};
    try { user = JSON.parse(userJson || '{}'); } catch(e) {}
    
    // Seed dummy events if empty
    if (!localStorage.getItem('gfg-events')) {
      const dummyEvents = [
        { id: 'ev_'+Date.now(), title: 'React Workshop', desc: 'Learn React hooks and context API.', date: '2026-04-10T10:00', location: 'Lab 1', max: 50 },
        { id: 'ev_'+(Date.now()+1), title: 'Hackathon 2026', desc: 'Annual coding competition.', date: '2026-05-15T09:00', location: 'Main Auditorium', max: 200 }
      ];
      localStorage.setItem('gfg-events', JSON.stringify(dummyEvents));
    }
    if (!localStorage.getItem('gfg-regs')) {
      localStorage.setItem('gfg-regs', JSON.stringify([]));
    }

    if (role === 'admin') {
      document.getElementById('adminView').classList.remove('d-none');
      const heading = document.getElementById('adminWelcomeHeading');
      if (heading) heading.textContent = 'Welcome, ' + (user.fullName || user.FullName || 'Admin') + '!';
      initAdminDashboard();
    } else {
      document.getElementById('userView').classList.remove('d-none');
      const heading = document.getElementById('userWelcomeHeading');
      if (heading) heading.textContent = 'Welcome, ' + (user.fullName || user.FullName || 'Participant') + '!';
      // Pre-fill registration form from profile
      var regEmail = document.getElementById('regEmail');
      var regFullName = document.getElementById('regFullName');
      if (regEmail && user.email) regEmail.value = user.email;
      if (regFullName && (user.fullName || user.FullName)) regFullName.value = (user.fullName || user.FullName);
      initUserDashboard();
    }
  };

  // -------------------------
  // USER DASHBOARD
  // -------------------------
  function initUserDashboard() {
    window.showUserEvents = function() {
      document.getElementById('userEventsView').classList.remove('d-none');
      document.getElementById('userRegistrationView').classList.add('d-none');
      renderUserEvents();
    };

    window.openRegistration = function(eventId, eventTitle) {
      document.getElementById('userEventsView').classList.add('d-none');
      document.getElementById('userRegistrationView').classList.remove('d-none');
      document.getElementById('regEventId').value = eventId;
      document.getElementById('regEventName').textContent = eventTitle;
    };

    const regForm = document.getElementById('eventRegistrationForm');
    if (regForm) {
      regForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const eventId = document.getElementById('regEventId').value;
        const eventName = document.getElementById('regEventName').textContent;
        const btn = document.getElementById('btnConfirmReg');

        const fullName = document.getElementById('regFullName').value.trim();
        const usn = document.getElementById('regUSN').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const branch = document.getElementById('regBranch').value.trim();
        const phone = document.getElementById('regPhone').value.trim();

        if (!fullName || !usn || !email || !branch || !phone) {
          showToast('Please fill in all fields.', 'error');
          return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processing...';

        try {
          const response = await fetch(`${API_BASE}/events/${eventId}/public-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, usn, email, branch, phone })
          });
          
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error?.message || result.message || 'Registration failed');
          }
          
          showToast(`Successfully registered for ${eventName}!`, 'success');
          regForm.reset();
          
          // Refresh user events to show updated capacity
          renderUserEvents();
          
          // If admin dashboard is active, refresh stats too
          const adminStatsEl = document.getElementById('statTotalRegs');
          if (adminStatsEl && document.getElementById('adminView').classList.contains('d-none') === false) {
            renderAdminDashboardStats();
          }
          
          showUserEvents();
        } catch (error) {
          showToast(error.message, 'error');
        } finally {
          btn.disabled = false;
          btn.textContent = 'Confirm Registration';
        }
      });
    }

    renderUserEvents();
  }

  async function renderUserEvents() {
    const grid = document.getElementById('userEventsGrid');
    if (!grid) return;
    const token = localStorage.getItem('gfg-token');
    
    grid.innerHTML = '<div class="col-12 text-center py-5"><span class="spinner-border text-green"></span></div>';

    try {
      // Fetch only published and open events for users
      const response = await fetch(`${API_BASE}/events?isPublished=true`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error?.message || result.message || 'Failed to load events');
      
      const events = Array.isArray(result.data) ? result.data : (result.data?.events || []);
      grid.innerHTML = '';

      if (events.length === 0) {
        grid.innerHTML = '<div class="col-12"><div class="alert alert-info border-0" style="background:var(--card-bg); color:var(--text-dark);">No events available right now.</div></div>';
        return;
      }

      events.forEach(function(ev) {
        const count = ev.CurrentRegistrations ? parseInt(ev.CurrentRegistrations, 10) : 0;
        const max = ev.MaxSlots ? parseInt(ev.MaxSlots, 10) : 0;
        const isFull = count >= max;
        const dateStr = new Date(ev.StartTime).toLocaleString(undefined, {
          year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'
        });

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 d-flex align-items-stretch';
        col.innerHTML = `
          <div class="event-card w-100">
            <h4 class="event-card-title">${ev.EventName}</h4>
            <div class="event-card-meta">
              <span><i class="bi bi-calendar3 text-green me-1"></i> ${dateStr}</span>
            </div>
            <div class="event-card-meta mt-0 mb-2">
              <span><i class="bi bi-geo-alt text-green me-1"></i> ${ev.VenueName || 'Online'}</span>
            </div>
            <div class="event-card-desc" title="${(ev.Description || '').replace(/"/g, '&quot;')}">${ev.Description || ''}</div>
            <div class="event-card-footer">
              <span class="fs-6 fw-bold ${isFull ? 'text-danger' : 'text-muted'}">${count} / ${max}</span>
              <button class="btn ${isFull ? 'btn-secondary disabled' : 'btn-signup px-3 py-2'}"
                style="${isFull ? 'cursor:not-allowed; opacity:0.7;' : ''}"
                onclick="${isFull ? '' : `openRegistration('${ev.EventID}', '${(ev.EventName || '').replace(/'/g,"\\'").replace(/"/g,"&quot;")}')`}">
                ${isFull ? 'Sold Out' : 'Register'}
              </button>
            </div>
          </div>
        `;
        grid.appendChild(col);
      });
    } catch (error) {
      grid.innerHTML = `<div class="col-12"><div class="alert alert-danger">${error.message}</div></div>`;
    }
  }

  // -------------------------
  // ADMIN DASHBOARD
  // -------------------------
  function initAdminDashboard() {
    const navLinks = document.querySelectorAll('.admin-nav-link');
    const panels = document.querySelectorAll('.admin-panel');

    // Tab Switching
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        
        // Update tabs
        navLinks.forEach(function(l) { l.classList.remove('active'); });
        this.classList.add('active');
        
        // Update panels
        panels.forEach(function(p) {
          if(p.id === targetId) p.classList.remove('d-none');
          else p.classList.add('d-none');
        });

        if (targetId === 'adminDashboardState') renderAdminDashboardStats();
        if (targetId === 'adminManageEventsState') renderAdminEventsTable();
        if (targetId === 'adminRegistrationsState') renderAdminRegsTable();
        
        // Reset creating state if navigating to Create
        if (targetId === 'adminCreateEventState' && document.getElementById('createEventSectionTitle').textContent !== 'Edit Event') {
          document.getElementById('adminEventForm').reset();
          document.getElementById('eventEditId').value = '';
        }
      });
    });

    // Populate filter dropdown and add event listeners
    const elFilter = document.getElementById('adminRegFilter');
    if (elFilter) {
      elFilter.addEventListener('change', renderAdminRegsTable);
    }
    const btnCsv = document.getElementById('btnDownloadCSV');
    if (btnCsv) {
      btnCsv.addEventListener('click', function(e){ e.preventDefault(); downloadRegistrations('csv'); });
    }
    const btnPdf = document.getElementById('btnDownloadPDF');
    if (btnPdf) {
      btnPdf.addEventListener('click', function(e){ e.preventDefault(); downloadRegistrations('pdf'); });
    }

    // Default venues data - will be created if they don't exist
    const DEFAULT_VENUES = [
      { VenueName: 'CSE Block', Location: 'Computer Science Department', Capacity: 200 },
      { VenueName: 'Birla Auditorium', Location: 'Main Building', Capacity: 500 },
      { VenueName: 'Media Center', Location: 'Communication Building', Capacity: 150 }
    ];

    // Initialize default venues if they don't exist
    async function initializeDefaultVenues() {
      try {
        const token = localStorage.getItem('gfg-token');
        const res = await fetch(`${API_BASE}/events/venues/all`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        
        if (!res.ok || !data.data || data.data.length === 0) {
          // Create default venues
          for (const venue of DEFAULT_VENUES) {
            try {
              await fetch(`${API_BASE}/events/venues`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(venue)
              });
            } catch (err) {
              console.log('Venue creation failed:', venue.VenueName, err);
            }
          }
          // Reload venues after creation
          setTimeout(loadVenues, 1000);
        } else {
          loadVenues();
        }
      } catch (err) {
        console.error('Failed to initialize venues:', err);
        // Try to load venues anyway
        loadVenues();
      }
    }

    // Fetch and populate Venue List
    async function loadVenues() {
      const datalist = document.getElementById('venueList');
      if (!datalist) return;
      try {
        const token = localStorage.getItem('gfg-token');
        const res = await fetch(`${API_BASE}/events/venues/all`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.data) {
          window.adminAvailableVenues = data.data;
          datalist.innerHTML = '';
          data.data.forEach(v => {
            datalist.innerHTML += `<option value="${v.VenueName}">Max Capacity: ${v.Capacity}</option>`;
          });
        }
      } catch (err) {
        console.error('Failed to load venues', err);
      }
    }

    // Initialize venues on page load
    initializeDefaultVenues();

    // Form submission
    const form = document.getElementById('adminEventForm');
    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const editId = document.getElementById('eventEditId').value;
        const title = document.getElementById('evTitle').value.trim();
        let desc = document.getElementById('evDesc').value.trim();
        const dateStr = document.getElementById('evDate').value;
        const locationStr = document.getElementById('evLocation').value.trim();
        const maxSlots = document.getElementById('evMax').value;
        const btnSave = document.getElementById('btnSaveEvent');
        
        if (!title) {
           showToast('Please enter an event title.', 'error');
           return;
        }
        if (!dateStr) {
           showToast('Please select a date and time.', 'error');
           return;
        }
        if (!locationStr) {
           showToast('Please enter a location.', 'error');
           return;
        }
        if (!maxSlots) {
           showToast('Please enter maximum participants.', 'error');
           return;
        }

        // Find matching venue or use default
        let venueID = 1; // Default to CSE Block
        if (window.adminAvailableVenues && window.adminAvailableVenues.length > 0) {
           const match = window.adminAvailableVenues.find(v => v.VenueName.toLowerCase() === locationStr.toLowerCase());
           if (match) {
             venueID = match.VenueID;
           }
        }

        const startTimeMs = new Date(dateStr).getTime();
        const payload = {
          eventName: title,
          description: desc,
          startTime: new Date(startTimeMs).toISOString(),
          endTime: new Date(startTimeMs + 2 * 60 * 60 * 1000).toISOString(), // auto-add config default 2 hrs
          venueID: venueID,
          maxSlots: parseInt(maxSlots, 10),
          registrationFee: 0,
          status: 'Open'
        };

        try {
          btnSave.disabled = true;
          btnSave.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
          const token = localStorage.getItem('gfg-token');
          
          let response;
          if (editId) {
            response = await fetch(`${API_BASE}/events/${editId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(payload)
            });
          } else {
            response = await fetch(`${API_BASE}/events`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(payload)
            });
          }
          
          const result = await response.json();
          if (!response.ok) throw new Error(result.error?.message || result.message || 'Failed to save event');

          // If creating a new event, publish it immediately for simplicity!
          if (!editId) {
             await fetch(`${API_BASE}/events/${result.data.EventID}/publish`, {
               method: 'POST',
               headers: { 'Authorization': `Bearer ${token}` }
             });
          }

          showToast(editId ? 'Event updated successfully.' : 'Event created successfully!', 'success');
          form.reset();
          cancelEditEvent(); // Reset form to create mode
          
          // Refresh dashboard stats in real-time
          renderAdminDashboardStats();
          
          document.querySelector('[data-target="adminManageEventsState"]').click();
        } catch (error) {
          showToast(error.message, 'error');
        } finally {
          btnSave.disabled = false;
          btnSave.textContent = editId ? 'Save Changes' : 'Create Event';
        }
      });
    }

    renderAdminDashboardStats();

    // Auto-refresh dashboard stats every 30 seconds
    setInterval(() => {
      // Only refresh if dashboard tab is active
      if (!document.getElementById('adminDashboardState').classList.contains('d-none')) {
        renderAdminDashboardStats();
      }
    }, 30000);

    // Attach global functions for inline onclick in tables
    window.editEventAdmin = function(id) {
      const events = window.adminEventsData || [];
      const target = events.find(function(ev) { return String(ev.EventID) === String(id); });
      if (!target) return;
      
      document.getElementById('createEventSectionTitle').textContent = 'Edit Event';
      document.getElementById('navCreateEventText').textContent = 'Edit Event';
      document.getElementById('btnSaveEvent').textContent = 'Update Event';
      document.getElementById('btnCancelEdit').classList.remove('d-none');
      
      // format datetime for datetime-local input
      const isoLocal = new Date(target.StartTime).toISOString().slice(0, 16);
      
      document.getElementById('eventEditId').value = target.EventID;
      document.getElementById('evTitle').value = target.EventName;
      document.getElementById('evDesc').value = target.Description;
      document.getElementById('evDate').value = isoLocal;
      document.getElementById('evLocation').value = target.VenueName || '';
      document.getElementById('evMax').value = target.MaxSlots;
      
      document.querySelector('[data-target="adminCreateEventState"]').click();
    };

    window.deleteEventAdmin = async function(id) {
      if(!confirm('Are you sure you want to delete this event? Valid registrations will also be removed.')) return;
      
      const token = localStorage.getItem('gfg-token');
      try {
        const response = await fetch(`${API_BASE}/events/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        
        // Sometimes backend throws a specific event deletion dependency error
        if (result.error && result.error.message.includes("published event. Please unpublish it first")) {
           // Auto-unpublish then delete!
           await fetch(`${API_BASE}/events/${id}/unpublish`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
           const retry = await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
           if (!retry.ok) throw new Error('Failed to delete even after unpublishing.');
        } else if (!response.ok) {
           throw new Error(result.error?.message || result.message || 'Failed to delete event');
        }
        
        showToast('Event deleted.', 'success');
        renderAdminEventsTable();
        renderAdminDashboardStats();
      } catch (err) {
        showToast(err.message, 'error');
      }
    };

    window.cancelEditEvent = function() {
      document.getElementById('createEventSectionTitle').textContent = 'Create New Event';
      document.getElementById('navCreateEventText').textContent = 'Create Event';
      document.getElementById('btnSaveEvent').textContent = 'Create Event';
      document.getElementById('btnCancelEdit').classList.add('d-none');
      document.getElementById('eventEditId').value = '';
      document.getElementById('adminEventForm').reset();
    };
  }

  async function renderAdminDashboardStats() {
    const elEvents = document.getElementById('statTotalEvents');
    const elRegs = document.getElementById('statTotalRegs');
    try {
      const token = localStorage.getItem('gfg-token');
      const res = await fetch(`${API_BASE}/events`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if(res.ok) {
        const events = Array.isArray(data.data) ? data.data : (data.data?.events || []);
        if(elEvents) elEvents.textContent = events.length;
        let totalRegs = 0;
        events.forEach(ev => totalRegs += parseInt(ev.CurrentRegistrations || 0, 10));
        if(elRegs) elRegs.textContent = totalRegs;
      }
    } catch(err) {
      console.error(err);
    }
  }

  async function renderAdminEventsTable() {
    const tbody = document.getElementById('adminEventsTbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-green"><span class="spinner-border spinner-border-sm"></span></td></tr>';
    
    try {
      const token = localStorage.getItem('gfg-token');
      const res = await fetch(`${API_BASE}/events`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message);
      
      const events = Array.isArray(data.data) ? data.data : (data.data?.events || []);
      tbody.innerHTML = '';
      if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted border-0">No events found.</td></tr>';
        return;
      }

      window.adminEventsData = events;

      events.forEach(function(ev) {
        const count = ev.CurrentRegistrations || 0;
        const dateStr = new Date(ev.StartTime).toLocaleString(undefined, {
          year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'
        });
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="fw-bold" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:200px;" title="${(ev.EventName || '').replace(/"/g, '&quot;')}">${ev.EventName}</td>
          <td style="white-space:nowrap;">${dateStr}</td>
          <td style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:150px;" title="${(ev.VenueName || '').replace(/"/g, '&quot;')}">${ev.VenueName || 'TBA'}</td>
          <td>${count}/${ev.MaxSlots}</td>
          <td class="text-end pe-4" style="white-space:nowrap;">
            <button class="btn btn-sm" style="background:var(--green-light); color:var(--green-primary); margin-right:4px;" onclick="editEventAdmin('${ev.EventID}')"><i class="bi bi-pencil"></i> Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteEventAdmin('${ev.EventID}')"><i class="bi bi-trash"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-danger border-0">${err.message}</td></tr>`;
    }
  }

  async function renderAdminRegsTable() {
    const tbody = document.getElementById('adminRegsTbody');
    const filterEl = document.getElementById('adminRegFilter');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-green"><span class="spinner-border spinner-border-sm"></span> Loading registrations...</td></tr>';
    
    try {
      const token = localStorage.getItem('gfg-token');
      
      // Populate dropdown if empty
      if (filterEl && filterEl.options.length <= 1) {
        if (!window.adminEventsData) {
          const evRes = await fetch(`${API_BASE}/events`, { headers: { 'Authorization': `Bearer ${token}` } });
          const evData = await evRes.json();
          window.adminEventsData = Array.isArray(evData.data) ? evData.data : (evData.data?.events || []);
        }
        window.adminEventsData.forEach(function(ev) {
          const opt = document.createElement('option');
          opt.value = ev.EventID;
          opt.textContent = ev.EventName;
          filterEl.appendChild(opt);
        });
      }

      const selectedEventId = filterEl ? filterEl.value : 'ALL';
      let eventDict = {};
      (window.adminEventsData || []).forEach(ev => eventDict[ev.EventID] = ev.EventName);

      // Fetch public registrations from dedicated endpoint
      let url = `${API_BASE}/events/public-registrations`;
      if (selectedEventId !== 'ALL') {
        url += `?eventId=${selectedEventId}`;
      }
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      let regs = [];
      if (res.ok && data.data) {
        regs = (Array.isArray(data.data) ? data.data : []).map(r => ({
          ...r,
          EventName: r.EventName || eventDict[r.EventID] || 'Unknown Event'
        }));
      }

      window.adminCurrentRegsData = regs;
      tbody.innerHTML = '';

      if (regs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted border-0">No registrations found.</td></tr>';
        return;
      }

      regs.sort(function(a,b) { return new Date(b.RegisteredAt) - new Date(a.RegisteredAt); }).forEach(function(r) {
        const dateStr = new Date(r.RegisteredAt).toLocaleDateString();
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="fw-bold">${r.FullName || 'N/A'}</td>
          <td><a href="mailto:${r.Email}" class="text-green text-decoration-none">${r.Email || 'N/A'}</a></td>
          <td>${r.Phone || 'N/A'}</td>
          <td>${r.USN || '-'}</td>
          <td>${r.Branch || '-'}</td>
          <td style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:200px;" title="${(r.EventName || '').replace(/"/g, '&quot;')}">${r.EventName}</td>
          <td>${dateStr}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch(err) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger border-0">${err.message}</td></tr>`;
    }
  }

  // -------------------------
  // DOWNLOAD REGISTRATIONS (CSV & PDF)
  // -------------------------
  window.downloadRegistrations = function(format) {
    let regs = window.adminCurrentRegsData || [];
    
    if (regs.length === 0) {
      showToast('No registrations to download.', 'error');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'USN', 'Event Name', 'Registered At', 'Status'];
    
    if (format === 'csv') {
      const csvRows = [];
      csvRows.push(headers.join(','));
      
      regs.forEach(function(r) {
        const row = [
          '"' + (r.FullName || '').replace(/"/g, '""') + '"',
          '"' + (r.Email || '').replace(/"/g, '""') + '"',
          '"' + (r.Phone || '').replace(/"/g, '""') + '"',
          '"' + (r.StudentID || '').replace(/"/g, '""') + '"',
          '"' + r.EventName.replace(/"/g, '""') + '"',
          '"' + new Date(r.RegistrationDate).toLocaleDateString() + '"',
          '"' + (r.RegStatus || '') + '"'
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registrations.csv';
      a.click();
      URL.revokeObjectURL(url);
      showToast('CSV downloaded.', 'success');
      
    } else if (format === 'pdf') {
      const win = window.open('', '_blank');
      let html = '<!DOCTYPE html><html><head><title>Registrations Report</title>';
      html += '<style>body{font-family:sans-serif;padding:20px;} table{width:100%;border-collapse:collapse;margin-top:20px;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background:#f4f4f4;}</style>';
      html += '</head><body><h2>Registrations Report</h2>';
      html += '<table><thead><tr>';
      headers.forEach(h => html += '<th>' + h + '</th>');
      html += '</tr></thead><tbody>';
      
      regs.forEach(function(r) {
        html += '<tr>';
        html += '<td>' + (r.FullName || '') + '</td>';
        html += '<td>' + (r.Email || '') + '</td>';
        html += '<td>' + (r.Phone || '') + '</td>';
        html += '<td>' + (r.StudentID || '-') + '</td>';
        html += '<td>' + r.EventName + '</td>';
        html += '<td>' + new Date(r.RegistrationDate).toLocaleDateString() + '</td>';
        html += '<td>' + (r.RegStatus || '') + '</td>';
        html += '</tr>';
      });
      
      html += '</tbody></table></body></html>';
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(function() {
        win.print();
        win.close();
      }, 250);
      showToast('PDF print dialog opened.', 'success');
    }
  };

  // -------------------------
  // PROFILE SETTINGS
  // -------------------------
  document.addEventListener('DOMContentLoaded', function() {
    const settingsModalEl = document.getElementById('settingsModal');
    if (!settingsModalEl) return;
    
    const settingsModal = new bootstrap.Modal(settingsModalEl);
    
    // Listen for clicks on "Settings" dropdown item
    document.body.addEventListener('click', function(e) {
      const targetLink = e.target.closest('a.dropdown-item');
      if (targetLink && targetLink.textContent.includes('Settings')) {
        e.preventDefault();
        
        const token = localStorage.getItem('gfg-token');
        let userStr = localStorage.getItem('gfg-user');
        if (!token || !userStr) return;
        
        const user = JSON.parse(userStr);
        document.getElementById('settingsFullName').value = user.fullName || '';
        document.getElementById('settingsUsername').value = user.username || '';
        document.getElementById('settingsEmail').value = user.email || '';
        document.getElementById('settingsPhone').value = user.phone || '';
        document.getElementById('settingsError').classList.add('d-none');
        
        settingsModal.show();
      }
    });
    
    // Handle Profile Update Submission
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const errorEl = document.getElementById('settingsError');
        const btn = document.getElementById('settingsSaveBtn');
        errorEl.classList.add('d-none');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
        
        try {
          const userStr = localStorage.getItem('gfg-user');
          const token = localStorage.getItem('gfg-token');
          if (!userStr || !token) throw new Error('Authentication error');
          
          const userObj = JSON.parse(userStr);
          
          const payload = {
            fullName: document.getElementById('settingsFullName').value.trim(),
            username: document.getElementById('settingsUsername').value.trim(),
            email: document.getElementById('settingsEmail').value.trim(),
            phone: document.getElementById('settingsPhone').value.trim()
          };
          
          const response = await fetch(`${API_BASE}/users/${userObj.userID || userObj.UserID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
          
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error?.message || result.message || 'Failed to update profile');
          }
          
          // Update localStorage
          localStorage.setItem('gfg-user', JSON.stringify(result.data.user));
          
          if(typeof showToast === 'function') {
            showToast('Profile updated successfully!', 'success');
          } else {
            alert('Profile updated successfully!');
          }
          
          settingsModal.hide();
          
          // Update welcome dashboard message
          const welcomeHeading = document.getElementById('userWelcomeHeading');
          if (welcomeHeading) {
             welcomeHeading.textContent = 'Welcome, ' + result.data.user.fullName.split(' ')[0] + '!';
          }
          
        } catch (error) {
          errorEl.textContent = error.message;
          errorEl.classList.remove('d-none');
        } finally {
          btn.disabled = false;
          btn.textContent = 'Save Changes';
        }
      });
    }
  });

})();
