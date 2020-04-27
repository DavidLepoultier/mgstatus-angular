$(window).scroll(function () {
  var scroll = $(window).scrollTop()+10;
  var header = $('header').height();
  if (scroll >= header) {
    $("header").addClass("background-header");
    $("myHeader").addClass("background-myheader");
  } else {
    $("header").removeClass("background-header");
    $("myHeader").removeClass("background-myheader");
    $("wrapper").removeClass("update-wrapper");
  }
});