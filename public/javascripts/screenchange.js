var i=0;

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
});


