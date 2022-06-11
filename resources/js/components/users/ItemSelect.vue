<template>
  <div class="d-flex align-items-center py-1 item-select mb-1" >
    <div class="position-relative">
      <img
        :src="makeAvatar(user.avatar)"
        class="rounded-circle mr-1 img__obj--cover"
        :alt="user.name"
        :width="width"
        :height="height"
      />
    </div>
    <div class="flex-grow-1 pl-3">
      <strong>{{ user.name }}</strong>
    </div>
  </div>
</template>
<script>
import user from '../../mixin/user'
export default {
  mixins: [user],
  props: {
    user: {},
    width: {
      type: String,
      default: 45,
    },
    height: {
      type: String,
      default: 45,
    },
  },
};
</script>
