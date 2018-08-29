$(document).ready(function() {


  $("#submit").on("click", function() {
    $.ajax({
      type: "post",
      url: "/login",
      data: {
        username: $("#user").val(),
        password: $("#pass").val()
      },
      dataType: "json",
      success: function(res, status, xhr) {
        if (res.code != 200) {
          alert(res.msg);
          return;
        }
        window.location.href = "userinfo.html";
      },
      error: function(err) {
        console.log("ajax error");
        console.log("ajax error" + JSON.stringify(err));
      }
    });
  });

});
