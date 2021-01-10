<template>
  <div class="home">
    <data-table
      data-name="shipment-list"
      :items="shipmentData"
      :fields="fields"
      sortBy="month"
      title="Details"
      :isBusy="busy"
    ></data-table>
  </div>
</template>

<script>
import DataTable from "../components/dataTable.vue";
import { getFetch } from "../utils/apiRequest";

export default {
  name: "Home",
  components: {
    DataTable
  },
  data() {
    return {
      shipmentData: [],
      fields: [
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
