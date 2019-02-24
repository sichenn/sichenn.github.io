const parallaxClass = "parallax";
const moveScale = 0;
// parallax scale 0-1
const parallaxScale = 0.33;
var maxMoveRange;
var targetUpdateRate = 1 / 30;

window.onload = start;
window.setInterval(update, targetUpdateRate);

function start() {
  parallaxAll();
  menuParallax();
  //   var parallaxDiv = document.getElementById(parallaxClass);
  //   var x, y;
  //   const moveScale = 0.025;

  //   // On mousemove use event.clientX and event.clientY to set the location of the div to the location of the cursor:
  //   window.addEventListener('mousemove', function (event) {
  //     x = event.clientX;
  //     y = event.clientY;
  //     if (typeof x !== 'undefined') {
  //       parallaxDiv.style.left = x * moveScale + "px";
  //       parallaxDiv.style.top = y * moveScale + "px";
  //     }
  //   }, false);
}

function update() {
  // console.log("tick");
}

function parallaxAll() {
  var elements = document.getElementsByClassName(parallaxClass);
  for (var i = 0; i < elements.length; i++) {
    parallax(elements[i]);
  }
}

// requires position: relative in style
function parallax(element, radius) {
  let x, y;
  // On mousemove use event.clientX and event.clientY to set the location of the div to the location of the cursor:
  window.addEventListener(
    "mousemove",
    function(event) {
      x = event.clientX;
      y = event.clientY;
      if (typeof x !== "undefined") {
        element.style.left = x * moveScale + "px";
        element.style.top = y * moveScale + "px";
      }
    },
    false
  );
}


function menuParallax(e) {
  if (isMobile()) {
    // menuParallaxMobile();
  } else {
    menuParallaxPC(parallaxScale);
  }
}

function menuParallaxPC(scale) {
  var w = $(window).width(), //window width
    h = $(window).height(); //window height
  var $menu = $(".Menu-list"),
    $item = $(".Menu-list-item"),
    menuListX = $menu.offsetLeft,
    menuListY = $menu.offsetTop;

  $(window).on("mousemove", function(event) {
    var offsetX = event.pageX / w, //cursor position X
      offsetY = event.pageY / h, //cursor position Y
      dx = event.pageX - menuListX, //@w/2 = center of poster
      dy = event.pageY - menuListY, //@h/2 = center of poster
      theta = Math.atan2(dy, dx), //angle between cursor and center of poster in RAD
      angle = (theta * 180) / Math.PI - 90, //convert rad in degrees
      offsetPoster = $menu.data("offset");

    //range angle between 0-360
    if (angle < 0) {
      angle = angle + 360;
    }

    offsetX *= scale;
    offsetY *= scale;

    parallaxMenu(
      offsetX * offsetPoster,
      -offsetY * offsetPoster,
      offsetX * (offsetPoster * 2)
    );

    //parallax for each layer
    $item.each(function() {
      var $this = $(this),
        offsetLayer = $this.data("offset") || 0,
        transformLayer =
          "translate3d(" +
          offsetX * offsetLayer +
          "px, " +
          offsetY * offsetLayer +
          "px, 20px)";

      $this.css("transform", transformLayer);
    });
  });
}

function menuParallaxMobile() {
  window.addEventListener("deviceorientation", function(event) {
    var $menu = $(".Menu-list"),
      $item = $(".Menu-list-item"),
      w = $(window).width(), //window width
      h = $(window).height(), //window height
      menuListX = $menu.offsetLeft,
      menuListY = $menu.offsetTop;

    var offsetX = event.gamma / 180, //cursor position X
      offsetY = event.beta / 180, //cursor position Y
      offsetPoster = $menu.data("offset");

    parallaxMenu(
      offsetX * offsetPoster,
      -offsetY * offsetPoster,
      offsetX * (offsetPoster * 2)
    );
    console.log(
      "alpha" + event.alpha + ", beta " + event.beta + ", gamma " + event.gamma
    );
  });
}

function parallaxMenu(translateY, rotateX, rotateY) {
  var $menu = $(".Menu-list");
  var transformPoster =
    "translate3d(0, " +
    translateY +
    "px, 0) " +
    "rotateX(" +
    rotateX +
    "deg) " +
    "rotateY(" +
    rotateY +
    "deg)";

  //poster transform
  $menu.css("transform", transformPoster);
}

function isMobile() {
  let mobileTestString = new RegExp(
    "Android|webOS|iPhone|iPad|" +
      "BlackBerry|Windows Phone|" +
      "Opera Mini|IEMobile|Mobile",
    "i"
  );

  return mobileTestString.test(navigator.userAgent);
}
