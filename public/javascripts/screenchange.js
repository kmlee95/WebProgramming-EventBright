$(function(){
    $('.credit-edit3').hide();
    $('.credit-edit4').hide();

    $('.buttongroup .firstbutton').click(function(){
        $('.credit-edit2').hide();
        $('.credit-edit3').show();
    });
    $('.buttongroup .secondbutton').click(function(){
        $('.credit-edit2').hide();
        $('.credit-edit4').show();
    });
    $('.buttonback').click(function(){
        $('.credit-edit3').hide();
        $('.credit-edit4').hide();
        $('.credit-edit2').show();
    }) 
});

$(function(){
    $('.question .title').css("color", "#"+(parseInt(Math.random()*0xffffff)).toString(16));
    $('.eventname').css("color", "#"+(parseInt(Math.random()*0xffffff)).toString(16));
});
