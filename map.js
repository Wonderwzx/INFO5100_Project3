const svg1 = d3.select("#choropleth").style("position", "relative");
const mapLegend = d3.select("#mapLegend").style("position", "relative");
const width1 = svg1.attr('width');
const height1 = svg1.attr('height');
const margin1 = { top: 10, right: 60, bottom: 70, left: 60 };
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
      return (d['name'] != 'NA' && d['category'] == "Women");
   });

   dataTuition = dataTuition.filter((d) => {
      return (d['state'] != "NA");
   })

   dataSalary = dataSalary.filter((d) => {
      d["state_name"] = d["state_name"].replace(/-/g, " ");
      return (d['early_career_pay'] != "NA" && d['mid_career_pay'] != "NA");
   })

   let stateList = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Minor Outlying Islands', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

   let countCollege = {};
   let sumInTuition = {};
   let avgInTuition = {};
   let sumOutTuition = {};
   let avgOutTuition = {};
   let sumEarlySalary = {};
   let avgEarlySalary = {};
   let sumMidSalary = {};
   let avgMidSalary = {};

   stateList.forEach((d) => {
      countCollege[d] = 0;
      sumInTuition[d] = 0;
      avgInTuition[d] = 0;
      sumOutTuition[d] = 0;
      avgOutTuition[d] = 0;
      sumEarlySalary[d] = 0;
      avgEarlySalary[d] = 0;
      sumMidSalary[d] = 0;
      avgMidSalary[d] = 0;
   });

   // Number of College
   dataSchool.forEach((college) => {
      var state = college['state'];
      countCollege[state] = Number(countCollege[state] + 1);
   });

   console.log("---- countCollege['California'] ----");
   console.log(countCollege["California"]);

   // Avg Tuition
   dataTuition.forEach((college) => {
      var state = college['state'];
      sumInTuition[state] = Number(sumInTuition[state] + college["in_state_tuition"]);
      sumOutTuition[state] = Number(sumOutTuition[state] + college["out_of_state_tuition"]);
   })
   console.log("----- SumInTuition -----")
   console.log(sumInTuition)
   console.log("----- SumOutTuition -----")
   console.log(sumOutTuition)

   stateList.forEach((d) => {
      avgInTuition[d] = Number((sumInTuition[d] / countCollege[d]).toFixed(2));
      avgOutTuition[d] = Number((sumOutTuition[d] / countCollege[d]).toFixed(2));
   });
   console.log("----- avgInTuition -----")
   console.log(avgInTuition)
   console.log("----- avgOutTuition -----")
   console.log(avgOutTuition)

   // Avg Salary
   dataSalary.forEach((college) => {
      var state = college['state_name'];
      sumEarlySalary[state] = Number(sumEarlySalary[state] + college["early_career_pay"]);
      sumMidSalary[state] = Number(sumMidSalary[state] + college["mid_career_pay"]);
   })
   console.log("----- sumEarlySalary -----")
   console.log(sumEarlySalary)
   console.log("----- sumMidSalary -----")
   console.log(sumMidSalary)

   stateList.forEach((d) => {
      avgEarlySalary[d] = Number((sumEarlySalary[d] / countCollege[d]).toFixed(2));
      avgMidSalary[d] = Number((sumMidSalary[d] / countCollege[d]).toFixed(2));
   });
   console.log("----- avgEarlySalary -----")
   console.log(avgEarlySalary)
   console.log("----- avgMidSalary -----")
   console.log(avgMidSalary)

   // Summart of State Information
   // let stateInfo = [];
   // for (var i=0; i < 52; i++) {
   //    stateInfo.push ({
   //       "Name": stateList[i],
   //       "Number of Colleges": countCollege[stateList[i]],
   //       "Avg In-state Tuition": avgInTuition[stateList[i]],
   //       "Avg Out-of-state Tuition":avgOutTuition[stateList[i]],
   //       "Avg Early Career Pay": avgEarlySalary[stateList[i]],
   //       "Avg Middle Career Pay": avgMidSalary[stateList[i]],
   //    });
   // }
   // console.log("---- stateInfo ----")
   // console.log(stateInfo)

   let lowercase2Data = {
      "number_of_colleges": countCollege,
      "avg_in_state_tuition": avgInTuition,
      "avg_out_of_state_tuition": avgOutTuition,
      "avg_early_career_pay": avgEarlySalary,
      "avg_middle_career_pay": avgMidSalary
   }
   console.log("----- lowercase2Data ------")
   console.log(lowercase2Data)

   let lowercase2Uppercase = {
      "number_of_colleges": "Number of Colleges",
      "avg_in_state_tuition": "Avg In-state Tuition",
      "avg_out_of_state_tuition": "Avg Out-of-state Tuition",
      "avg_early_career_pay": "Avg Early Career Pay",
      "avg_middle_career_pay": "Avg Middle Career Pay"
   };

   //------------------------------- DRAW MAP ------------------------------------
   var states = topojson.feature(dataUS, dataUS.objects.states);
   var statesMesh = topojson.mesh(dataUS, dataUS.objects.states);
   var projection = d3.geoAlbersUsa().fitSize([mapWidth, mapHeight], states);
   var path = d3.geoPath().projection(projection);
   console.log(states);
   console.log(statesMesh);

   var graticule = d3.geoGraticule10();
   map.append("path").attr("class", "graticule").attr("d", path(graticule))

   var colorScale = d3.scaleQuantile()
      .domain(Object.values(countCollege))
      .range(["#f4f9e8", "#d4eed3", "#90d4be", "#3ea9c1", "#225882"]);
   console.log("---- countCollege ---- ")
   console.log(countCollege)

   map.selectAll("path.state").data(states.features)
      .join("path")
      .attr("class", "state")
      .attr('id', (d) => d.properties.name)
      .attr("d", path)
      .attr('fill', (d) => {
         return colorScale(countCollege[d.properties.name]);
      })
      .on('mouseover', mouseEntersPlot)
      .on('mouseout', mouseLeavesPlot);

   map.append("path").datum(statesMesh)
      .attr("class", "outline")
      .attr("d", path);

   drawLegend(mapLegend, colorScale);

   // ------------------------------- DROPDOWN MENU ------------------------------
   let mapDropdown = d3.select("#map-dropdown");
   let lowercase = ["number_of_colleges", "avg_in_state_tuition", "avg_out_of_state_tuition", "avg_early_career_pay", "avg_middle_career_pay"]
   let uppercase = ["Number of Colleges", "Avg In-state Tuition", "Avg Out-of-state Tuition", "Avg Early Career Pay", "Avg Middle Career Pay"];

   uppercase.forEach((d, i) => {
      mapDropdown.append("option")
         .attr("value", () => { return lowercase[i] })
         .text("Color by: " + d)
   });


   //--------------------------------- MAP HOVER----------------------------------
   let tooltipWidth = 200;
   let tooltipHeight = 125;

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


   let stateLabel = tooltip
      .append('text')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .attr('alignment-baseline', 'hanging')
      .attr('x', 0)
      .attr('y', 2);


   lowercase.forEach((d, i) => {
      tooltip.append("text")
        .attr("id", d)
        .attr("x", 0)
        .attr("y", 25 + 20 * i)
        .attr("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .attr('alignment-baseline', 'hanging')
        .attr('fill', 'white')
        .text("");
    })

   d3.selectAll('.state').on('mouseenter', mouseEntersPlot);
   d3.selectAll('.state').on('mouseout', mouseLeavesPlot);

   function mouseEntersPlot() {
      tooltip.style('visibility', 'visible');

      let state = d3.select(this);
      let stateName = state.datum().properties.name;

      stateLabel.text(stateName);

      // stateInfo.text("Number of Colleges: " + countCollege[stateName])


      lowercase.forEach(function (d) {
            d3.selectAll("text#" + d).text(lowercase2Uppercase[d] + ": " + lowercase2Data[d][stateName]);
         });

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

   // --------------------------------- UPDATE MAP --------------------------------
   function update(selectedGroup) {

      // Give these new data to update map
      colorScale = d3.scaleQuantile()
         .domain(Object.values(lowercase2Data[selectedGroup]))
         .range(["#f4f9e8", "#d4eed3", "#90d4be", "#3ea9c1", "#225882"]);
      console.log("---- lowercase2Data[selectedGroup] ---- ")
      console.log(lowercase2Data[selectedGroup])

      // Update Legend
      mapLegend.html("")
      drawLegend(mapLegend, colorScale);

      map.selectAll("path.state").data(states.features)
         .join("path")
         .attr("class", "state")
         .attr('id', (d) => d.properties.name)
         .attr("d", path)
         .attr('fill', (d) => {
            return colorScale(lowercase2Data[selectedGroup][d.properties.name]);
         })
         .on('mouseover', mouseEntersPlot)
         .on('mouseout', mouseLeavesPlot);
   
   }


   // When the button is changed, run the updateMap function
   mapDropdown.on("change", function () {
      var selectedOption = d3.select(this).property("value")
      console.log("---- selectedOption ---- ")
      console.log(d3.select(this))
      update(selectedOption)
   })

   // ####################################### Function showChart() #######################################

   function showSpiderMap() {
     // Use this command to erase:
     // annotations.html("")
   
     let clicked = d3.select(this).datum();

   }




}
drawMap()
