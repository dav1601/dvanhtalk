<template>
  <div
    class="d-flex align-items-center justify-content-between mb-2"
    v-if="isLoading"
  >
    <div
      class="
        group-info
        d-flex
        align-items-center
        justify-content-start
        flex-grow-1
      "
    >
      <v-skeleton-loader
        type="image"
        width="80"
        height="80"
      ></v-skeleton-loader>
      <div class="flex-grow-1 ml-3">
        <span class="d-block group-name"
          ><v-skeleton-loader type="card-heading"></v-skeleton-loader
        ></span>
        <div class="small d-flex justify-content-lg-start align-items-center">
          <v-skeleton-loader
            type="list-item"
            width="150"
            height="40"
          ></v-skeleton-loader>
          <v-skeleton-loader type="avatar"></v-skeleton-loader>
          <v-skeleton-loader
            type="list-item"
            width="150"
            height="40"
          ></v-skeleton-loader>
        </div>
      </div>
    </div>
    <div class="group-action"></div>
  </div>
</template>
<script>
export default {
  props: ["isLoading"],
};
</script>
<style>
.v-skeleton-loader__avatar {
  border-radius: 50%;
  height: 25px;
  width: 25px;
}
.v-skeleton-loader__heading {
  width: 70%;
  margin-bottom: 0 !important;
}
.v-skeleton-loader__text {
  height: 16px;
  margin-bottom: 0;
  width: 100%;
}
.userActive {
  color: #fff;
  background-color: #007bff;
}
.small {
  font-size: 14px;
  color: #fff !important;
}
.group-image {
  border-radius: 8px;
}
.group-name {
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 5px;
}
</style>
