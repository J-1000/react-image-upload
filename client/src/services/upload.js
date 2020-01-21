import axios from 'axios';

const errorHandler = err => {
  // console.error(err);
  throw err;
};

export default {
  handleUpload(file) {
    console.log('file to be handled: ', file);
    return axios.post('api/upload', file)
      .then(res => res.data)
      .catch(errorHandler);
  }
}