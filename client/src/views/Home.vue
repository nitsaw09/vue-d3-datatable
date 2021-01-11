<template>
  <div class="home">
    <bar-chart v-if="!busy" :data="shipmentData" :columns="columns"></bar-chart>
    <data-table
      data-name="shipment-list"
      :items="shipmentData"
      :fields="columns"
      sortBy="month"
      title="Details"
      :isBusy="busy"
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
