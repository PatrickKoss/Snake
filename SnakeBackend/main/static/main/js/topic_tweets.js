window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false);
    let index = 0;
    if (document.getElementsByName("topic")) {
      index = document.getElementsByName("topic")[0].id;
      document.getElementsByName("topic")[index].checked = true;
    }
}, false);