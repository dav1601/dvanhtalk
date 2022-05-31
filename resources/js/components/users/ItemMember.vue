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
                <v-btn
                    @click="handleActions('removeMod')"
                    color="#d63031"
                    :loading="handling"
                    v-if="member.role == 1 && isAdmin && isSetting"
                    >Gỡ Mod</v-btn
                >
                <v-btn
                    color="#e17055"
                    class="mr-2"
                    :loading="handling"
                    @click="handleActions('setMod')"
                    v-if="member.role == 2 && isAdmin && isSetting"
                    >Set Mod</v-btn
                >
                <v-btn
                    @click="handleActions('kick')"
                    :loading="handling"
                    v-if="member.role == 2 && isManage && isSetting"
                    >Kick</v-btn
                >
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
            handling: false,
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
    methods: {
        async handleActions(action) {
            this.handling = true;
            if (action == "setMod") {
                this.title = "Bạn có chắc muốn set mod cho thành viên này";
            } else if (action == "removeMod") {
                this.title = "Bạn có chắc muốn xoá mod của thành viên này";
            } else {
                this.title =
                    "Bạn có chắc muốn kick thành viên này ra khỏi nhóm";
            }
            if (confirm(this.title)) {
                await this.$store
                    .dispatch("users/handleActionsGroup", {
                        users_id: this.member.users_id,
                        groups_id: this.member.groups_id,
                        action: action,
                    })
                    .then((req) => {
                        this.handling = false;
                    })
                    .catch((err) => {
                        this.handling = false;
                    });
            } else {
                this.handling = false;
            }
        },
    },
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
