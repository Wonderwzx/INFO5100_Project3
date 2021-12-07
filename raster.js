// https://jeffrz.github.io/info3300-fa2021/notes/21.10.27.notes.htm
const container = d3.select("#container").style("position","relative");
const svgLegend = d3.select("#rasterLegend");
const widthLegend = svgLegend.attr('width');
const heightLegend = svgLegend.attr('height');
const width = Number(container.style("width").replace("px",""));
const height = Number(container.style("height").replace("px",""));
const margin = { top: 15, right: 10, bottom: 70, left:65};
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

    
const svgA = container.append("svg")
                        .attr("width",chartWidth)
                        .attr("height",chartHeight)
                        .style("position","absolute")
                        .style("top",margin.top + 'px')
                        .style("left",margin.left + 'px');

const svg = container.append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .style("position","absolute")
                    .style("top", 0)
                    .style("left", 0);               

const yAxisArea = svg.append("g").attr("transform","translate("+(margin.left-10)+","+margin.top+")");
const xAxisArea = svg.append("g").attr("transform","translate("+margin.left+","+(chartHeight+2+margin.top)+")");
const label = svg.append("text").attr("x", margin.left+10).attr("y", margin.top);

svg.append("text") // y-axis label
    // .attr("transform", "rotate(-90)")
    .attr('x',0)
    .attr('y', margin.top)
    .text("Income/$")
    .style('font', '12px Verdana')
    .style("font-weight","bold");


const interactiveArea = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");
interactiveArea.append("rect")
                .attr("width",chartWidth)
                .attr("height",chartHeight)
                .attr("x",0)
                .attr("y",0)
                .attr("opacity",0);  

const drawPlot = async () => {
     
    let data = await d3.csv("data/all-ages.csv",d3.autoType);
    console.log(data)
    // console.log(new Set(data.map(d => d.Major_category)))

    let categories = new Set(data.map(d => d.Major_category))
    console.log(categories)
    const xScale = d3.scalePoint().domain(categories).range([10, chartWidth-10]);
    let yScale = d3.scaleLinear().domain(d3.extent(data, d => d.Median)).range([chartHeight-10, 10]);
    const cScale = d3.scaleLinear().domain(d3.extent(data, d => (1-d.Unemployment_rate))).range([0, 1]);
    const colorScale = d3.scaleSequential( d => d3.interpolateYlGnBu(cScale(d)) );

    var colorScaleLegend = d3.scaleSequential(d3.interpolateYlGnBu)
                        .domain([0, widthLegend])
         
    svgLegend.selectAll("rect")
             .data(d3.range(widthLegend), function(d) { return d; })
             .enter().append("rect")
             .attr("x", function(d, i) { return i; })
             .attr("y", 10)
             .attr("height", 30)
             .attr("width", 1)
             .style("fill", function(d, i ) { return colorScaleLegend(d); })

    const legendscale = d3.scaleLinear().domain(d3.extent(data, d => (1-d.Unemployment_rate))).range([0, outerWidth]);
    let legendAxis = d3.axisBottom(legendscale);
    svgLegend.append("g")
             .attr("class", "legend axis")
             .call(legendAxis)
             .attr("transform","translate(0,40)");
    svgLegend.append("text") 
            .attr('x',0)
            .attr('y', 10)
            .text("Employment Rate")
            // .style("alignment-baseline","hanging")
            .style('font', '12px Verdana')
            .style("font-weight","bold");

    let yAxis = d3.axisLeft(yScale); 
    yAxisArea.append("g").attr("class", "y axis").call(yAxis);

    let xAxis = d3.axisBottom(xScale); 
    xAxisArea.append("g")  
             .attr("class", "x axis")
             .call(xAxis)
             .selectAll("text")
             .style("text-anchor", "end")
             .attr("dx", "-.8em")
             .attr("dy", ".15em")
             .style("font-size", "11px")
             .attr("transform", "rotate(-18)");

    data.forEach( (d,i) => {

        svgA.append("circle")
           .attr("cx", xScale(d.Major_category))
           .attr("cy", yScale(d.Median))
           .style("fill", colorScale(1 - d.Unemployment_rate))
           .attr("r",8)
           .style("opacity",0.7)
    });

      const delaunay = d3.Delaunay.from(data, d => xScale(d.Major_category), d => yScale(d.Median));

      let currentTarget = -1;
      interactiveArea.on("mousemove", function(event) {

          let loc = d3.pointer(event);
          let index;
          if (currentTarget === -1) {

            index = delaunay.find(loc[0],loc[1]);   
          }
          else {
            
            index = delaunay.find(loc[0],loc[1],currentTarget)
          }
          if (index !== currentTarget) {
              
              console.log("mouseover");
              currentTarget = index;
              mouseExited();
              mouseEntered(index);
          }
        });

        interactiveArea.on("mouseout", () => {
          currentTarget = -1;
          mouseExited(); 
        })
  
  
        function mouseEntered(i) {
              let d = data[i];
              interactiveArea.append("circle")
                          .attr("id","highlight")
                          .attr("cx",xScale(d.Major_category))
                          .attr("cy",yScale(d.Median))
                          .attr("r",10)
                          .attr("stroke","black")
                          .attr("fill","none");
              label.text(d.Major);
                        
        }
        function mouseExited() {
          d3.select("#highlight").remove();
          label.text("");
        }
        

        var incomeSelect = d3.select("#raster-dropdown");
        var selectedValue = "Median";
        let dropValues = ["Median", "P25th", "P75th"];
        let dataTypes = ["Median Income", "25th percentile of earnings", "75th percentile of earnings"];

        dataTypes.forEach((d, i) => {
          incomeSelect.append("option")
                      .attr("value", dropValues[i])
                      .property("selected", () => { return (d === "Median Income") })
                      .text(d)
        });

        incomeSelect.on("change", updateChart)

        function updateChart() {
          selectedValue = d3.select(this).property("value");
          yScale = d3.scaleLinear().domain(d3.extent(data, d => d[selectedValue])).range([chartHeight-10, 10]);
          yAxis = d3.axisLeft(yScale); 
          yAxisArea.select(".y.axis").call(yAxis); 

          svgA.selectAll("circle")
                .data(data)
                .transition()
                .delay(function(d,i){return(i*3)})
                .duration(2000)
                .attr("cx", d => xScale(d.Major_category))
                .attr("cy", d => yScale(d[selectedValue]))

          const delaunay = d3.Delaunay.from(data, d => xScale(d.Major_category), d => yScale(d[selectedValue]));

          let currentTarget = -1;
          interactiveArea.on("mousemove", function(event) {

          let loc = d3.pointer(event);
          let index;
          if (currentTarget === -1) {

            index = delaunay.find(loc[0],loc[1]);   
          }
          else {
            
            index = delaunay.find(loc[0],loc[1],currentTarget)
          }
          if (index !== currentTarget) {
              
              // console.log("mouseover");
              currentTarget = index;
              mouseExited();
              mouseEntered(index);
          }
        });

        interactiveArea.on("mouseout", () => {
          currentTarget = -1;
          mouseExited(); 
        })
  
  
        function mouseEntered(i) {
              let d = data[i];
              interactiveArea.append("circle")
                          .attr("id","highlight")
                          .attr("cx",xScale(d.Major_category))
                          .attr("cy",yScale(d[selectedValue]))
                          .attr("r",10)
                          .attr("stroke","black")
                          .attr("fill","none");
              label.text(d.Major);
                        
        }
        function mouseExited() {
          d3.select("#highlight").remove();
          label.text("");
        }

      }

}
drawPlot()