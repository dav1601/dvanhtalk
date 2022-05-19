<template>
  <router-link
    v-if="!isLoading && link"
    class="list-group-item list-group-item-action border-0"
    :to="{
      name: 'chat',
      params: { friendId: user.id },
      query: { uid: user.id },
    }"
    :class="{ classUser, active: active }"
    @click.native="resetSeen()"
  >
    <div
      class="badge bg-success float-right"
      v-show="count != 0"
      :id="classQueue"
      :data-count="count"
    >
      {{ count }}
    </div>
    <div class="d-flex align-items-start">
      <img
        :src="makeAvatar(user.avatar)"
        class="rounded-circle mr-1"
        alt="Vanessa Tucker"
        width="45"
        height="45"
      />
      <div class="flex-grow-1 ml-3">
        {{ user.name }}
        <div class="small">
          <span
            class="fas fa-circle"
            :class="{ 'chat-online': isOnline, 'chat-offline': !isOnline }"
          ></span>
          {{ textStatus }}
        </div>
      </div>
    </div>
  </router-link>
</template>
<script>
import user from "../../mixin/user";
export default {
  props: ["user", "isOnline", "active", "isLoading", "link"],
  mixins: [user],
  data() {
    return {
      count: 0,
    };
  },
  async updated() {
    await this.getMessagesUnseen;
  },
  async created() {
    await this.getMessagesUnseen;
  },
  computed: {
    textStatus() {
      return this.isOnline ? "Online" : this.user.offline_at;
    },

    classUser() {
      return "user-" + this.user.id;
    },
    classQueue() {
      return "queue-" + this.user.id;
    },
    async getMessagesUnseen() {
      await axios
        .get("/message_unseen", { params: { sd_id: this.user.id } })
        .then((req) => {
          this.count = req.data.count;
        })
        .catch((err) => {
          this.count = 0;
        });
    },
  },
  methods: {
    resetSeen() {
      this.count = 0;
      let el = document.getElementById("queue-" + this.user.id);
      let countQueue = 0;
      el.setAttribute("data-count", 0);
      el.innerHTML = 0;
      el.style.display = "none";
    },
  },
};
</script>
<style scoped>
.userActive {
  color: #fff;
  background-color: #007bff;
}
</style>
