/**
 * ============================================================================
 * PRIYANKA MAKEOVER STUDIO - LUXURY ADMIN DASHBOARD ENGINE
 * Real-time Supabase Data Management, Authentication & WhatsApp Automation
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. SUPABASE CLIENT CONFIGURATION
  // --------------------------------------------------------------------------
  const SUPABASE_PROJECT_URL = 'https://sikhychqetcddvhcrycq.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_x9fBpJ1a1xB97DPqzM8Riw_4DeXtytx';

  let supabaseClient = null;
  if (window.supabase && SUPABASE_ANON_KEY) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);
      console.log('✨ Admin Supabase client connected to https://sikhychqetcddvhcrycq.supabase.co');
    } catch (e) {
      console.warn('Supabase initialization note:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 2. STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const state = {
    bookings: [],
    filtered: [],
    activeStatus: 'all',
    activeService: 'all',
    sortOrder: 'created_desc',
    searchQuery: '',
    activeLayout: 'cards',
    selectedBooking: null,
    deleteCandidateId: null,
    isDemoFallback: false
  };

  // Demo fallback inquiries shown if table is newly created or empty
  const SAMPLE_PREVIEW_BOOKINGS = [
    {
      id: 'demo-1',
      client_name: 'Aanya Singhania',
      phone: '+91 98112 34567',
      event_date: getFutureDate(7),
      service_type: 'Airbrush HD Bridal Glamour',
      venue_location: 'The Leela Palace, Chanakyapuri, New Delhi',
      people_count: '1 (Only Bride)',
      special_notes: 'Wants glass skin finish, soft blush pink lips, and traditional floral bun hairstyle for morning Anand Karaj ceremony.',
      status: 'confirmed',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'demo-2',
      client_name: 'Meera Deshmukh',
      phone: '+91 99201 88776',
      event_date: getFutureDate(18),
      service_type: 'Royal HD Bridal Makeover',
      venue_location: 'Studio Visit (Supertech Mart, Noida Ext)',
      people_count: '2 (Bride + 1 Guest)',
      special_notes: 'Evening wedding look with antique jewellery pairing and heavy maroon lehenga draping.',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      id: 'demo-3',
      client_name: 'Ritika Mathur',
      phone: '+91 97118 45678',
      event_date: getFutureDate(25),
      service_type: 'Engagement & Sagan Makeover',
      venue_location: 'Radisson Blu, Greater Noida',
      people_count: '3-5 (Bridal Party)',
      special_notes: 'Soft smokey rose gold eye makeup, hollywood glam waves with diamond tiara.',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'demo-4',
      client_name: 'Pooja Verma',
      phone: '+91 98100 99881',
      event_date: getFutureDate(-5),
      service_type: 'Cocktail & Sangeet Glow',
      venue_location: 'Grand Heritage Resort',
      people_count: '1 (Only Bride)',
      special_notes: 'Emerald green outfit, glowy bronzed complexion.',
      status: 'completed',
      created_at: new Date(Date.now() - 3600000 * 120).toISOString()
    }
  ];

  function getFutureDate(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  // --------------------------------------------------------------------------
  // 3. AUTHENTICATION & SESSION HANDLING
  // --------------------------------------------------------------------------
  const loginView = document.getElementById('loginView');
  const dashboardView = document.getElementById('dashboardView');
  const loginForm = document.getElementById('loginForm');
  const loginUser = document.getElementById('loginUser');
  const loginPass = document.getElementById('loginPass');
  const passToggleBtn = document.getElementById('passToggleBtn');
  const rememberMe = document.getElementById('rememberMe');
  const btnLogout = document.getElementById('btnLogout');

  // Check existing session
  function checkAuth() {
    const session = localStorage.getItem('pms_admin_logged_in') || sessionStorage.getItem('pms_admin_logged_in');
    if (session === 'true') {
      showDashboard();
    } else {
      showLogin();
    }
  }

  function showDashboard() {
    loginView.style.display = 'none';
    dashboardView.style.display = 'block';
    fetchBookings();
  }

  function showLogin() {
    dashboardView.style.display = 'none';
    loginView.style.display = 'flex';
  }

  // Toggle password visibility
  if (passToggleBtn) {
    passToggleBtn.addEventListener('click', () => {
      const isPass = loginPass.type === 'password';
      loginPass.type = isPass ? 'text' : 'password';
      passToggleBtn.textContent = isPass ? '🔒' : '👁️';
    });
  }

  // Handle Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = loginUser.value.trim();
      const pass = loginPass.value.trim();
      const submitBtn = document.getElementById('btnLoginSubmit');

      submitBtn.textContent = 'Verifying Credentials...';
      submitBtn.disabled = true;

      let authSuccess = false;

      // 1. Try Supabase Auth if credentials look like email and client is active
      if (supabaseClient && user.includes('@') && pass.length >= 6) {
        try {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: user,
            password: pass
          });
          if (!error && data?.user) {
            authSuccess = true;
          }
        } catch (authErr) {
          console.log('Supabase auth attempt:', authErr);
        }
      }

      // 2. Default Studio Admin Master Passcode
      // Allows owner immediate access with standard studio credentials
      if (!authSuccess) {
        const validUsers = ['admin', 'priyanka', 'priyankamakeovers', 'priyanka@makeover.com'];
        const validPasses = ['admin123', 'admin', 'priyanka@2026', 'bridal2026'];

        if (validUsers.includes(user.toLowerCase()) && validPasses.includes(pass)) {
          authSuccess = true;
        }
      }

      submitBtn.textContent = 'Unlock Admin Dashboard';
      submitBtn.disabled = false;

      if (authSuccess) {
        if (rememberMe.checked) {
          localStorage.setItem('pms_admin_logged_in', 'true');
        } else {
          sessionStorage.setItem('pms_admin_logged_in', 'true');
        }
        showToast('✨ Welcome, Admin! Studio portal unlocked.', 'success');
        showDashboard();
      } else {
        showToast('Invalid credentials. Use admin / admin123 or check your details.', 'error');
      }
    });
  }

  // Handle Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('pms_admin_logged_in');
      sessionStorage.removeItem('pms_admin_logged_in');
      if (supabaseClient) {
        try { supabaseClient.auth.signOut(); } catch(e) {}
      }
      showToast('Logged out successfully.', 'success');
      showLogin();
    });
  }

  // --------------------------------------------------------------------------
  // 4. SUPABASE DATA FETCHING
  // --------------------------------------------------------------------------
  const loadingBox = document.getElementById('loadingBox');
  const cardsGrid = document.getElementById('cardsGrid');
  const tableWrapper = document.getElementById('tableWrapper');
  const emptyState = document.getElementById('emptyState');
  const btnSyncData = document.getElementById('btnSyncData');
  const supabaseIndicator = document.getElementById('supabaseIndicator');
  const supabaseIndicatorText = document.getElementById('supabaseIndicatorText');

  async function fetchBookings() {
    loadingBox.style.display = 'block';
    cardsGrid.style.display = 'none';
    tableWrapper.style.display = 'none';
    emptyState.style.display = 'none';

    if (!supabaseClient) {
      handleFetchFallback('Supabase client not initialized');
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase query result note:', error.message);
        handleFetchFallback(error.message);
        return;
      }

      if (data && data.length > 0) {
        state.bookings = data;
        state.isDemoFallback = false;
        if (supabaseIndicator && supabaseIndicatorText) {
          supabaseIndicator.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          supabaseIndicator.style.color = '#10B981';
          supabaseIndicatorText.textContent = `Supabase Live (${data.length} Bookings)`;
        }
      } else {
        // Table exists but has 0 records yet
        state.bookings = SAMPLE_PREVIEW_BOOKINGS;
        state.isDemoFallback = true;
        if (supabaseIndicator && supabaseIndicatorText) {
          supabaseIndicator.style.borderColor = 'rgba(245, 158, 11, 0.4)';
          supabaseIndicator.style.color = '#F59E0B';
          supabaseIndicatorText.textContent = 'Supabase Table Empty • Showing Previews';
        }
      }
    } catch (err) {
      console.warn('Fetch exception:', err);
      handleFetchFallback(err.message);
      return;
    }

    finishFetch();
  }

  function handleFetchFallback(reason) {
    state.bookings = SAMPLE_PREVIEW_BOOKINGS;
    state.isDemoFallback = true;
    if (supabaseIndicator && supabaseIndicatorText) {
      supabaseIndicator.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      supabaseIndicator.style.color = '#F59E0B';
      supabaseIndicatorText.textContent = 'Preview Mode • Connect bookings table';
    }
    finishFetch();
  }

  function finishFetch() {
    loadingBox.style.display = 'none';
    updateKpis();
    applyFiltersAndRender();
  }

  if (btnSyncData) {
    btnSyncData.addEventListener('click', () => {
      btnSyncData.style.transform = 'rotate(180deg)';
      setTimeout(() => btnSyncData.style.transform = '', 400);
      fetchBookings();
      showToast('🔄 Synchronized data with Supabase!', 'success');
    });
  }

  // --------------------------------------------------------------------------
  // 5. METRICS & KPIS CALCULATION
  // --------------------------------------------------------------------------
  function updateKpis() {
    const list = state.bookings;
    const total = list.length;
    const pending = list.filter(b => (b.status || 'pending').toLowerCase() === 'pending').length;
    const confirmed = list.filter(b => (b.status || '').toLowerCase() === 'confirmed').length;

    // Upcoming in next 30 days
    const now = new Date();
    const future30 = new Date();
    future30.setDate(now.getDate() + 30);

    const upcoming = list.filter(b => {
      if (!b.event_date) return false;
      const d = new Date(b.event_date);
      return d >= now && d <= future30;
    }).length;

    document.getElementById('kpiTotal').textContent = total;
    document.getElementById('kpiPending').textContent = pending;
    document.getElementById('kpiConfirmed').textContent = confirmed;
    document.getElementById('kpiUpcoming').textContent = upcoming;

    // Badges on filter tabs
    document.getElementById('badgeAll').textContent = total;
    document.getElementById('badgePending').textContent = pending;
    document.getElementById('badgeConfirmed').textContent = confirmed;
    document.getElementById('badgeCompleted').textContent = list.filter(b => (b.status || '').toLowerCase() === 'completed').length;
    document.getElementById('badgeCancelled').textContent = list.filter(b => (b.status || '').toLowerCase() === 'cancelled').length;
  }

  // --------------------------------------------------------------------------
  // 6. FILTERING, SEARCHING & SORTING
  // --------------------------------------------------------------------------
  const searchInput = document.getElementById('searchInput');
  const statusTabs = document.getElementById('statusTabs');
  const serviceFilter = document.getElementById('serviceFilter');
  const sortOrder = document.getElementById('sortOrder');
  const btnViewCards = document.getElementById('btnViewCards');
  const btnViewTable = document.getElementById('btnViewTable');

  function applyFiltersAndRender() {
    let list = [...state.bookings];

    // Status filter
    if (state.activeStatus !== 'all') {
      list = list.filter(b => (b.status || 'pending').toLowerCase() === state.activeStatus);
    }

    // Service filter
    if (state.activeService !== 'all') {
      const match = state.activeService.toLowerCase();
      list = list.filter(b => (b.service_type || '').toLowerCase().includes(match));
    }

    // Search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(b => 
        (b.client_name || '').toLowerCase().includes(q) ||
        (b.phone || '').toLowerCase().includes(q) ||
        (b.service_type || '').toLowerCase().includes(q) ||
        (b.venue_location || '').toLowerCase().includes(q) ||
        (b.special_notes || '').toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (state.sortOrder === 'created_desc') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      } else if (state.sortOrder === 'event_asc') {
        return new Date(a.event_date || '9999-12-31') - new Date(b.event_date || '9999-12-31');
      } else if (state.sortOrder === 'event_desc') {
        return new Date(b.event_date || '1970-01-01') - new Date(a.event_date || '1970-01-01');
      } else if (state.sortOrder === 'name_asc') {
        return (a.client_name || '').localeCompare(b.client_name || '');
      }
      return 0;
    });

    state.filtered = list;

    if (list.length === 0) {
      cardsGrid.style.display = 'none';
      tableWrapper.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      if (state.activeLayout === 'cards') {
        renderCards(list);
        cardsGrid.style.display = 'grid';
        tableWrapper.style.display = 'none';
      } else {
        renderTable(list);
        cardsGrid.style.display = 'none';
        tableWrapper.style.display = 'block';
      }
    }
  }

  // Search input with debounce
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value.trim();
        applyFiltersAndRender();
      }, 250);
    });
  }

  // Status Tab Clicks
  if (statusTabs) {
    statusTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.status-tab-btn');
      if (!btn) return;
      statusTabs.querySelectorAll('.status-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeStatus = btn.dataset.status;
      applyFiltersAndRender();
    });
  }

  // Service dropdown filter
  if (serviceFilter) {
    serviceFilter.addEventListener('change', (e) => {
      state.activeService = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Sort dropdown
  if (sortOrder) {
    sortOrder.addEventListener('change', (e) => {
      state.sortOrder = e.target.value;
      applyFiltersAndRender();
    });
  }

  // View toggle
  if (btnViewCards && btnViewTable) {
    btnViewCards.addEventListener('click', () => {
      btnViewCards.classList.add('active');
      btnViewTable.classList.remove('active');
      state.activeLayout = 'cards';
      applyFiltersAndRender();
    });

    btnViewTable.addEventListener('click', () => {
      btnViewTable.classList.add('active');
      btnViewCards.classList.remove('active');
      state.activeLayout = 'table';
      applyFiltersAndRender();
    });
  }

  // --------------------------------------------------------------------------
  // 7. RENDERING: CARDS & TABLE
  // --------------------------------------------------------------------------
  function formatDateNice(dateStr) {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getCountdownBadge(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target - now) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return `<span class="event-countdown-pill" style="background:#10B981; color:#fff;">TODAY 🎉</span>`;
    if (diffDays === 1) return `<span class="event-countdown-pill" style="background:#FF2A85; color:#fff;">TOMORROW</span>`;
    if (diffDays > 1 && diffDays <= 30) return `<span class="event-countdown-pill">In ${diffDays} days</span>`;
    if (diffDays < 0) return `<span class="event-countdown-pill" style="opacity: 0.6;">Past Event</span>`;
    return '';
  }

  function formatTimeAgo(timeStr) {
    if (!timeStr) return '';
    const diff = (Date.now() - new Date(timeStr)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function getCleanPhone(phone) {
    return (phone || '').replace(/[^0-9]/g, '');
  }

  function renderCards(list) {
    cardsGrid.innerHTML = '';
    list.forEach(booking => {
      const initial = (booking.client_name || 'B').charAt(0).toUpperCase();
      const status = (booking.status || 'pending').toLowerCase();
      const cleanPhone = getCleanPhone(booking.phone);
      const timeAgo = formatTimeAgo(booking.created_at);

      const card = document.createElement('div');
      card.className = 'booking-item-card';
      card.dataset.id = booking.id;

      card.innerHTML = `
        <div>
          <div class="card-top-row">
            <div class="client-identity">
              <div class="client-avatar">${initial}</div>
              <div class="client-name-box">
                <h3>${escapeHtml(booking.client_name)}</h3>
                <span class="inquiry-timestamp">Received ${timeAgo || 'recently'}</span>
              </div>
            </div>
            <span class="status-pill ${status}">${status}</span>
          </div>

          <div class="card-details-box">
            <div class="detail-line">
              <span class="detail-icon">📅</span>
              <span class="detail-text">
                <strong>Event:</strong> ${formatDateNice(booking.event_date)} ${getCountdownBadge(booking.event_date)}
              </span>
            </div>
            <div class="detail-line">
              <span class="detail-icon">💄</span>
              <span class="detail-text">
                <strong>Service:</strong> ${escapeHtml(booking.service_type || 'Bridal Makeover')}
              </span>
            </div>
            <div class="detail-line">
              <span class="detail-icon">📍</span>
              <span class="detail-text">
                <strong>Venue:</strong> ${escapeHtml(booking.venue_location || 'Studio Visit')}
              </span>
            </div>
            <div class="detail-line">
              <span class="detail-icon">👥</span>
              <span class="detail-text">
                <strong>Guests:</strong> ${escapeHtml(booking.people_count || '1 (Bride)')}
              </span>
            </div>
          </div>

          ${booking.special_notes ? `
            <div class="card-notes-preview" title="${escapeHtml(booking.special_notes)}">
              "${escapeHtml(booking.special_notes)}"
            </div>
          ` : ''}
        </div>

        <div class="card-bottom-actions">
          <select class="status-change-dropdown" data-id="${booking.id}" aria-label="Change status">
            <option value="pending" ${status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
            <option value="confirmed" ${status === 'confirmed' ? 'selected' : ''}>💍 Confirmed</option>
            <option value="completed" ${status === 'completed' ? 'selected' : ''}>✅ Completed</option>
            <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>❌ Cancelled</option>
          </select>

          <div class="card-action-btns">
            ${cleanPhone ? `
              <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${booking.client_name}! ✨ This is Priyanka Makeover Studio regarding your inquiry for ${booking.service_type || 'Bridal Makeover'} on ${formatDateNice(booking.event_date)}. We would love to assist you!`)}" target="_blank" rel="noopener noreferrer" class="btn-icon-action wa" title="Chat on WhatsApp">
                💬
              </a>
              <a href="tel:${cleanPhone}" class="btn-icon-action" title="Call Client">
                📞
              </a>
            ` : ''}
            <button type="button" class="btn-icon-action btn-view-details" data-id="${booking.id}" title="Full Details & Templates">
              👁️
            </button>
            <button type="button" class="btn-icon-action danger btn-delete-booking" data-id="${booking.id}" title="Delete Booking">
              🗑️
            </button>
          </div>
        </div>
      `;

      cardsGrid.appendChild(card);
    });

    attachItemEventListeners();
  }

  function renderTable(list) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    list.forEach(booking => {
      const initial = (booking.client_name || 'B').charAt(0).toUpperCase();
      const status = (booking.status || 'pending').toLowerCase();
      const cleanPhone = getCleanPhone(booking.phone);

      const tr = document.createElement('tr');
      tr.dataset.id = booking.id;

      tr.innerHTML = `
        <td>
          <div class="table-client-cell">
            <div class="client-avatar" style="width: 32px; height: 32px; font-size: 0.9rem;">${initial}</div>
            <div>
              <strong>${escapeHtml(booking.client_name)}</strong>
              <span>Received ${formatTimeAgo(booking.created_at)}</span>
            </div>
          </div>
        </td>
        <td>
          <a href="tel:${cleanPhone}" style="color: #fff; text-decoration: none; font-weight: 600;">${escapeHtml(booking.phone || 'N/A')}</a>
        </td>
        <td>
          <strong>${formatDateNice(booking.event_date)}</strong>
          <div>${getCountdownBadge(booking.event_date)}</div>
        </td>
        <td>
          <span style="color: var(--accent-pink); font-weight: 600;">${escapeHtml(booking.service_type || 'Bridal Makeover')}</span>
        </td>
        <td>
          <div>${escapeHtml(booking.venue_location || 'Studio Visit')}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(booking.people_count || '1 Bride')}</span>
        </td>
        <td>
          <select class="status-change-dropdown" data-id="${booking.id}" aria-label="Change status">
            <option value="pending" ${status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
            <option value="confirmed" ${status === 'confirmed' ? 'selected' : ''}>💍 Confirmed</option>
            <option value="completed" ${status === 'completed' ? 'selected' : ''}>✅ Completed</option>
            <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>❌ Cancelled</option>
          </select>
        </td>
        <td style="text-align: right;">
          <div class="card-action-btns" style="justify-content: flex-end;">
            ${cleanPhone ? `
              <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${booking.client_name}! ✨ This is Priyanka Makeover Studio regarding your inquiry for ${booking.service_type || 'Bridal Makeover'} on ${formatDateNice(booking.event_date)}.`)}" target="_blank" rel="noopener noreferrer" class="btn-icon-action wa" title="WhatsApp">
                💬
              </a>
            ` : ''}
            <button type="button" class="btn-icon-action btn-view-details" data-id="${booking.id}" title="Details">
              👁️
            </button>
            <button type="button" class="btn-icon-action danger btn-delete-booking" data-id="${booking.id}" title="Delete">
              🗑️
            </button>
          </div>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    attachItemEventListeners();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------------------------------------------------------------------------
  // 8. ACTIONS: STATUS UPDATE, DELETE, MANUAL ADD
  // --------------------------------------------------------------------------
  function attachItemEventListeners() {
    // Status Dropdown changes
    document.querySelectorAll('.status-change-dropdown').forEach(dropdown => {
      dropdown.addEventListener('change', async (e) => {
        const id = e.target.dataset.id;
        const newStatus = e.target.value;
        await updateBookingStatus(id, newStatus);
      });
    });

    // View Details
    document.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openDetailsModal(id);
      });
    });

    // Delete
    document.querySelectorAll('.btn-delete-booking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openDeleteModal(id);
      });
    });
  }

  async function updateBookingStatus(id, newStatus) {
    const booking = state.bookings.find(b => b.id === id);
    if (!booking) return;

    const oldStatus = booking.status;
    booking.status = newStatus;

    if (supabaseClient && !id.startsWith('demo-')) {
      try {
        const { error } = await supabaseClient
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) {
          console.warn('Status update note:', error.message);
          showToast(`Note: Status updated locally. (${error.message})`, 'error');
        } else {
          showToast(`✨ Status updated to "${newStatus.toUpperCase()}" in Supabase!`, 'success');
        }
      } catch (err) {
        console.warn('Status update error:', err);
      }
    } else {
      showToast(`✨ Status updated to "${newStatus.toUpperCase()}"!`, 'success');
    }

    updateKpis();
    applyFiltersAndRender();
  }

  // Delete flow
  const deleteModal = document.getElementById('deleteModal');
  const deleteModalText = document.getElementById('deleteModalText');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');

  function openDeleteModal(id) {
    const booking = state.bookings.find(b => b.id === id);
    if (!booking) return;
    state.deleteCandidateId = id;
    deleteModalText.textContent = `Are you sure you want to permanently delete the inquiry for "${booking.client_name}" (${formatDateNice(booking.event_date)})?`;
    deleteModal.classList.add('active');
  }

  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', async () => {
      const id = state.deleteCandidateId;
      if (!id) return;

      if (supabaseClient && !id.startsWith('demo-')) {
        try {
          const { error } = await supabaseClient
            .from('bookings')
            .delete()
            .eq('id', id);

          if (error) {
            console.warn('Delete error:', error.message);
            showToast(`Delete notice: ${error.message}`, 'error');
          } else {
            showToast('🗑️ Inquiry deleted from Supabase.', 'success');
          }
        } catch (err) {
          console.warn('Delete exception:', err);
        }
      } else {
        showToast('🗑️ Inquiry removed.', 'success');
      }

      state.bookings = state.bookings.filter(b => b.id !== id);
      deleteModal.classList.remove('active');
      state.deleteCandidateId = null;
      updateKpis();
      applyFiltersAndRender();
    });
  }

  // Add Manual Booking Flow
  const addModal = document.getElementById('addModal');
  const btnOpenAddModal = document.getElementById('btnOpenAddModal');
  const btnEmptyAction = document.getElementById('btnEmptyAction');
  const addBookingForm = document.getElementById('addBookingForm');

  if (btnOpenAddModal) btnOpenAddModal.addEventListener('click', () => addModal.classList.add('active'));
  if (btnEmptyAction) btnEmptyAction.addEventListener('click', () => addModal.classList.add('active'));

  if (addBookingForm) {
    addBookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newBooking = {
        client_name: document.getElementById('newClientName').value.trim(),
        phone: document.getElementById('newClientPhone').value.trim(),
        event_date: document.getElementById('newEventDate').value,
        service_type: document.getElementById('newServiceType').value,
        venue_location: document.getElementById('newVenueLocation').value.trim() || 'Studio Visit',
        people_count: document.getElementById('newPeopleCount').value,
        special_notes: document.getElementById('newSpecialNotes').value.trim() || 'Manual Studio Entry',
        status: document.getElementById('newStatus').value
      };

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from('bookings')
            .insert([newBooking])
            .select();

          if (error) {
            console.warn('Manual insert note:', error.message);
            newBooking.id = 'local-' + Date.now();
            newBooking.created_at = new Date().toISOString();
            state.bookings.unshift(newBooking);
            showToast(`Saved locally. (Supabase note: ${error.message})`, 'error');
          } else if (data && data[0]) {
            state.bookings.unshift(data[0]);
            showToast('✨ Booking successfully saved directly to Supabase!', 'success');
          }
        } catch (err) {
          newBooking.id = 'local-' + Date.now();
          newBooking.created_at = new Date().toISOString();
          state.bookings.unshift(newBooking);
          showToast('Saved to local session.', 'success');
        }
      } else {
        newBooking.id = 'local-' + Date.now();
        newBooking.created_at = new Date().toISOString();
        state.bookings.unshift(newBooking);
        showToast('Saved to local session.', 'success');
      }

      addBookingForm.reset();
      addModal.classList.remove('active');
      updateKpis();
      applyFiltersAndRender();
    });
  }

  // Details Modal & WhatsApp Templates
  const detailsModal = document.getElementById('detailsModal');
  const detailsContent = document.getElementById('detailsContent');
  const btnWaConfirmTemplate = document.getElementById('btnWaConfirmTemplate');
  const btnWaPricingTemplate = document.getElementById('btnWaPricingTemplate');
  const btnWaCustom = document.getElementById('btnWaCustom');

  function openDetailsModal(id) {
    const booking = state.bookings.find(b => b.id === id);
    if (!booking) return;
    state.selectedBooking = booking;

    detailsContent.innerHTML = `
      <div class="detail-view-row">
        <span class="label">Client Name:</span>
        <span class="val">${escapeHtml(booking.client_name)}</span>
      </div>
      <div class="detail-view-row">
        <span class="label">Contact Phone:</span>
        <span class="val"><a href="tel:${getCleanPhone(booking.phone)}" style="color: var(--accent-pink);">${escapeHtml(booking.phone)}</a></span>
      </div>
      <div class="detail-view-row">
        <span class="label">Event Date:</span>
        <span class="val">${formatDateNice(booking.event_date)} ${getCountdownBadge(booking.event_date)}</span>
      </div>
      <div class="detail-view-row">
        <span class="label">Requested Service:</span>
        <span class="val" style="color: var(--accent-purple);">${escapeHtml(booking.service_type)}</span>
      </div>
      <div class="detail-view-row">
        <span class="label">Venue Location:</span>
        <span class="val">${escapeHtml(booking.venue_location || 'Studio Visit')}</span>
      </div>
      <div class="detail-view-row">
        <span class="label">Bridal Guests:</span>
        <span class="val">${escapeHtml(booking.people_count || '1')}</span>
      </div>
      <div class="detail-view-row">
        <span class="label">Current Status:</span>
        <span class="val"><span class="status-pill ${booking.status}">${booking.status}</span></span>
      </div>
      <div class="detail-view-row" style="flex-direction: column; gap: 0.35rem; align-items: flex-start;">
        <span class="label">Special Bridal Notes & Requests:</span>
        <p style="color: #fff; font-size: 0.88rem; background: rgba(0,0,0,0.25); padding: 0.65rem; border-radius: var(--radius-xs); width: 100%;">
          ${escapeHtml(booking.special_notes || 'None provided')}
        </p>
      </div>
    `;

    detailsModal.classList.add('active');
  }

  // Template dispatch
  if (btnWaConfirmTemplate) {
    btnWaConfirmTemplate.addEventListener('click', () => {
      if (!state.selectedBooking) return;
      const b = state.selectedBooking;
      const phone = getCleanPhone(b.phone);
      const msg = `Hello ${b.client_name}! 💍✨\n\nThis is Priyanka Makeover Studio. We have reviewed your inquiry and are delighted to confirm that your event date (*${formatDateNice(b.event_date)}*) is available for *${b.service_type}*!\n\nWould you like to schedule an initial bridal trial or discuss look customizations?\n\nWarm regards,\nPriyanka Makeovers`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  if (btnWaPricingTemplate) {
    btnWaPricingTemplate.addEventListener('click', () => {
      if (!state.selectedBooking) return;
      const b = state.selectedBooking;
      const phone = getCleanPhone(b.phone);
      const msg = `Hello ${b.client_name}! 💖\n\nThank you for reaching out to Priyanka Makeover Studio for your *${b.service_type}* on *${formatDateNice(b.event_date)}*.\n\nOur signature package includes:\n• Luxury HD / Airbrush Foundation base\n• Premium mink 3D lashes & eye styling\n• Complete designer hairstyling & accessories\n• Dupatta draping & jewellery setting\n\nLet us know your preferred time to connect over a quick call!\n\nPriyanka Makeovers`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  if (btnWaCustom) {
    btnWaCustom.addEventListener('click', () => {
      if (!state.selectedBooking) return;
      const phone = getCleanPhone(state.selectedBooking.phone);
      window.open(`https://wa.me/${phone}`, '_blank');
    });
  }

  // Close modals handler
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.closeModal;
      const target = document.getElementById(modalId);
      if (target) target.classList.remove('active');
    });
  });

  // Modal backdrop click closes
  document.querySelectorAll('.admin-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  });

  // --------------------------------------------------------------------------
  // 9. EXPORT TO CSV
  // --------------------------------------------------------------------------
  const btnExportCsv = document.getElementById('btnExportCsv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const list = state.filtered;
      if (list.length === 0) {
        showToast('No inquiries to export.', 'error');
        return;
      }

      const headers = ['Client Name', 'Phone', 'Event Date', 'Service Requested', 'Venue Location', 'People Count', 'Special Notes', 'Status', 'Inquiry Created At'];
      const rows = list.map(b => [
        `"${(b.client_name || '').replace(/"/g, '""')}"`,
        `"${(b.phone || '').replace(/"/g, '""')}"`,
        `"${b.event_date || ''}"`,
        `"${(b.service_type || '').replace(/"/g, '""')}"`,
        `"${(b.venue_location || '').replace(/"/g, '""')}"`,
        `"${(b.people_count || '').replace(/"/g, '""')}"`,
        `"${(b.special_notes || '').replace(/"/g, '""')}"`,
        `"${b.status || 'pending'}"`,
        `"${b.created_at || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `priyanka_makeovers_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`📥 Exported ${list.length} inquiries to CSV spreadsheet!`, 'success');
    });
  }

  // --------------------------------------------------------------------------
  // 10. TOAST NOTIFICATION SYSTEM
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✨' : '⚠️';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Initial authentication check
  checkAuth();
});
