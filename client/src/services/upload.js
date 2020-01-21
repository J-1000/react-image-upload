import axios from 'axios';

const errorHandler = err => {
  // console.error(err);
  throw err;
};

export default {
  service,
  handleUpload(file) {
    console.log('file to be handled: ', file);
    return axios.post('api/upload', file)
      .then(res => res.data)
      .catch(errorHandler);
  }
}