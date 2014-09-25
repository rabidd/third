
var data = [];
    for (i=0; i<=99; i++) {
	data.push({xloc: 0, yloc: 0, xvel: 0, yvel: 0, color: Math.round(Math.random() * 200), toYellow: true});
	// data.push({xloc: 0, yloc: 0, xvel: 0, yvel: 0, color: 0, toYellow: true});
    }

var w = 1200,
	h = 600,
	spacing = 1,
	xmin = d3.min(data, function(d) { return d.xloc; }) - spacing,
	xmax = d3.max(data, function(d) { return d.xloc; }) + spacing,
	ymin = d3.min(data, function(d) { return d.yloc; }) - spacing,
	ymax = d3.max(data, function(d) { return d.yloc; }) + spacing,		
	mouseX,
	mouseY,		
	x = d3.scale.linear()
		.domain([xmin, xmax])
		.range([0, w]),
	y = d3.scale.linear()
		.domain([ymin, ymax])
		.range([0, h]);		
		
var latest = new Date(),
	last = latest,
	fps = [];
					
for (i=0; i<=100; i++) {
	fps.push(30);
}
			
var chart = d3.select("body").append("svg")
	.attr("class", "chart")
	.attr("width", w)
	.attr("height", h);
	
chart.selectAll("circle")
	.data(data)
	.enter().append("circle")
	.attr("class", "little")
	.attr("cx", function(d) { 
		return x(d.xloc); 
	})
	.attr("cy", function(d) { 
		return y(d.yloc); 
	})
	.attr("r", function(d) {
		return 50;
	});	
	
function xmean() {
	d3.mean(data, function(d) { return d.xloc; });
}

function ymean() {
	d3.mean(data, function(d) { return d.yloc; });
}      		
				  
function motion(e, index, array) { 
	if(inMouseRadius(x(e.xloc), y(e.yloc)))	{
		var random = Math.random();
		if(random  > 0.25 && random  < 0.5 )	{
			e.xloc += 2.5;	
			e.yloc += 2.5;
		}	
		if(random  > 0.5 && random  < 0.75 )	{
			e.xloc -= 2.5;	
			e.yloc += 2.5;
		}
		if(random  > 0.75 && random  < 1 )	{
			e.xloc += 2.5;	
			e.yloc -= 2.5;
		}	else	{
			e.xloc -= 2.5;	
			e.yloc -= 2.5;
		}
	}
	e.xloc = e.xloc + e.xvel; 	
	e.yloc = e.yloc + e.yvel; 			      	
	e.xvel = e.xvel + 0.09*Math.random() - 0.05*e.xvel - 0.0005*e.xloc;	
	e.yvel = e.yvel + 0.09*Math.random() - 0.05*e.yvel - 0.0005*e.yloc;

	if(e.toYellow)	{
		e.color += Math.round(Math.random() * 5);
	}	else	{
		e.color -= Math.round(Math.random() * 5);
	}
	if(e.color > 255)	{
		e.color = 255;
		e.toYellow = false;
	}
	if (e.color < 0) {
		e.color = 0;
		e.toYellow = true;
	};

}      			      	     
									  
d3.timer(function() {
					
	data.forEach(motion);	
	xmin = d3.min(data, function(d) { return d.xloc; }) - spacing;
	xmax = d3.max(data, function(d) { return d.xloc; }) + spacing;
	ymin = d3.min(data, function(d) { return d.yloc; }) - spacing;
	ymax = d3.max(data, function(d) { return d.yloc; }) + spacing;				
	x = d3.scale.linear()
		.domain([xmin, xmax])
		.range([0, w]);
	y = d3.scale.linear()
		.domain([ymin, ymax])
		.range([0, h]);		
					
	chart.selectAll("circle")
		.attr("cx", function(d) { 
			var cX = x(d.xloc);
			return cX; 
		})
		.attr("cy", function(d) { 
			var cY = y(d.yloc);
			return cY;
		})
		.attr("r", function(d) {
			return d3.min([2000,25]);
		})
		.attr("fill", function(d) {
   		    return "rgb(255, "+ d.color +", 0)";
   		});	
		
	latest = new Date();
	fps.push(1/(latest-last)*100);
	fps.shift();
	last = latest;
	d3.select("#fps span").text(Math.round(d3.mean(fps)));


});

function inMouseRadius(pX, pY)	{
	if(mouseX != undefined && mouseY != undefined && (pX - mouseX)*(pX - mouseX) + (pY -mouseY)*(pY -mouseY) < 22500)	{
		return true;
	}	else	{
		return false;
	}
}

d3.select("svg").on('mousemove', function () {
   var coordinates = [0, 0];
	coordinates = d3.mouse(this);
	mouseX = coordinates[0];
	mouseY = coordinates[1];
  
});
