<template>
  <router-link
    class="list-group-item list-group-item-action border-0 card-group mb-2"
    v-if="!isLoading"
    :to="{
      name: 'group',
      params: { friendId: group.id },
      query: { uid: group.id },
    }"
  >
    <div class="d-flex align-items-center justify-content-between">
      <div
        class="
          group-info
          d-flex
          align-items-center
          justify-content-start
          flex-grow-1
        "
      >
        <img
          :src="makeAvatar(group.group_image)"
          class="group-image mr-1"
          alt="Vanessa Tucker"
          width="80"
          height="80"
        />
        <div class="flex-grow-1 ml-3">
          <span class="d-block group-name">{{ group.name }}</span>
          <div class="small d-flex justify-content-lg-start align-items-center">
            <span class="d-block">Admin:</span>
            <img
              :src="makeAvatar(group.founder.avatar)"
              :alt="group.name"
              width="20"
              height="20"
              class="rounded-circle mx-2"
            />
            <span class="d-block">{{ group.founder.name }}</span>
          </div>
        </div>
      </div>
      <div class="group-action">
          
      </div>
    </div>
  </router-link>
</template>
<script>
import user from "../../mixin/user";
export default {
  props: ["group" , "isLoading"],
  mixins: [user],
  async updated() {},
  async created() {},
  computed: {},
  methods: {},
};
</script>
<style scoped>
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
