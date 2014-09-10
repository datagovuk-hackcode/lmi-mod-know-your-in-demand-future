
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
    var     soc = lmi.jobs[job_key].soc; 
    
    $.when(
        $.getJSON("http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc="+soc+"&age=20&coarse=false", function(data){
            lmi.jobs[job_key].estimated_pay = data; 
        }),
        $.getJSON("http://api.lmiforall.org.uk/api/v1/ashe/estimateHours?soc="+soc+"&coarse=false", function(data){
            lmi.jobs[job_key].estimate_hours = data; 
        }),
        $.getJSON("http://api.lmiforall.org.uk/api/v1/wf/predict?minYear=2012&maxYear=2020&soc="+soc+"&coarse=false", function(data){
            lmi.jobs[job_key].wf_data = data;
            
            var offset = data.predictedEmployment[0].employment * 0.8; 
            lmi.jobs[job_key].total_graph = [];
            $.each(data.predictedEmployment, function(key, loop_val) {
                
                var employment = parseInt(loop_val.employment-offset);
                
                lmi.jobs[job_key].total_graph[key] = {'year': loop_val.year.toString(), "employment" : employment }; 
            });
        }),
        $.getJSON('http://api.lmiforall.org.uk/api/v1/wf/predict/breakdown/gender?soc=' + soc, function(data) {
            var gender_data = data.predictedEmployment[0].breakdown;
            
            var total = gender_data[0].employment + gender_data[1].employment;
            var first_pc    = parseInt(gender_data[0].employment / total *100) ;
            var second_pc   = parseInt(gender_data[1].employment / total *100) ;
                
            lmi.jobs[job_key].gender_graph = [];
            
            lmi.jobs[job_key].gender_graph[0] = { 
                label: gender_data[0].name,
                value: first_pc,
            }
            
            lmi.jobs[job_key].gender_graph[1] = { 
                label: gender_data[1].name,
                value: second_pc,
            }
        }),
        $.getJSON('http://api.lmiforall.org.uk/api/v1/wf/predict/breakdown/status?soc=' + soc, function(data) {
            var status_data = data.predictedEmployment[0].breakdown;
            
            var total = status_data[0].employment + status_data[1].employment + status_data[2].employment ;
            var first_pc    = parseInt(status_data[0].employment / total *100) ;
            var second_pc   = parseInt(status_data[1].employment / total *100) ;
            var third_pc   = parseInt(status_data[2].employment / total *100) ;
            
            lmi.jobs[job_key].status_graph = [];
            
            lmi.jobs[job_key].status_graph[0] = { 
                label: status_data[0].name,
                value: first_pc,
            }
            
            lmi.jobs[job_key].status_graph[1] = { 
                label: status_data[1].name,
                value: second_pc,
            }
            
            lmi.jobs[job_key].status_graph[2] = { 
                label: status_data[2].name,
                value: third_pc,
            }
        })    
        
        
    ).then(function() {
        lmi.renderJobDetails(job_key); 
    });
}