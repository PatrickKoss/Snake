export const config = {
  // identifier used for localStorage
  appId: "snake",

  // endpoint of the rest api
  apiEndpoint: process.env.VUE_APP_BACKEND_URL || "http://127.0.0.1:8000",
};
