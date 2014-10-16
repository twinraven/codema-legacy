App.filter('useDashIfEmpty', function() {
    return function(str) {
        if (str === undefined || str.length === 0) {
            return '–';
        } else {
            return str;
        }
    };
});