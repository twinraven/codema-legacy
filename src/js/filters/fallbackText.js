App.filter('fallbackText', function() {
    return function(str, fallbackStr) {
        if (str === undefined || str.length === 0) {
            return fallbackStr;
        } else {
            return str;
        }
    };
});