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

        $.getJSON('http://api.lmiforall.org.uk/api/v1/ess/regions/ranksocs/'+region_code + "?callback=?", function(data){ 
            lmi.jobs = [];
            lmi.jobs = data.slice(0, 10);
            lmi.regionResults();   
        }); 
    });
});

lmi.regionResults = function() { 
    
    $('#results_container').html('');

    
    $.each(lmi.jobs, function(key, val){ 
          
        $.getJSON('http://api.lmiforall.org.uk/api/v1/soc/code/' + val.soc + "?callback=?", function(data) { 
            lmi.jobs[key].soc_data = data;

        });
                
    });




    $.each(lmi.jobs, function(key, val){
        $.getJSON('http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc=' + val.soc + "&callback=?", function(data) {
            lmi.jobs[key].ashe_data = data;
            console.log("----> " + key);
            console.log("----> " + key);
            if(key == lmi.jobs.length-1) { 
                lmi.renderRegionResults();
                
            }
        });         
    });  
    
    
    $.each(lmi.jobs, function(key, val){ 
        $.getJSON('http://api.lmiforall.org.uk/api/v1/wf/predict?minYear=2012&maxYear=2020&soc=' + val.soc + "&callback=?", function(data) {
            lmi.jobs[key].wf_data = data;
        });
    });    
}


lmi.jobDetails = function(soc) { 
    
    console.log(lmi.jobs);
    $.each(lmi.jobs, function(key,val) {
        
        lmi.current_item = val;
        
        if(val.soc_data.soc == soc) {
            var content      =  '<h2 data-soc="'+soc+'">' + val.soc_data.title + "</h2>";
            content          +=  '<p>' + val.soc_data.description + "</p>";
            content          +=  '<p><strong>Vacancies that are hard to fill:</strong> ' + parseInt(val.percentHTF) + "%</p>";
            content          +=  '<p><strong>Vacancies unfilled due to skills shortage: </strong> ' + parseInt(val.percentSSV) + "%</p>";
            content          +=  '<h3>Qualifications</h3>';
            content          +=  '<p>' + val.soc_data.qualifications + "</p>";
            content          +=  '<h3>Pay</h3>';
            content          +=  '<ul class="pay">';
            
            console.log(val.ashe_data); 

            $.each(val.ashe_data.series, function(ashe_key, ashe_val) {
                content          +=  '<li>' + ashe_val.year + ' : £' + parseInt(ashe_val.estpay) + ' per week</li>';
            });
            
            content          +=  '</ul>';
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
                lmi.drawGraph(lmi.current_item, graph_filter);
            });

            $('#instructions').css('display', "none");
        }
    });
}




lmi.drawGraph = function(val, graph_filter) { 
    lmi.graph_data = [];
    //graph_filter= '';
    
    
    $('#forecast').replaceWith("<div id='forecast'></div>");
    console.log(graph_filter);
    if(graph_filter == '') { 
 
        var offset = val.wf_data.predictedEmployment[0].employment * 0.8; 
    
        $.each(val.wf_data.predictedEmployment, function(key, val) { 
           var employment = parseInt(val.employment-offset);
           lmi.graph_data[key] = {'year': val.year.toString(), "employment" : employment }; 
        });
        lmi.morris();
    }
    
    
    
    else if(graph_filter == 'gender') { 
        $.getJSON('http://api.lmiforall.org.uk/api/v1/wf/predict/breakdown/' + graph_filter + '?soc=' + val.soc, function(data) {
            
        console.log(data);
        var offset = data.predictedEmployment[0].breakdown[0].employment * 0.8; 

        $.each(data.predictedEmployment, function(key, val) { 
            console.log(val);
            var employment = parseInt(val.employment) - offset;
            var male = parseInt(val.breakdown[0].employment);
            var female = parseInt(val.breakdown[1].employment);
            lmi.graph_data[key] = {'year': val.year.toString(), "male" : male, "female" : female }; 
        });

        lmi.morrisGender();
         });
    }  
    
    else if(graph_filter == 'status') { 
        $.getJSON('http://api.lmiforall.org.uk/api/v1/wf/predict/breakdown/' + graph_filter + '?soc=' + val.soc, function(data) {
            
        console.log(data);
        var offset = data.predictedEmployment[0].breakdown[0].employment * 0.8; 

        $.each(data.predictedEmployment, function(key, val) { 
            console.log(val);
            var employment = parseInt(val.employment) - offset;
            var ft = parseInt(val.breakdown[0].employment);
            var pt = parseInt(val.breakdown[1].employment);
            var se = parseInt(val.breakdown[2].employment);
            
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
    $('#results_container li').click(function(){ 
        var soc = $(this).attr('data-soc');  
        lmi.jobDetails(soc);
    });   
}

lmi.renderRegionResults = function() { 
    $.each(lmi.jobs, function(key, val){ 
          
        var content      =  '<li data-soc="' + lmi.jobs[key].soc_data.soc +  '">' + lmi.jobs[key].soc_data.title + "</li>";
        $('#results_container').append(content);
        lmi.attachJobClicks();
                
    }); 
}

