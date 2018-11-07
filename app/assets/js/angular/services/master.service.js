app.factory('MasterSvc', function ($http, config) {
    return {
        getStudyProgram: function () {
            var url = config.url + '/studyprograms/getlist';
            return $http.get(url);
        },
        getLocation: function () {
            var url = config.url + '/joblocations/getlist';
            return $http.get(url);
        }
     
    };
});