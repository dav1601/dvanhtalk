<template>
    <div class="position-relative">
        <div
            class="d-flex justify-content-start align-items-center join__chat position-relative"
        >
            <div
                class="d-flex justify-content-start align-items-center join__chat--cap p-1"
            >
                <img
                    :src="makeAvatar(member.info.avatar)"
                    height="35"
                    width="35"
                    class="rounded-circle img__obj--cover"
                    alt=""
                />
                <span> {{ member.info.name }} </span>
            </div>
            <div class="join__chat--eff">
                <the-role
                    type="join"
                    :role="member.role"
                    width="100%"
                    height="100%"
                ></the-role>
            </div>
        </div>
    </div>
</template>
<script>
import TheRole from "../../../role/TheRole.vue";
import user from "../../../../mixin/user";
export default {
    props: ["member"],
    mixins: [user],
    components: { TheRole },
};
</script>
<style lang="scss" scoped>
@import "../../../../../sass/_variables.scss";
.join__chat {
    span {
        display: block;
        margin-left: 10px;
        font-size: 15px;
        padding-right: 10px;
    }
    &--cap {
        border-radius: 25px;
        @include designRole(1);
    }
    &--eff {
        width: 200px;
        height: 200px;
        img {
            position: relative;
            top: -50px;
        }
    }
    z-index: 50000;
}
</style>
