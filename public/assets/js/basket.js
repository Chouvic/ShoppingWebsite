$(function() {


  var productid = window.location.hash.substring(1)
  console.log("proid= " + productid);
  var size;
  for (var i = 0; i < 10; i++) {
    $("#d" + i).fadeOut(10);
  }

  $("#username").fadeOut(10);
  $("#address").fadeOut(10);
  $("#telephone").fadeOut(10);

  console.log("basket");
  $.ajax({
    type: "post",
    url: "/basket",
    data: {
      productid: productid,
    },
    dataType: "json",
    success: function(res, status, xhr) {
      if (res.code != 200) {
        alert(res.msg);
        window.location.href = "login.html";
        return;
      }

      size = res.size;
      var amount = res.amount;
      var data = res.row;
      console.log(data);
      console.log(amount);

      $("#username").fadeIn(10);
      $("#address").fadeIn(10);
      $("#telephone").fadeIn(10);

      $('#username').html(data[0].name);
      $('#address').html(data[0].address);
      $('#telephone').html(data[0].phone);
      if (size >= 3) $('#innerspace').fadeOut(5);

      var sum = 0;
      for (var i = 0; i < size; i++) {
        $('#noorder').fadeOut(5);
        $('#d' + i).fadeIn(5);
        var productname = "#productname" + i;
        var quan = "#quan" + i;
        var price = "#price" + i;
        var amount = "#amount" + i;
        $(productname).html(data[i].title);
        $(quan).html(data[i].sum);
        $(price).html(data[i].price);
        var total = data[i].sum * data[i].price;
        $(amount).html(total);
        sum += total;
      }
      sum = sum.toFixed(2);
      $('#total').html(sum);

    },
    error: function(err) {
      console.log("ajax error" + JSON.stringify(err));
    }
  });


});
