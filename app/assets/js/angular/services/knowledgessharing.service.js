app.factory('KnowledgessharingSvc', function ($http, config, Upload) {
    return {
		
        createKnowledges: function (data) {
            var url = config.url + '/knowledgesharings';
            return Upload.upload({url,  data});
        },
		
		editKnowledges: function (data, id) {
            var url = config.url + '/knowledgesharings/' + id;
            return Upload.upload({url:url, data:data, method: 'PUT'});
        },
		
        delete: function (id) {
            var url = config.url + '/knowledgesharings/' + id;
            return $http.delete(url);
        },
		
        getSingleMemory: function (id) {
            var url = config.url + '/knowledgesharings/' + id;
            return $http.get(url);
        },
		
        getList: function (limit, page, query) {

            if(query == undefined){
                query = "";
            }
            var studyProgramId= query.studyProgramId == undefined ? "" : query.studyProgramId;
			var title = query.title == undefined ? "" : query.title;
			var description = query.description == undefined ? "" : query.description;
			var category = query.category == undefined ? "" : query.category;
			var file = query.file == undefined ? "" : query.file;
			
			var filter1 = '&title=' + title;
            var filter2 = '&description=' + description;
            var filter3 = '&category=' + category;
            var filter4 = '&file=' + file;

			var url = config.url + '/knowledgesharings?limit=' + limit + '&page=' + page;
            // console.log("url", url);
            return $http.get(url);
			
            var final = url + limit + offset +  filter4 + filter1 + filter2 + filter3;
            console.log("url", final);
            return $http.get(final);

            

        },
		
		 getSearchList: function (search,page,limit) {
            var url = config.url + '/knowledgesharings/search?q=' + search+'&page=' + page + '&limit=' + limit;
            // console.log("url", url);
            return $http.get(url);

        },
		
		getSearchListPopular: function (search,page,limit) {
            var url = config.url + '/knowledgesharings/search?q=' + search+'&page=' + page + '&limit=' + limit;
            //console.log("url", url);
            return $http.get(url);

        },
		
		getSearchListCategory: function (search,page,limit) {
            var url = config.url + '/knowledgesharings/search?q=' + search+'&page=' + page + '&limit=' + limit;
            //console.log("url", url);
            return $http.get(url);

        },
		
		getSearchListCreator: function (search,page,limit) {
            var url = config.url + '/knowledgesharings/search?q=' + search+'&page=' + page + '&limit=' + limit;
            //console.log("url", url);
            return $http.post(url);

        },
		
		deleteKnowledgessharing: function (id) {
            var url = config.url + '/knowledgesharings/' + id;
            //console.log("url", url);
            return $http.delete(url);

        },
		
		
		
		getListPopular: function (limit, page) {
			
            var url = config.url + '/knowledgesharings/popular?page=' + page + '&limit=' + limit;
            //console.log(url);
            return $http.get(url);
        },
		
        getListCreator: function (limit, page,data) {
            var url = config.url + '/knowledgesharings/uploaded?page=' + page + '&limit=' + limit;
			// console.log(data);
			return $http.post(url,data);
        },
		
		getBookmarks: function (limit, page, data) {
            var url = config.url + '/knowledgesharings/bookmark?page=' + page + '&limit=' + limit;
			//console.log(url);
			return $http.post(url, data);
        },
	
        getCommentList: function (limit, page, id) {
            var url = config.url + '/knowledgesharings/comment/' + id + "?limit=" + limit + "&page=" + page;
            return $http.get(url);
        },
        comment: function(data, id){
            var url = config.url + "/knowledgesharings/comment/" + id;
            return $http.post(url, data);
        },
        replyComment: function(data, id){
            var url = config.url + "/knowledgesharings/comment/reply/" + id;
            return $http.post(url, data);
        },
        upLike: function (data, id){
			//console.log(data);
            var url = config.url + "/knowledgesharings/like/" + id;
            return $http.post(url, data);
        },

        unLike: function (data, id){
            //console.log(data);
            var url = config.url + "/knowledgesharings/unlike/" + id;
            return $http.post(url, data);
        },        
		
        Like: function(data, id){
            var url = config.url + "/knowledgesharings/like/" + id;
            return $http.post(url, data);
        },
      
		upBookmarks: function (data, id){
			//console.log(data);
            var url = config.url + "/knowledgesharings/bookmark/" + id;
            return $http.post(url, data);
        },
		
		unBookmarks: function (data, id){
			//console.log(data);
            var url = config.url + "/knowledgesharings/unbookmark/" + id;
            return $http.post(url, data);
        },
		
        downLike: function(data, id){
            var url = config.url + "/knowledgesharings/unlike/" + id;
            return $http.post(url, data);
        },
		
        getListById : function (id) {

            var url = config.url + '/knowledgesharings/' + id;
            return $http.get(url);

        },
		
		getListCategory: function (limit, page, idCategory) {
            var url = config.url + '/knowledgesharings/category/' + idCategory + '?page=' + page + '&limit=' + limit;
            //console.log(url);
            return $http.get(url);
        },
		
        getCategoryList: function () {
            var url = config.url + '/knowledgesharingcategories';
            //console.log(url);
            return $http.get(url);
        },
		
		
    };
});