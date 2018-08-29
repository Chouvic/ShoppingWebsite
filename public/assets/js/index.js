$(document).ready(function() {

  $(".look").click(function() {
    var str = (this.id).split("");
    var i = str[str.length -1];

    console.log("image click");
    $.ajax({
      type: "post",
      url: "/productid",
      data: {
        idp: i,
      },
      dataType: "json",
      success: function(res, status, xhr) {
        if (res.code != 200) {
          alert(res.msg);
          return;
        }
      },
      error: function(err) {
        console.log("ajax error");
        console.log("ajax error" + JSON.stringify(err));
      }
    });
    console.log("index0000");
    window.location.href = "product.html";
  });

});
