// https://jeffrz.github.io/info3300-fa2021/notes/21.10.27.notes.htm
const container = d3.select("#container").style("position","relative");
const width = Number(container.style("width").replace("px",""));
const height = Number(container.style("height").replace("px",""));
const margin = { top: 10, right: 10, bottom: 70, left:60};
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;
    
// Add a canvas element
const canvas = container.append("canvas")
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
const label = svg.append("text").attr("x", margin.left+10).attr("y", margin.top+10);

const svgLegend = d3.select("raster-legend")
                 .append("svg")
                 .attr("width",width)
                 .attr("height", 70)
svgLegend.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", 20)
        .attr("height", 15)
        .style("fill", d3.interpolateYlGnBu())


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
    const yScale = d3.scaleLinear().domain(d3.extent(data, d => d.Median)).range([chartHeight-10, 10]);
    const cScale = d3.scaleLinear().domain(d3.extent(data, d => d.Unemployment_rate)).range([0, 1]);
    const colorScale = d3.scaleSequential( d => d3.interpolateYlGnBu(cScale(d)) );

    

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

    const context = canvas.node().getContext('2d');
    context.clearRect(0, 0, width, height);
    context.globalAlpha = 0.6;
    data.forEach( (d,i) => {
    
        let x = xScale(d.Major_category);
        let y = yScale(d.Median);
        let rad = 8;
        let color = colorScale(d.Unemployment_rate);

        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, rad, 0, 2*Math.PI);
        context.fill();

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

}
drawPlot()