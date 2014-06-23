function getSOCsForJobTitle() {
	var keyword = $('.job_title').html();
	var postcode = 'e29qy';//$("#postcode").val();
	var apiurl =  "http://api.lmiforall.org.uk/api/v1/vacancies/search?postcode="
	var apiurl2 = "&keywords="
	var apicall = apiurl + postcode + apiurl2 + keyword;

	$.get(apicall, function (data) {
		$("#socjobsearch tbody").html("<td align='center' style='background-color:#ebf5ff'><font color='white'>Job title</font></td><td align='center' style='background-color:#ebf5ff'><font color='white'>Company name</font></td>");
		$.each(data, function(i, e) {

			(function (soc){
				var tablerow = $ ("<tr></tr>")
				tablerow.append ("<td valign='top' width='auto' height='auto' style='background-color:#f4ffff; padding:5px 5px 5px 5px;'><b>" + e.title + "</b></td>");
				tablerow.append ("<td valign='top' width='auto' height='auto' style='background-color:#f4ffff; padding:5px 5px 5px 5px;'><b>" + e.company + "</b></td>");

				tablerow.click(function() {
					getMoreInfo(soc);
					getUnemployment(soc);
				});

				$("#socjobsearch tbody").append (tablerow)
		})(e.soc);
		});
	});

}

function getMoreInfo (socCode) {

	var apiurl = "http://api.lmiforall.org.uk/api/v1/soc/code/";
	var apicall = apiurl + socCode;
	$.get(apicall, function(data) {
		$("#jobinfo").html("");
		$("#jobinfo").append("<h4>" + data.title + "</h4>");
		$("#jobinfo").append(data.description);
	});

}

function getUnemployment (socCode){
	var apiurl = "http://api.lmiforall.org.uk/api/v1/lfs/unemployment?soc=";
	var apicall = apiurl + socCode;
	$.get(apicall, function(data) {
		$("#unemployment tbody").html("");
			$.each(data.years, function (i, e) {
				var tablerow = $ ("<tr></tr>");
				tablerow.append ("<td>" + e.year + "</td>");
				tablerow.append ("<td>" + e.unemprate + "</td>");
								$("#unemployment tbody").append(tablerow);
	});
	});
}



$(function() {

	$("#jobsearch-button").click (getSOCsForJobTitle);

});