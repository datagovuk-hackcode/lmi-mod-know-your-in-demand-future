
lmi = {};
lmi.jobs = [];
lmi.ready=[];
lmi.sub_jobs = [];


lmi.search = function() { 
    var region_code = $('#region_selector').val();
    
    if(region_code ==='choose') { 
        alert('You must choose a region');
    }
    else {        
        $.getJSON('http://api.lmiforall.org.uk/api/v1/ess/regions/ranksocs/'+region_code + "?callback=?", function(data){ 
          lmi.filterTopLevelResults(data);
          
        })        
    }
}


lmi.filterTopLevelResults = function(all_jobs){ 
    lmi.jobs = [];
    var results_length = all_jobs.length; 
    var number_of_results_to_return  = 5;
    var current_item;
    var current_item_index; 
     
    for (i=0; i< 20; i++) { 
        current_item_index = Math.floor((Math.random() * results_length));
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
        
        if(lmi.jobs.length >number_of_results_to_return ) { 
            i= 100;
        }
        
    }
    
    lmi.addSOCData(); 
}


lmi.addSOCData = function(){ 
    //loop through the list of soc codes we just got
    $.each(lmi.jobs, function(job_key, job_val){ 
        //get title of each of the most in demand jobs for which we only have soc codes
        $.getJSON('http://api.lmiforall.org.uk/api/v1/soc/code/' + job_val.soc + "?callback=?", function(data) { 
            if(data.title !=='Missing') {
                lmi.jobs[job_key].clean_title = data.title.replace('n.e.c.', '');
                lmi.jobs[job_key].soc_data = data;
                lmi.renderRegionResults();
            }
        });
    });
}






lmi.getDataForSOC = function(job_key) {
    this.soc = soc; 
    $.when(
        $.getJSON("http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc="+soc+"4&age=20&coarse=false", function(data){
            
        }),
        $.getJSON("http://api.lmiforall.org.uk/api/v1/ashe/estimateHours?soc="+soc+"&coarse=false", function(data){
            
        }),
        $.getJSON("http://api.lmiforall.org.uk/api/v1/wf/predict?minYear=2012&maxYear=2020&soc="+soc+"&coarse=false", function(data){
            
        })
        
        
    ).then(function() {
        lmi.renderJobDetails(job_key); 
    });
}