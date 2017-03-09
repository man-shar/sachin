var avg_width=800;
var avg_height=400;
var padding=50;
var svg=d3.select("body").append("svg").attr("height",avg_height+padding).attr("width",avg_width+padding).attr("class","avg_viz");
d3.csv("data/a/combined.csv",function(data){
	avg=data;
	var g=svg.append("g").attr("width",avg_width).attr("transform","translate(20,0)").attr("height",avg_height);
	var yscale=d3.scaleLinear().domain([1,100]).range([avg_height,0]);
	var xscale=d3.scaleLinear().domain([1,700]).range([0,avg_width]);
	var xaxis=d3.axisBottom(xscale);
	var yaxis=d3.axisLeft(yscale);

	var create_x_axis=g.append("g").attr("transform","translate(0,"+avg_height+")").call(xaxis);
	var create_y_axis=g.append("g").call(yaxis);

	g.append("path").attr("class","line sachin").style("stroke","red").data([avg]).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d){return xscale(d.Mat);}).y(function(d){return yscale(d.Sachin_Runs);}));
	//g.append("path").attr("class","line viv").data([avg]).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d){return xscale(d.Mat);}).y(function(d){return yscale(d.Viv_Runs);}));
	g.append("path").attr("class","line ponting").data([avg]).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d){return xscale(d.Mat);}).y(function(d){return yscale(d.Ponting_Runs);}));
	g.append("path").attr("class","line dravid").data([avg]).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d){return xscale(d.Mat);}).y(function(d){return yscale(d.Dravid_Runs);}));
	g.append("path").attr("class","line kallis").data([avg]).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d){return xscale(d.Mat);}).y(function(d){return yscale(d.Kallis_Runs);}));

});
