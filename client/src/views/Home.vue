<template>
  <div class="home">
    <bar-chart
      v-if="!busy"
      :data="shipmentData"
      :xData="chartDetails.xData"
      :yData="chartDetails.yData"
      :colors="chartDetails.colors"
    ></bar-chart>
    <data-table
      v-if="!busy"
      data-name="shipment-list"
      :items="shipmentData"
      :fields="columns"
      sortBy="month"
      title="Details"
    ></data-table>
  </div>
</template>

<script>
import BarChart from "../components/charts/barChart.vue";
import DataTable from "../components/dataTable.vue";
import { getFetch } from "../utils/apiRequest";

export default {
  name: "Home",
  components: {
    BarChart,
    DataTable
  },
  data() {
    return {
      shipmentData: [],
      columns: [
        { key: "month", label: "Pickup Date", sortable: true },
        { key: "deliverd", label: "Deliverd", sortable: true },
        { key: "undelivered", label: "Undelivered", sortable: true }
      ],
      chartDetails: {
        xData: "month",
        yData: ["deliverd", "undelivered"],
        colors: ["#4DAF4A", "#377EB8"]
      },
      busy: false
    };
  },
  created() {
    this.getShipment();
  },
  methods: {
    getShipment() {
      this.busy = true;
      getFetch("shipment")
        .then(data => {
          this.shipmentData = data;
          this.busy = false;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
