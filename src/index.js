import './sass/index.scss';
import { fetchImages } from './fetchImages'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchQuery = document.querySelector('input[name="searchQuery"]');
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

let perPage = 40;
let page = 0;
let name = searchQuery.value;

loadBtn.style.display = 'none';

searchForm.addEventListener('submit', eventHandler);

async function eventHandler(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  loadBtn.style.display = 'none';

  page = 1;
  name = searchQuery.value;

  fetchImages(name, page, perPage)
    .then(name => {
      let totalPages = name.totalHits / perPage;

      if (name.hits.length > 0) {
       Notify.success(`Hooray! We found ${name.totalHits} images.`);
        renderGallery(name);
        new SimpleLightbox('.gallery a');
   
        if (page < totalPages) {
          loadBtn.style.display = 'block';
        } else {
          loadBtn.style.display = 'none';
         Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
       Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        gallery.innerHTML = '';
      }
    })
    .catch(error => console.log('ERROR: ' + error));
}

function renderGallery(name) {
  const markup = name.hits
    .map(hit => {
      return `<div class='photo-card'>
  <a href='${hit.largeImageURL}'>
    <img src='${hit.webformatURL}' alt='${hit.tags}' loading='lazy' />
  </a>
  <div class='info'>
    <p class='info-item'>
      <b>Likes</b>
      ${hit.likes}
    </p>
    <p class='info-item'>
      <b>Views</b>
      ${hit.views}
    </p>
    <p class='info-item'>
      <b>Comments</b>
      ${hit.comments}
    </p>
    <p class='info-item'>
      <b>Downloads</b>
     ${hit.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

loadBtn.addEventListener(
  'click',
  () => {
    name = searchQuery.value;
    page += 1;
    fetchImages(name, page, perPage).then(name => {
      let totalPages = name.totalHits / perPage;
      renderGallery(name);
      new SimpleLightbox('.gallery a');
      if (page >= totalPages) {
        loadBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
  },
  true
);
