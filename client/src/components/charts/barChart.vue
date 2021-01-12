<template>
  <div class="container">
    <div id="bar-chart"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "bar-chart",
  props: {
    data: Array,
    xData: String,
    yData: Array,
    colors: Array
  },
  mounted() {
    this.loadBarChart();
  },
  methods: {
    loadBarChart() {
      // set the dimensions and margins of the graph
      const margin = { top: 10, right: 30, bottom: 20, left: 50 },
        width = 1100 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // append the svg object to the body of the page

      const svg = d3
        .select("#bar-chart")
        .append("svg")
        .attr("viewBox", [0, -50, width, height])
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

      const data = this.data;
      const xData = this.xData;
      const yData = this.yData 

      const months = d3
        .map(data, function(d) {
          return d[xData];
        })
        .keys();

      //stack the data
      const stackedData = d3
        .stack()
        .keys(yData)(data)
        .map(d => (d.forEach(v => (v.key = d.key)), d));

      // Add X axis
      const x = d3
        .scaleBand()
        .domain(months)
        .range([margin.left, width - 100])
        .padding([0.5]);
      svg
        .append("g")
        .attr("transform", "translate(0," + 300 + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x).tickSizeOuter(0));

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
        .rangeRound([height - 70, margin.top]);
      svg
        .append("g")
        .attr("class", "y axis")
        .call(
          d3
            .axisLeft(y)
            .ticks(20, "s")
            .tickSize(-width, 0, 0)
        );

      // color palette
      const colors = this.colors;

      const color = d3
        .scaleOrdinal()
        .domain(yData)
        .range(colors);

      // Show the bars
      svg
        .append("g")
        .selectAll("g")
        // Enter in the stack data
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", function(d) {
          return color(d.key);
        })
        .selectAll("rect")
        .data(function(d) {
          return d;
        })
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return x(d.data[xData]);
        })
        .attr("y", function(d) {
          return y(d[1]);
        })
        .attr("height", function(d) {
          return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth());

      // Draw legend
      const legend = svg
        .selectAll(".legend")
        .data(colors)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
          return "translate( -" + (i * 70 + 120) + ", -20)";
        });
      legend
        .append("circle")
        .attr("x", width - 18)
        .attr("cx", width - 10)
        .attr("cy", 10)
        .attr("r", 6)
        .style("fill", function(d, i) {
          return colors.slice().reverse()[i];
        });

      const legendTexts = yData.reverse();
      legend
        .append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d, i) {
          const text = legendTexts[i];
          return text.charAt(0).toUpperCase() + text.slice(1);
        });
    }
  }
};
</script>

<style>
#bar-chart {
  margin-right: 50px;
  margin-bottom: 50px;
}
#bar-chart svg {
  font: 10px sans-serif;
  shape-rendering: crispEdges;
}

#bar-chart .axis path,
#bar-chart .axis line {
  fill: none;
  stroke: #000;
}

#bar-chart path.domain {
  stroke: none;
}

#bar-chart .y .tick line {
  stroke: #ddd;
}

#bar-chart .x.axis > .tick > line {
  stroke-opacity: 0;
}
</style>
