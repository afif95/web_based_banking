'use strict';
const btnScrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabscontent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//button scrolling
btnScrollto.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log('height/weight viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  //scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});


// event delegation
// 1. add event listener to common parent element
// 2. determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // guard closure
  if (!clicked)
    return;

  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabscontent.forEach(a => a.classList.remove('operations__content--active'));

  //activate tab
  clicked.classList.add('operations__tab--active');

  //activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link)
        el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));


const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickynav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  }

  else
    nav.classList.remove('sticky');

};

const headerobserver = new IntersectionObserver(stickynav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerobserver.observe(header);


// reveal sections

const allSections = document.querySelectorAll('.section');
const revealsection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting)
    return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionobserver = new IntersectionObserver(revealsection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionobserver.observe(section);
  section.classList.add('section--hidden');
});


// lazy loading images

const imgtargets = document.querySelectorAll('img[data-src]');

const loadimg = function (entries, observer) {
  const [entry] = entries; // only 1 threshold, only 1 entry

  if (!entry.isIntersecting)
    return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgobserver = new IntersectionObserver(loadimg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgtargets.forEach(img => imgobserver.observe(img));


//slider 
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnleft = document.querySelector('.slider__btn--left');
  const btnright = document.querySelector('.slider__btn--right');
  const dotcontainer = document.querySelector('.dots');

  let currentslide = 0;
  const maxslide = slides.length;


  // functions
  const createdots = function () {
    slides.forEach(function (_, i) {
      dotcontainer.insertAdjacentHTML('beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };


  const activatedot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };


  const gotoslide = function (curslide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - curslide)}%)`));
  };


  //next slide
  const nextslide = function () {
    if (currentslide === maxslide - 1) {
      currentslide = 0;
    }
    else {
      currentslide++;
    }
    gotoslide(currentslide);
    activatedot(currentslide);
  };

  const prevslide = function () {
    if (currentslide === 0) {
      currentslide = maxslide - 1;
    }
    else {
      currentslide--;
    }
    gotoslide(currentslide);
    activatedot(currentslide);
  };

  const init = function () {
    gotoslide(0);
    createdots();
    activatedot(0);
  };
  init();

  // event handlers
  btnright.addEventListener('click', nextslide);
  btnleft.addEventListener('click', prevslide);


  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevslide();
    e.key === 'ArrowRight' && nextslide();
  });

  dotcontainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoslide(slide);
      activatedot(slide);
    }
  });

};
slider();



document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded');
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });