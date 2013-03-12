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
//= require_tree .

lmi = {};
lmi.jobs = [];
lmi.ready=[];

$(document).ready(function(){ 
    $('#region_selector').change(function(){
        var region_code = $(this).val();

        $.getJSON('http://api.lmiforall.org.uk/api/ess/regions/ranksocs/'+region_code, function(data){ 
           
            lmi.ess_data = data;
            lmi.regionResults();
            
        }); 
    });
});

lmi.regionResults = function() { 
    
    $('#results_container').html('');
    
    lmi.jobs = [];
    
    $.each(lmi.ess_data, function(key, val){ 
        
        
        $.getJSON('http://api.lmiforall.org.uk/api/soc/code/' + val.soc, function(data) { 
            lmi.jobs[key] = {};
            lmi.jobs[key].soc_data = data;
                
            if(key <10) { 
                var content      =  '<li>' + lmi.jobs[key].soc_data.title + "</li>";

                $('#results_container').append(content);
            }
        });
        
        $.getJSON('http://api.lmiforall.org.uk/api/ashe/estimate?soc=' + val.soc, function(data) { 
            lmi.jobs[key] = {};
            lmi.jobs[key].ashe_data = data;
        });
     
        
    });
}

lmi.jobDetails = function(soc) { 
    $.each(lmi.jobs, function(key,val) { 
        if(val.soc_data.soc == soc) {
            
 
        }
    });
}