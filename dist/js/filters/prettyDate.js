App.filter('prettyDate', function() {
    return function(str) {
        if (str === undefined || str.length === 0) {
            return str;
        } else {
            var d = new Date(str);
            return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
        }
    };
});