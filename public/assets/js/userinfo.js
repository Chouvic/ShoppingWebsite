$(function(){
    $.ajax({
        type:"GET",
        url:"/detail",
        data:{},
        dataType:"json",
        success:function(res, status, xhr){
            if(res.code != 200){
                alert(res.msg);
                window.location.href = "login.html";
                return;
            }
            $("#user").html(res.user);
            $("#name").html(res.name);
            $("#birt").html(res.birt);
            $("#addr").html(res.addr);
            $("#tele").html(res.tele);
        },
        error:function(err){
            console.log("ajax error"+JSON.stringify(err));
        }
    });
});
