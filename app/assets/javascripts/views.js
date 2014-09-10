$(document).ready(function(){ 
    $('.trigger_search').click(function(){
         lmi.search();
    })
});



lmi.renderRegionResults = function() { 
    $('.job_choices').css('display', 'block');
    $('#results_container').html('');
    $('#job_detail').html('');
    $('#instructions').html('');
    $('#job_detail').append('<p>Anything take your fancy? </p>');  
    
    $.each(lmi.jobs, function(job_key, job_val){ 
        $('#results_container').append("<li data-key='"+job_key+"' >" + job_val.clean_title + '</li>');
    });
    
    lmi.attachJobClicks();
}

lmi.attachJobClicks = function() { 
    $('#results_container li').unbind('click');
    $('#results_container li').click(function(){
        var job_pos = $(this).attr('data-key');
        lmi.getDataForSOC(job_pos);
    }); 
}

lmi.renderJobDetails = function(job_pos) {

    val = lmi.jobs[job_pos];
    var content      =  '<h2 class="job_title" data-soc="'+val.soc+'">' + val.title + "</h2>";
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
