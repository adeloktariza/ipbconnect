app.factory('MemorySvc', function ($http, config, Upload) {
    return {
        create: function (data) {
            var url = config.url + '/memories';
            return Upload.upload({url:url, data:data});
        },
        delete: function (id) {
            var url = config.url + '/memories/' + id;
            return $http.delete(url);
        },
        getSingleMemory: function (id) {
            var url = config.url + '/memories/' + id;
            return $http.get(url);
        },
        getList: function (limit, page, query) {
            if(query == undefined){
                query = "";
            }
            var studyProgramId = query.studyProgramId == undefined ? "" : query.studyProgramId;

            var url = config.url + '/memories?limit=' + limit + '&page=' + page + '&studyProgramId=' + studyProgramId;
            console.log("url", url);
            return $http.get(url);

        },
        getListByCreator: function (limit, page, query) {
            var createdBy = query.createdBy == undefined ? "" : query.createdBy;

            var filter1 = '&createdBy=' + createdBy;

            var url = config.url + '/memories?limit=' + limit + '&page=' + page;
            var finals = url + filter1;
            return $http.get(finals);
        },
        getCommentList: function (limit, page, id) {
            var url = config.url + '/memories/comment/' + id + "?limit=" + limit + "&page=" + page;
            return $http.get(url);
        },
        comment: function(data, id){
            var url = config.url + "/memories/comment/" + id;
            return $http.post(url, data);
        },
        upLike: function(data, id){
            var url = config.url + "/memories/like/" + id;
            return $http.post(url, data);
        },
        downLike: function(data, id){
            var url = config.url + "/memories/unlike/" + id;
            return $http.post(url, data);
        },
        getListById : function (id) {

            var url = config.url + '/memories/' + id;
            return $http.get(url);

        }
    };
});