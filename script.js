const images = Array.from(document.querySelectorAll('.gallery img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

let currentIndex = 0;
let startX = 0;

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = images[index].src;
  lightbox.classList.add('active');
}

function closeLightbox() {
  lightbox.classList.remove('active');
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
}

/* Click thumbnails */
images.forEach(img => {
    img.addEventListener('pointerup', e => {
        e.preventDefault();
        openLightbox(parseInt(img.dataset.index));
    });
});

/* Close on click */
lightbox.addEventListener('click', closeLightbox);

/* Keyboard */
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

/* Swipe */
lightbox.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    diff > 0 ? showNext() : showPrev();
  }
});

async function loadBooking() {
  const res = await fetch("booking.json");
  const data = await res.json();

  const container = document.getElementById("booking-container");

  for (const month in data) {
    const block = document.createElement("div");
    block.className = "month";

    const title = document.createElement("h3");
    title.textContent = formatMonth(month);
    block.appendChild(title);

    const table = document.createElement("table");
    table.innerHTML = "<tr><th>Zeitraum</th><th>Status</th></tr>";

    data[month].forEach(entry => {
      const tr = document.createElement("tr");
      tr.className = entry.status;
      tr.innerHTML = `<td>${formatDate(entry.from)} – ${formatDate(entry.to)}</td>
                      <td>${entry.status === "free" ? "frei" : "gebucht"}</td>`;
      table.appendChild(tr);
    });

    block.appendChild(table);
    container.appendChild(block);
  }
}

function formatMonth(m) {
  const [y, mo] = m.split("-");
  return new Date(y, mo - 1).toLocaleString("de-DE", { month: "long", year: "numeric" });
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("de-DE");
}


document.addEventListener("DOMContentLoaded", () => {

  fetch("booking.json")
    .then(res => res.json())
    .then(data => renderCalendar(data));

  // Monatsname formatieren: "Januar 2026"
  function formatMonth(m) {
    const [y, mo] = m.split("-");
    return new Date(y, mo - 1).toLocaleString("de-DE", { month: "long", year: "numeric" });
  }

  // Datum formatieren: TT.M.
  function formatDate(d) {
    const date = new Date(d);
    return `${date.getDate()}.${date.getMonth()+1}`;
  }

  // Zeitraum: TT.M. – TT.M.
  function formatPeriod(period) {
    return `${formatDate(period.from)} – ${formatDate(period.to)}`;
  }

  // Status: past = grau, booked = rot, free = grün, current = gelb
  function getStatusClass(period) {
    const today = new Date();
    const start = new Date(period.from);
    const end = new Date(period.to);

    if (today >= start && today <= end) return "current";
    if (end < today) return "past";
    if (period.status === "booked") return "booked";
    return "free";
  }

  // Render-Funktion
  function renderCalendar(data) {
    const container = document.getElementById("booking");

    Object.keys(data).forEach(monthKey => {
      const monthTable = document.createElement("table");
      monthTable.className = "booking-table";

      // Überschrift = Monatsname + Jahr
      const caption = document.createElement("caption");
      caption.textContent = formatMonth(monthKey);
      monthTable.appendChild(caption);

      // Jede Zeile = ein 2-Wochen-Block
      data[monthKey].forEach(period => {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        const cls = getStatusClass(period);
        cell.classList.add(cls);
        cell.textContent = formatPeriod(period);

        row.appendChild(cell);
        monthTable.appendChild(row);
      });

      container.appendChild(monthTable);
    });
  }

});

