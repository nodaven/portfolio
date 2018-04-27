//作品集清單滑鼠效果
$(function(){

$(".work-list").hover(function(){
    $(this).find('.work-title').addClass('active');
    $(this).find('.work').addClass('active');
  },function(){
    $(this).find('.work-title').removeClass('active');
    $(this).find('.work').removeClass('active');
});

$('#rwd_hamburger').click(function(){
  $('.shape-overlays').toggleClass('active');
  $('.rwd-logo').toggleClass('active');
  $('.rwd-contact').toggleClass('active');
  $('html').toggleClass('hide');
  $('body').toggleClass('hide');
});

$("#gotop").click(function(){
    jQuery("html,body").animate({
        scrollTop:0
    },500);
    console.log("msg");
});

  });



