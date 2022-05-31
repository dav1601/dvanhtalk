<template>
    <v-card>
        <v-app-bar
            elevation="4"
            class="va__dialog--groupSetting justify-content-between"
        >
            <v-card-title>Cài Đặt Nhóm</v-card-title>
            <v-icon dark @click="closeDialog">mdi-close</v-icon>
        </v-app-bar>
        <v-row no-gutters class="p-4">
            <v-col cols="4" class="px-4">
                <div>
                    <v-card-title>Chỉnh Sửa Thông Tin</v-card-title>
                    <v-text-field
                        v-model="nameGr"
                        label="Tên Nhóm"
                        required
                    ></v-text-field>
                    <div class="mt-4 mb-8">
                        <v-card-title>Thêm Thành Viên</v-card-title>
                        <multiselect
                            v-model="selected"
                            selectLabel="Click để chọn"
                            deselectLabel="Click để bỏ chọn"
                            placeholder="Thêm thành viên"
                            label="name"
                            track-by="id"
                            :options="users"
                            :multiple="true"
                            :taggable="true"
                        >
                            <template slot="option" slot-scope="props">
                                <item-select
                                    :user="props.option"
                                    width="40"
                                    height="40"
                                ></item-select>
                            </template>
                        </multiselect>
                    </div>
                    <v-btn
                        class="mt-5 mx-auto d-block"
                        width="35%"
                        @click="saveDataGroup"
                        color="primary"
                        :loading="saving"
                    >
                        Lưu
                    </v-btn>
                </div>
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
                    v-for="(user, key) in members"
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
import ItemSelect from "../../../components/users/ItemSelect.vue";
export default {
    components: { ItemReq, ItemMember, ItemSelect },
    props: ["receiver", "isAdmin", "isMod", "isManage", "members"],
    mixins: [user],
    emits: ["close-dialog"],
    data() {
        return {
            nameGr: "",
            selected: [],
            saving: false,
        };
    },
    created() {
        this.nameGr = this.receiver.name;
    },
    computed: {
        listUser() {
            return this.$store.getters["users/users"];
        },
        users() {
            let data = [];
            this.listUser.forEach((user) => {
                const existMember = this.receiver.members.findIndex((mem) => {
                    return mem.users_id == user.id;
                });
                if (existMember == -1) {
                    data.push(user);
                }
            });
            return data;
        },
    },
    methods: {
        closeDialog() {
            console.log("ok");
            this.$emit("close-dialog", true);
        },
        saveDataGroup() {
            if (this.isAdmin) {
                if (this.nameGr != "" && this.nameGr != null && this.nameGr) {
                    this.saving = true;
                    this.$store
                        .dispatch("users/saveDataGroup", {
                            groups_id: this.receiver.id,
                            selected: this.selected,
                            name: this.nameGr,
                        })
                        .then((req) => {
                            this.saving = false;
                            this.selected = [];
                        })
                        .catch((err) => {
                            this.saving = false;
                            this.selected = [];
                        });
                }
            } else {
                alert("Bạn không đủ quyền hạn để thực hiện chức năng này");
            }
        },
    },
};
</script>
<style lang="scss">
.va__dialog--groupSetting {
    .v-toolbar__content {
        justify-content: space-between;
        i {
            cursor: pointer;
        }
    }
}
</style>
