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
        console.log('region_code= ' + region_code);
        $.get('http://api.lmiforall.org.uk/api/ess/regions/ranksocs/'+region_code, function(data){ 
           
            lmi.ess_data = JSON.parse(data);
            lmi.regionResults();
            
        }); 

        
        
    });
});

lmi.regionResults = function() { 
    
    $('#results_container').html('');
    
    $.each(lmi.ess_data, function(key, val){ 
        
        $.get('http://api.lmiforall.org.uk/api/soc/code/' + val.soc, function(data) { 
            lmi.jobs[key] = {'soc_data': data};
            
            var content      =  '<p>' + data.title + "</p>";
            content         +=  '';
            content         +=  '';
            content         +=  '';
            content         +=  '';

            $('#results_container').append(content);
            
        });
     
        
    });
    

    
}