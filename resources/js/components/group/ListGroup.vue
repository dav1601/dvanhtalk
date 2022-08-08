<template>
    <div>
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
        <div class="wrapper__list--group scroll-custom" id="wp__groups">
            <item-group
                v-for="(group, key) in listGroup"
                :key="'Lobby-Group-' + key"
                :group="group"
                :isLoading="!loadedGroups"
            ></item-group>
            <sk-item-group
                :isLoading="!loadedGroups"
                v-for="i in 7"
                :key="'Ske-Group-' + i"
            ></sk-item-group>
        </div>
    </div>
</template>
<script>
import SkItemGroup from "../skeleton/SkItemGroup.vue";
import ItemGroup from "../group/ItemGroup.vue";
export default {
    components: {
        SkItemGroup,
        ItemGroup,
    },
    computed: {
        listGroup() {
            return this.$store.getters["users/groups"];
        },
        myGroups() {
            return this.$store.getters["users/myGroups"];
        },
    },
    async created() {
        await this.setGroups();
    },
    data() {
        return {
            loadedGroups: false,
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
    methods: {
        async setGroups() {
            this.loadedGroups = false;
            await this.$store
                .dispatch("users/getGroups")
                .then((req) => {
                    this.loadedGroups = true;
                })
                .catch((err) => {
                    this.loadedGroups = false;
                });
        },
        async saveGroup() {
            this.loadedGroups = false;
            let file = document.getElementById("imageGroup").files[0];
            if (file != "undefined" && this.nameGroup != "") {
                this.notValid = false;
                this.adding = true;
                const data = {
                    file: file,
                    name: this.nameGroup,
                    selected: this.selected,
                };
                await this.$store
                    .dispatch("users/addGroup", data)
                    .then((req) => {
                        this.loadedGroups = true;
                        this.adding = false;
                        this.successRequest = true;
                        this.successText = "Thêm nhóm thành công";
                        this.dialog = false;
                        this.resetForm;
                    })
                    .catch((err) => {
                        this.adding = false;
                        this.notValid = true;
                        this.errorText =
                            "Thêm nhóm thất bại vui lòng F5 vàf thử lại";
                        this.resetForm;
                        this.loadedGroups = false;
                    });
            } else {
                this.notValid = true;
                this.errorText = "Bạn chưa nhập đủ thông tin của nhóm";
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.wrapper__list--group {
    margin-bottom: 130px;
}
#wp__groups {
    overflow-x: hidden;
    overflow-y: scroll;
}
</style>
