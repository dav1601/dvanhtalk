<template>
  <div class="row g-0">
    <div
      class="col-12 col-lg-5 border-right listUser scroll-custom"
      :class="[isHome ? ['col-xl-6', 'position-relative'] : 'col-xl-3']"
    >
      <div class="d-none d-md-block">
        <div class="d-flex align-items-center">
          <div class="flex-grow-1">
            <input
              type="text"
              class="form-control my-3"
              placeholder="Tìm 1 ai đó..."
            />
          </div>
        </div>
      </div>
      <item-user
        v-for="(user, key) in listUser"
        :key="key"
        :user="user"
        :isOnline="isOnline(user.id)"
        :active="active(user.id)"
      ></item-user>
      <hr class="d-block d-lg-none mt-1 mb-0" />
    </div>
    <v-slide-x-transition mode="out-in">
      <router-view></router-view>
    </v-slide-x-transition>
  </div>
</template>

<script>
import ItemUser from "../components/users/ItemUser.vue";
import user from "../mixin/user";
export default {
  components: { ItemUser },
  mixins: [user],
  data() {
    return {
      isLoading: false,
      currentContact: this.$route.query.uid,
    };
  },
  async created() {
    await this.setUsers;
    this.setUid;
  },
  computed: {
    async setUsers() {
      this.isLoading = true;
      await this.$store
        .dispatch("users/getUsers")
        .then((req) => {
          this.isLoading = false;
        })
        .catch((err) => {});
    },
    listUser() {
      return this.$store.getters["users/users"];
    },
    listUsersOnline() {
      return this.$store.getters["users/usersOnline"];
    },
    bindClass() {
      return this.isHome ? "col-xl-6" : "col-xl-3";
    },
  },

  methods: {
    active(id) {
      return id == this.$route.query.uid;
    },
    isOnline(id) {
      return this.listUsersOnline.find((user) => user.id == id);
    },
  },
};
</script>
<style scoped>
.fixLayout {
  left: 18% !important;
  width: 800px !important;
}
</style>

