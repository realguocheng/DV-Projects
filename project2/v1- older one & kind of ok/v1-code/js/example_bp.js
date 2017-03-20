var chart = circularHeatChart()
    .segmentHeight(20)
    .innerRadius(50)
    .numSegments(16)
    .segmentLabels(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"])
	.lineNames([" 1 - Escherichia coli"," 2 - Klebsiella pneumoniae"," 3 - Mycobacterium tuberculosis"," 4 - Proteus vulgaris",
				" 5 - Pseudomonas aeruginosa"," 6 - Salmonella (Eberthella) typhosa"," 7 - Salmonella schottmuelleri"," 8 - Aerobacter aerogenes",
				" 9 - Brucella abortus","10 - Staphylococcus albus","11 - Staphylococcus aureus","12 - Streptococcus fecalis",
				"13 - Brucella anthracis","14 - Diplococcus pneumoniae","15 - Streptococcus hemolyticus","16 - Streptococcus viridans"])
	.colorNames(["Neomycin","Streptomycin","Neomycin","Gram Staining negative"]);

    
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

