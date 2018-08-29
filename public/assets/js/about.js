$(document).ready(function() {

  var imageWei = ["images/about/w1.jpg", "images/about/w2.jpg", "images/about/w3.jpg"];
  var imageZhou = ["images/about/z1.jpg", "images/about/z2.jpg", "images/about/z3.jpg"];
  var curIndex=0;
  var timeInterval=2500;
  setInterval(changeImg,timeInterval);
  var i = 1;
  function changeImg()
  {
    $("#img1").fadeOut(300, function() {
       $("#img1").attr("src", imageWei[i]);
       if(i == 2){i = 0;}
       else{
         i ++;
       }
       $("#img1").fadeIn(300);
     })
  }

  var j = 0;
  $("#img2").click(function() {
    $("#img2").fadeOut(300, function() {
      $("#img2").attr("src", imageZhou[j]);
      if (j == 2) {
        j = 0;
      }else{
        j++;
      }
      $("#img2").fadeIn(300);
    })
  });

});
