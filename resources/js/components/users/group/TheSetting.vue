<template>
    <v-card>
        <v-app-bar elevation="4" class="va__dialog--groupSetting">
            <v-card-title>Cài Đặt Nhóm</v-card-title>
            <v-icon dark>mdi-close</v-icon>
        </v-app-bar>
        <v-row no-gutters class="p-4">
            <v-col cols="4" class="px-4">
                <v-card-title>Chỉnh Sửa Thông Tin</v-card-title>
                <v-text-field
                    v-model="nameGr"
                    label="Tên Nhóm"
                    required
                ></v-text-field>
                <v-btn class="mr-4" color="primary"> Lưu </v-btn>
            </v-col>
            <v-col cols="4" class="px-4">
                <v-card-title>Yêu Cầu Tham Gia Nhóm</v-card-title>
                <item-req
                    v-for="(request, key) in receiver.requests_join"
                    :key="'request-' + key"
                    :request="request"
                    :isManage="isManage"
                    :isAdmin="isAdmin"
                    :isMod="isMod"
                ></item-req>
            </v-col>
            <v-col cols="4" class="px-4">
                <v-card-title>Quản Lý Thành Viên</v-card-title>
                <item-member
                    v-for="(user, key) in receiver.members"
                    :key="'member' + key"
                    :member="user"
                    :isAdmin="isAdmin"
                    :isMod="isMod"
                    :isManage="isManage"
                    :isSetting="true"
                    :isChecking="false"
                ></item-member>
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
import user from "../../../mixin/user";
import ItemReq from "../group/ItemReq.vue";
import ItemMember from "../../../components/users/ItemMember.vue";
export default {
    components: { ItemReq, ItemMember },
    props: ["receiver", "isAdmin", "isMod", "isManage"],
    mixins: [user],
    data() {
        return {
            nameGr: "",
        };
    },
    created() {
        this.nameGr = this.receiver.name;
    },
};
</script>
<style lang="scss">
.v-dialog__content {
    z-index: 99000 !important;
}
</style>
