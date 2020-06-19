// Helper function for making API requests
let API_URL = "/api";

const apiRequest = async (method, path, body = null) => {
  try {
    let opts = { method };
    if (body) {
      opts.headers = { "Content-Type": "application/json" };
      opts.body = JSON.stringify(body);
    }
    let res = await fetch(API_URL + path, opts);
    let json = await res.json();
    return [res.status, json];
  } catch (e) {
    alert(e.message);
    throw e;
  }
};

/* This line exposes the apiRequest function in the console */
window.apiRequest = apiRequest;

export default apiRequest;
