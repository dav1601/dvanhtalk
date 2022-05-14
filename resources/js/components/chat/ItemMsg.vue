<template>
  <div
    class="pb-4"
    :class="[itMe ? ['chat-message-right'] : ['chat-message-left']]"
  >
    <div :class="[!itMe ? ['d-flex flex-column align-items-center'] : ['']]">
      <img
        :src="itMe ? avatar : makeAvatar(receiver.avatar)"
        class="rounded-circle mr-1"
        alt="Chris Wood"
        width="45"
        height="45"
      />
      <div
        class="text-muted small text-nowrap mt-2"
        :class="[itMe ? [''] : ['mx-2']]"
      >
        {{ formatTime(data.message.created_at) }}
      </div>
    </div>

    <div
      class="flex-shrink-1 bg-light rounded px-3 py-2 mr-3"
      :class="[itMe ? ['me-chat'] : ['friend-chat']]"
      v-if="type == 1"
    >
      <div class="font-weight-bold mb-1">
        {{ itMe ? "You" : receiver.name }}
      </div>
      {{ data.message.message }}
    </div>
    <div
      class="flex-shrink-1 bg-light rounded px-2 py-2 mr-3"
      :style="createBackgroundImage"
      v-if="type == 2"
    >
      <img :src="data.message.message" alt="message image" @load="loaded" />
    </div>
    <div :style="createBgAudio" class="flex-shrink-1 bg-light rounded px-1 py-1 mr-3" v-if="type == 3">
      <vuetify-audio
        :file="data.message.message"
        color="primary"
        downloadable
        :canPlay="loaded"
      ></vuetify-audio>
    </div>
  </div>
</template>
<script>
import user from "../../mixin/user";
export default {
  props: ["data", "receiver"],
  mixins: [user],
  components: {
    VuetifyAudio: () => import("vuetify-audio"),
  },
  computed: {
    createBackgroundImage() {
      return (
        "background-image: radial-gradient(circle, rgba(0, 0, 0, 0) 25%, rgba(24, 24, 24, 1) 75%),url(" +
        this.data.message.message +
        ");background-size: cover;"
      );
    },
    createBgAudio() {
      return "background-image: radial-gradient(circle, rgba(0, 0, 0, 0) 25%, rgba(24, 24, 24, 1) 75%);background-size: cover;";
    },
    itMe() {
      return this.data.sd_id == this.id;
    },
    type() {
      return this.data.message.type;
    },
  },
  methods: {
    formatTime($time) {
      var d = new Date($time);
      return d.toLocaleTimeString();
    },
    loaded() {
      return this.$emit("loaded");
    },
  },
};
</script>
<style scoped>
img {
  max-width: 350px;
  max-height: 350px;
}
</style>
