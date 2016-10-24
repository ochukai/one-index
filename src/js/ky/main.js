$(function () {

  $('#btn-one').on('click', function () {
    var host = location.host;

    // http://kyligence.io
    // kyligence.io
    var pos = host.lastIndexOf(':');
    host = pos <= 4 ? host : host.substring(0, pos);

    location.href = 'http://' + host + ':7070/kylin';
  });

  $('#btn-kybot').on('click', function () {
    location.href = 'http://kybot.io';
  });

  var $dialog = $('.one-dialog-wrapper');

  var $info = $('#tpl-info').html();
  var $success = $('#tpl-success').html();
  var isShowing = false;

  function closeDialog() {
    $dialog.fadeOut('fast');
    isShowing = false;
  }

  function openDialog(pos) {
    $dialog.css(pos).fadeIn('fast');
    isShowing = true;
  }

  function loadContent(content) {
    $dialog
      .find('.one-dialog-content')
      .empty()
      .append(content);
  }

  function disableSubmit() {
    $('#form-apply .btn-submit').attr('disabled', 'disabled');
  }

  function enableSubmit() {
    $('#form-apply .btn-submit').removeAttr('disabled');
  }

  // function showError() {}
  // function hideError() {}

  function sendRequest(data) {
    disableSubmit();
    $.ajax({
      type    : "POST",
      url     : 'http://kybot.io/api/user/requestUser',
      data    : data,
      dataType: 'json',
      complete: function (xhr) {
        console.log(xhr);

        if(xhr.readyState === 0 && xhr.status === 0) {
          loadContent($success);
        } else {
          enableSubmit();
        }
      }

      // ,
      // success : function () {
      //   loadContent($success);
      // },
      // error   : function (xhr) {
      //   console.error(xhr);
      //   enableSubmit();
      // }
    });
  }

  $('#btn-apply').on('click', function () {
    if (isShowing) {
      closeDialog();
      return;
    }

    var $this = $(this);
    var offset = $this.offset();
    var newPos = {
      left: offset.left + $this.width() + 100,
      top : offset.top - 140
    };

    loadContent($info);
    openDialog(newPos);
  });

  $('.one-dialog-close').on('click', function () {
    closeDialog();
  });

  function getFormData() {
    return {
      company: $('input[name="company"]').val().trim(),
      title  : $('input[name="title"]').val().trim(),
      name   : $('input[name="name"]').val().trim(),
      email  : $('input[name="email"]').val().trim(),
      phone  : $('input[name="phone"]').val().trim()
    };
  }

  $('.one-dialog-content')
    .on('input change', 'form input', function () {
      console.log('change');

      var hasEmpty = false;
      $('#form-apply input').each(function () {
        var $this = $(this);
        if (!$this.val().trim()) {
          hasEmpty = true;
        }
      });

      if (hasEmpty) {
        disableSubmit();
      } else {
        enableSubmit()
      }
    })
    .on('click', '.btn-submit', function () {
      console.log('submit form');

      var data = getFormData();
      sendRequest(data);
    });

});
