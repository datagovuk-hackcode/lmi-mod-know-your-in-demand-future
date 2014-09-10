lmi.drawGraph = function(val, graph_filter) { 

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
