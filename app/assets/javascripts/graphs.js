lmi.drawGraphs = function(job_pos) { 
    lmi.morrisTotal(job_pos);
    lmi.morrisGender(job_pos);
    lmi.morrisStatus(job_pos);
}

lmi.morrisTotal = function(job_pos) { 
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'total_graph',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data:  lmi.jobs[job_pos].total_graph,
        // The name of the data record attribute that contains x-values.
        xkey: ['year'],
        // A list of names of data record attributes that contain y-values.
        ykeys: ['employment'],
        labels: ['employment'],
        yLabelFormat: function(y){ 
            return  y +'sadf ';
        }, 
        hideHover: 'always'
    });    
}


lmi.morrisGender = function(job_pos) { 
    new Morris.Donut({
        // ID of the element in which to draw the chart.
        element: 'gender_graph',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data:  lmi.jobs[job_pos].gender_graph,
        formatter: function(y,data){ 
            return y + " %"
        }
    });    
}

lmi.morrisStatus = function(job_pos) { 
    new Morris.Donut({
        // ID of the element in which to draw the chart.
        element: 'status_graph',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data:  lmi.jobs[job_pos].status_graph,
        formatter: function(y,data){ 
            return y + " %"
        }
    });
}
