/**
 * Created by yanzexin on 23/11/2016.
 * All right reserved @Stary 23/11/2016
 */

'use strict';
$(document).ready(function () {
    function login() {
        var studentId = $('#studentId').val();
        var password = $('#password').val();
        console.log(parsePassword(password));
        if (studentId == '' || password == '') {
            notify('学号和密码不能为空', 'danger');
        } else {
            $.ajax({
                url: './users/login',
                data: {
                    studentId: studentId,
                    password: parsePassword(password),
                    remember: document.getElementById('remember').checked
                },
                type: 'POST',
                async: true,
                success: function (data) {
                    if (!data['succeed']) {
                        notify(data['error'], 'danger');
                    } else {
                        window.location.href = './home';
                    }
                },
                error: function (error) {
                    notify('出错了, 请联系管理员!', 'danger');
                    console.log(error);
                }
            })
        }
    }

    function parsePassword() {
        return hex_md5($('#password').val());
    }

    $('#login').click(login);
});
