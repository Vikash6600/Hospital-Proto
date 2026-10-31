document.querySelectorAll('img').forEach(image => {
  const markUnavailable = () => image.classList.add('image-failed');
  image.addEventListener('error', markUnavailable, {once:true});
  if (image.complete && image.naturalWidth === 0) markUnavailable();
});

const heroVisual = document.querySelector('.hero-visual');
const heroImage = heroVisual.querySelector('img');
const heroStories = [
  ['A more personal kind of care', 'Thoughtful at every step', 'assets/care-consultation.jpg', 'A doctor listening to an older patient'],
  ['Care starts with listening', 'A clearer next step, together', 'assets/care-team.jpg', 'A care team member talking with a patient'],
];
let heroStoryIndex = 0;
document.getElementById('heroNext').addEventListener('click', () => {
  heroStoryIndex = (heroStoryIndex + 1) % heroStories.length;
  const [title, detail, image, alt] = heroStories[heroStoryIndex];
  heroVisual.classList.add('story-changing');
  heroImage.src = image;
  heroImage.alt = alt;
  document.querySelector('.image-label strong').textContent = title;
  document.querySelector('.image-label small').textContent = detail;
  document.querySelector('.counter-active').textContent = `0${heroStoryIndex + 1}`;
  window.setTimeout(() => heroVisual.classList.remove('story-changing'), 220);
});

const overlay = document.getElementById('bookingOverlay');
const bookingForm = document.getElementById('bookingForm');
const serviceSelect = document.getElementById('serviceSelect');
let selectedDate = document.querySelector('.date-choices button.selected')?.dataset.date || 'Tue, Nov 3';
let selectedTime = document.querySelector('.time-choices button.selected')?.textContent.trim() || '9:30 AM';
let lastFocus = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}
function setBookingStep(step) {
  document.querySelectorAll('.booking-step').forEach(panel => panel.classList.toggle('active', panel.dataset.step === String(step)));
  document.querySelectorAll('.step-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index + 1 === step);
    dot.classList.toggle('done', typeof step === 'number' && index + 1 < step);
  });
  const currentStep = Number(step);
  document.querySelectorAll('.journey-item').forEach((item, index) => {
    item.classList.toggle('current', index + 1 === currentStep);
    item.classList.toggle('complete', step === 'success' || (currentStep > 0 && index + 1 < currentStep));
  });
}
function openBooking(event) {
  lastFocus = event.currentTarget;
  const requestedService = event.currentTarget.dataset.service;
  const requestedDoctor = event.currentTarget.dataset.doctor;
  if (requestedService) {
    const option = [...serviceSelect.options].find(item => item.textContent.trim() === requestedService);
    if (option) serviceSelect.value = option.value;
  }
  if (requestedDoctor) document.getElementById('doctorSelect').value = requestedDoctor;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setBookingStep(1);
  serviceSelect.focus({preventScroll:true});
}
function closeBooking() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastFocus?.focus?.({preventScroll:true});
}
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', openBooking));
document.querySelectorAll('.service-card[data-service]').forEach(button => button.addEventListener('click', openBooking));
document.getElementById('bookingClose').addEventListener('click', closeBooking);
document.getElementById('bookingDone').addEventListener('click', closeBooking);
overlay.addEventListener('click', event => { if (event.target === overlay) closeBooking(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && overlay.classList.contains('open')) closeBooking();
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); document.getElementById('careSearch').focus();
  }
});

document.querySelectorAll('.date-choices button').forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('selected')));
  button.addEventListener('click', () => {
  document.querySelectorAll('.date-choices button').forEach(item => item.classList.remove('selected'));
  document.querySelectorAll('.date-choices button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  button.classList.add('selected'); selectedDate = button.dataset.date;
  });
});
document.querySelectorAll('.time-choices button').forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('selected')));
  button.addEventListener('click', () => {
  document.querySelectorAll('.time-choices button').forEach(item => item.classList.remove('selected'));
  document.querySelectorAll('.time-choices button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  button.classList.add('selected'); selectedTime = button.textContent.trim();
  });
});
document.getElementById('bookingNext1').addEventListener('click', () => {
  if (!serviceSelect.reportValidity()) return;
  setBookingStep(2);
  document.getElementById('firstName').focus({preventScroll:true});
});
document.getElementById('bookingBack2').addEventListener('click', () => setBookingStep(1));
document.getElementById('bookingBack3').addEventListener('click', () => setBookingStep(2));
document.getElementById('bookingNext2').addEventListener('click', () => {
  const fields = [...document.querySelectorAll('[data-step="2"] input')];
  for (const field of fields) if (!field.reportValidity()) return;
  document.getElementById('reviewService').textContent = serviceSelect.value;
  document.getElementById('reviewDoctor').textContent = document.getElementById('doctorSelect').value || 'First available';
  document.getElementById('reviewWhen').textContent = `${selectedDate} · ${selectedTime}`;
  document.getElementById('reviewPatient').textContent = `${document.getElementById('firstName').value.trim()} ${document.getElementById('lastName').value.trim()} · ${document.getElementById('emailAddress').value.trim()}`;
  setBookingStep(3);
});
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('successSummary').textContent = `${serviceSelect.value} · ${selectedDate} at ${selectedTime}. Sample request only; nothing was sent or saved.`;
  setBookingStep('success');
  document.querySelectorAll('.step-dot').forEach(dot => { dot.classList.add('done'); dot.classList.remove('active'); });
});

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const opened = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!opened));
  menuToggle.setAttribute('aria-label', opened ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !opened);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
}));

const navSections = ['care', 'doctors', 'visit', 'about'].map(id => document.getElementById(id)).filter(Boolean);
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    nav.querySelectorAll('a[href^="#"]').forEach(link => {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), {rootMargin:'-34% 0px -58% 0px', threshold:0});
  navSections.forEach(section => navObserver.observe(section));
}

let heroPointerFrame = 0;
heroVisual.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || heroPointerFrame) return;
  heroPointerFrame = window.requestAnimationFrame(() => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    heroImage.style.transform = `scale(1.05) translate3d(${-x * 10}px, ${-y * 8}px, 0)`;
    heroVisual.querySelector('.image-label').style.transform = `translate3d(${x * 5}px, ${y * 4}px, 0)`;
    heroPointerFrame = 0;
  });
});
heroVisual.addEventListener('pointerleave', () => {
  heroImage.style.transform = '';
  heroVisual.querySelector('.image-label').style.transform = '';
});

const searchBox = document.getElementById('careSearch');
const cards = [...document.querySelectorAll('.service-card')];
const doctorCards = [...document.querySelectorAll('.doctor-card')];
let activeCategory = 'all';
function updateCareResults(query = searchBox.value) {
  const normalized = query.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const matchesCategory = activeCategory === 'all' || card.dataset.categoryCard === activeCategory;
    const searchable = `${card.dataset.searchable} ${card.textContent}`.toLowerCase();
    const matchesSearch = !normalized || searchable.includes(normalized);
    card.hidden = !(matchesCategory && matchesSearch);
    if (!card.hidden) visible++;
  });
  doctorCards.forEach(card => {
    const searchable = `${card.dataset.searchable} ${card.textContent}`.toLowerCase();
    card.hidden = Boolean(normalized) && !searchable.includes(normalized);
  });
  document.getElementById('serviceEmpty').hidden = visible > 0;
  const filterName = {all:'all care', specialty:'specialty care', everyday:'everyday care'}[activeCategory];
  const status = document.getElementById('serviceStatus');
  status.textContent = normalized
    ? `Showing ${visible} ${visible === 1 ? 'service' : 'services'} matching “${query.trim()}”`
    : `Showing ${visible} ${visible === 1 ? 'service' : 'services'} · ${filterName}`;
}
const searchResults = document.getElementById('searchResults');
function renderSearchResults() {
  const query = searchBox.value.trim().toLowerCase();
  searchResults.replaceChildren();
  if (query.length < 2) { searchResults.hidden = true; return; }
  const matches = [
    ...cards.filter(card => `${card.dataset.searchable} ${card.textContent}`.toLowerCase().includes(query)).map(card => ({kind:'SERVICE',title:card.querySelector('.service-content strong').textContent,detail:'Explore care and sample appointment times',icon:'✳',target:'care'})),
    ...doctorCards.filter(card => `${card.dataset.searchable} ${card.textContent}`.toLowerCase().includes(query)).map(card => ({kind:'SPECIALIST',title:card.querySelector('h3').textContent,detail:card.querySelector('.doctor-details p').textContent,icon:'◉',target:'doctors'})),
  ].slice(0, 5);
  if (!matches.length) {
    const empty = document.createElement('div'); empty.className = 'search-empty'; empty.textContent = 'No exact match. Try a service or specialist name.'; searchResults.append(empty);
  }
  matches.forEach(match => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'search-result'; button.setAttribute('role','option');
    button.innerHTML = `<span class="search-result-icon">${match.icon}</span><span><strong>${match.title}</strong><small>${match.kind} · ${match.detail}</small></span><span aria-hidden="true">↗</span>`;
    button.addEventListener('click', () => {
      searchBox.value = match.title;
      updateCareResults(match.title);
      searchResults.hidden = true;
      document.getElementById(match.target).scrollIntoView({behavior:'smooth'});
    });
    searchResults.append(button);
  });
  searchResults.hidden = false;
}
searchBox.addEventListener('input', () => { updateCareResults(); renderSearchResults(); });
searchBox.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !searchResults.hidden) {
    event.preventDefault(); searchResults.querySelector('.search-result')?.click();
  }
  if (event.key === 'Escape') searchResults.hidden = true;
});
document.addEventListener('click', event => { if (!event.target.closest('.search-wrap')) searchResults.hidden = true; });
document.querySelectorAll('.finder-tags button').forEach(button => button.addEventListener('click', () => {
  activeCategory = 'all';
  document.querySelectorAll('.service-tabs button').forEach(tab => {
    const selected = tab.dataset.category === 'all';
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  searchBox.value = button.dataset.search;
  updateCareResults(button.dataset.search);
  document.getElementById('care').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('.care-node').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.care-node').forEach(node => node.setAttribute('aria-pressed', String(node === button)));
  searchBox.value = button.dataset.search;
  activeCategory = 'all';
  document.querySelectorAll('.service-tabs button').forEach(tab => {
    const selected = tab.dataset.category === 'all';
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  updateCareResults();
  searchResults.hidden = true;
  document.getElementById('care').scrollIntoView({behavior:'smooth'});
}));
document.querySelectorAll('.service-tabs button').forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  searchBox.value = '';
  searchResults.hidden = true;
  document.querySelectorAll('.service-tabs button').forEach(tab => {
    const selected = tab === button;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  updateCareResults();
  cards.forEach(card => {
    if (card.hidden) return;
    card.classList.remove('filter-enter');
    requestAnimationFrame(() => card.classList.add('filter-enter'));
  });
}));

doctorCards.forEach(card => {
  card.tabIndex = 0;
  card.setAttribute('role','button');
  card.setAttribute('aria-label',`View and book with ${card.querySelector('h3').textContent}`);
  card.addEventListener('click', event => {
    if (event.target.closest('button,a')) return;
    const trigger = card.querySelector('[data-doctor]');
    openBooking({currentTarget:trigger});
  });
  card.addEventListener('keydown', event => {
    if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault(); openBooking({currentTarget:card.querySelector('[data-doctor]')});
    }
  });
});

const quotes = [
  ['I came in with a lot of questions. My doctor took the time to answer every one and made me feel like part of the plan.', 'Jordan R.', 'Patient · Family medicine'],
  ['Everyone knew what was happening next. That made a difficult week feel a little less overwhelming.', 'Simone L.', 'Patient · Heart & vascular care'],
  ['I never felt rushed. The team listened first, then helped me figure out the right next step.', 'Ravi M.', 'Patient · Orthopedics'],
];
let quoteIndex = 0;
function showQuote(index) {
  quoteIndex = (index + quotes.length) % quotes.length;
  const [quote, name, context] = quotes[quoteIndex];
  const card = document.querySelector('.quote-card');
  card.classList.add('changing');
  window.clearTimeout(showQuote.timer);
  showQuote.timer = window.setTimeout(() => card.classList.remove('changing'), 150);
  document.getElementById('quoteText').textContent = quote;
  document.getElementById('quoteName').textContent = name;
  document.getElementById('quoteContext').textContent = context;
  document.getElementById('quoteCount').textContent = `0${quoteIndex + 1} / 0${quotes.length}`;
}
document.getElementById('quotePrev').addEventListener('click', () => showQuote(quoteIndex - 1));
document.getElementById('quoteNext').addEventListener('click', () => showQuote(quoteIndex + 1));

const faqContent = {
  Patients: [
    ['What should I bring to an appointment?', 'Bring a photo ID, a list of current medications, and any questions you want to discuss. The hospital team will share any service-specific instructions.'],
    ['Can I choose a specific specialist?', 'Yes. Use the specialist cards to start a sample request with that doctor selected.'],
    ['How do I get ready for my first visit?', 'Arrive a little early and bring your insurance details if applicable. Our reception team can help you find your clinic.'],
  ],
  Visitors: [
    ['When can I visit a patient?', 'General visiting hours are Monday to Saturday, 8am–6pm. Please check with the hospital team for unit-specific guidance.'],
    ['Where can I park?', 'Visitor parking is available near the main entrance. Reception can help direct you to accessible spaces.'],
    ['Where is the main entrance?', 'The main entrance is on Willow Park Road, with the reception desk just inside.'],
  ],
  Appointments: [
    ['How do I request an appointment?', 'Choose a service or specialist, select a sample time, and enter fictional contact details in the booking demo.'],
    ['Can I change or cancel a visit?', 'This concept demo does not create real appointments. A live website would provide the hospital’s rescheduling instructions.'],
    ['Will the hospital contact me?', 'No. This is a visual prototype and the sample form does not send or save information.'],
  ],
};
function renderFaq(category) {
  document.querySelectorAll('.faq-tabs button').forEach(button => button.classList.toggle('active', button.dataset.faq === category));
  const list = document.getElementById('faqList');
  list.replaceChildren();
  faqContent[category].forEach(([question, answer], index) => {
    const item = document.createElement('div'); item.className = 'faq-item';
    const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-expanded', 'false');
    const title = document.createElement('span'); title.textContent = question;
    const toggle = document.createElement('span'); toggle.className = 'faq-toggle'; toggle.textContent = '+';
    button.append(title, toggle);
    const panel = document.createElement('div'); panel.className = 'faq-answer'; panel.hidden = true;
    const answerText = document.createElement('p'); answerText.textContent = answer; panel.append(answerText);
    if (index === 0) { item.classList.add('expanded'); button.setAttribute('aria-expanded', 'true'); toggle.textContent = '−'; panel.hidden = false; }
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open)); item.classList.toggle('expanded', open); toggle.textContent = open ? '−' : '+'; panel.hidden = !open;
    });
    item.append(button, panel); list.append(item);
  });
  const more = document.createElement('a'); more.className = 'faq-more'; more.href = '#contact'; more.textContent = 'More patient information ↗'; list.append(more);
}
document.querySelectorAll('.faq-tabs button').forEach(button => button.addEventListener('click', () => renderFaq(button.dataset.faq)));
renderFaq('Patients');

document.getElementById('newsletter').addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('newsletterMessage').textContent = 'Thanks for joining us. This demo did not send or store your email.';
  document.getElementById('newsletterEmail').value = '';
  showToast('Thanks for your interest — this is only a demo.');
});

let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('scrollProgress').style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
    scrollFrame = 0;
  });
}, {passive:true});

const revealElements = [...document.querySelectorAll('.care-finder,.care-section,.service-card,.specialist-section,.doctor-card,.experience-section,.testimonial-section,.visit-section,.faq-section,.location-section,.final-cta')];
revealElements.forEach((element,index) => {
  element.classList.add('reveal');
  if (element.matches('.service-card,.doctor-card')) element.style.transitionDelay = `${(index % 4) * 55}ms`;
});
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), {threshold:.08,rootMargin:'0px 0px -35px 0px'});
  revealElements.forEach(element => revealObserver.observe(element));
} else revealElements.forEach(element => element.classList.add('is-visible'));
