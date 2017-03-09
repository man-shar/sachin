var width=600;
var height=400;
var padding=100;


//number of matches for each player
var matches={

	"Sachin":664,
	"Kallis":519,
	"Ponting":560,
	"Dravid":509,
	"Viv":309,
	"Bradman":53,
};

//colours for particular player
var colourmap={
	'#d7191c':"Sachin",
	'#b15928':"Ponting",
	'#2b83ba':"Dravid",
	'#6a3d9a':"Kallis",
	"#33a02c":"Viv",
	"#ff7f00":"Bradman"
};
//map from player to colour
var playermap={
	"Sachin":'#d7191c',
	"Ponting":'#b15928',
	"Dravid":'#2b83ba',
	"Kallis":'#6a3d9a',
	"Viv":"#33a02c",
	"Bradman":"#ff7f00"
};

//used for d3 filter method to filter out undefined values
function exists(x){
	return (x!="");
}

//averages visualization
function avg_viz(stat){

	var avg_svg=d3.select(".average_viz").append("svg").attr("height",height+padding).attr("width",width+padding+300).attr("class","avg_viz");
	var g=avg_svg.append("g").attr("width",width+100).attr("transform","translate(50,50)").attr("height",height);
	var xlabel=g.append("text").text("Average").attr("x",-height/2).style("text-anchor", "middle").attr("y",-35).attr("transform", "rotate(-90)").style("font-size",12);
	var ylabel=g.append("text").text("Match Number").attr("x",width/2).style("text-anchor", "middle").attr("y",height+35).style("font-size","12");


	var legend=avg_svg.append("g").attr("class","legend").attr("width",200).attr("transform","translate(800,50)").attr("height",100);
	var c=0;

	//create legend for each player
	for (i in colourmap){
		var elem=legend.append("g").attr("height","10").attr("transform",function(){return "translate"+"(5,"+c*18+")"});
		elem.append("rect").attr("height",12).attr("width",12).style("fill",i).attr("x",5);
		elem.append("text").text(colourmap[i]).attr("x",20).attr("y",11).style("font-size",14);
		c++;
	}

	//define scales for the axis and create axis

	var yscale=d3.scaleLinear().domain([1,120]).range([height,0]);
	var xscale=d3.scaleLinear().domain([1,700]).range([0,width]);
	var xaxis=d3.axisBottom(xscale);
	var yaxis=d3.axisLeft(yscale);

	var create_x_axis=g.append("g").attr("transform","translate(0,"+(height)+")").call(xaxis);
	var create_y_axis=g.append("g").call(yaxis);

	//create maps from the player details
	var sachin=[Object.values(stat.map(function(d) { return d["Sachin_Ave"];}).filter(exists))];
	var ponting=[Object.values(stat.map(function(d) { return d["Ponting_Ave"];}).filter(exists))];
	var kallis=[Object.values(stat.map(function(d) { return d["Kallis_Ave"];}).filter(exists))];
	var dravid=[Object.values(stat.map(function(d) { return d["Dravid_Ave"];}).filter(exists))];
	var viv=[Object.values(stat.map(function(d) { return d["Viv_Ave"];}).filter(exists))];
	var bradman=[Object.values(stat.map(function(d) { return d["Bradman_Ave"];}).filter(exists))];

	//create path for each player
	g.append("path").attr("class","line sachin").style("stroke",playermap["Sachin"]).data(sachin).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line ponting").style("stroke",playermap["Ponting"]).data(ponting).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line dravid").style("stroke",playermap["Dravid"]).data(dravid).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line kallis").style("stroke",playermap["Kallis"]).data(kallis).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line viv").style("stroke",playermap["Viv"]).data(viv).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line bradman").style("stroke",playermap["Bradman"]).data(bradman).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	var tooltip=g.append("g").attr("class","tooltip avg").style("display","none");
	var marker=tooltip.append("line").attr("class","marker").attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",height);
	var desc=tooltip.append("g").attr("class","description");


//add text to rollover//
desc.append("rect").attr("height",140).attr("width",150);
g.append("rect")
.attr("width", width)
.attr("height", height)
.attr("class","overlay")
.on("mouseover",function(){
	desc.selectAll("text").remove();

	d3.selectAll(".description").selectAll("text").remove();
	d3.selectAll(".tooltip.avg").style("display",null)})
.on("mouseout",function(){
	d3.selectAll(".tooltip.avg").style("display","none");;
	desc.selectAll("text").remove();
	d3.selectAll(".description").selectAll("text").remove();
})	
.on("mousemove",function(){

	desc.selectAll("text").remove();
    //getmouse coordinates
	mouseX=d3.mouse(this)[0];
	marker.attr("x1",mouseX).attr("x2",mouseX);
    //get match number from x coordinate by inverting cale
	var match=Math.ceil(xscale.invert(mouseX));
    //append text to tooltip
	desc.attr("transform","translate("+mouseX+",10)");
	desc.append("text").text("Match number: "+match).style("font-weight",600).style("color","#666").attr("y",function(){return (1)*1.3+"em" ;}).attr("x",5);
	desc.append("text").text(function(){
		if((match)<matches["Sachin"])
			return ("Sachin: "+sachin[0][match-1]);
		else
			return "Sachin: NA";
	}).attr("y",function(){return (2)*1.3+"em" ;}).attr("x",5);
	desc.append("text").text(function(){
		if((match)<matches["Kallis"])
			return ("Kallis: "+kallis[0][match-1]);
		else
			return "Kallis: NA";
	}).attr("y",function(){return (3)*1.3+"em" ;}).attr("x",5);
	desc.append("text").text(function(){
		if((match)<matches["Ponting"])
			return ("Ponting: "+ponting[0][match-1]);
		else
			return "Ponting: NA";
	}).attr("y",function(){return (4)*1.3+"em" ;}).attr("x",5);
	desc.append("text").text(function(){
		if((match)<matches["Dravid"])
			return ("Dravid: "+dravid[0][match-1]);
		else
			return "Dravid: NA";
	}).attr("y",function(){return (5)*1.3+"em" ;}).attr("x",5);
	desc.append("text").text(function(){
		if((match)<matches["Viv"])
			return ("Viv: "+viv[0][match-1]);
		else
			return "Viv: NA";
	}).attr("y",function(){return (6)*1.3+"em" ;}).attr("x",5);
	desc.append("text").text(function(){
		if((match)<matches["Bradman"])
			return ("Bradman: "+bradman[0][match-1]);
		else
			return "Bradman: NA";
	}).attr("y",function(){return (7)*1.3+"em" ;}).attr("x",5);

});

}


function runs_viz(stat){
	var runs_svg=d3.select(".runs_viz").append("svg").attr("height",height+padding).attr("width",width+padding+300).attr("class","runs_viz");
	var g=runs_svg.append("g").attr("width",width).attr("transform","translate(50,50)").attr("height",height);


	var legend=runs_svg.append("g").attr("class","legend").attr("width",200).attr("transform","translate(800,50)").attr("height",100);
	var c=0;
	//create legend for each player
	for (i in colourmap){
		var elem=legend.append("g").attr("height","10").attr("transform",function(){return "translate"+"(5,"+c*18+")"});
		elem.append("rect").attr("height",12).attr("width",12).style("fill",i).attr("x",5);
		elem.append("text").text(colourmap[i]).attr("x",20).attr("y",11).style("font-size",14);
		c++;
	}
	var xlabel=g.append("text").text("Runs").attr("x",-height/2).style("text-anchor", "middle").attr("y",-35).attr("transform", "rotate(-90)").style("font-size",12);
	var ylabel=g.append("text").text("Match Number").attr("x",width/2).style("text-anchor", "middle").attr("y",height+35).style("font-size","12");

	//define scales for the axis and create axis

	var yscale=d3.scaleLinear().domain([1,36000]).range([height,0]);
	var xscale=d3.scaleLinear().domain([1,700]).range([0,width]);
	var xaxis=d3.axisBottom(xscale);
	var yaxis=d3.axisLeft(yscale).tickFormat(d3.formatPrefix(",.0",1e3));
    //create maps from the player details
	var sachin=[Object.values(stat.map(function(d) { return d["Sachin_Runs"];}).filter(exists))];
	var ponting=[Object.values(stat.map(function(d) { return d["Ponting_Runs"];}).filter(exists))];
	var kallis=[Object.values(stat.map(function(d) { return d["Kallis_Runs"];}).filter(exists))];
	var dravid=[Object.values(stat.map(function(d) { return d["Dravid_Runs"];}).filter(exists))];
	var viv=[Object.values(stat.map(function(d) { return d["Viv_Runs"];}).filter(exists))];
	var bradman=[Object.values(stat.map(function(d) { return d["Bradman_Runs"];}).filter(exists))];


	var create_x_axis=g.append("g").attr("transform","translate(0,"+(height)+")").call(xaxis);
	var create_y_axis=g.append("g").call(yaxis);

	//create path for each player
	g.append("path").attr("class","line sachin").style("stroke",playermap["Sachin"]).data(sachin).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line ponting").style("stroke",playermap["Ponting"]).data(ponting).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line dravid").style("stroke",playermap["Dravid"]).data(dravid).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line kallis").style("stroke",playermap["Kallis"]).data(kallis).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line viv").style("stroke",playermap["Viv"]).data(viv).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line bradman").style("stroke",playermap["Bradman"]).data(bradman).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));


	var tooltip=g.append("g").attr("class","tooltip runs").style("display","none");
	var marker=tooltip.append("line").attr("class","marker").attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",height);
	var desc=tooltip.append("g").attr("class","description");

//add text to rollover
	desc.append("rect").attr("height",140).attr("width",150);
	g.append("rect")
	.attr("width", width)
	.attr("height", height)
	.attr("class","overlay")
	.on("mouseover",function(){
		desc.selectAll("text").remove();
		
		d3.selectAll(".description").selectAll("text").remove();
		d3.selectAll(".tooltip.runs").style("display",null)})
	.on("mouseout",function(){
		desc.selectAll("text").remove();
		d3.selectAll(".description").selectAll("text").remove();
		d3.selectAll(".tooltip.runs").style("display","none");})
	.on("mousemove",function(){
		desc.selectAll("text").remove();
        //get mouse coordinates
		mouseX=d3.mouse(this)[0];
		marker.attr("x1",mouseX).attr("x2",mouseX);
        //get match number from mouse coordinate by inverting the scale
		var match=Math.ceil(xscale.invert(mouseX));
        //append text to tooltip
		
		desc.attr("transform","translate("+mouseX+",10)");
		desc.append("text").text("Match number: "+match).style("font-weight",600).style("color","#666").attr("y",function(){return (1)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Sachin"])
				return ("Sachin: "+sachin[0][match-1]);
			else
				return "Sachin: NA";
		}).attr("y",function(){return (2)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Kallis"])
				return ("Kallis: "+kallis[0][match-1]);
			else
				return "Kallis: NA";
		}).attr("y",function(){return (3)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Ponting"])
				return ("Ponting: "+ponting[0][match-1]);
			else
				return "Ponting: NA";
		}).attr("y",function(){return (4)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Dravid"])
				return ("Dravid: "+dravid[0][match-1]);
			else
				return "Dravid: NA";
		}).attr("y",function(){return (5)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Viv"])
				return ("Viv: "+viv[0][match-1]);
			else
				return "Viv: NA";
		}).attr("y",function(){return (6)*1.3+"em" ;}).attr("x",5);desc.append("text").text(function(){
			if((match)<matches["Bradman"])
				return ("Bradman: "+bradman[0][match-1]);
			else
				return "Bradman: NA";
		}).attr("y",function(){return (7)*1.3+"em" ;}).attr("x",5);
//		debugger;
});

}

function wickets_viz(stat){
	var wickets_svg=d3.select(".wickets_viz").append("svg").attr("height",height+padding).attr("width",width+padding+300).attr("class","wkts_viz");
	var g=wickets_svg.append("g").attr("width",width).attr("transform","translate(50,50)").attr("height",height);


	var legend=wickets_svg.append("g").attr("class","legend").attr("width",200).attr("transform","translate(800,50)").attr("height",100);
	var c=0;
	//create legend for each player
	for (i in colourmap){
		var elem=legend.append("g").attr("height","10").attr("transform",function(){return "translate"+"(5,"+c*18+")"});
		elem.append("rect").attr("height",12).attr("width",12).style("fill",i).attr("x",5);
		elem.append("text").text(colourmap[i]).attr("x",20).attr("y",11).style("font-size",14);
		c++;
	}


	var xlabel=g.append("text").text("Wickets").attr("x",-height/2).style("text-anchor", "middle").attr("y",-35).attr("transform", "rotate(-90)").style("font-size",12);
	var ylabel=g.append("text").text("Match Number").attr("x",width/2).style("text-anchor", "middle").attr("y",height+35).style("font-size","12");


	//define scales for the axis and create axis

	var yscale=d3.scaleLinear().domain([1,600]).range([height,0]);
	var xscale=d3.scaleLinear().domain([1,700]).range([0,width]);
	var xaxis=d3.axisBottom(xscale);
	var yaxis=d3.axisLeft(yscale);
    //create maps from the player details
	var sachin=[Object.values(stat.map(function(d) { return d["Sachin_Wkts"];}).filter(exists))];
	var ponting=[Object.values(stat.map(function(d) { return d["Ponting_Wkts"];}).filter(exists))];
	var kallis=[Object.values(stat.map(function(d) { return d["Kallis_Wkts"];}).filter(exists))];
	var dravid=[Object.values(stat.map(function(d) { return d["Dravid_Wkts"];}).filter(exists))];
	var viv=[Object.values(stat.map(function(d) { return d["Viv_Wkts"];}).filter(exists))];
	var bradman=[Object.values(stat.map(function(d) { return d["Bradman_Wkts"];}).filter(exists))];

	var create_x_axis=g.append("g").attr("transform","translate(0,"+(height)+")").call(xaxis);
	var create_y_axis=g.append("g").call(yaxis);

	//create path for each player
	g.append("path").attr("class","line sachin").style("stroke",playermap["Sachin"]).data(sachin).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line ponting").style("stroke",playermap["Ponting"]).data(ponting).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line dravid").style("stroke",playermap["Dravid"]).data(dravid).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line kallis").style("stroke",playermap["Kallis"]).data(kallis).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line viv").style("stroke",playermap["Viv"]).data(viv).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	g.append("path").attr("class","line bradman").style("stroke",playermap["Bradman"]).data(bradman).attr("d",d3.line().curve(d3.curveStepBefore).x(function(d,i){return xscale(i+1);}).y(function(d){return yscale(d);}));

	var tooltip=g.append("g").attr("class","tooltip wkts").style("display","none");
	var marker=tooltip.append("line").attr("class","marker").attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",height);
	var desc=tooltip.append("g").attr("class","description");


    //add text to rollover
	desc.append("rect").attr("height",140).attr("width",150);

	//append background rectangle
	g.append("rect")
	.attr("width", width)
	.attr("height", height)
	.attr("class","overlay")
	.on("mouseover",function(){

        //remove text for fresh rollover
		desc.selectAll("text").remove();		
		d3.selectAll(".description").selectAll("text").remove();
		d3.selectAll(".tooltip.wkts").style("display",null)
    })
	.on("mouseout",function(){
        //remove text from tooltip and hide the tooltip.
		desc.selectAll("text").remove();
		d3.selectAll(".description").selectAll("text").remove();
		d3.selectAll(".tooltip.wkts").style("display","none");
    })
	.on("mousemove",function(){
		desc.selectAll("text").remove();
        //get mouse coordinates
		mouseX=d3.mouse(this)[0];
		marker.attr("x1",mouseX).attr("x2",mouseX);
        //get match number from mouse coordinate by inverting the scale
		var match=Math.ceil(xscale.invert(mouseX));

        //append text to tooltip		
		desc.attr("transform","translate("+mouseX+",10)");

		desc.append("text").text("Match number: "+match).style("font-weight",600).style("color","#666").attr("y",function(){return (1)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Sachin"])
				return ("Sachin: "+sachin[0][match-1]);
			else
				return "Sachin: NA";
		}).attr("y",function(){return (2)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Kallis"])
				return ("Kallis: "+kallis[0][match-1]);
			else
				return "Kallis: NA";
		}).attr("y",function(){return (3)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Ponting"])
				return ("Ponting: "+ponting[0][match-1]);
			else
				return "Ponting: NA";
		}).attr("y",function(){return (4)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Dravid"])
				return ("Dravid: "+dravid[0][match-1]);
			else
				return "Dravid: NA";
		}).attr("y",function(){return (5)*1.3+"em" ;}).attr("x",5);
		desc.append("text").text(function(){
			if((match)<matches["Viv"])
				return ("Viv: "+viv[0][match-1]);
			else
				return "Viv: NA";
		}).attr("y",function(){return (6)*1.3+"em" ;}).attr("x",5);desc.append("text").text(function(){
			if((match)<matches["Bradman"])
				return ("Bradman: "+bradman[0][match-1]);
			else
				return "Bradman: NA";
		}).attr("y",function(){return (7)*1.3+"em" ;}).attr("x",5);
//		debugger;
});

}

function kvs_viz(stat){
	var kvs_svg=d3.select(".kvs_viz").append("svg").attr("height",height+padding).attr("width",width+padding+300).attr("class","kvs_viz");
	var gs=kvs_svg.append("g").attr("class","kvg_svg").attr("width",width).attr("transform","translate(50,50)").attr("height",height);

	var gk=kvs_svg.append("g").attr("class","kvg_svg").attr("width",width).attr("transform","translate(50,50)").attr("height",height);

	var tooltip=kvs_svg.append("g").attr("class","description").style("display","none");

	//define scales for the axis and create axis

	var yscale=d3.scaleLinear().domain([0,1]).range([height,0]);
	var xscale=d3.scaleLinear().domain([1,500]).range([0,width]);
	var xaxis=d3.axisBottom(xscale);
	var yaxis=d3.axisLeft(yscale);

	var xlabel=gs.append("text").text("Fraction of player score/team total").attr("x",-height/2).style("text-anchor", "middle").attr("y",-35).attr("transform", "rotate(-90)").style("font-size",12);
	var ylabel=gs.append("text").text("Match Number").attr("x",width/2).style("text-anchor", "middle").attr("y",height+35).style("font-size","12");


	var legend=kvs_svg.append("g").attr("class","legend").attr("width",200).attr("transform","translate(800,50)").attr("height",100);
	
	
	var elem=legend.append("g").attr("height","10").attr("transform",function(){return "translate"+"(5,"+"0)"});
	elem.append("rect").attr("height",12).attr("width",12).style("fill",playermap["Sachin"]).attr("x",5);
	elem.append("text").text("Sachin").attr("x",20).attr("y",11).style("font-size",14);
	var elem=legend.append("g").attr("height","10").attr("transform",function(){return "translate"+"(5,"+18+")"});
	elem.append("rect").attr("height",12).attr("width",12).style("fill",playermap["Kallis"]).attr("x",5);
	elem.append("text").text("Kallis").attr("x",20).attr("y",11).style("font-size",14);
	
	//variables for sachin's and kallis's data
	var sdata = stat.map(function(d){
		robj={};
		robj["Mat"]=d.Mat;
		robj["Sachin_P"]=d.Sachin_P;
		robj["Sachin_Score"]=d.Sachin_Score;
		robj["Sachin_Date"]=d.Sachin_Date;
		robj["Sachin_Match"]=d.Sachin_Match;
		robj["Sachin_TS"]=d.Sachin_TS;
		robj["Sachin_OS"]=d.Sachin_OS;
		robj["Sachin_Result"]=d.Sachin_Result;
		
		return robj;
	}).filter(function(d){
		return (+d.Sachin_P)>=0.25&&(d.Sachin_Result)!="No Result";//filter out the matches with no result
	});
	
	var kdata = stat.map(function(d){
		robj={};
		robj["Mat"]=d.Mat;
		robj["Kallis_P"]=d.Kallis_P;
		robj["Kallis_Score"]=d.Kallis_Score;
		robj["Kallis_Date"]=d.Kallis_Date;
		robj["Kallis_Match"]=d.Kallis_Match;
		robj["Kallis_TS"]=d.Kallis_TS;
		robj["Kallis_OS"]=d.Kallis_OS;
		robj["Kallis_Result"]=d.Kallis_Result;
		
		return robj;
	}).filter(function(d){
		return (+d.Kallis_P)>=0.25&&(d.Kallis_Result)!="No Result";//filter out the matches with no result
	});


	var create_x_axis=gs.append("g").attr("transform","translate(0,"+(height)+")").call(xaxis);
	var create_y_axis=gs.append("g").call(yaxis);

	gs.selectAll("circle").data(sdata).enter().append("circle").attr("cx",function(d,i){return xscale(d.Mat)}).attr("cy",function(d){return yscale(d.Sachin_P)}).attr("r",10).style("opacity",0.4).style("stroke","black").style("stroke-width","1px").attr("class","sachin sachin_percentage").style("fill",playermap["Sachin"]).on("mouseover",function(d){
		d3.select(this).style("stroke","orange");
		var mouse=d3.mouse(this);
		tooltip.attr("transform","translate("+(mouse[0]+60)+","+(mouse[1]-70)+")");
		tooltip.append("rect").attr("height",130).attr("width",200);
		tooltip.style("display",null);
		tooltip.append("text").text("Sachin Tendulkar:").style("font-weight",600).attr("y",function(){return (1)*1.3+"em" ;}).attr("x",5);;
		tooltip.append("text").text("Percentage: "+Math.round(d.Sachin_P*8000)/100+"%").attr("y",function(){return (2)*1.3+"em" ;}).attr("x",5);;
		tooltip.append("text").text("Match: "+d.Sachin_Match).attr("y",function(){return (3)*1.3+"em" ;}).attr("x",5);;
		tooltip.append("text").text("Date: "+d.Sachin_Date).attr("y",function(){return (4)*1.3+"em" ;}).attr("x",5);;
		tooltip.append("text").text("Score: "+d.Sachin_Score).attr("y",function(){return (5)*1.3+"em" ;}).attr("x",5);;
		tooltip.append("text").text("Team Score: "+d.Sachin_TS).attr("y",function(){return (6)*1.3+"em" ;}).attr("x",5);;
		tooltip.append("text").text("Opposition Score: "+d.Sachin_OS).attr("y",function(){return (7)*1.3+"em" ;}).attr("x",5);
		tooltip.append("text").text("Match Result: "+d.Sachin_Result).attr("y",function(){return (8)*1.3+"em" ;}).attr("x",5);;
	})
	.on("mouseout",function(d){
		d3.select(this).style("stroke","black").style("fill",playermap["Sachin"]).attr("r",10);
		tooltip.selectAll("*").remove();
		tooltip.style("display","none");
	});

	gk.selectAll("circle").data(kdata).enter().append("circle").attr("cx",function(d,i){return xscale(d.Mat)}).attr("cy",function(d){return yscale(d.Kallis_P)}).attr("r",15).style("opacity",0.4).style("stroke","black").style("stroke-width","1px").attr("class","kallis kallis_percentage").style("fill",playermap["Kallis"]).on("mouseover",function(d){
		d3.select(this).style("stroke","orange");
		var mouse=d3.mouse(this);
		tooltip.attr("transform","translate("+(mouse[0]+55)+","+(mouse[1]-10)+")");
		tooltip.append("rect").attr("height",130).attr("width",200).attr("class","description");
		tooltip.style("display",null);
		tooltip.append("text").text("Jacques Kallis:").style("font-weight",600).attr("y",function(){return (1)*1.3+"em" ;}).attr("x",5);
		tooltip.append("text").text("Percentage: "+Math.round(d.Kallis_P*8000)/100+"%").attr("y",function(){return (2)*1.3+"em" ;}).attr("x",5);
		tooltip.append("text").text("Match: "+d.Kallis_Match).attr("y",function(){return (3)*1.3+"em" ;}).attr("x",5);
		tooltip.append("text").text("Date: "+d.Kallis_Date).attr("y",function(){return (4)*1.3+"em" ;}).attr("x",5);
		tooltip.append("text").text("Score: "+d.Kallis_Score).attr("y",function(){return (5)*1.3+"em" ;}).attr("x",5);
		tooltip.append("text").text("Team Score: "+d.Kallis_TS).attr("y",function(){return (6)*1.3+"em" ;}).attr("x",5);
		tooltip.append("text").text("Opposition Score: "+d.Kallis_OS).attr("y",function(){return (7)*1.3+"em" ;}).attr("x",5);
		tooltip.append("text").text("Match Result: "+d.Kallis_Result).attr("y",function(){return (8)*1.3+"em" ;}).attr("x",5);;
	})
	.on("mouseout",function(){
		d3.select(this).style("stroke","black").style("fill",playermap["Kallis"]).attr("r",15);
		tooltip.selectAll("*").remove();
		tooltip.style("display","none");
	});

	gs.append("line").attr("x1",0).attr("x2",width).attr("y1",function(){return yscale(0.25);}).attr("y2",function(){return yscale(0.25);}).style("stroke","#386cb0").style("stroke-width","0.6px").style("stroke-dasharray","5,5");
	gs.append("line").attr("x1",0).attr("x2",width).attr("y1",function(){return yscale(0.5);}).attr("y2",function(){return yscale(0.5);}).style("stroke","#386cb0").style("stroke-width","0.6px").style("stroke-dasharray","5,5");

}
d3.csv("combined.csv",function(data){
	
	avg_viz(data);
	runs_viz(data);
	wickets_viz(data);
	kvs_viz(data);

});
