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
