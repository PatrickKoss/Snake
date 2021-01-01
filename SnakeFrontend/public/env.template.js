(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["VUE_APP_BACKEND_URL"] = "${VUE_APP_BACKEND_URL}";
  window["env"]["VUE_APP_API_URL"] = "${VUE_APP_API_URL}";
})(this);
