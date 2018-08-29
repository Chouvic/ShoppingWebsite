$(document).ready(function() {

  $.ajax({
    type: "GET",
    url: "/product",
    data: {},
    dataType: "json",
    success: function(res, status, xhr) {
      if (res.code != 200) {
        alert(res.msg);
        window.location.href = "index.html";
        return;
      }
      productid = res.id;
      $("#title").html(res.title);
      $("#brand").html(res.brand);
      $("#price").html(res.price);
      $("#memory").html(res.memory);
      $("#storage").html(res.storage);
      $("#processor").html(res.processor);
      $("#screen").html(res.screen_size);
      $("#graphics").html(res.graphics);
      $("#picture").attr("src", res.image);
    },
    error: function(err) {
      console.log("ajax error" + JSON.stringify(err));
    }
  });
  var e = document.getElementById("squan");
  var quantity = 0;
  document.getElementById("squan").onchange = function() {
    quantity = e.value;
  };

  $("#BuyI").on("click", function() {
    if (quantity == 0) {
      alert("Quantity is zero, please select!")
      return
    };
    $.ajax({
      type: "post",
      url: "/buy",
      data: {
        productid: productid,
        quantity: quantity
      },
      dataType: "json",
      success: function(res, status, xhr) {
        if (res.code != 200) {
          alert(res.msg);
          return;
        }
        window.location.href = "basket.html" + '#' + productid;
      },
      error: function(err) {
        console.log("ajax error");
        console.log("ajax error" + JSON.stringify(err));
      }
    });
  })
});
