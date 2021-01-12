<template>
  <div data-name="data-table">
    <b-container>
      <div data-name="responsive-table">
        <b-row class="title-section">
          <b-col md="6">
            <h5>{{ title }}</h5>
          </b-col>
          <b-col offset-md="3" md="3" class="my-3">
            <b-input-group size="sm" class="pl-4 pr-4">
              <b-input-group-prepend is-text class="bg-icon">
                <b-icon icon="search"></b-icon>
              </b-input-group-prepend>
              <b-form-input type="search" v-model="filter"></b-form-input>
            </b-input-group>
          </b-col>
        </b-row>
        <b-table
          id="data-table"
          responsive
          bordered
          sticky-header
          :items="items"
          :fields="fields"
          :sort-by.sync="sortColumn"
          :sort-direction="sortOrder"
          :filter="filter"
          :filter-included-fields="filterOn"
          :currentPage="currentPage"
          :per-page="perPage"
          show-empty
          small
          @filtered="onFiltered"
        ></b-table>
        <b-row>
          <b-col md="4">
            <span class="ml-3" style="font-size:0.875rem;">
              {{ pageRecordDetails }}
            </span>
          </b-col>
          <b-col md="4" class="mb-3">
            <b-form-group
              label="shows"
              label-for="per-page-select"
              label-cols-md="4"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
                style="width:60px;"
                @change="dataPerPage"
              ></b-form-select>
              <span class="ml-1" style="font-size:0.875rem;"
                >entries per page</span
              >
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-button-toolbar
              key-nav
              aria-label="Toolbar with button groups"
              class="float-right"
            >
              <b-button-group class="mx-1">
                <b-button
                  class="paginate-btn"
                  :disabled="currentPage === 1"
                  @click="paginate(`forward previous`)"
                  >&laquo;</b-button
                >
                <b-button
                  class="paginate-btn"
                  :disabled="currentPage === 1"
                  @click="paginate(`previous`)"
                  >&lsaquo;</b-button
                >
              </b-button-group>
              <span style="line-height: 38px; font-size: 14px;"
                >Page {{ currentPage }} of {{ totalPages }}</span
              >
              <b-button-group class="mx-1">
                <b-button
                  class="paginate-btn"
                  :disabled="currentPage === totalPages"
                  @click="paginate(`next`)"
                  >&rsaquo;</b-button
                >
                <b-button
                  class="paginate-btn"
                  :disabled="currentPage === totalPages"
                  @click="paginate(`forward next`)"
                  >&raquo;</b-button
                >
              </b-button-group>
            </b-button-toolbar>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "data-table",
  props: {
    title: String,
    items: Array,
    fields: Array,
    sortBy: String,
    sortDirection: String,
    recorderPerPage: Number
  },
  data() {
    return {
      sortColumn: this.sortBy || "",
      sortOrder: this.sortDirection || "asc",
      filter: null,
      filterOn: [],
      totalRows: 1,
      totalPages: 1,
      currentPage: 1,
      perPage: this.recorderPerPage || 5,
      pageOptions: [5, 10, 20, 50]
    };
  },
  mounted() {
    this.totalRows = this.items.length;
    this.totalPages = this.pageCount();
  },
  computed: {
    pageRecordDetails() {
      let to;
      let from;
      if (this.currentPage === 0) {
        from = 0;
        to = 0;
      } else if (this.currentPage === this.totalPages) {
        from = (this.currentPage - 1) * this.perPage + 1;
        to = this.totalRows;
      } else if (this.currentPage === 1) {
        from = 1;
        to = this.perPage;
      } else {
        to = this.perPage * this.currentPage;
        from = to - this.perPage + 1;
      }
      return `Showing ${from} - ${to} of ${this.totalRows} entries`;
    }
  },
  methods: {
    pageCount() {
      return Math.ceil(this.totalRows / this.perPage);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.totalPages = this.pageCount();
      this.currentPage = this.totalPages >= 1 ? 1 : 0;
    },
    dataPerPage() {
      this.totalPages = this.pageCount();
    },
    paginate(direction) {
      switch (direction) {
        case "forward previous":
          this.currentPage = 1;
          break;
        case "previous":
          this.currentPage = this.currentPage - 1;
          break;
        case "next":
          this.currentPage = this.currentPage + 1;
          break;
        case "forward next":
          this.currentPage = this.totalPages;
          break;
      }
    }
  }
};
</script>

<style scoped>
[data-name="responsive-table"] {
  text-align: left;
  border: 1px solid #dee2e6;
  border-radius: 5px;
}

.title-section h5 {
  padding: 20px 0px 0px 20px;
}
.input-group-text {
  background: transparent !important;
}
.paginate-btn,
.paginate-btn:hover,
.paginate-btn:focus {
  margin-right: 5px;
  background: transparent !important;
  border-color: #dee2e6 !important;
  color: black !important;
}
</style>
