app.factory('UserSvc', function ($http, config, Upload) {
    return {

        login: function (data) {
            var url = config.url + '/users/login';
            return $http.post(url, data);
        },
        register: function(data){
            var url = config.url + "/users";
            return $http.post(url, data);
        },
		forgotPass: function(data){
            var url = config.url + '/users/forgotpassword';
            return $http.post(url, data);
		},
		
        getUserById: function(id){
            var url = config.url + "/users/" + id;
            return $http.get(url);
        },
        editAcademic: function(data){
            var url = config.url + "/users/academic/" + data._id;
            return $http.put(url, data);
        },
        editProfile: function(data, id){
            var url = config.url + "/users/profiles/" + id;
            return $http.put(url, data);
        },
        editPassword: function(data, id){
            var url = config.url + "/users/change-password/" + id;
            return $http.put(url, data);
        },
        changePict: function(data, id){
            var url = config.url + "/users/profiles/upload/" + id;
            return Upload.upload({url: url, data: data});
        },
        verify: function (x) {
            var url = config.url + '/users/verified/' + x;
            return $http.post(url);
        },
        explore: function (limit, page, query) {
            if(query == undefined){
                query = "";
            }
            var fullName = query.fullName == undefined ? "" : query.fullName;
            var batch = query.batch == undefined ? "" : query.batch;
            var studyProgramId = query.studyProgramId == undefined ? "" : query.studyProgramId;
            var isVerified = query.isVerified == undefined ? "" : query.isVerified;
            
            var filter1 = '&fullName=' + fullName;
            var filter2 = '&batch=' + batch;
            var filter3 = '&studyProgramId=' + studyProgramId;
            var filter4 = '&isVerified=' + isVerified;

            var url = config.url + '/users?limit=' + limit + '&page=' + page;

            var finals = url + filter1 + filter2 + filter3 + filter4;

            return $http.get(finals);
        },
        countUser: function (x) {
            var url = config.url + '/users/count?studyProgramId=' + x;
            return $http.get(url);
        },

  
    };
});