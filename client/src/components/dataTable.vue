<template>
  <div data-name="data-table">
    <b-container>
      <div data-name="responsive-table">
        <h4>{{ title }}</h4>
        <b-table
          id="data-table"
          responsive
          bordered
          sticky-header
          :items="items"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        ></b-table>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "data-table",
  props: {
    data: Object
  },
  data() {
    return {
      title: this.data.title || "",
      items: this.data.items || [],
      fields: this.data.fields || [],
      sortBy: this.data.sortBy || "",
      sortDesc: this.data.sortDesc || false
    };
  }
};
</script>

<style scoped>
[data-name="responsive-table"] {
  text-align: left;
}
</style>
