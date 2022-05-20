<template>
  <div
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
      <div class="group-action d-flex justify-content-end align-items-center">
        <v-btn
          :link="true"
          :to="{ name: 'group', params: { friendId: group.id } }"
          v-if="inGroup || statusRequest == 2"
          rounded
          color="primary"
          dark
        >
          Vào Nhóm
        </v-btn>
        <v-btn
          v-if="!request && !inGroup && statusRequest == null"
          @click="sendRequest"
          rounded
          color="#263238"
          :loading="loading"
          :disabled="loading"
          dark
        >
          Xin Vào
        </v-btn>
        <v-btn
          v-if="statusRequest == 1"
          statusUpdate="1"
          rounded
          color="#424242"
          dark
        >
          Chờ xét duyệt
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import user from "../../mixin/user";
export default {
  props: ["group", "isLoading"],
  mixins: [user],
  data() {
    return {
      statusRequest: null,
      loading: false,
    };
  },
  updated() {},
  created() {
    this.setStatus;
  },
  computed: {
    setStatus() {
      if (this.request) {
        this.statusRequest = this.request.status;
      }
    },

    isMember() {
      const exist = this.group.members.find((user) => {
        return user.users_id == this.id;
      });
      if (exist) {
        return true;
      }
      return false;
    },
    isAdmin() {
      if (this.group.founder.id == this.id) {
        return true;
      }
      return false;
    },
    inGroup() {
      if (this.isMember || this.isAdmin) {
        return true;
      }
      return false;
    },
    request() {
      if (this.group.requests_join.length > 0) {
        const Rq = this.group.requests_join.find((rq) => {
          return rq.users_id == this.id;
        });
        if (Rq) {
          return Rq;
        }
      }
      return false;
    },
  },
  methods: {
    async sendRequest() {
      this.loading = true;
      await this.$store
        .dispatch("users/rqJoinGr", {
          groupId: this.group.id,
        })
        .then((req) => {
          this.loading = false;
        })
        .catch((err) => {
            this.loading = false;
        });
    },
  },
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
a {
  text-decoration: none !important;
}
.group-name {
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 5px;
}
</style>
