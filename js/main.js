// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Dynamic work status badge (Open from 9:00 to 18:00 Europe/Sofia)
const badge = document.getElementById('work-status-badge');
if (badge) {
  try {
    const options = { timeZone: 'Europe/Sofia', hour: 'numeric', hour12: false };
    const sofiaHour = parseInt(new Intl.DateTimeFormat('en-US', options).format(new Date()), 10);
    if (sofiaHour >= 9 && sofiaHour < 18) {
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  } catch (e) {
    console.error('Error calculating Europe/Sofia hour:', e);
    const localHour = new Date().getHours();
    if (localHour >= 9 && localHour < 18) {
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }
}


/* Header scroll state */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });
}

/* Mobile nav toggle */
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

/* Hero Slider Logic */
const sliderEl = document.getElementById('hero-slider');
if (sliderEl) {
  const slides = sliderEl.querySelectorAll('.slide');
  if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 3500); // Swap every 3.5 seconds
  }
}

/* Partner logos marquee */
const partnerFiles = Array.from({ length: 13 }, (_, i) => `images/Tiravtomivka-partner-${i + 1}.png`);
const track = document.getElementById('partners-track');
if (track) {
  function buildPartnerSet() {
    const inner = document.createElement('div');
    inner.className = 'track-inner';
    partnerFiles.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Партньор на Автомивка Блясък';
      img.loading = 'lazy';
      inner.appendChild(img);
    });
    return inner;
  }
  track.appendChild(buildPartnerSet());
  track.appendChild(buildPartnerSet());
}

/* Gallery */
const galleryFiles = [
  'avtomivka-blqsak-gorublyane-sofia-tir-2.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-7.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-12-1.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-32.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-42.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-52.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-62.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-82.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-92.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-102.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-112.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-122.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-132.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-142.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-152.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-162.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-172.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-182.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-192.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-202.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-212.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-222.jpg',
  'avtomivka-blqsak-gorublyane-sofia-tir-232.jpg',
];
const galleryGrid = document.getElementById('gallery-grid');
if (galleryGrid) {
  galleryFiles.forEach((file, i) => {
    const img = document.createElement('img');
    img.src = `images/${file}`;
    img.alt = 'Автомивка Блясък — снимка от обекта';
    img.loading = 'lazy';
    if (i % 7 === 0) img.classList.add('g-wide');
    galleryGrid.appendChild(img);
  });

  /* Lightbox */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Затвори">&times;</button><img src="" alt="">';
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('img');

  galleryGrid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      lightboxImg.src = e.target.src;
      lightbox.classList.add('active');
    }
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) lightbox.classList.remove('active');
  });
}

/* ===== Booking Calendar Logic & Form Submissions ===== */
const BOOKING_API_URL = '/api/bookings';
const WORK_HOURS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00"
];

async function getBookedSlots() {
  try {
    const res = await fetch(BOOKING_API_URL);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    localStorage.setItem('avtomivka_blqsuk_bookings', JSON.stringify(data));
    return data;
  } catch (err) {
    console.warn('Booking API error, falling back to cached localStorage bookings:', err);
    const cached = localStorage.getItem('avtomivka_blqsuk_bookings');
    return cached ? JSON.parse(cached) : {};
  }
}

async function saveBookingsToServer(data) {
  try {
    const res = await fetch(BOOKING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('API save failed');
    localStorage.setItem('avtomivka_blqsuk_bookings', JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Error saving bookings:', err);
    return false;
  }
}

function sendNtfyAlert(name, phone, email, date, time, message) {
  const topic = 'avtomivka_blqsuk_alerts';
  const url = `https://ntfy.sh/${topic}`;
  
  let text = `👤 Клиент: ${name}\n📞 Телефон: ${phone}\n✉️ Имейл: ${email || 'Не е посочен'}\n`;
  if (date && time) {
    const parts = date.split('-');
    text += `📅 Резервиран час: ${parts[2]}.${parts[1]}.${parts[0]} г. в ${time}\n`;
  } else {
    text += `ℹ️ Тип: Общо запитване от сайта\n`;
  }
  text += `💬 Съобщение: ${message}`;

  fetch(url, {
    method: 'POST',
    body: text,
    headers: {
      'Title': date && time ? 'Нова Резервация за Час! 🚗✨' : 'Ново съобщение от сайта! ✉️',
      'Priority': 'high',
      'Tags': date && time ? 'car,calendar_spiral' : 'incoming_envelope,bell'
    }
  }).catch(err => console.error('Error sending ntfy notification:', err));
}

// Contact form submit listener
const form = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');
if (form && formNote) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form field values
    const nameVal = form.querySelector('[name="name"]').value;
    const phoneVal = form.querySelector('[name="phone"]').value;
    const emailVal = form.querySelector('[name="email"]').value || '';
    const messageVal = form.querySelector('[name="message"]').value;
    
    const dateInput = form.querySelector('#booking-date');
    const timeSelect = form.querySelector('#booking-time');
    
    let selectedDate = dateInput ? dateInput.value : '';
    let selectedTime = timeSelect ? timeSelect.value : '';
    
    formNote.style.color = 'var(--text)';
    formNote.textContent = 'Обработване на заявката...';
    
    if (selectedDate && selectedTime) {
      // It's a booking reservation
      try {
        const bookings = await getBookedSlots();
        if (!bookings[selectedDate]) {
          bookings[selectedDate] = {};
        }
        
        // Double check if slot is already taken in the database
        if (bookings[selectedDate][selectedTime]) {
          formNote.style.color = '#ff4a4a';
          formNote.textContent = 'Този час току-що беше зает! Моля, изберете друг час.';
          return;
        }
        
        // Add booking
        bookings[selectedDate][selectedTime] = {
          name: nameVal,
          phone: phoneVal,
          email: emailVal,
          message: messageVal,
          type: 'customer',
          timestamp: new Date().toISOString()
        };
        
        const success = await saveBookingsToServer(bookings);
        if (!success) {
          formNote.style.color = '#ff4a4a';
          formNote.textContent = 'Грешка при връзката с календара. Моля, опитайте отново или се обадете по телефона.';
          return;
        }
        
        // Send alert
        sendNtfyAlert(nameVal, phoneVal, emailVal, selectedDate, selectedTime, messageVal);
        formNote.textContent = 'Благодарим! Часът Ви беше запазен успешно. Ще се свържем с Вас за потвърждение.';
        
      } catch (err) {
        console.error('Error during reservation:', err);
        formNote.style.color = '#ff4a4a';
        formNote.textContent = 'Грешка при резервация. Моля, опитайте отново.';
        return;
      }
    } else {
      // It's a general inquiry
      sendNtfyAlert(nameVal, phoneVal, emailVal, '', '', messageVal);
      formNote.textContent = 'Благодарим! Запитването е изпратено успешно. Ще се свържем с Вас скоро.';
    }
    
    form.reset();
    
    if (timeSelect) {
      timeSelect.innerHTML = '<option value="" disabled selected>Изберете първо дата...</option>';
    }
    
    const gridContainers = document.querySelectorAll('.booking-slots-container');
    gridContainers.forEach(container => {
      container.style.display = 'none';
      const grid = container.querySelector('.booking-slots-grid');
      if (grid) grid.innerHTML = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const dateInputs = document.querySelectorAll('#booking-date');
  const timeSelects = document.querySelectorAll('#booking-time');
  
  if (dateInputs.length === 0) return;
  
  // Set min date to today's date
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (mm < 10) mm = '0' + mm;
  if (dd < 10) dd = '0' + dd;
  const todayStr = `${yyyy}-${mm}-${dd}`;
  
  dateInputs.forEach(input => {
    input.min = todayStr;
  });
  
  // Fetch latest bookings
  const bookings = await getBookedSlots();
  
  // Bind change event to date inputs
  dateInputs.forEach((dateInput, index) => {
    const timeSelect = timeSelects[index];
    if (!timeSelect) return;
    
    // Create visual grid container dynamically
    const container = document.createElement('div');
    container.className = 'booking-slots-container';
    container.style.display = 'none';
    container.innerHTML = `
      <div class="booking-slots-title">Наличност на часове за деня (изберете час):</div>
      <div class="booking-slots-grid"></div>
    `;
    
    // Insert after the parent .booking-date-time container
    const dateTimeRow = dateInput.closest('.booking-date-time');
    if (dateTimeRow) {
      dateTimeRow.parentNode.insertBefore(container, dateTimeRow.nextSibling);
    }
    
    dateInput.addEventListener('change', () => {
      const selectedDate = dateInput.value;
      if (!selectedDate) {
        container.style.display = 'none';
        timeSelect.innerHTML = '<option value="" disabled selected>Изберете първо дата...</option>';
        return;
      }
      
      const bookedHours = bookings[selectedDate] || {};
      timeSelect.innerHTML = '<option value="" disabled selected>Изберете час...</option>';
      
      const grid = container.querySelector('.booking-slots-grid');
      grid.innerHTML = '';
      container.style.display = 'block';
      
      WORK_HOURS.forEach(slot => {
        const isBooked = bookedHours[slot] !== undefined;
        
        // Populate option element
        const option = document.createElement('option');
        option.value = slot;
        if (isBooked) {
          option.disabled = true;
          option.textContent = `${slot} (зает)`;
        } else {
          option.textContent = slot;
        }
        timeSelect.appendChild(option);
        
        // Populate visual pill
        const pill = document.createElement('div');
        pill.className = 'slot-pill';
        if (isBooked) {
          pill.classList.add('busy');
          pill.textContent = slot;
          pill.title = 'Този час е зает';
        } else {
          pill.classList.add('free');
          pill.textContent = slot;
          pill.addEventListener('click', () => {
            // Deselect other pills
            grid.querySelectorAll('.slot-pill').forEach(p => p.classList.remove('selected'));
            // Highlight current pill
            pill.classList.add('selected');
            // Sync to select dropdown value
            timeSelect.value = slot;
          });
        }
        grid.appendChild(pill);
      });
    });

    // Sync select dropdown changes to visual pills
    timeSelect.addEventListener('change', () => {
      const selectedVal = timeSelect.value;
      const pills = container.querySelectorAll('.slot-pill');
      pills.forEach(p => {
        if (p.textContent === selectedVal) {
          p.classList.add('selected');
        } else {
          p.classList.remove('selected');
        }
      });
    });
  });
});
