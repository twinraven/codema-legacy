App.filter('hideProtocol', function() {
    return function(str) {
        if (str && str.indexOf('http://') !== -1) {
            return str.replace('http://', '');

        } else if (str && str.indexOf('https://') !== -1) {
            return str.replace('https://', '');

        } else {
            return str;
        }
    };
});