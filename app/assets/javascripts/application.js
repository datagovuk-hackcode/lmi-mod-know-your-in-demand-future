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

$(document).ready(function(){ 
    $('#region_selector').change(function(){
        var region_code = $(this).val();

        $.getJSON('http://api.lmiforall.org.uk/api/ess/regions/ranksocs/'+region_code, function(data){ 
            lmi.jobs = data;
            lmi.regionResults();   
        }); 
    });
});

lmi.regionResults = function() { 
    
    $('#results_container').html('');

    
    $.each(lmi.jobs, function(key, val){ 
        
        
        $.getJSON('http://api.lmiforall.org.uk/api/soc/code/' + val.soc, function(data) { 
            lmi.jobs[key].soc_data = data;
                
            if(key <10) { 
                var content      =  '<li data-soc="' + lmi.jobs[key].soc_data.soc +  '">' + lmi.jobs[key].soc_data.title + "</li>";

                $('#results_container').append(content);
            }
            
            lmi.attachJobClicks();
        });
                
    });

    $.each(lmi.jobs, function(key, val){ 
        
        $.getJSON('http://api.lmiforall.org.uk/api/ashe/estimate?soc=' + val.soc, function(data) {
            lmi.jobs[key].ashe_data = data;
        });
                
    });  
    
    
    $.each(lmi.jobs, function(key, val){ 
        $.getJSON('http://api.lmiforall.org.uk/api/wf/predict?minYear=2012&maxYear=2020&soc=' + val.soc, function(data) {
            lmi.jobs[key].wf_data = data;
        });
    });
    
    

    
}




lmi.jobDetails = function(soc) { 
    $.each(lmi.jobs, function(key,val) { 
        console.log(val.soc_data);
        if(val.soc_data.soc == soc) {
            var content      =  '<h2>' + val.soc_data.title + "</h2>";
            content          +=  '<p>' + val.soc_data.description + "</p>";
            content          +=  '<h3>Qualifications</h3>';
            content          +=  '<p>' + val.soc_data.qualifications + "</p>";
            content          +=  '<h3>Pay</h3>';
            content          +=  '<ul class="pay">';
            
            $.each(val.ashe_data.years, function(ashe_key, ashe_val) {
                content          +=  '<li>' + ashe_val.year + ' : £' + parseInt(ashe_val.estpay) + ' per week</li>';
            });
            
            content          +=  '</ul>';
            content          +=  '<h3>Forecast</h3>';
            content          +=  '<div id="forecast"></div>';
            

            
            
            $('#job_detail').html(content);
            
            lmi.graph_data = [];
            console.log(val.wf_data.predictedEmployment);
            var offset = val.wf_data.predictedEmployment[0].employment *0.8; 
            
            $.each(val.wf_data.predictedEmployment, function(key, val) { 
               lmi.graph_data[key] = {'year': val.year.toString(), "employment" : val.employment-offset}; 
            });
            
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

            $('#instructions').css('display', "none");
        }
    });
}

lmi.attachJobClicks = function() { 
    $('#results_container li').click(function(){ 
        var soc = $(this).attr('data-soc');  
        lmi.jobDetails(soc);
    });   
}