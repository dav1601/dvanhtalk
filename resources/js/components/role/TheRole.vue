<template>
 <div>
      <img
    v-if="type == 'icon' && getRole"
    :src="getRole.icon"
    :alt="'royal-role' + role"
    :width="width"
    :height="height"
  />
    <img
    v-if="type == 'join' && getRole"
    :src="getRole.joinGit"
    :alt="'royal-role' + role"
    :width="width"
    :height="height"
  />
 </div>

</template>
<script>
export default {
  props: {
    role: {
      type: Number,
      default: 2,
    },
    type: {
      type: String,
      default: "icon",
    },
    width: {
      type: Number,
      default: 32,
    },
    height: {
      type: Number,
      default: 32,
    },
  },
  data() {
    return {
      dataRole: [
        {
          role: 0,
          icon: "https://res.cloudinary.com/team151/image/upload/v1653124688/icon/dragon_qma4vj.png",
          joinGit: "https://res.cloudinary.com/team151/image/upload/v1653244957/icon/6NeK_t6eskg.gif",
        },
        {
          role: 1,
          icon: "https://res.cloudinary.com/team151/image/upload/v1653124964/icon/phoenix_cldjpu.png",
          joinGit: "https://res.cloudinary.com/team151/image/upload/v1653244962/icon/7AxL_hoycen.gif",
        },
      ],
    };
  },
  computed: {
    getRole() {
      const role = this.dataRole.find((role) => role.role == this.role);
      if (role) {
        return role;
      } else {
        return false;
      }
    },
  },
};
</script>

