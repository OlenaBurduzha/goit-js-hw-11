import axios from 'axios';

const baseURL = 'https://pixabay.com/api/';
const key = '31316114-180796932203d7dd4f11923fb';
  
async function fetchImages(name, page, perPage) {
  try {
    const response = await axios.get(
      `${baseURL}?key=${key}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response.data;
  } catch (error) {
    console.log('ERROR: ' + error);
  }
}

export { fetchImages };