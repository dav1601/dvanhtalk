<template>
  <div
    class="d-flex align-items-center justify-content-between"
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
        type="avatar"
        width="45"
        height="45"
        class="sk-avatar"
      ></v-skeleton-loader>
      <div class="flex-grow-1 ml-3">
        <span class="d-block group-name"
          ><v-skeleton-loader
            type="card-heading"
            class="sk-user-heading"
          ></v-skeleton-loader
        ></span>
        <div
          class="small d-flex justify-content-start align-items-center sk-user"
        >
          <v-skeleton-loader type="avatar"></v-skeleton-loader>
          <v-skeleton-loader
            type="list-item"
            width="150"
            height="40"
          ></v-skeleton-loader>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["isLoading"],
};
</script>
<style>
.sk-avatar .v-skeleton-loader__avatar {
  border-radius: 50%;
  height: 45px;
  width: 45px;
}
.sk-user-heading .v-skeleton-loader__heading {
  margin-left: 0;
}
.sk-user .v-skeleton-loader__avatar {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  margin-top: 5px;
}
.v-skeleton-loader__heading {
  width: 70%;
  margin-bottom: 0 !important;
}

.sk-avatar .v-skeleton-loader__avatar {
  width: 100%;
}
.small {
  font-size: 14px;
  color: #fff !important;
}
</style>
