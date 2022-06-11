<template>
    <div class="d-flex justify-content-start align-items-center item-join" >
        <div class="d-flex justify-content-start align-items-center">
            <img :src="avatar" class="rounded-circle img__obj--cover" alt="">
            <span class="join-name">{{ user.name }}</span>
        </div>
        <the-role type="join" :width="250" :height="250" :role="0"></the-role>
    </div>
</template>
<script>
import user from '../../mixin/user';
import TheRole from '../role/TheRole.vue';
export default {
  components: { TheRole },
  props:['user'],
mixins:[user]
}
</script>
<style lang="scss" scoped>
.item-join {
    border-radius: 15px;
}
</style>
