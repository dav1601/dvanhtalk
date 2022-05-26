<template>
      <div
    class="pb-4 chat-message-left mt-4"
       v-if="typing"
  >
<div class="d-flex flex-column align-items-center mr-3">
      <img
        :src="makeAvatar(receiver.avatar)"
        class="rounded-circle mr-1"
        :alt="receiver.name"
        width="45"
        height="45"
      />
    </div>
    <div
      class="
        flex-shrink-1
        bg-light
        rounded
        mr-2
        chat-item
        d-flex
        flex-column
        position-relative
        friend-chat
      "
    >
      <iframe src="https://giphy.com/embed/ule4vhcY1xEKQ" width="100" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
    </div>
  </div>

</template>
<script>
import user from "../../mixin/user";
export default {
props:['receiver' , 'typing'],
mixins: [user],
};
</script>
<style scoped>
.msg-time-left {
  padding-left: 50px;
}
.text-muted {
  font-size: 12.99999px;
}
.msg-time-right {
  padding-right: 56px;
}
img {
  max-width: 350px;
  max-height: 350px;
}
.chat-item {
  border-radius: 8px !important;
}

.friend-chat .name-sender {
  color: #b0b3b8;
}
.me-chat .name-sender {
  color: #00b2ff;
  font-weight: 600;
}
.friend-chat {
  background: #3e4042 !important;
}
.me-chat {
  background: #006aff !important;
}
</style>
