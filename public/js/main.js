/**
 * Created by mahong on 17/5/24.
 */
$(function(){
    var loginBox = $("#loginBox");
    var registerBox = $("#registerBox");
    var userInfoBox = $("#userInfoBox");

    //注册登陆切换
    $(".go-login").on('click',function(){
        registerBox.hide();
        loginBox.show();
    });
    $(".go-register").on('click',function(){
        loginBox.hide();
        registerBox.show();
    });

    //注册
    registerBox.find("#registerBtn").on('click',function(){
        var password = registerBox.find("input[name='password']").val();
        var rePassword = registerBox.find("input[name='re-password']").val();
        if(password!=rePassword){
            registerBox.find(".error-msg").html("两次输入的密码不一致")
            return;
        }

        $.ajax({
            type:'post',
            url: '/api/user/register',
            data:{
                username: registerBox.find("input[name='username']").val(),
                password: registerBox.find("input[name='password']").val()
            },
            dataType: 'json',
            success : function(result){
                console.log(result);

                if(result.code != 0){
                    registerBox.find(".error-msg").html(result.message)
                }
                if(result.code==0){
                    //registerBox.hide();
                    //loginBox.show();
                    window.location.reload();
                }
            }

        })

    });

    //登陆
    loginBox.find("#loginBtn").on('click',function(){
        $.ajax({
            type:'post',
            url: '/api/user/login',
            data:{
                username: loginBox.find("input[name='username']").val(),
                password: loginBox.find("input[name='password']").val()
            },
            dataType: 'json',
            success : function(result){
                console.log(result);
                if(result.code != 0){
                    loginBox.find(".error-msg").html(result.message)
                    return;
                }
                if(result.code==0){
                    //loginBox.hide();
                    //userInfoBox.show();
                    //userInfoBox.find(".username").html(result.userInfo.username);
                    //userInfoBox.find(".welcome-info").html("您好,欢迎光临我的博客");
                    location.reload();
                }
            }

        })

    });

    //退出

    userInfoBox.find("#logout").on('click', function(){
        $.ajax({
            type:'get',
            url: '/api/user/logout',
            success: function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })


});