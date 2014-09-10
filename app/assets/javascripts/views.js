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
    
    var content      =  '<h2 class="job_title" data-soc="'+val.soc+'">' + val.clean_title + "</h2>";
    content         += '<h3>Description</h3>';
    content         += '<h3>Description</h3>';
    content         +=  '<p>' + val.soc_data.description + '<p>';
    content         +=  '<div class="row">';
        content         +=  '<div class="span4 ">'; 
            content         +=  '<div id="total_graph" class="graph_container"></div><p class="graph_hack_lables">2010 &nbsp;  &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; 2020</p>'; 
        content         +=  '</div>';
        content         +=  '<div class="span4 graph_container" id="gender_graph"  ></div>'; 
        content         +=  '<div class="span4 graph_container" id="status_graph" ></div>'; 
    content         +=  '</div>'; 

    $('#job_detail').html(content);

    lmi.drawGraphs(job_pos);



    $(".jobsearch-link").click(function(){
        getSOCsForJobTitle($('.job_title').html());
    });

    $('#instructions').css('display', "none");

}
