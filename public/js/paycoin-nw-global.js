var gui = require('nw.gui'),
  win = gui.Window.get();

win.showDevTools();

$('.js-button-close').click(function () {
  win.close();
});

$('.js-button-minimize').click(function () {
  win.hide();
});

$("#navigation a").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
});

win.on('new-win-policy', function (frame, url, policy) {
    gui.Shell.openExternal(url);
    policy.ignore();
});