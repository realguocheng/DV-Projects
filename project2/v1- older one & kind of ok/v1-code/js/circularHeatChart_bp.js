function circularHeatChart() {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    innerRadius = 50,
    numSegments = 16,
    segmentHeight = 20,
    domain = null,
    range = ["white", "red"],
    accessor = function(d) {return d;},
    radialLabels = segmentLabels = [];

    function chart(selection) {
        selection.each(function(data) {
            var svg = d3.select(this);

            var offset = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight;
            g = svg.append("g")
                .classed("circular-heat", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            var autoDomain = false;
            if (domain === null) {
                domain = d3.extent(data, accessor);
                autoDomain = true;
            }
            var color = d3.scale.linear().domain(domain).range(range);
            if(autoDomain)
                domain = null;

            g.selectAll("path").data(data)
                .enter().append("path")
                .attr("d", d3.svg.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
                .attr("fill", function(d) {
					if(d == 4) return "#CAE1FF";
					else if(d == 5)	return "white";
					else if(d >= 11 && d <= 26){
						var bluea = d3.rgb(40,40,255);
						var blueb = d3.rgb(128,128,255);
						var colorb = d3.interpolate(bluea,blueb); 
						var linearb = d3.scale.linear()  
										.domain([11, 26])  
										.range([0, 1]);  
						return colorb(linearb(d));
					}
					else if(d >= 27 && d <= 42){
						var greya = d3.rgb(128,128,128);
						var greyb = d3.rgb(208,208,208);
						var colorg = d3.interpolate(greya,greyb); 
						var linearg = d3.scale.linear()  
							.domain([27, 42])  
							.range([0, 1]);  
						return colorg(linearg(d));
					}
					else if(d >= 43 && d <= 58){
						var reda = d3.rgb(255,20,20);
						var redb = d3.rgb(255,128,128);
						var colorr = d3.interpolate(reda,redb); 
						var linearr = d3.scale.linear()  
							.domain([43, 58])  
							.range([0, 1]);  
						return colorr(linearr(d));
					}
				});


            // Unique id so that the text path defs are unique - is there a better way to do this?
            var id = d3.selectAll(".circular-heat")[0].length;

            //Radial labels
            var lsa = 0.01; //Label start angle
            var labels = svg.append("g")
                .classed("labels", true)
                .classed("radial", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            labels.selectAll("def")
                .data(radialLabels).enter()
                .append("def")
                .append("path")
                .attr("id", function(d, i) {return "radial-label-path-"+id+"-"+i;})
                .attr("d", function(d, i) {
                    var r = innerRadius + ((i + 0.2) * segmentHeight);
                    return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) + 
                            " a" + r + " " + r + " 0 1 1 -1 0";
                });

            labels.selectAll("text")
                .data(radialLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", function(d, i) {return "#radial-label-path-"+id+"-"+i;})
                .style("font-size", 0.6 * segmentHeight + 'px')
                .text(function(d) {return d;});

			 //Segment labels
            var segmentLabelOffset = 2;
            var r = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight + segmentLabelOffset;
            labels = svg.append("g")
                .classed("labels", true)
                .classed("segment", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            labels.append("def")
                .append("path")
                .attr("id", "segment-label-path-"+id)
                .attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");

            labels.selectAll("text")
                .data(segmentLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", "#segment-label-path-"+id)
                .attr("startOffset", function(d, i) {return i * 100 / numSegments + "%";})
                .text(function(d) {return d;});
			//Legend	
				var legend=svg.append("g");
			
				legend.selectAll("text")
				    	.data(lineNames)
						.enter()
						.append("text")
						.text(function(d){return d;})
						.attr("class","legend")
						.attr("x",350)
						.attr("y",function(d,i){return 70+i*13});
				var legendc=svg.append("g");
			
				legendc.selectAll("text")
				    	.data(colorNames)
						.enter()
						.append("text")
						.text(function(d){return d;})
						.attr("class","legend")
						.attr("x",function(d,i){return 70+i*110})
						.attr("y",330);
				legendc.selectAll("rect")
						.data(colorNames)
						.enter()
						.append("rect")
						.attr("x",function(d,i){return 50+i*110})
						.attr("y",320)
						.attr("width",10)
						.attr("height",10)
						.attr("fill",function(d,i){
							if(i == 0){
								return "#FF1414";
							}else if(i == 1){
								return "#808080";
							}else if(i == 2){
								return "#3A3AFF";
							}else{
								return "#CAE1FF";
							}
						});
        });

    }

    /* Arc functions */
    ir = function(d, i) {
        return innerRadius + Math.floor(i/numSegments) * segmentHeight;
    }
    or = function(d, i) {
        return innerRadius + segmentHeight + Math.floor(i/numSegments) * segmentHeight;
    }
    sa = function(d, i) {
        return (i * 2 * Math.PI) / numSegments;
    }
    ea = function(d, i) {
        return ((i + 1) * 2 * Math.PI) / numSegments;
    }

    /* Configuration getters/setters */
    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.innerRadius = function(_) {
        if (!arguments.length) return innerRadius;
        innerRadius = _;
        return chart;
    };

    chart.numSegments = function(_) {
        if (!arguments.length) return numSegments;
        numSegments = _;
        return chart;
    };

    chart.segmentHeight = function(_) {
        if (!arguments.length) return segmentHeight;
        segmentHeight = _;
        return chart;
    };

    chart.domain = function(_) {
        if (!arguments.length) return domain;
        domain = _;
        return chart;
    };

    chart.range = function(_) {
        if (!arguments.length) return range;
        range = _;
        return chart;
    };

    chart.radialLabels = function(_) {
        if (!arguments.length) return radialLabels;
        if (_ == null) _ = [];
        radialLabels = _;
        return chart;
    };

    chart.segmentLabels = function(_) {
        if (!arguments.length) return segmentLabels;
        if (_ == null) _ = [];
        segmentLabels = _;
        return chart;
    };
	chart.lineNames = function(_){
		if (!arguments.length) return lineNames;
        if (_ == null) _ = [];
        lineNames = _;
        return chart;
	}
	chart.colorNames = function(_){
		if (!arguments.length) return colorNames;
        if (_ == null) _ = [];
        colorNames = _;
        return chart;
	}
    chart.accessor = function(_) {
        if (!arguments.length) return accessor;
        accessor = _;
        return chart;
    };

    return chart;
}