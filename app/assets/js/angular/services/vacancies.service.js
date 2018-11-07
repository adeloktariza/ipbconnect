app.factory('VacancySvc', function ($http, config) {
    return {

        getLowongans: function (limit, offset, query) {
            if(query == undefined){
                query = "";
            }
            var title = query.title == undefined ? "" : query.title;
            var salaryMin = query.salaryMin == undefined ? "" : query.salaryMin;
            var jobLocationId = query.jobLocationId == undefined ? "" : query.jobLocationId;
            var studyProgramId = query.studyProgramId == undefined ? "" : query.studyProgramId;

            var filter1 = '&title=' + title;
            var filter2 = '&salaryMin=' + salaryMin;
            var filter3 = '&jobLocationId=' + jobLocationId;
            var filter4 = '&studyProgramId=' + studyProgramId;

            var url = config.url + '/vacancies';
            var limit = '?limit=' + limit;
            var offset = '&page=' + offset;
            //var filter1 = '&lowongan=' + lowongan;

            var final = url + limit + offset +  filter4 + filter1 + filter2 + filter3;
            console.log("url", final);
            return $http.get(final);
        },
        getVacancyByCreator: function (limit, page, id) {
            var id = id == undefined ? "" : id;
            var filter1 = '&createdBy=' + id;
            var url = config.url + '/vacancies?limit=' + limit + '&page=' + page;
            var final = url + filter1;
             console.log("url", final);
            return $http.get(final);
        },
        updateVacancy: function (data, id) {
            var url = config.url + '/vacancies/' + id;
            return $http.put(url, data);
        },
        createLowongan: function (data) {
            var url = config.url + '/vacancies';
            return $http.post(url, data);
        },
        getVacancyById: function(data){
            var id = data;
            var url = config.url + '/vacancies/' + id;
            return $http.get(url);
        },
        deleteVacancy: function (id) {
            var url = config.url + '/vacancies/' + id;
            return $http.delete(url);
        }
    };
});