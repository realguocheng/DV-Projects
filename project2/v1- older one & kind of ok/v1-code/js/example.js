var chart = circularHeatChart()
    .segmentHeight(33)
    .innerRadius(0)
    .numSegments(16)
    .segmentLabels(["Ec", "Kp", "Mt", "Pv", "Pa", "St", "Ss", "Aa", "Bab", "Sal", "Sau", "Sf", "Ban", "Dp", "Sh", "Sv"])	
	.colorNames(["Neomycin","Streptomycin","Penicilin","Gram Staining negative"]);

    
var data = [4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,
			49,53,55,50,52,46,48,34,47,43,44,51,11,13,12,14,
			31,36,39,29,38,32,33,54,17,15,16,19,45,56,57,40,
			22,24,23,20,25,18,21,26,37,30,28,35,27,41,42,58];
d3.select('#chart3')
    .selectAll('svg')
    .data([data])
    .enter()
    .append('svg')
    .call(chart);

