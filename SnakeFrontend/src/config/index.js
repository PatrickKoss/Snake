export const config = {
  // identifier used for localStorage
  appId: "snake",
  apiEndpoint: window["env"]["VUE_APP_BACKEND_URL"] || "http://127.0.0.1:8000",
  apiServerUrl: window["env"]["VUE_APP_API_URL"] || "http://localhost:3000",
  // apiEndpoint: process.env.VUE_APP_BACKEND_URL || "http://127.0.0.1:8000",
  // apiServerUrl: process.env.VUE_APP_API_URL || "http://localhost:3000",
  corsHeader: {
    'Access-Control-Allow-Origin': '*',
  },
};
