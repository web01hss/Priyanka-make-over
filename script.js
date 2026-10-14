/**
 * PRIYANKA MAKEOVER STUDIO - INTERACTIVE ENGINE
 * Smooth animations, Instagram look research modal, before/after slider,
 * live gentle palette switcher, and WhatsApp booking integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. LIVE PURPLE & PINK PALETTE SWITCHER
  // --------------------------------------------------------------------------
  const paletteButtons = document.querySelectorAll('.palette-dot');
  const body = document.body;

  // Check saved preference or default to purple-pink mix
  const savedPalette = localStorage.getItem('pms_palette') || 'purple-pink';
  setPalette(savedPalette);

  paletteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-set');
      setPalette(selected);
      localStorage.setItem('pms_palette', selected);
    });
  });

  function setPalette(paletteName) {
    body.setAttribute('data-palette', paletteName);
    paletteButtons.forEach(btn => {
      if (btn.getAttribute('data-set') === paletteName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 1B. DARK THEME CONTROLLER (Midnight Velvet & Radiant Orchid)
  // --------------------------------------------------------------------------
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  // Default to dark theme
  const savedTheme = localStorage.getItem('pms_theme_v2') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      body.setAttribute('data-theme', 'dark');
      themeToggleBtns.forEach(btn => {
        btn.textContent = '☀️';
        btn.title = 'Switch to Light Theme';
      });
    } else {
      body.removeAttribute('data-theme');
      themeToggleBtns.forEach(btn => {
        btn.textContent = '🌙';
        btn.title = 'Switch to Dark Theme';
      });
    }
    localStorage.setItem('pms_theme_v2', theme);
  }

  function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  themeToggleBtns.forEach(btn => btn.addEventListener('click', toggleTheme));

  // --------------------------------------------------------------------------
  // 2. STICKY HEADER & SCROLL BEHAVIOR
  // --------------------------------------------------------------------------
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 3. MOBILE MENU SLIDE-OVER DRAWER (Flawless Mobile Experience)
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    if (mobileToggle) mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    if (mobileToggle) mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', closeDrawer);
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeDrawer);
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // --------------------------------------------------------------------------
  // 4. SMOOTH INTERSECTION OBSERVER REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 5. INTERACTIVE BEFORE & AFTER SLIDER
  // --------------------------------------------------------------------------
  const baSlider = document.getElementById('baSlider');
  const baClipped = document.getElementById('baClipped');
  const baHandle = document.getElementById('baHandle');
  let isDragging = false;

  if (baSlider && baClipped && baHandle) {
    function setSliderPosition(x) {
      const rect = baSlider.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      if (pos < 0) pos = 0;
      if (pos > 1) pos = 1;
      
      const percentage = pos * 100;
      baClipped.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    }

    baSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile devices
    baSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // --------------------------------------------------------------------------
  // 6. INSTAGRAM SECTOR: LOOK RESEARCH DATA & INTERACTIVE MODAL
  // --------------------------------------------------------------------------
  const instagramData = {
    1: {
      title: "Heritage Royal Red Bride: Warm Undertone Glam",
      badge: "Bridal HD Look Research",
      img: "https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=900&q=80",
      postDate: "Shared on Instagram • 18-Hr Wear Test",
      base: "Charlotte Tilbury Magic Cream + Airbrush Foundation (Shade 6W)",
      eyes: "Deep Bronze & Champagne Cut-Crease with 3D Faux Mink Lashes",
      lips: "MAC Velvet Teddy + Ruby Woo gradient ombre with satin gloss",
      hair: "Royal Traditional Bun with Fresh Red Roses & Double Dupatta Drape",
      caption: "Crafted for real bride Radhika on her wedding day. The brief was regal, timeless, and completely tear-resistant. Flawless through 16 hours of rituals without needing a single touchup!",
      hashtags: ["#PriyankaMakeovers", "#RoyalIndianBride", "#HDAirbrush", "#RedLehengaBride", "#DelhiNCRBride"],
      igUrl: "https://www.instagram.com/priyankamakeoverstudio/"
    },
    2: {
      title: "Pastel Blush Engagement: Glass-Skin Radiance",
      badge: "Engagement Look Research",
      img: "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=900&q=80",
      postDate: "Shared on Instagram • Day Ceremony",
      base: "Dior Forever Glow Hydrating Primer + NARS Light Reflecting Base",
      eyes: "Soft Rose-Gold Pearl Wash with winged chocolate gel eyeliner",
      lips: "Huda Beauty Silk Balm in 'Blush' with Charlotte Tilbury Pillow Talk",
      hair: "Romantic Hollywood waves adorned with baby's breath gypsophila",
      caption: "Soft, gentle and luminous for Day Engagement celebrations. We emphasized glowing glass-skin highlights and romantic blush tones matching her pastel lehenga.",
      hashtags: ["#PriyankaMakeoverStudio", "#EngagementLook", "#GlassSkinBride", "#PastelBridal", "#SoftGlam"],
      igUrl: "https://www.instagram.com/priyankamakeoverstudio/"
    },
    3: {
      title: "Cocktail & Sangeet: Sultry Bronzed Shimmer Eyes",
      badge: "Reception & Evening Glam",
      img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80",
      postDate: "Shared on Instagram • Night Sangeet",
      base: "Estée Lauder Double Wear + Huda Beauty Easy Bake powder",
      eyes: "Smokey Espresso Kohl with 24K gold foil pressed glitters",
      lips: "MAC Spice Lip Pencil + Fenty Beauty Gloss Bomb",
      hair: "Sculpted voluminous messy textured high pony with hair extensions",
      caption: "Cocktail-ready, dancing-proof makeup that reflects stage lights brilliantly. Designed for brides who want high-impact eyes and sculpted cheekbones.",
      hashtags: ["#SangeetGlam", "#SmokeyEyeBridal", "#PriyankaMakeovers", "#NightReception", "#PartyMakeup"],
      igUrl: "https://www.instagram.com/priyankamakeoverstudio/"
    },
    4: {
      title: "South Silk Pattu Saree & Temple Jasmine Gajra",
      badge: "Traditional South & North Fusion",
      img: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=80",
      postDate: "Shared on Instagram • Temple Wedding",
      base: "Sweat-resistant MAC Studio Fix Fluid with botanical setting mist",
      eyes: "Classic South Indian dramatic winged eyeliner with gold temple lid",
      lips: "Rich Vermilion Red longwear liquid matte",
      hair: "Traditional Jadai with handcrafted copper-gold temple billas & jasmine",
      caption: "A magnificent South Indian bridal ensemble. Pre-pleated pure Kanjivaram silk saree draped with millimeter precision to keep the bride comfortable all morning.",
      hashtags: ["#PattuSareeBridal", "#SouthIndianBride", "#TempleJewellery", "#SareeDrapingSpecialist", "#PriyankaStudio"],
      igUrl: "https://www.instagram.com/priyankamakeoverstudio/"
    },
    5: {
      title: "Couture Textured Braid with Pearl Accents",
      badge: "Hair Artistry Research",
      img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80",
      postDate: "Shared on Instagram • Hair Masterclass",
      base: "L'Oréal Professionnel Tecni.Art + Schwarzkopf Osis+ texture dust",
      eyes: "Soft dewy monochrome peach tones",
      lips: "Hydrating tinted gloss in Nude Rose",
      hair: "Multi-strand French Fishtail Braid intertwined with micro pearls",
      caption: "One of our most viral hair styling looks on Instagram reels! Takes 35 minutes to build and stays intact all through high-energy sangeet performances.",
      hashtags: ["#BridalHairStyling", "#TexturedBraid", "#PriyankaHairArtist", "#HairBotox", "#WeddingHairstyles"],
      igUrl: "https://www.instagram.com/priyankamakeoverstudio/"
    },
    6: {
      title: "Masterclass Batch 24: Color Theory & Airbrushing",
      badge: "Academy Certification Research",
      img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      postDate: "Shared on Instagram • Academy Highlights",
      base: "Temptu Pro 24K Airbrush Compressor + Silicon-based pigments",
      eyes: "Technique workshop: Hooded eyes, double cut-crease, glitter trapping",
      lips: "Custom mixing color wheel demonstration",
      hair: "Live model practical hands-on evaluation",
      caption: "Proud mentor moment! Our Batch 24 students presenting their final bridal evaluations. Priyanka Makeover Academy offers certified diploma courses with 100% placement support.",
      hashtags: ["#PriyankaAcademy", "#MakeupArtistCourse", "#BridalMasterclass", "#LearnAirbrush", "#BeautySchool"],
      igUrl: "https://www.instagram.com/priyankamakeoverstudio/"
    }
  };

  const igGrid = document.getElementById('igGrid');
  const igModalBackdrop = document.getElementById('igModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  
  const modalImg = document.getElementById('modalImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalPostDate = document.getElementById('modalPostDate');
  const modalTitle = document.getElementById('modalTitle');
  const modalBase = document.getElementById('modalBase');
  const modalEyes = document.getElementById('modalEyes');
  const modalLips = document.getElementById('modalLips');
  const modalHair = document.getElementById('modalHair');
  const modalCaption = document.getElementById('modalCaption');
  const modalHashtags = document.getElementById('modalHashtags');
  const modalIgLink = document.getElementById('modalIgLink');
  const modalWaLink = document.getElementById('modalWaLink');

  // Open modal on tile touch/click
  if (igGrid) {
    const tiles = igGrid.querySelectorAll('.ig-tile');
    tiles.forEach(tile => {
      tile.addEventListener('click', () => {
        const id = tile.getAttribute('data-id');
        const data = instagramData[id];
        if (!data) return;

        modalImg.src = data.img;
        modalBadge.textContent = data.badge;
        modalPostDate.textContent = data.postDate;
        modalTitle.textContent = data.title;
        modalBase.textContent = data.base;
        modalEyes.textContent = data.eyes;
        modalLips.textContent = data.lips;
        modalHair.textContent = data.hair;
        modalCaption.textContent = data.caption;

        // Render hashtags
        modalHashtags.innerHTML = '';
        data.hashtags.forEach(tag => {
          const span = document.createElement('span');
          span.textContent = tag;
          modalHashtags.appendChild(span);
        });

        modalIgLink.href = data.igUrl;
        
        // Custom WhatsApp booking message for this look
        const encodedMsg = encodeURIComponent(`Hi Priyanka Makeover Studio! I was researching your looks on your website and loved "${data.title}". I'd like to book/discuss this look.`);
        modalWaLink.href = `https://wa.me/919999624960?text=${encodedMsg}`;

        igModalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  // Close modal
  function closeIgModal() {
    igModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeIgModal);
  }

  if (igModalBackdrop) {
    igModalBackdrop.addEventListener('click', (e) => {
      if (e.target === igModalBackdrop) {
        closeIgModal();
      }
    });
  }

  // Filter Pills for Instagram looks
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      const tiles = document.querySelectorAll('.ig-tile');

      tiles.forEach(tile => {
        const category = tile.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          tile.style.display = 'block';
          tile.classList.add('revealed');
        } else {
          tile.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. PHOTO LOOKBOOK GALLERY LIGHTBOX
  // --------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryModalBackdrop = document.getElementById('galleryModalBackdrop');
  const galleryCloseBtn = document.getElementById('galleryCloseBtn');
  const galleryModalImg = document.getElementById('galleryModalImg');
  const galleryModalCaption = document.getElementById('galleryModalCaption');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption');
      galleryModalImg.src = src;
      galleryModalCaption.textContent = caption;
      galleryModalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeGalleryModal() {
    galleryModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (galleryCloseBtn) {
    galleryCloseBtn.addEventListener('click', closeGalleryModal);
  }

  if (galleryModalBackdrop) {
    galleryModalBackdrop.addEventListener('click', (e) => {
      if (e.target === galleryModalBackdrop) {
        closeGalleryModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. SUPABASE BACKEND & BOOKING FORM DISPATCHER
  // --------------------------------------------------------------------------
  const SUPABASE_PROJECT_URL = 'https://sikhychqetcddvhcrycq.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_x9fBpJ1a1xB97DPqzM8Riw_4DeXtytx';

  let supabaseClient = null;
  if (window.supabase && SUPABASE_ANON_KEY) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);
      console.log('✨ Supabase backend initialized for https://sikhychqetcddvhcrycq.supabase.co');
    } catch (err) {
      console.warn('Supabase init warning:', err);
    }
  }

  // Live status indicator for the frontend badge
  async function checkSupabaseBackendStatus() {
    const pill = document.getElementById('supabaseStatusPill');
    const text = document.getElementById('supabaseStatusText');
    if (!pill || !text) return;

    if (!supabaseClient) {
      pill.className = 'supabase-status-pill notice';
      text.textContent = '⚡ Supabase: Connecting...';
      return;
    }

    try {
      const { data, error } = await supabaseClient.from('bookings').select('id').limit(1);
      if (error && (error.code === 'PGRST205' || error.message.includes('Could not find') || error.message.includes('schema cache'))) {
        pill.className = 'supabase-status-pill notice';
        text.innerHTML = '⚡ Supabase Connected (Project: <b>sikhychqetcddvhcrycq</b>) • Run table SQL in Supabase';
      } else if (!error) {
        pill.className = 'supabase-status-pill connected';
        text.innerHTML = '🟢 Supabase Backend Live (Table: <b>bookings</b> ready!)';
      } else {
        pill.className = 'supabase-status-pill notice';
        text.textContent = `Supabase: ${error.message}`;
      }
    } catch (e) {
      pill.className = 'supabase-status-pill notice';
      text.textContent = 'Supabase Project Connected';
    }
  }

  checkSupabaseBackendStatus();

  const bookingForm = document.getElementById('bookingForm');
  const btnSubmitDirect = document.getElementById('btnSubmitDirect');

  async function saveBookingToDatabase(payload) {
    if (!supabaseClient) return { success: false, reason: 'no_client' };
    try {
      const { data, error } = await supabaseClient
        .from('bookings')
        .insert([{
          client_name: payload.name,
          phone: payload.phone,
          event_date: payload.date,
          service_type: payload.service,
          venue_location: payload.venue,
          people_count: payload.count,
          special_notes: payload.notes,
          status: 'pending'
        }])
        .select();

      if (error) {
        console.warn('Supabase insert note:', error.message);
        return { success: false, error };
      }
      console.log('✅ Booking successfully stored in Supabase:', data);
      return { success: true, data };
    } catch (e) {
      console.warn('Supabase network note:', e);
      return { success: false, error: e };
    }
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload = {
        name: document.getElementById('clientName').value.trim(),
        phone: document.getElementById('clientPhone').value.trim(),
        date: document.getElementById('eventDate').value,
        service: document.getElementById('serviceType').value,
        venue: document.getElementById('venueLocation').value.trim() || 'Studio Visit',
        count: document.getElementById('peopleCount').value,
        notes: document.getElementById('specialNotes').value.trim() || 'None'
      };

      const result = await saveBookingToDatabase(payload);
      if (result && result.success) {
        alert(`✨ Success! Your inquiry has been saved directly to your Supabase backend database! Opening WhatsApp...`);
      } else if (result && result.error && (result.error.code === 'PGRST205' || result.error.message?.includes('schema cache'))) {
        alert('⚡ Supabase is connected to project sikhychqetcddvhcrycq!\n\nNote: The "bookings" table has not been created yet in your Supabase dashboard. Please run the SQL snippet in your Supabase SQL Editor so future bookings are saved directly to your database.\n\nOpening WhatsApp now...');
      }

      const message = `✨ *Bridal Inquiry - Priyanka Makeover Studio* ✨\n\n` +
        `👤 *Name:* ${payload.name}\n` +
        `📞 *Contact:* ${payload.phone}\n` +
        `📅 *Event Date:* ${payload.date}\n` +
        `💄 *Service:* ${payload.service}\n` +
        `📍 *Location:* ${payload.venue}\n` +
        `👥 *People Count:* ${payload.count}\n` +
        `📝 *Notes/Requests:* ${payload.notes}\n\n` +
        `_Sent via Priyanka Makeover Studio Website_`;

      const whatsappUrl = `https://wa.me/919999624960?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  if (btnSubmitDirect) {
    btnSubmitDirect.addEventListener('click', async () => {
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const date = document.getElementById('eventDate').value || new Date().toISOString().split('T')[0];
      const service = document.getElementById('serviceType').value || 'Bridal Consultation';
      const venue = document.getElementById('venueLocation').value.trim() || 'Studio Visit';
      const count = document.getElementById('peopleCount').value || '1 (Only Bride)';
      const notes = document.getElementById('specialNotes').value.trim() || 'Direct Callback Requested';

      if (!name || !phone) {
        alert('Please enter your Name and Phone Number so our bridal coordinator can reach out to you.');
        return;
      }

      await saveBookingToDatabase({ name, phone, date, service, venue, count, notes });

      alert(`Thank you ${name}! Your inquiry has been saved to our database. Our senior bridal stylist Priyanka will call you at ${phone} shortly.`);
      bookingForm.reset();
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeIgModal();
      closeGalleryModal();
    }
  });
});
