(function($) {
  "use strict";

  //Page cursors

  document
    .getElementsByTagName("html")[0]
    .addEventListener("mousemove", function(n) {
      (cursor.style.left = n.clientX + "px"),
        (cursor.style.top = n.clientY + "px"),
        (cursor2.style.left = n.clientX + "px"),
        (cursor2.style.top = n.clientY + "px"),
        (cursor3.style.left = n.clientX + "px"),
        (cursor3.style.top = n.clientY + "px");
    });

  var cursor = document.getElementById("cursor"),
    cursor2 = document.getElementById("cursor2"),
    cursor3 = document.getElementById("cursor3");

  function onMouseOver(t) {
    cursor2.classList.add("hover");
    cursor3.classList.add("hover");
  }

  function onMouseOut(t) {
    cursor2.classList.remove("hover");
    cursor3.classList.remove("hover");
  }

  onMouseOut();

  for (
    var r = document.querySelectorAll(".hover-target"), a = r.length - 1;
    a >= 0;
    a--
  ) {
    o(r[a]);
  }

  function o(t) {
    t.addEventListener("mouseover", onMouseOver);
    t.addEventListener("mouseout", onMouseOut);
  }

  //Navigation

  var app = (function() {
    var html = undefined;
    var nav = undefined;
    var menu = undefined;
    var menuItems = undefined;
    var init = function init() {
      html = document.querySelector("html");
      nav = document.querySelector("nav");
      menu = document.querySelector(".menu-icon");
      menuItems = document.querySelectorAll(".nav__list-item");
      applyListeners();
    };
    function applyListeners() {
      menu.addEventListener("click", function() {
        toggleClass(nav, "nav-active");
        toggleClass(html, "nav-active");
      });
    }
    var toggleClass = function toggleClass(element, stringClass) {
      if (element.classList.contains(stringClass)) {
        element.classList.remove(stringClass);
        console.log("removed " + stringClass + " from " + element);
      } else {
        console.log("added " + stringClass + " to " + element);
        element.classList.add(stringClass);
      }
    };
    init();
  })();

  //Switch light/dark

  //   $("#switch").on("click", function() {
  //     if ($("body").hasClass("light")) {
  //       $("body").removeClass("light");
  //       $("#switch").removeClass("switched");
  //     } else {
  //       $("body").addClass("light");
  //       $("#switch").addClass("switched");
  //     }
  //   });
})(jQuery);
