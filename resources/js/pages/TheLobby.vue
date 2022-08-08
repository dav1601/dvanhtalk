<template>
    <div
        :class="[isHome ? ['row'] : '']"
        class="h-100"
        style="background-color: inherit"
    >
        <!-- end dialog -->
        <v-dialog :fullscreen="true" v-model="dialogAction" id="dialog__action">
            <v-card>
                <div id="dialog__action__title" class="b-b-4-d">
                    <div
                        class="d-inline-block cursor-pointer"
                        @click.stop="dialogAction = false"
                    >
                        <a
                            class="d-flex justify-content-start align-items-center text-decoration-none"
                        >
                            <v-icon size="25" color="#fff"
                                >mdi-keyboard-backspace</v-icon
                            >
                            <span class="d-block ml-4">{{
                                payLoadDialog.title
                            }}</span>
                        </a>
                    </div>
                </div>
                <div id="dialog__action__content">
                    <setting-user
                        v-if="payLoadDialog.name == 'setting__user'"
                    ></setting-user>
                </div>
            </v-card>
        </v-dialog>
        <!-- tabs phone -->
        <div
            class="w-100 h-100 col-12 py-0"
            :class="[
                isChat && !isIpadProUp ? ['px-0'] : '',
                !isChat && !isIpadProUp ? ['dav-px-15'] : '',
            ]"
            id="wrapper__tabs"
            v-if="!isIpadProUp"
        >
            <v-tabs
                v-model="tab"
                fixed-tabs
                v-if="isHome"
                id="header__mobi__tabs"
            >
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
                    <v-card id="mobi__users__online">
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
                    <v-card class="w-100 h-100">
                        <list-user
                            class="w-100 h-100 wrapper__layout--users"
                        ></list-user>
                    </v-card>
                </v-tab-item>
                <v-tab-item value="mobile-tabs-5-2">
                    <list-group></list-group>
                </v-tab-item>
                <v-tab-item value="mobile-tabs-5-3">
                    <div
                        class="w-100 d-flex justify-content-center align-items-center flex-column mt-4"
                    >
                        <item-avatar
                            :fullWH="false"
                            :img="avatar"
                            :username="authName"
                            height="80px"
                            width="80px"
                            fontStt="14px"
                            classStyleName="auth__name"
                            :showName="true"
                        ></item-avatar>
                    </div>
                    <v-card class="list__actions-mobile">
                        <div class="box__action">
                            <span class="box__action-title"
                                >Tài khoản & hỗ trợ</span
                            >

                            <div
                                @click.stop="openDialogAction()"
                                class="box__action-item cursor-pointer"
                            >
                                <action-setting
                                    icon="mdi-cog-box"
                                    color="#6610f2"
                                    actionName="Cài đặt tài khoản"
                                    size="25"
                                ></action-setting>
                            </div>
                            <div
                                @click.prevent="logout()"
                                class="box__action-item cursor-pointer"
                            >
                                <action-setting
                                    icon="mdi-logout"
                                    color="#6c757d"
                                    actionName="Đăng xuất"
                                    size="25"
                                ></action-setting>
                            </div>
                        </div>
                    </v-card>
                </v-tab-item>
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
import ActionSetting from "../components/mobile/ActionSetting";
import SettingUser from "../pages/SettingUser";
export default {
    components: {
        ItemUser,
        ItemSelect,
        SkItemUser,
        ListUser,
        ListGroup,
        ActionSetting,
        SettingUser,
    },
    data() {
        return {
            tab: null,
            isLoading: false,
            isLoadingUsers: false,
            isLoadingGroup: false,
            currentContact: this.$route.query.uid,
            dialogAction: false,
            payLoadDialog: {
                title: null,
                name: null,
            },
        };
    },
    mounted() {
        this.watchLayout();
    },
    updated() {
        this.watchLayout();
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
        openDialogAction(name = "setting__user", title = "Dav Messenger") {
            alert("ok");
            this.payLoadDialog.title = title;
            this.payLoadDialog.name = name;
            this.dialogAction = true;
        },
        async requestsJoinGroup() {
            await this.$store
                .dispatch("users/getRequestsJoinGroup")
                .then((req) => {})
                .catch((err) => {});
        },
        open() {},
        close() {},
        watchLayout() {
            const wp__groups = document.getElementById("wp__groups");
            const wp__users = document.getElementById("wp__users");
            const searchGroup = this.getAbsoluteHeight(
                document.getElementById("searchGroup")
            );
            const searchUser = this.getAbsoluteHeight(
                document.getElementById("search__users")
            );
            let sum__groups = 0;
            let sum__users = 0;
            if (this.isIpadProUp) {
                const header = this.getAbsoluteHeight(
                    document.getElementById("main__app__bar")
                );
                sum__groups = this.windowHeight - (header + searchGroup);
                sum__users = this.windowHeight - (header + searchUser);
                console.log({
                    wh: this.windowHeight,
                    sg: searchGroup,
                    su: searchUser,
                    header: header,
                });
            } else {
                const header__tabs = this.getAbsoluteHeight(
                    document.getElementById("header__mobi__tabs")
                );
                const mobi__users__online = this.getAbsoluteHeight(
                    document.getElementById("mobi__users__online")
                );
                sum__groups =
                    this.windowHeight -
                    (header__tabs + searchGroup + mobi__users__online);
                sum__users =
                    this.windowHeight -
                    (header__tabs + searchUser + mobi__users__online);
                console.log({
                    wh: this.windowHeight,
                    sg: searchGroup,
                    su: searchUser,
                    header: header__tabs,
                    mb: mobi__users__online,
                });
            }
            if (wp__groups) {
                wp__groups.style.height = sum__groups + "px";
            }
            if (wp__users) {
                wp__users.style.height = sum__users + "px";
            }
        },
    },
    watch: {
        tab(newTab) {
            this.watchLayout();
        },
        windowHeight() {
            this.watchLayout();
        },
        windowWidth() {
            this.watchLayout();
        },
    },
};
</script>
<style lang="scss">
#dialog__action {
    &__title {
        a {
            padding: 10px 20px;
            color: var(--bs-gray-100);
            font-size: 20px;
        }
    }
}
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
    #mobile-tabs-5-3 {
        .auth__name {
            margin-top: 10px;
            font-weight: 600;
            font-size: 18px;
            text-transform: capitalize;
        }
        .box__action {
            &-item {
                padding: 10px;
                border-radius: 8px;
                &:hover {
                    text-decoration: none;
                    background: #232526; /* fallback for old browsers */
                    background: -webkit-linear-gradient(
                        to right,
                        #414345,
                        #232526
                    ); /* Chrome 10-25, Safari 5.1-6 */
                    background: linear-gradient(to right, #414345, #232526);
                }
            }

            &-title {
                padding: 10px;
                display: block;
                font-size: 14px;
                color: var(--bs-gray-500);
            }
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
