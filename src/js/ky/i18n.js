$(function () {

  jQuery.i18n.properties({
    name    : 'messages',
    path    : 'i18n/',
    mode    : 'both',
    // language: 'en_US',
    callback: function () {
      console.log('callback');
      // updateExamples();
    }
  });

});