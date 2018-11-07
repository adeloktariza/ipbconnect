app.factory('EventsSvc', function ($http, config, Upload) {
    return {

        getEvents: function (limit, offset, query) {
            if(query == undefined){
                query = "";
            }
            if(offset == undefined){
                offset = 1;
            }
            var title = query.title == undefined ? "" : query.title;
            var price = query.price == undefined ? "" : query.price;
            // var studyProgramId = query.studyProgramId == undefined ? "" : query.studyProgramId;
            // var isVerified = query.isVerified == undefined ? "" : query.isVerified;
            
            var filter1 = '&title=' + title;
            var filter2 = '&price=' + price;
            // var filter3 = '&studyProgramId=' + studyProgramId;
            // var filter4 = '&isVerified=' + isVerified;

            var url = config.url + '/events';
            var limit = '?limit=' + limit;
            var offset = '&page=' + offset;

            var final = url + limit + offset + filter1 +filter2;
            // + limit + offset ;
            console.log("events", final);
            return $http.get(final);
            
        },
        getEventByCreator: function (limit, page, id) {
            var id = id == undefined ? "" : id;
            var filter1 = '&createdBy=' + id;
            var url = config.url + '/events?limit=' + limit + '&page=' + page;
            var final = url + filter1;
            console.log("url", final);
            return $http.get(final);
        },
        createEvents: function (data) {
            var url = config.url + '/events';
            return Upload.upload({url: url, data: data});
        },
        getEventById: function(data){
            var id = data;
            var url = config.url + '/events/' + id;
            return $http.get(url);
        },
        deleteEvents: function (id) {
            var url = config.url + '/events/' + id;
            return $http.delete(url);
        },
        updateEvents: function (data, id) {
            var url = config.url + '/events/' + id;
            return Upload.upload({url: url, data: data, method: 'PUT'});
        }
    };
});