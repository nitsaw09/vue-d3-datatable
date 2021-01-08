<template>
  <div class="home">
    <data-table
      data-name="shipment-list"
      v-if="busy"
      :data="shipmentData"
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
      shipmentData: {
        title: "Details",
        fields: [
          { key: "month", label: "Pickup Date", sortable: true },
          { key: "deliverd", label: "Deliverd", sortable: true },
          { key: "undelivered", label: "Undelivered", sortable: true }
        ],
        items: [],
        sortBy: "month"
      },
      busy: false
    };
  },
  created() {
    this.getShipment();
  },
  methods: {
    getShipment() {
      getFetch("shipment")
        .then(data => {
          this.shipmentData.items = data;
          this.busy = true;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
