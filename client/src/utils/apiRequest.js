import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

export const getFetch = (url, params = {}) => {
  return axios
    .get(url, {
      method: "GET",
      params: params
    })
    .then(res => res.data);
};
