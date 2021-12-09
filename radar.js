const radar = container.append("svg")
                       .attr("width","600px")
                       .attr("height","400px")
                    //    .style("background","grey")
                       .attr("transform","translate(360,0)");
const margin_1 = { top: 20, right: 30, bottom: 30, left: 20 };
const chartArea_1 = radar.append("g")
                        .attr("transform", "translate(" + margin_1.left + "," + margin_1.top + ")");


const NUM_OF_SIDES = 4;
const NUM_OF_LEVELS = 4;
const offset = Math.PI;
const polyangle = (Math.PI*2)/NUM_OF_SIDES;
center = {
    x:300,
    y:270
}

const scale = d3.scaleLinear()
            .domain( [ 0, 100 ] )
            .range( [ 0, 100 ] );

const generatePoint = ({ length , angle }) =>
{
    const point =
    {
        x: center.x + ( length * Math.sin( offset - angle ) ),
        y: center.y + ( length * Math.cos( offset - angle ) )
    };
    return point;
};

let points = [];  const length = 50;
for ( let vertex = 0; vertex < NUM_OF_SIDES; vertex++ ) 
{
    const theta = vertex * polyangle;

    points.push( generatePoint( { length, angle: theta } ) );

}

const lineGenerator = d3.line()
                        .x( d => d.x )
                        .y( d => d.y );

// const drawPath = ( points, parent ) =>{
//     parent.append( "path" )
//         .attr( "d", lineGenerator( points ) )
//         .attr("stroke","black")
//         .attr("fill","red")
// };

const genTicks = (levels, Max) =>{
    const ticks = [];
    const step = Max / levels;
    for ( let i = 0; i <= levels; i++ ) 
    {
        const num = step * i;
        if ( Number.isInteger( step ) )
        {
            ticks.push( num );
        }
        else
        {
            ticks.push( num.toFixed( 2 ) );
        }
    }
    return ticks;
};

const ticks = genTicks( NUM_OF_LEVELS, 100 );
// console.log(ticks);
// const dataset = generateData( NUM_OF_SIDES );

const generateAndDrawLevels = ( levelsCount, sideCount ) =>
{
    for ( let level = 1; level <= levelsCount; level++ ) 
    {
        const hyp = ( level / levelsCount ) * 100;

        const points = [];
        for ( let vertex = 0; vertex < sideCount; vertex++ ) 
        {
            const theta = vertex * polyangle;

            points.push( generatePoint( { length: hyp, angle: theta } ) );

        }
        const group = radar.append( "g" ).attr( "class", "levels" );
        // drawPath( [ ...points, points[ 0 ] ], group );
        // points = [ ...points, points[0]];
        group.append( "path" )
        .attr( "d", lineGenerator( [ ...points, points[ 0 ] ] ) )
        .attr("stroke","black")
        .attr("fill","none")
    }
};

const generateAndDrawLines = ( sideCount ) =>
{

    const group = radar.append( "g" ).attr( "class", "grid-lines" );
    for ( let vertex = 1; vertex <= sideCount; vertex++ ) 
    {
        const theta = vertex * polyangle;
        const point = generatePoint( { length: 100, angle: theta } );

        // drawPath( [ center, point ], group );
        group.append( "path" )
        .attr( "d", lineGenerator( [center,point] ) )
        .attr("stroke","black")
        .attr("fill","none")
    }

};

const generateData = ( ) =>
{
  
    const min = 20;
    const max = 70;
        
    value= Math.round( min + ( ( max - min ) * Math.random() ))
        
        
    return value;
};

const drawText = ( text, point, isAxis, group ) =>
{
    if ( isAxis == 1 )
    {
        const xSpacing = text.toString().includes( "." ) ? 30 : 22;
        group.append( "text" )
            .attr( "x", point.x - xSpacing )
            .attr( "y", point.y + 5 )
            .html( text )
            .style( "text-anchor", "middle" )
            .attr( "fill", "darkgrey" )
            .style( "font-size", "10px" )
            .style( "font-family", "sans-serif" );
    }
    else if( isAxis == 2)
    {
        const ySpacing = text.toString().includes( "." ) ? 30 : 22;
        group.append( "text" )
            .attr( "x", point.x )
            .attr( "y", point.y + ySpacing )
            .html( text )
            .style( "text-anchor", "middle" )
            .attr( "fill", "darkgrey" )
            .style( "font-size", "10px" )
            .style( "font-family", "sans-serif" );
    }
    else
    {
        group.append( "text" )
            .attr( "x", point.x )
            .attr( "y", point.y )
            .html( text )
            .style( "text-anchor", "middle" )
            .attr( "fill", "black" )
            .style( "font-size", "12px" )
            .style( "font-family", "sans-serif" );
    }

};

const drawAxisY = ( ticks, levelsCount ,theta) =>
{
    const groupL = radar.append( "g" ).attr( "class", "tick-lines" );
    const point = generatePoint( { length: 100, angle: theta } );
    // drawPath( [ center, point ], groupL );
    groupL.append( "path" )
        .attr( "d", lineGenerator( [center, point] ) )
        .attr("stroke","black")
        .attr("fill","none")

    const groupT = radar.append( "g" ).attr( "class", "ticks" );

    ticks.forEach( ( d, i ) =>
    {
        const r = ( i / levelsCount ) * 100;
        const p = generatePoint( { length: r, angle: theta } );
        const points =
            [
                p,
                {
                    ...p,
                    x: p.x - 10
                }

            ];
        // drawPath( points, groupL );
        groupL.append( "path" )
            .attr( "d", lineGenerator( points ) )
            .attr("stroke","black")
            .attr("fill","none")
        drawText( d, p, 1, groupT );
    } );
};

const drawAxisX = ( ticks, levelsCount ,theta) =>
{
    const groupL = radar.append( "g" ).attr( "class", "tick-lines" );
    const point = generatePoint( { length: 100, angle: theta } );
    // drawPath( [ center, point ], groupL );
    groupL.append( "path" )
        .attr( "d", lineGenerator( [center, point] ) )
        .attr("stroke","black")
        .attr("fill","none")

    const groupT = radar.append( "g" ).attr( "class", "ticks" );

    ticks.forEach( ( d, i ) =>
    {
        const r = ( i / levelsCount ) * 100;
        const p = generatePoint( { length: r, angle: theta } );
        const points =
            [
                p,
                {
                    ...p,
                    y: p.y + 10
                }

            ];
        // drawPath( points, groupL );
        groupL.append( "path" )
            .attr( "d", lineGenerator( points ) )
            .attr("stroke","black")
            .attr("fill","none")
        drawText( d, p, 2, groupT );
    } );
};

const drawAllAxis = (ticks, levelsCount)=>{
    drawAxisY(ticks, levelsCount,0);
    drawAxisX(ticks, levelsCount,Math.PI /2);
    drawAxisY(ticks, levelsCount,Math.PI);
    drawAxisX(ticks, levelsCount,Math.PI * 3/2);
}

const drawCircles = points =>
{
    radar.append( "g" )
        .attr( "class", "indicator" )
        .selectAll( "circle" )
        .data( points )
        .enter()
        .append( "circle" )
        .attr("fill","green")
        .attr( "cx", d => d.x )
        .attr( "cy", d => d.y )
        .attr( "r", 5 )
};

const drawData = ( dataset, n ) =>
{
    const points = [];
    dataset.forEach( ( d, i ) => 
    {
        const len = scale( d.value );
        const theta = i * ( 2 * Math.PI / n );

        points.push(
            {
                ...generatePoint( { length: len, angle: theta } ),
                value: d.value
            } );
    } );

    const group = radar.append( "g" ).attr( "class", "shape" );

    // drawPath( [ ...points, points[ 0 ] ], group );
    // points = [ ...points, points[0]];
        group.append( "path" )
        .attr( "d", lineGenerator( [ ...points, points[ 0 ] ] ) )
        .attr("stroke","black")
        .attr("fill","#0d9cbf")
        .attr("opacity",0.6);
    drawCircles( points );
};

const drawLabels = ( dataset, sideCount ) =>
{
    const groupL = radar.append( "g" ).attr( "class", "labels" );
    for ( let vertex = 0; vertex < sideCount; vertex++ ) 
    {

        const angle = vertex * polyangle;
        const label = dataset[ vertex ].name;
        const point = generatePoint( { length: 1.25*( 200 / 2 ), angle } );

        drawText( label, point, 0, groupL );
    }
};

// console.log(dataset);

example = [
    {name:'Research', value:75},
    {name:'Award', value:75},
    {name:'Alumini', value:75},
    {name:'Teaching', value:75},
]


const drawWeb = async () => {
    var dataTHE = await d3.csv("data/timesData.csv", d3.autoType);
    var dataARWU = await d3.csv("data/shanghaiData.csv", d3.autoType);
    var dataCWUR = await d3.csv("data/cwurData.csv", d3.autoType);

    var dataSchool = await d3.csv("data/diversity_school.csv", d3.autoType);
    var dataSalary = await d3.csv("data/salary_potential.csv", d3.autoType);
    var dataTuition = await d3.csv("data/tuition_cost.csv", d3.autoType);

    let stateList = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Minor Outlying Islands', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    dataSchool = dataSchool.filter((d) => {
        return (d['name'] != 'NA' && d['category'] == "Women");
    });

    let collegeInCWUR = [];
    dataCWUR.forEach(d => {
        if(!(collegeInCWUR.includes(d.institution))){
            collegeInCWUR.push(d.institution);
        }
    });
    // console.log(collegeInCWUR);
    // console.log(dataCWUR);
    let collegeInTHE = [];
    dataTHE.forEach(d => {
        if(!(collegeInTHE.includes(d.university_name))){
            collegeInTHE.push(d.university_name);
        }
    });
    // console.log(collegeInTHE);
    // console.log(dataTHE);
    let collegeInARWU = [];
    dataARWU.forEach(d => {
        if(!(collegeInARWU.includes(d.university_name))){
            collegeInARWU.push(d.university_name);
        }
    });
    // console.log(collegeInARWU);
    // console.log(dataARWU);

    let collegeByStateCWUR = {};
    stateList.forEach((state) => {
        collegeByStateCWUR[state] = dataSchool.filter((d)=>{
            return d.state == state;
        });
        collegeByStateCWUR[state] = collegeByStateCWUR[state].filter((d)=>{
            return collegeInTHE.includes(d.name)&&collegeInCWUR.includes(d.name)&&collegeInARWU.includes(d.name);
        });
    });
    console.log(collegeByStateCWUR);

    let collegeByStateTHE = {};
    stateList.forEach((state) => {
        collegeByStateTHE[state] = dataSchool.filter((d)=>{
            return d.state == state;
        });
        collegeByStateTHE[state] = collegeByStateTHE[state].filter((d)=>{
            return collegeInTHE.includes(d.name)&&collegeInCWUR.includes(d.name)&&collegeInARWU.includes(d.name);
        });
    });
    console.log(collegeByStateTHE);


    let collegeByStateARWU = {};
    stateList.forEach((state) => {
        collegeByStateARWU[state] = dataSchool.filter((d)=>{
            return d.state == state;
        });
        collegeByStateARWU[state] = collegeByStateARWU[state].filter((d)=>{
            return collegeInTHE.includes(d.name)&&collegeInCWUR.includes(d.name)&&collegeInARWU.includes(d.name);
        });
    });
    console.log(collegeByStateARWU);


    const getTHEinfo = (schoolName) =>{
        //year from 2011-2016
        schoolInfo = [];
        for(var i=2011;i<=2016;i++){
            schoolInfo.push( 
                { year: i,
                info:dataTHE.filter(d=>{return d.university_name==schoolName&&d.year==i;})
                }
            )
        }
        var dataset = [];
        schoolInfo.forEach((d,i)=>{
            if(d.info.length==1){
                dataset[i] = [
                    {name : "Teaching", value : d.info[0].teaching},
                    {name : "research", value :  d.info[0].research},
                    {name : "international",value : d.info[0].international},
                    {name : "citations",value : d.info[0].citations}
                ]
            }else{
                dataset[i]= [
                    {name : "Teaching", value : generateData()},
                    {name : "research", value :  generateData()},
                    {name : "international",value : generateData()},
                    {name : "citations",value : generateData()}
                ]
            }
        })
        return dataset;
        //dataset[0]-[5] for 2011-2016
    }
    console.log(typeof([]));

    const getCWURinfo = (schoolName) =>{
        //year from 2012-2015
        schoolInfo = [];
        for(var i=2012;i<=2015;i++){
            schoolInfo.push( 
                { year: i,
                info:dataCWUR.filter(d=>{return d.institution==schoolName&&d.year==i;})
                }
            )
        }
        // console.log(schoolInfo);
        var dataset = [];
        schoolInfo.forEach((d,i)=>{
            if(d.info.length==1){
                dataset[i] = [
                    {name : "total_score", value : d.info[0].score},
                    {name : "citations", value : (100-d.info[0].citations/3)>20?100-d.info[0].citations:20},
                    {name : "quality_of_education",value : (100-d.info[0].quality_of_education/3)>20?100-d.info[0].quality_of_education/3:20},
                    {name : "publications",value : (100-d.info[0].publications/3)>20?100-d.info[0].publications/3:20}
                ]
            }else{
                dataset[i] = [
                    {name : "total_score", value : generateData()},
                    {name : "citations", value : generateData()},
                    {name : "quality_of_education",value: generateData()},
                    {name : "publications",value : generateData()}
                ]
            }
        })
        return dataset;

    }

    const getARWUinfo = (schoolName) =>{
        //year from 2005-2015
        schoolInfo = [];
        for(var i=2005;i<=2015;i++){
            schoolInfo.push( 
                { year: i,
                info:dataARWU.filter(d=>{return d.university_name==schoolName&&d.year==i;})
                }
            )
        }
        var dataset = [];
        schoolInfo.forEach((d,i)=>{
            if(d.info.length==1){
                dataset[i] = [
                    {name : "total_score", value : d.info[0].total_score},
                    {name : "alumni", value : d.info[0].alumni},
                    {name : "award",value : d.info[0].award},
                    {name : "publications",value : d.info[0].pub}
                ]
            }else{
                dataset[i] = [
                    {name : "total_score", value : generateData()},
                    {name : "alumni", value : generateData()},
                    {name : "award",value : generateData()},
                    {name : "publications",value : generateData()}
                ]

            }
        })
        return dataset;

    }
    dataset = getTHEinfo("University of Vermont");
    console.log(dataset);

    generateAndDrawLevels( NUM_OF_LEVELS, NUM_OF_SIDES );
    generateAndDrawLines( NUM_OF_SIDES );
    drawAllAxis( ticks, NUM_OF_LEVELS );
    drawData( example, NUM_OF_SIDES );
    drawLabels( example, NUM_OF_SIDES );

    var select_states = d3.select("#selectStates");
    stateList.forEach(d=>{
        select_states.append("option")
                     .attr("value",d)
                     .text(d);
    })

    d3.select("#selectStates").on("change", function() {
    
        selected_state = d3.select(this).property("value");

        rankingSystem = d3.select("#selectRankingSystem").property("value");

        universities = [];
        if(rankingSystem == "THE"){
            collegeByStateTHE[selected_state].forEach(d=>{
                universities.push(d.name);
            });
        }else if(rankingSystem =="ARWU"){
            collegeByStateARWU[selected_state].forEach(d=>{
                universities.push(d.name);
            });
        }else if(rankingSystem == "CWUR"){
            collegeByStateCWUR[selected_state].forEach(d=>{
                universities.push(d.name);
            })
        }
        
        university_selection = document.getElementById('selectUniversity');
        university_selection.options.length = 1;

        universities.forEach(d=>{
            university_selection.options.add(new Option(d,d));
        });

        if(university_selection.options.length==1){
            university_selection.options.add(new Option("No university in this rank!",""));
        }

    })


    d3.select("#selectRankingSystem").on("change", function() {
            
        rankingSystem = d3.select(this).property("value");

        selected_state = d3.select("#selectStates").property("value");

        universities = [];
        if(rankingSystem == "THE"){
            collegeByStateTHE[selected_state].forEach(d=>{
                universities.push(d.name);
            });
        }else if(rankingSystem =="ARWU"){
            collegeByStateARWU[selected_state].forEach(d=>{
                universities.push(d.name);
            });
        }else if(rankingSystem == "CWUR"){
            collegeByStateCWUR[selected_state].forEach(d=>{
                universities.push(d.name);
            })
        }

        university_selection = document.getElementById('selectUniversity');
        university_selection.options.length = 1;

        universities.forEach(d=>{
            university_selection.options.add(new Option(d,d));
        });

        if(university_selection.options.length==1){
            university_selection.options.add(new Option("No university in this rank!",""));
        }

        year_selection = document.getElementById('selectYear');
        if(rankingSystem == "THE"){
            year_selection.options.length=1;
            year_selection.options.add(new Option('2011','2011'));
            year_selection.options.add(new Option('2012','2012'));
            year_selection.options.add(new Option('2013','2013'));
            year_selection.options.add(new Option('2014','2014'));
            year_selection.options.add(new Option('2015','2015'));
            year_selection.options.add(new Option('2016','2016'));
        }else if(rankingSystem =="ARWU"){
            year_selection.options.length=1;
            year_selection.options.add(new Option('2005','2005'));
            year_selection.options.add(new Option('2006','2006'));
            year_selection.options.add(new Option('2007','2007'));
            year_selection.options.add(new Option('2008','2008'));
            year_selection.options.add(new Option('2009','2009'));
            year_selection.options.add(new Option('2010','2010'));
            year_selection.options.add(new Option('2011','2011'));
            year_selection.options.add(new Option('2012','2012'));
            year_selection.options.add(new Option('2013','2013'));
            year_selection.options.add(new Option('2014','2014'));
            year_selection.options.add(new Option('2015','2015'));
        }else if(rankingSystem == "CWUR"){
            year_selection.options.length=1;
            year_selection.options.add(new Option('2012','2012'));
            year_selection.options.add(new Option('2013','2013'));
            year_selection.options.add(new Option('2014','2014'));
            year_selection.options.add(new Option('2015','2015'));
        }
    })


    button = d3.select("#update")
               .text("Confirm")
               .on("click",function(){
                    radar.append("rect")
                    .attr("x",0)
                    .attr("y",0)
                    .attr("width",600)
                    .attr("height",400)
                    .style("fill","white");


                    generateAndDrawLevels( NUM_OF_LEVELS, NUM_OF_SIDES );
                    generateAndDrawLines( NUM_OF_SIDES );
                    drawAllAxis( ticks, NUM_OF_LEVELS );

                    selected_state = d3.select("#selectStates").property("value");
                    rankingSystem = d3.select("#selectRankingSystem").property("value");
                    selected_university = d3.select("#selectUniversity").property("value");
                    selected_year = d3.select("#selectYear").property("value");

                    if(selected_state=="Select States"||rankingSystem=="Select Ranking"||selected_university=="Select Universities"||selected_university=="No university in this rank!"||selected_year=="Select year"){
                        radar.append("text")
                        .attr("text-anchor","middle")
                        .attr("dominant-baseline","middle")
                        .attr("font-family","Verdana")
                        .attr("font-size","30px")
                        .attr("x","300")
                        .attr("y","50")
                        .style("color","black")
                        .text("No data, Please reselect");
                        console.log("false");
                    }else{
                        radar.append("text")
                        .attr("text-anchor","middle")
                        .attr("dominant-baseline","middle")
                        .attr("font-family","Verdana")
                        .attr("font-size","30px")
                        .attr("x","300")
                        .attr("y","40")
                        .style("color","black")
                        .text("Top University in  "+selected_state);

                        radar.append("text")
                        .attr("text-anchor","middle")
                        .attr("dominant-baseline","middle")
                        .attr("font-family","Verdana")
                        .attr("font-size","20px")
                        .attr("x","300")
                        .attr("y","100")
                        .style("color","black")
                        .text(selected_university);

                        if(rankingSystem == "THE"){
                            datasource = getTHEinfo(selected_university);
                            drawData( datasource[Number(selected_year)-2011], NUM_OF_SIDES );
                            drawLabels( datasource[Number(selected_year)-2011], NUM_OF_SIDES );
                            
                        }else if(rankingSystem =="ARWU"){
                            datasource = getARWUinfo(selected_university);
                            drawData( datasource[Number(selected_year)-2005], NUM_OF_SIDES );
                            drawLabels( datasource[Number(selected_year)-2005], NUM_OF_SIDES );
                        }else if(rankingSystem == "CWUR"){
                            datasource = getCWURinfo(selected_university);
                            drawData( datasource[Number(selected_year)-2012], NUM_OF_SIDES );
                            drawLabels( datasource[Number(selected_year)-2012], NUM_OF_SIDES );
                        }
                    }

                
               })
}

drawWeb();

