// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require raphael
//= require morris
//= require_tree .

lmi = {};
lmi.jobs = [];
lmi.ready=[];
lmi.sub_jobs = [];

$(document).ready(function(){ 
    $('.trigger_search').click(function(){

        var region_code = $('#region_selector').val();

        //get a list of the most indemand jobs by soc code
        $.getJSON('http://api.lmiforall.org.uk/api/v1/ess/regions/ranksocs/'+region_code + "?callback=?", function(data){ 
            lmi.filterTopLevelResults(data); 
        });
    })
});

lmi.filterTopLevelResults = function(all_jobs){ 
    lmi.jobs = [];
    var results_length = all_jobs.length; 
    var number_of_results_to_return  = 5;
    var current_item;
    var current_item_index; 
     
    for (i=0; i< number_of_results_to_return; i++) { 
        current_item_index = Math.floor((Math.random() * results_length) + 1);
        current_item = all_jobs[current_item_index]
        var already_in_results = false; 
        $.each(lmi.jobs, function(key, val){
            if(val.soc==current_item.soc) { 
                already_in_results = true; 
                return false 
            }
        });
        
        if(!already_in_results) { 
            lmi.jobs.push(current_item); 
        }
        
    }
    
    lmi.regionResults(); 
}

lmi.regionResults = function() { 

    $('#results_container').html('');

    $('#job_detail').html('');
    $('#instructions').html('');

    $('#job_detail').append('<h2>Employers in your area are looking for: </h2>');  

    //loop through the list of soc codes we just got
    $.each(lmi.jobs, function(job_key, job_val){ 

        //get title of each of the most in demand jobs for which we only have soc codes
        $.getJSON('http://api.lmiforall.org.uk/api/v1/soc/code/' + job_val.soc + "?callback=?", function(data) { 
            $('#results_container').append("<p>" + data.title + '</p>');

        });
    })



}


lmi.jobDetails = function(job_pos, sub_job_pos) {

    val = lmi.jobs[job_pos].sub_jobs[sub_job_pos];
    console.log(val); 
    var content      =  '<h2 class="job_title" data-soc="'+val.soc+'">' + val.title + "</h2>";
    //content          +=  "<h3>In 2012, the number of people employed were ……..  (/wf/predict), in 2013 it was……. (/wf/predict).</h3>";
    if(val.wf_data.predictedEmployment[0].employment > val.wf_data.predictedEmployment[0].employment) {
        content        += "<h3> The number of jobs for "+val.title+" is likely to go down :(</h3>"; 
    } else { 
        content        += "<h3> The number of jobs for "+val.title+" is likely to go up next year!</h3>";
    }


    content          +=  '<h3>' + parseInt(val.percentSSV) + "% of positions for "+val.title+" are waiting for someone like you to fill them. <a class='jobsearch-link' >Click here to see available jobs.</a></h3>";

    content          +=  '<table id = "socjobsearch"> <tr> </tr> </table>';        
    content          +=  "<h3>On average, "+val.title+" earned £" + parseInt(val.ashe_data.series[0].estpay) +" per week in the year 2012.</h3>";


    content          +=  "<h2>Description</h2>";
    content          +=  '<p>' + val.description + "</p>";

    content          +=  '<h2>Qualifications</h2>';
    content          +=  '<p>' + val.qualifications + "</p>";

    content          +=  '<h3>Forecast</h3>';
    content          +=  '<select id="graph_drop_down">';
    content          +=  '<option value="">Total</option>';
    content          +=  '<option value="gender">Gender</option>';
    content          +=  '<option value="status">Status</option>';
    content          +=  '<select>';
    content          +=  '<div id="forecast"></div>';

    $('#job_detail').html(content);

    var graph_filter = $('#graph_drop_down').val();

    lmi.drawGraph(val, graph_filter);

    $('#graph_drop_down').change(function(){ 

        var graph_filter = $('#graph_drop_down').val();
        lmi.drawGraph(val, graph_filter);
    });

    $(".jobsearch-link").click(function(){
        getSOCsForJobTitle($('.job_title').html());
    });

    $('#instructions').css('display', "none");

}




lmi.drawGraph = function(val, graph_filter) { 

    console.log("SOC ");
    console.log(val.SOC);

    lmi.graph_data = [];

    $('#forecast').replaceWith("<div id='forecast'></div>");

    if(graph_filter == '') {

        var offset = val.wf_data.predictedEmployment[0].employment * 0.8; 

        $.each(val.wf_data.predictedEmployment, function(key, loop_val) {
            console.log(loop_val);
            var employment = parseInt(loop_val.employment-offset);
            lmi.graph_data[key] = {'year': loop_val.year.toString(), "employment" : employment }; 
        });

        lmi.morris();
    }


    else if(graph_filter == 'gender') { 
        $.getJSON('http://api.lmiforall.org.uk/api/v1/wf/predict/breakdown/' + graph_filter + '?soc=' + val.soc, function(data) {


            var offset = data.predictedEmployment[0].breakdown[0].employment * 0.8; 

            $.each(data.predictedEmployment, function(key, val) {
                console.log(val);
                var employment = parseInt(val.employment) - offset;
                var male; 
                var female;

                $.each(val.breakdown, function(inner_key, inner_val) {

                    if (inner_val.name === 'female') {
                        male = parseInt(inner_val.employment);
                    }
                    if (inner_val.name === 'Male') {
                        female = parseInt(inner_val.employment);
                    }
                });

                lmi.graph_data[key] = {'year': val.year.toString(), "male" : male, "female" : female }; 
            });

            lmi.morrisGender();
        });
    }  

    else if(graph_filter == 'status') { 
        $.getJSON('http://api.lmiforall.org.uk/api/v1/wf/predict/breakdown/' + graph_filter + '?soc=' + val.soc, function(data) {


            var offset = data.predictedEmployment[0].breakdown[0].employment * 0.8; 

            $.each(data.predictedEmployment, function(key, val) { 

                var employment = parseInt(val.employment) - offset;
                var pt;
                var ft;
                var se;

                $.each(val.breakdown, function(inner_key, inner_val) {
                    console.log(inner_val);
                    if (inner_val.name === 'Self Employed') {
                        se = parseInt(inner_val.employment);
                    }

                    if (inner_val.name === 'FT Employee') {
                        ft = parseInt(inner_val.employment);
                    }

                    if (inner_val.name === 'PT Employee') {
                        pt = parseInt(inner_val.employment);
                    }

                });          


                lmi.graph_data[key] = {'year': val.year.toString(), "FT Employee" : ft, "PT Employee" : pt, "Self Employed" : se }; 
            });

            lmi.morrisStatus();
        });
    }  


}

lmi.morris = function() { 
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'forecast',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data:  lmi.graph_data,
        // The name of the data record attribute that contains x-values.
        xkey: ['year'],
        // A list of names of data record attributes that contain y-values.
        ykeys: ['employment'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['employment']
    });    
}

lmi.morrisGender = function() { 
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'forecast',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data:  lmi.graph_data,
        // The name of the data record attribute that contains x-values.
        xkey: ['year'],
        // A list of names of data record attributes that contain y-values.
        ykeys: ['male', 'female'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['male', 'female']
    });    
}

lmi.morrisStatus = function() { 
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'forecast',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data:  lmi.graph_data,
        // The name of the data record attribute that contains x-values.
        xkey: ['year'],
        // A list of names of data record attributes that contain y-values.
        ykeys: ['FT Employee', 'PT Employee', 'Self Employed'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['FT Employee', 'PT Employee', 'Self Employed']
    });    
}

lmi.attachJobClicks = function() { 
    $('#results_container ul li').click(function(){
        var job_pos = $(this).attr('data-job-pos');
        var sub_job_pos = $(this).attr('data-sub-job-pos');  

        lmi.jobDetails(job_pos, sub_job_pos);
    });   
}

lmi.renderRegionResults = function() { 

    $.each(lmi.jobs, function(job_key, job_val){
        console.log('new item');
        var content = '<li>'+job_val.job_cat+'</li>';
        content += "<ul>";
        $.each(job_val.sub_jobs, function(sub_job_key, sub_job_val){
            content  +=  '<li data-soc="' + sub_job_val.soc +  '" data-job-pos=' + job_key + ' data-sub-job-pos=' + sub_job_key +' >' + sub_job_val.title + "</li>";


            if(sub_job_key == job_val.sub_jobs.length - 1) {
                content  += '</ul>';    
                $('#results_container').append(content);

                if(lmi.jobs.length - 1 == job_key){
                    console.log('clicksattached');
                    lmi.attachJobClicks();
                }
            }        
        }); 



    }); 
}
