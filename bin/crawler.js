var fs = require('fs');
var yaml = require('js-yaml');

var page = require('webpage').create();
var url = 'http://ionicons.com';

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onCallback = function(data) {
  if (data && data.command && (data.command === 'dump')) {
    fs.write('workflow/icons.yml', yaml.dump({ icons: data.icons }));
    console.log("\nThe file was saved successfully!");
  }
};

page.open(url, function(status) {
  if (status === 'success') {
    page.evaluate(function() {
      String.prototype.toTitleCase = function() {
        return this.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };

      var elements = document.querySelectorAll('#icons li');

      var icons = [];
      for (var i = 0; i < elements.length; i++) {
        var icon = {};

        var element = elements[i];
        var id = element.className.replace(/^ion-/, '');
        icon['name'] = id.replace(/-/g, ' ').toTitleCase();
        icon['id'] = id;
        icon['unicode'] = window.getComputedStyle(element, ':before').getPropertyValue('content')
                                .charCodeAt().toString(16);
        var tags = element.dataset.tags;
        if (tags) {
          icon['filter'] = tags.split(/,\s*/);
        }
        icon['categories'] = [element.dataset.pack.toTitleCase()];
        console.log((i+1) + ' ' + id);

        icons.push(icon);
      }

      if (typeof window.callPhantom === 'function') {
        var event = window.callPhantom({
          command: 'dump',
          icons: icons
        });
        alert(event);
      }
    });
  }

  phantom.exit(0);
});
