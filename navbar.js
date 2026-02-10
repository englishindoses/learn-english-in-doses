document.addEventListener("DOMContentLoaded", function() {
  fetch("/navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;

      // Mark the current page link with aria-current
      const links = document.querySelectorAll("#navbar a.nav-link");
      links.forEach(link => {
        if (link.href === window.location.href) {
          link.setAttribute("aria-current", "page");
        }
      });
    })
    .catch(error => console.error("Error loading navbar:", error));
});
