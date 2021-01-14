<template>
  <div class="container">
    <div id="select-bar">
      <label style="float:left">Bar Chart</label><br/>
      <b-form-select
        v-model="chartType"
        :options="chartOptions"
        @change="onChangeBar"
        class="float-left"
      ></b-form-select>
    </div>
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
  data() {
    return {
      chartType: "stacked",
      chartOptions: ["stacked", "grouped"]
    };
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

      const svg = d3
        .select("#bar-chart")
        .append("svg")
        .attr("viewBox", [0, -50, width, 440])
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

      const data = this.data;
      const xData = this.xData;
      const yData = this.yData;

      const months = d3
        .map(data, d => {
          return d[xData];
        })
        .keys();

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
      const yAxisData = [];
      data.forEach(d => {
        let yd = 0;
        yData.forEach(y => {
          yd = yd + Number(d[y]);
        });
        yAxisData.push(yd); // group the data to cal y-axis max length
      });
      const yLen = Math.max(...yAxisData); // get the max length of y-axis
      const y = d3
        .scaleLinear()
        .domain([0, yLen + yLen / 4])
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

      // color palette
      const colors = this.colors;

      const color = d3
        .scaleOrdinal()
        .domain(yData)
        .range(colors);

      if (this.chartType === "stacked") {
        //stack the data
        const stackedData = d3
          .stack()
          .keys(yData)(data)
          .map(d => (d.forEach(v => (v.key = d.key)), d));
        // Show the bars
        svg
          .append("g")
          .selectAll("g")
          .data(stackedData)
          .enter()
          .append("g")
          .attr("fill", d => color(d.key))
          .selectAll("rect")
          .data(d => d)
          .enter()
          .append("rect")
          .attr("x", d => x(d.data[xData]))
          .attr("y", d => y(d[1]))
          .transition()
          .duration(800)
          .attr("height", d => y(d[0]) - y(d[1]))
          .delay((d,i) => i * 100)
          .attr("width", x.bandwidth());
      } else if (this.chartType === "grouped") {
        // group the data
        var groupData = d3
          .scaleBand()
          .domain(yData)
          .range([0, x.bandwidth()])
          .padding([0.01]);

        // Show the bars
        svg
          .append("g")
          .selectAll("g")
          // Enter in data = loop group per group
          .data(data)
          .enter()
          .append("g")
          .attr("transform", d => "translate(" + x(d.month) + ",0)")
          .selectAll("rect")
          .data(d => {
            return yData.map(key => {
              return { key: key, value: d[key] };
            });
          })
          .enter()
          .append("rect")
          .attr("x", d => groupData(d.key))
          .attr("y", d => y(d.value))
          .transition()
          .duration(1000)
          .ease("linear")
          .attr("width", groupData.bandwidth())
          .attr("height", d => height - y(d.value))
          .attr("fill", d => color(d.key));
      }

      // Draw legend
      const legend = svg
        .selectAll(".legend")
        .data(colors)
        .enter()
        .append("g")
        .attr("transform", (d, i) => {
          return "translate( -" + (i * 70 + 120) + ", -20)";
        });
      
      const legendColors = colors.slice().reverse();
      legend
        .append("circle")
        .attr("x", width - 18)
        .attr("cx", width - 10)
        .attr("cy", 10)
        .attr("r", 6)
        .style("fill", (d, i) => legendColors[i]);
      
      const legendText = yData.slice().reverse();
      legend
        .append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text((d, i) => {
          const text = legendText[i];
          return text.charAt(0).toUpperCase() + text.slice(1);
        });
    },
  onChangeBar() {
    d3.select("svg").remove();
    this.loadBarChart();
  }
  }
};
</script>

<style>
#select-bar {
  width: 100px;
}

#select-bar label {
  font: 10px sans-serif;
}

#select-bar select {
  width:120px;
  font: 12px sans-serif;
}

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
