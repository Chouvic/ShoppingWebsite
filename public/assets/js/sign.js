jQuery(function($) {


  // $("#Sign").click(function(){
  console.log("Sign Js");
  //


  $("#Sign").on("click", function() {

    var pass1 = $("#pass").val();
    var pass2 = $("#repass").val();
    var name = $("#name").val();
    var birthday = $("#birt").val();
    var address = $("#addr").val();
    var telephone = $("#tele").val();

    if (pass1 != pass2) {
      alert("Passwords do not match, please try again!");
      return;
    }

    if (name.length == 0) {
      alert("Name cannot be empty, please try again.");
      return;
    } else if (address.length == 0) {
      alert("Address cannot be empty, please try again.");
      return;
    } else if (birthday.length == 0) {
      alert("Birthday cannot be empty, please try again.");
      return;
    } else if (telephone.length == 0) {
      alert("Telephone cannot be empty, please try again.");
      return;
    } else {
      $.ajax({
        type: "post",
        url: "/sign",
        data: {
          username: $("#user").val(),
          password: $("#pass").val(),
          name: $("#name").val(),
          birthday: $("#birt").val(),
          address: $("#addr").val(),
          phone: $("#tele").val()
        },
        dataType: "json",
        success: function(res, status, xhr) {
          if (res.code != 200) {
            alert(res.msg);
            return;
          }
          alert("Congraduations! You have already signed in, please login in!");
          window.location.href = "login.html";
        },
        error: function(err) {
          console.log("ajax error");
          console.log("ajax error" + JSON.stringify(err));
        }
      });
    }
  });

});
