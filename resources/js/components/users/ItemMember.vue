<template>
  <div
    class="list-group-item list-group-item-action border-0"
    v-if="!isChecking"
  >
    <div class="d-flex align-items-center">
      <img
        :src="makeAvatar(member.info.avatar)"
        class="rounded-circle mr-1"
        alt="Vanessa Tucker"
        width="45"
        height="45"
      />
      <div class="flex-grow-1 ml-3">
        {{ member.info.name }}
        <div class="small">Role: {{ member.info.role }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import user from "../../mixin/user";
export default {
  props: ["member", "isChecking"],
  mixins: [user],
  async created() {
    console.log(this.member);
  },
  computed: {},
  methods: {},
};
</script>
<style scoped>
</style>
