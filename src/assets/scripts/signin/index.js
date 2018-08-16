import * as $ from 'jquery';
import util from '../util.js';
const MD5 = require('blueimp-md5/js/md5');

export default (function () {
  const $msg = $('#msg');

  // Sidebar links
  $('#signin').click(function (e) {
    const $this = $(this),
          $user = $('#user'),
          $pwd = $('#pwd');

    console.log($user)
    if(!$user.val()){
      $msg.text('请输入用户名').show();
      return;
    }

    if(!$pwd.val()){
      $msg.text('请输入密码').show();
      return;
    }
    
    util.post('/auth/login', {
      username: $user.val(),
      password: MD5($pwd.val())
    }, (data)=>{
      if(data.status == "OK"){
        $.cookie('token', data.result);
        location.href = "/index.html";
      }else if(data.status == "FAILED"){
        $msg.text(data.errMsg).show();
      }
    });

  });

  // 开始输入隐藏消息
  $('#signin-form input').on('focus', function(){
    $msg.hide();
  })
}());
