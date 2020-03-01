import axios from 'axios';

const instance = axios.create({
  baseURL: "https://burger-builder-226e0.firebaseio.com/",
});

export default instance;