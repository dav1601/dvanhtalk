<template>
    <div
        class="list-group-item list-group-item-action border-0"
        :class="role"
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
            </div>
            <div class="flex-grow-1 d-flex justify-content-end">
                <the-role v-if="!isSetting" :role="member.role"></the-role>
                <v-btn v-if="member.role == 1 && isAdmin">Gỡ Mod</v-btn>
            </div>
        </div>
    </div>
</template>
<script>
import user from "../../mixin/user";
import TheRole from "../role/TheRole.vue";
export default {
    components: { TheRole },
    props: [
        "member",
        "isChecking",
        "isManage",
        "isAdmin",
        "isMod",
        "isSetting",
    ],
    mixins: [user],
    data() {
        return {
            text: "user",
        };
    },
    async created() {
        this.setText;
    },
    computed: {
        role() {
            return "royal-role-" + this.member.role;
        },
        setText() {
            if (this.member.role == 0) {
                return (this.text = "Admin");
            } else if (this.member.role == 1) {
                return (this.text = "Mod");
            } else {
                return (this.text = "User");
            }
        },
    },
    methods: {},
};
</script>
<style lang="scss" scpoed>
@import "../../../sass/_variables.scss";
.role-0 {
    @include designRole(0);
}
.role-1 {
    @include designRole(1);
}
</style>
