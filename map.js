const svg1= d3.select("#choropleth").style("position", "relative");
const width1 = svg1.attr('width');
const height1 = svg1.attr('height');
const margin1 = { top: 10, right: 10, bottom: 70, left: 60 };
const mapWidth = width1 - margin1.left - margin1.right;
const mapHeight = height1 - margin1.top - margin1.bottom;

const map = svg1.append('g')
   .attr('transform', 'translate(' + margin1.left + ',' + margin1.top + ')');

const drawMap = async () => {

   var dataSchool = await d3.csv("data/diversity_school.csv", d3.autoType);
   var dataSalary = await d3.csv("data/salary_potential.csv", d3.autoType);
   var dataTuition = await d3.csv("data/tuition_cost.csv", d3.autoType);
   const dataUS = await d3.json(
      'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'
   );

   console.log("---- dataSchool ----");
   console.log(dataSchool);
   console.log("---- dataSalary ----");
   console.log(dataSalary);
   console.log("---- dataTuition ----");
   console.log(dataTuition);
   console.log("---- dataUS ----");
   console.log(dataUS);

   //------------------------ DATA PROCESSING ------------------------------------
   dataSchool = dataSchool.filter((d) => {
      return (d['name'] != 'NA');
    });

   // Number of school in each state
   let stateList = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Minor Outlying Islands', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
   let countSchool = {};

   stateList.forEach((d) => {
      countSchool[d] = 0;
   });

   dataSchool.forEach((school) => {
      var state = school['state'];
      countSchool[state] = Number(countSchool[state] + 1);
   });
   console.log("---- countSchool['California'] ----");
   console.log(countSchool["California"]);

   //------------------------------- DRAW MAP ------------------------------------
   var states = topojson.feature(dataUS, dataUS.objects.states);
   var statesMesh = topojson.mesh(dataUS, dataUS.objects.states);
   var projection = d3.geoAlbersUsa().fitSize([mapWidth, mapHeight], states);
   var path = d3.geoPath().projection(projection);
   console.log(states);
   console.log(statesMesh);

   var graticule = d3.geoGraticule10();
   map.append("path").attr("class", "graticule").attr("d", path(graticule))

   const colorScale = d3.scaleQuantile()
      .domain(Object.values(countSchool))
      .range(['#ffffd4', '#fed98e', '#fe9929', '#d95f0e', '#993404']);
   console.log("---- countSchool ---- ")
   console.log(countSchool)

   map.selectAll("path.state").data(states.features)
      .join("path")
      .attr("class", "state")
      .attr('id', (d) => d.properties.name)
      .attr("d", path)
      .attr('fill', (d) => {
         return colorScale(countSchool[d.properties.name]);
      })
      .on('mouseover', mouseEntersPlot)
      .on('mouseout', mouseLeavesPlot);

   map.append("path").datum(statesMesh)
      .attr("class", "outline")
      .attr("d", path);

   drawLegend(d3.select("#mapLegend"), colorScale);

   //--------------------------------- MAP HOVER----------------------------------
   let tooltipWidth = 140;
   let tooltipHeight = 40;

   let momesh = map
      .append('path')
      .attr('class', 'mouseover outline')
      .attr('d', '');

   let tooltip = map
      .append('g')
      .attr('class', 'tooltip')
      .attr('visibility', 'hidden');

   tooltip
      .append('rect')
      .attr('fill', 'black')
      .attr('opacity', 0.9)
      .attr('x', -tooltipWidth / 2.0)
      .attr('y', 0)
      .attr('width', tooltipWidth)
      .attr('height', tooltipHeight);

   let txt = tooltip
      .append('text')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('x', 0)
      .attr('y', 2);

   let txt2 = tooltip
      .append('text')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .attr('x', 0)
      .attr('y', 22);

   d3.selectAll('.state').on('mouseenter', mouseEntersPlot);
   d3.selectAll('.state').on('mouseout', mouseLeavesPlot);

   function mouseEntersPlot() {
      tooltip.style('visibility', 'visible');

      let state = d3.select(this);

      let stateName = state.datum().properties.name;

      txt.text(stateName);
      txt2.text(countSchool[stateName] + " schools");

      let bounds = path.bounds(state.datum());

      let xPos = (bounds[0][0] + bounds[1][0]) / 2.0;
      let yPos = bounds[1][1] - 15;

      tooltip.attr('transform', `translate(${xPos},${yPos})`);

      var mo = topojson.mesh(dataUS, dataUS.objects.states, function (a, b) {
         return (
            a.properties.name === stateName || b.properties.name === stateName
         );
      });
      momesh.datum(mo).attr('d', path);
   }

   function mouseLeavesPlot() {
      tooltip.style('visibility', 'hidden');
      // let state = d3.select(this);
      momesh.attr('d', '');
   }

   function drawLegend(legend, legendColorScale) {

      const legendWidth = legend.attr('width');
      // const legendHeight = legend.attr('height');
      const legendMinMax = d3.extent(legendColorScale.domain());
      const barHeight = 50;
      const stepSize = 4;

      const pixelScale = d3
         .scaleLinear()
         .domain([0, legendWidth - 40])
         .range([legendMinMax[0] - 1, legendMinMax[1] + 1]);

      const barScale = d3
         .scaleLinear()
         .domain([legendMinMax[0] - 1, legendMinMax[1] + 1])
         .range([0, legendWidth - 40]);
      const barAxis = d3.axisBottom(barScale);

      if (legendColorScale.hasOwnProperty('quantiles')) {
         barAxis.tickValues(legendColorScale.quantiles().concat(legendMinMax));
      }
      legend
         .append('g')
         .attr('class', 'colorbar axis')
         .attr('transform', 'translate(' + 20 + ',' + (barHeight + 5) + ')')
         .call(barAxis);

      let bar = legend
         .append('g')
         .attr('transform', 'translate(' + 20 + ',' + 0 + ')');
      for (let i = 0; i < legendWidth - 40; i = i + stepSize) {
         bar
            .append('rect')
            .attr('x', i)
            .attr('y', 0)
            .attr('width', stepSize)
            .attr('height', barHeight)
            .style('fill', legendColorScale(pixelScale(i)));
      }

      bar
         .append('line')
         .attr('stroke', 'white')
         .attr('stroke-width', 3)
         .attr('x1', barScale(legendMinMax[0]))
         .attr('x2', barScale(legendMinMax[0]))
         .attr('y1', 0)
         .attr('y1', barHeight + 4);
      bar
         .append('line')
         .attr('stroke', 'white')
         .attr('stroke-width', 3)
         .attr('x1', barScale(legendMinMax[1]))
         .attr('x2', barScale(legendMinMax[1]))
         .attr('y1', 0)
         .attr('y1', barHeight + 4);
   }





}
drawMap()
