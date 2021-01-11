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
    columns: Array
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
        .attr("viewBox", [0, 20, width, height])
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

      const data = this.data;

      const columns = this.columns.map(col => col.key).slice(1);

      const sipments = columns;

      const months = d3
        .map(data, function(d) {
          return d.month;
        })
        .keys();

      //stack the data
      const stackedData = d3
        .stack()
        .keys(sipments)(data)
        .map(d => (d.forEach(v => (v.key = d.key)), d));

      // Add X axis
      const x = d3
        .scaleBand()
        .domain(months)
        .range([margin.left, width - 100])
        .padding([0.5]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x).tickSizeOuter(0));

      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
        .rangeRound([height, margin.top]);
      svg
        .append("g")
        .attr("class", "y axis")
        .call(
          d3
            .axisLeft(y)
            .ticks(20, "s")
            .tickSize(-width, 0, 0)
        );

      // color palette = one color per shipment
      const color = d3
        .scaleOrdinal()
        .domain(sipments)
        .range(["#e41a1c", "#377eb8"]);

      // Show the bars
      svg
        .append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = month per month
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", function(d) {
          return color(d.key);
        })
        .selectAll("rect")
        // enter a second time = loop shipment per shipment to add all rectangles
        .data(function(d) {
          return d;
        })
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return x(d.data.month);
        })
        .attr("y", function(d) {
          return y(d[1]);
        })
        .attr("height", function(d) {
          return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth());
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
