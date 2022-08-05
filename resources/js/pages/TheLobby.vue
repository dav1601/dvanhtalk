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

        <!-- tabs phone -->
        <div
            class="w-100 h-100 col-12 py-0"
            :class="[isChat ? ['px-0'] : '']"
            id="wrapper__tabs"
            v-if="!isIpadProUp"
        >
            <v-tabs v-model="tab" fixed-tabs v-if="isHome">
                <v-tabs-slider></v-tabs-slider>
                <v-tab href="#mobile-tabs-5-1" class="primary--text">
                    <v-icon>mdi-message</v-icon>
                </v-tab>

                <v-tab href="#mobile-tabs-5-2" class="primary--text">
                    <v-icon>mdi-account-group</v-icon>
                </v-tab>

                <v-tab href="#mobile-tabs-5-3" class="primary--text">
                    <v-icon>mdi-account-cog</v-icon>
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" v-if="isHome">
                <v-tab-item value="mobile-tabs-5-1" id="mobile-tabs-5-1">
                    <v-card>
                        <v-card-text>Đang hoạt động</v-card-text>
                        <v-slide-group
                            show-arrows
                            v-if="listUsersOnline.length > 0"
                        >
                            <v-slide-item
                                v-for="(user, index) in listUsersOnline"
                                :key="'slide-user-online-' + index"
                            >
                                <router-link
                                    :to="{
                                        name: 'chat',
                                        params: { friendId: user.id },
                                        query: { uid: user.id },
                                    }"
                                    class="mx-3 user--online"
                                    style="width: 60px; height: 60px"
                                >
                                    <item-avatar
                                        :img="user.avatar"
                                        :username="user.name"
                                        height="60px"
                                        width="60px"
                                        fontStt="14px"
                                        :showStt="true"
                                        :userId="user.id"
                                    ></item-avatar>
                                    <span
                                        class="d-block text-overflow user--online-name text-center"
                                    >
                                        {{ user.name }}</span
                                    >
                                </router-link>
                            </v-slide-item>
                        </v-slide-group>
                        <v-card-text v-else
                            >Hiện không có người dùng nào đang hoạt
                            động</v-card-text
                        >
                    </v-card>
                    <v-card class="w-100 h-100" style="margin-bottom: 100px">
                        <list-user
                            class="w-100 h-100 wrapper__layout--users"
                        ></list-user>
                    </v-card>
                </v-tab-item>
                <v-tab-item value="mobile-tabs-5-2">
                    <div class="mb-2">
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
                    <list-group></list-group>
                </v-tab-item>
                <v-tab-item value="mobile-tabs-5-3"> test 3 </v-tab-item>
            </v-tabs-items>
            <router-view></router-view>
        </div>
        <!-- end tabs phone -->
        <div
            class="row g-0 mx-0 p-0 h-100 no-gutters"
            :class="[isHome ? ['col-6'] : 'col-12']"
            v-if="isIpadProUp"
        >
            <list-user
                :isLoadingUser="isLoadingUsers"
                :class="[!isHome ? ['col-20', 'd-ipp-none'] : '']"
                class="wrapper__layout--users"
            ></list-user>

            <!--  -->
            <router-view></router-view>
        </div>
        <!-- ----------------------- -->
        <div
            class="row g-0 mt-0 py-0 no-gutters"
            v-if="isHome && isIpadProUp"
            :class="[isHome ? ['col-6'] : 'col-12']"
            id="listGroup"
        >
            <div
                class="col-12 col-lg-5 border-right listGroup davList"
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
                <list-group></list-group>
                <!-- --------------- -->
                <hr class="d-block d-lg-none mt-1 mb-0" />
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import SkItemUser from "../components/skeleton/SkItemUser.vue";
import ItemSelect from "../components/users/ItemSelect.vue";
import ItemUser from "../components/users/ItemUser.vue";
import ListUser from "../components/users/ListUser.vue";
import ListGroup from "../components/group/ListGroup";
import user from "../mixin/user";
import responsive from "../mixin/responsive";
export default {
    components: {
        ItemUser,
        ItemSelect,
        SkItemUser,
        ListUser,
        ListGroup,
    },
    mixins: [user, responsive],
    data() {
        return {
            tab: null,
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
    mounted() {
        this.watchLayoutDes();
    },
    computed: {
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
    //  LÀM TAB RESPONSIVE CHO LOBBY CHO MENUUUUUUUUUUUUUUUUUUUUUUUUUUU
    methods: {
        async requestsJoinGroup() {
            await this.$store
                .dispatch("users/getRequestsJoinGroup")
                .then((req) => {})
                .catch((err) => {});
        },
        open() {},
        close() {},
        watchLayoutDes() {
            if (this.isIpadProUp) {
                const header = this.getAbsoluteHeight(
                    document.getElementById("main__app__bar")
                );
                const searchGroup = this.getAbsoluteHeight(
                    document.getElementById("searchGroup")
                );
                const searchUser = this.getAbsoluteHeight(
                    document.getElementById("search__users")
                );
                const wp__groups = document.getElementById("wp__groups");
                const wp__users = document.getElementById("wp__users");
                const sum__groups = this.windowHeight - (header + searchGroup);
                const sum__users = this.windowHeight - (header + searchUser);
                wp__groups.style.height = sum__groups + "px";
                wp__users.style.height = sum__users + "px";
            }
        },
        watchLayoutPhone() {
            if (!this.isIpadProUp) {
            }
        },
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
<style lang="scss">
#wrapper__tabs {
    .v-tab {
        border-bottom: 1px solid var(--bs-gray-500);
        text-decoration: none;
    }
    .user--online {
        &-name {
            color: var(--bs-gray-500);
        }
        text-decoration: none;
    }
    #mobile-tabs-5-1 {
        .v-slide-group__content {
            height: 100px;
        }
    }
}
.fixLayout {
    left: 18% !important;
    width: 800px !important;
}
.multiselect__content {
    padding-left: 0 !important;
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
