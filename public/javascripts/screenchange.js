/*이미지 불러오기*/
$(function() {
    //이미지 클릭시 업로드창 실행
    $('#profile_file_add').click(function() {
        console.log('fileadd');
        $("input[name='fileProfile']").click();
       
    })
    //업로드 파일체인지가 됬을경우 실행되는 이벤트  form태그에 fileProfile은 hidden으로 넣어줌
    $("input[name='fileProfile']").change(function(e){
       
        $( "#frm_profile_img" ).submit();
        $("input[name='fileProfile']").val();
        var frm = document.getElementById('profile_file_add');
        frm.method = 'POST';
        frm.enctype = 'multipart/form-data';
        var fileData = new FormData(frm);
     
        // ajax
        $.ajax({
            type:'POST',
            url:'/BoardProject/profileUpdate.ref',
            data:fileData,
            processData: false,
            contentType: false,
            success : function(data, textStatus, xhr) {
                console.log('success');
            },
            error : function(request,status,error) {  
               alert("code:"+request.status+"\n"+"error:"+error);
            }
        });
    })
})

$(function() {
    $('.switch').click(function(){
        $('.credit-edit2').toggle();
    });
});