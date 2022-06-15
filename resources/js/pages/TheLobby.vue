<template>
    <div
        :class="[isHome ? ['row'] : '']"
        class="h-100"
        style="background-color: inherit"
    >
        <v-snackbar v-model="notValid" timeout="3500" color="error" top>
            {{ errorText }}
        </v-snackbar>
        <v-snackbar v-model="successRequest" timeout="3500" color="primary" top>
            {{ successText }}
        </v-snackbar>
        <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
            content-class="addGroupDg"
        >
            <v-card class="position-relative">
                <base-loading :isLoading="adding"></base-loading>
                <v-card-title>
                    <span class="text-h5">Thêm Nhóm</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row no-gutters>
                            <v-col cols="12" class="px-0">
                                <v-text-field
                                    label="Tên Nhóm"
                                    v-model="nameGroup"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" class="px-0">
                                <v-file-input
                                    accept="image/*"
                                    label="Ảnh Nhóm"
                                    id="imageGroup"
                                    required
                                ></v-file-input>
                            </v-col>
                            <v-col cols="12" class="px-0">
                                <multiselect
                                    v-model="selected"
                                    selectLabel="Click để chọn"
                                    deselectLabel="Click để bỏ chọn"
                                    placeholder="Thêm thành viên"
                                    label="name"
                                    track-by="id"
                                    :options="listUser"
                                    :multiple="true"
                                    :taggable="true"
                                    @open="open"
                                    @close="close"
                                >
                                    <template slot="option" slot-scope="props">
                                        <item-select
                                            :user="props.option"
                                            width="40"
                                            height="40"
                                        ></item-select>
                                    </template>
                                </multiselect>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click.stop="dialog = false"
                    >
                        Đóng
                    </v-btn>
                    <v-btn color="blue darken-1" @click.stop="saveGroup" text>
                        Lưu
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- end dialog -->
        <div
            class="row g-0 mx-0 p-0 h-100 no-gutters"
            :class="[isHome ? ['col-6'] : 'col-12']"
        >
            <list-user :isLoadingUser="isLoadingUsers"></list-user>

            <!--  -->
            <router-view></router-view>
        </div>
        <!-- ----------------------- -->
        <div
            class="row g-0 mt-0 py-0 no-gutters"
            v-if="isHome"
            :class="[isHome ? ['col-6'] : 'col-12']"
            id="listGroup"
        >
            <div
                class="col-12 col-lg-5 border-right listGroup davList scroll-custom"
                :class="[
                    isHome ? ['col-xl-12', 'position-relative'] : 'col-xl-3',
                ]"
            >
                <div class="d-none d-md-block mb-2">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1" v-show="isHome">
                            <input
                                type="text"
                                class="form-control my-3"
                                id="searchGroup"
                                v-on:keyup="debounceSearchGroup"
                                placeholder="Tìm 1 nhóm để hít drama..."
                            />
                        </div>
                        <v-btn
                            ref="addGroup"
                            @click.stop="dialog = true"
                            class="mx-2"
                            fab
                            dark
                            color="indigo"
                            small
                        >
                            <v-icon dark> mdi-plus </v-icon>
                        </v-btn>
                    </div>
                </div>
                <!-- --------------- -->
                <div class="wrapper__list--group">
                    <item-group
                        v-for="(group, key) in listGroup"
                        :key="'Lobby-Group-' + key"
                        :group="group"
                        :isLoading="isLoadingGroup"
                    ></item-group>
                    <sk-item-group
                        :isLoading="isLoadingGroup"
                        v-for="i in 7"
                        :key="'Ske-Group-' + i"
                    ></sk-item-group>
                </div>
                <hr class="d-block d-lg-none mt-1 mb-0" />
            </div>

            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import SkItemGroup from "../components/skeleton/SkItemGroup.vue";
import SkItemUser from "../components/skeleton/SkItemUser.vue";
import ItemGroup from "../components/users/ItemGroup.vue";
import ItemSelect from "../components/users/ItemSelect.vue";
import ItemUser from "../components/users/ItemUser.vue";
import ListUser from "../components/users/ListUser.vue";
import user from "../mixin/user";
export default {
    components: {
        ItemUser,
        ItemSelect,
        ItemGroup,
        SkItemGroup,
        SkItemUser,
        ListUser,
    },
    mixins: [user],
    data() {
        return {
            isLoading: false,
            isLoadingUsers: false,
            isLoadingGroup: false,
            currentContact: this.$route.query.uid,
            dialog: false,
            nameGroup: "",
            notValid: false,
            errorText: "",
            successText: "",
            selected: [],
            adding: false,
            successRequest: false,
        };
    },
    created() {
        this.setUsers();
        this.setGroups();
    },
    computed: {
        listGroup() {
            return this.$store.getters["users/groups"];
        },
        myGroups() {
            return this.$store.getters["users/myGroups"];
        },
        bindClass() {
            return this.isHome ? "col-xl-6" : "col-xl-3";
        },
        resetForm() {
            this.adding = false;
            this.selected = [];
            this.nameGroup = [];
            document.getElementById("imageGroup").value = "";
            document.getElementsByClassName("v-file-input__text").innerHTML =
                "";
        },
    },

    methods: {
        async requestsJoinGroup() {
            await this.$store
                .dispatch("users/getRequestsJoinGroup")
                .then((req) => {})
                .catch((err) => {});
        },
        async setUsers() {
            this.isLoadingUsers = true;
            await this.$store
                .dispatch("users/getUsers")
                .then((req) => {
                    this.isLoadingUsers = false;
                })
                .catch((err) => {
                    this.isLoadingUsers = false;
                });
        },

        async setGroups() {
            this.isLoadingGroup = true;
            await this.$store
                .dispatch("users/getGroups")
                .then((req) => {
                    this.isLoadingGroup = false;
                })
                .catch((err) => {
                    this.isLoadingGroup = false;
                });
        },
        open() {},
        close() {},
        saveGroup() {
            let file = document.getElementById("imageGroup").files[0];
            if (file != "undefined" && this.nameGroup != "") {
                this.notValid = false;
                this.adding = true;
                const data = {
                    file: file,
                    name: this.nameGroup,
                    selected: this.selected,
                };
                this.$store
                    .dispatch("users/addGroup", data)
                    .then((req) => {
                        this.adding = false;
                        this.successRequest = true;
                        this.successText = "Thêm nhóm thành công";
                        this.dialog = false;
                        this.resetForm;
                    })
                    .catch((err) => {
                        this.adding = false;
                        this.notValid = true;
                        this.errorText = "Thêm nhóm thất bại vui lòng thử lại";
                        this.resetForm;
                    });
            } else {
                this.notValid = true;
                this.errorText = "Bạn chưa nhập đủ thông tin của nhóm";
            }
        },
    },
};
</script>
<style>
.fixLayout {
    left: 18% !important;
    width: 800px !important;
}
.multiselect__content {
    padding-left: 0 !important;
}
.wrapper__list--group {
    margin-bottom: 84px;
}
.multiselect__option {
    border-radius: 8px !important;
}
.multiselect__option--selected {
    background: #41b883 !important;
    color: #fff !important;
    font-weight: 700 !important;
}
.multiselect__element {
    margin-bottom: 5px !important;
}
.addGroupDg {
    overflow: unset !important;
}
</style>
