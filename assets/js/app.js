function makeResponsive(){
  var svgWidth = 960;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
  d3.csv("assets/data/data.csv").then(function(newsData) {
      console.log(newsData);
      // Parse Data/Cast as numbers
      newsData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

      // Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(newsData, d => d.poverty)])
        .range([0, width]);
        
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(newsData, d => d.healthcare)])
        .range([height, 0]);
        
        // Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

      // Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
        
        chartGroup.append("g")
        .call(leftAxis);

      // Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
      .data(newsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "blue")
      .attr("opacity", ".5");
      //Create Text inside the circles
      
      circlesGroup.append("text").text(function(d){
        return d.abbr;
      })
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      ;
      

      // Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .style("background-color", "lightgrey")
        .style("border-width", "1px")
        .style("padding", "5px")
        .html(function(d) {
          return (`${d.state}<br>Poverty: ${d.poverty} % <br>Healthcare: ${d.healthcare} %`);
        });

      //  Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);

      // Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("mouseover", function(data) {
        d3.select(this)
        .transition()
        .duration(500)
        toolTip.show(data, this);
      })
      // onmouseout event
        .on("mouseout", function(data, index) {
          d3.select(this)
          .transition()
          .duration(500)
          toolTip.hide(data);
        });

      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty (%)");

    }).catch(function(error) {
      console.log(error);
  });
}

//When the browser window is resized, call makeResponsive
d3.select(window).on("resize", makeResponsive());
