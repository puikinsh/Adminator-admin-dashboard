import * as $ from 'jquery';
import 'jquery.cookie';

export default {
  "post": function(url, data, success_callback, fail_callback){
    // data['token']
    $.ajax({
      "url": url,
      "data": data,
      "method": "POST",
      "dataType": "json",
      "headers": {
        'Authorization': "Bearer " + $.cookie('token')
      },
      "statusCode": {
        403: function(e) {
          alert( e.responseJSON.errMsg );
          location.href = "/signin.html";
        }
      }
    }).done(function( data, textStatus, jqXHR ) {
      success_callback( data, textStatus, jqXHR )
    }).fail(function( data, textStatus, errorThrown ) {
      fail_callback( data, textStatus, errorThrown )
    })
  }
}