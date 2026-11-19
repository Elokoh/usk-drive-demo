// Usk Drive demo site — interactions
(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Marquee: duplicate track content so the -50% loop is seamless
  var track = document.getElementById("marqueeTrack");
  if (track) track.innerHTML += track.innerHTML;

  // Scroll reveal (content visible by default if JS/IO unavailable)
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Enquiry form: validate + demo success state
  var form = document.getElementById("enquiryForm");
  var success = document.getElementById("formSuccess");
  if (form && success) {
    var fields = {
      name: form.querySelector('[data-field="name"]'),
      phone: form.querySelector('[data-field="phone"]')
    };

    function setInvalid(field, invalid) {
      if (field) field.classList.toggle("invalid", invalid);
    }

    function validPhone(v) {
      // Accept anything that looks like a UK number: 10-13 digits allowing spaces, +44, leading 0
      var digits = v.replace(/[^\d+]/g, "");
      return /^(\+44\d{9,10}|0\d{9,10})$/.test(digits);
    }

    ["fName", "fPhone"].forEach(function (id) {
      var input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", function () {
          setInvalid(input.closest(".field"), false);
        });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameInput = document.getElementById("fName");
      var phoneInput = document.getElementById("fPhone");
      var ok = true;

      var nameBad = !nameInput.value.trim();
      setInvalid(fields.name, nameBad);
      if (nameBad) ok = false;

      var phoneBad = !validPhone(phoneInput.value.trim());
      setInvalid(fields.phone, phoneBad);
      if (phoneBad) ok = false;

      if (!ok) {
        var firstInvalid = form.querySelector(".field.invalid input");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var name = nameInput.value.trim().split(" ")[0];
      var typeSel = document.getElementById("fType");
      var typeText = typeSel.options[typeSel.selectedIndex].text.toLowerCase();
      var successText = document.getElementById("successText");
      successText.textContent =
        "Thanks " + name + " — on a live site, your " + typeText +
        " enquiry would now land straight in the instructor's inbox. " +
        "This demo sent nothing anywhere.";

      form.style.display = "none";
      success.classList.add("show");
      success.focus();
    });
  }
})();
