<template>
    <v-container id="setting__user">
        <div class="setting__user">
            <v-card dark v-if="loadedMe">
                <v-card-title class="setting__user-title">
                    Cài đặt tài khoản chung
                </v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <div class="setting__user-content px-8">
                        <div
                            class="w-100 d-flex justify-content-center flex-column align-center mb-2 setting__user-content--avatar"
                        >
                            <div>
                                <img
                                    :src="avatar"
                                    ref="authAvatar"
                                    class="img__obj--cover rounded-circle"
                                    width="120"
                                    height="120"
                                    alt=""
                                />
                            </div>
                            <v-btn
                                color="blue-grey"
                                class="ma-2 white--text"
                                @click="avatarUpload"
                                :disabled="saving"
                            >
                                {{ showCancel ? "Huỷ" : "Tải lên" }}
                                <v-icon right dark v-if="!showCancel">
                                    mdi-cloud-upload
                                </v-icon>
                            </v-btn>
                            <input
                                type="file"
                                class="d-none"
                                ref="avatarUpload"
                                @change="changeAvatar"
                            />
                        </div>
                        <!-- --------- -->
                        <div
                            class="d-flex justify-content-center mb-2"
                            :class="{
                                'align-items-center': activeEdit != 'name',
                            }"
                        >
                            <v-card-text style="width: 200px"
                                >Tên người dùng</v-card-text
                            >
                            <div style="flex: 1">
                                <div v-if="activeEdit == 'name'">
                                    <v-text-field
                                        label="Tên người dùng"
                                        ref="authName"
                                        v-model="name"
                                        :loading="saving"
                                        :disabled="saving"
                                        :rules="nameRules"
                                        required
                                    ></v-text-field>
                                    <div
                                        class="w-100 d-flex justify-content-end align-items-center"
                                    >
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="resetData"
                                            :disabled="saving"
                                        >
                                            Huỷ
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            :loading="saving"
                                            @click="saveDataUser"
                                            :disabled="!valid"
                                        >
                                            Lưu
                                        </v-btn>
                                    </div>
                                </div>
                                <div
                                    class="d-flex justify-content-start align-center"
                                    v-else
                                >
                                    <span class="edit__name mr-4">{{
                                        name
                                    }}</span>
                                    <v-icon
                                        dark
                                        class="cursor-pointer"
                                        @click="switchActiveEdit('name')"
                                    >
                                        mdi-pencil
                                    </v-icon>
                                </div>
                            </div>
                        </div>
                        <!-- -------------- -->
                        <div
                            class="d-flex justify-content-start mb-2"
                            :class="{
                                'align-items-center': activeEdit != 'email',
                            }"
                        >
                            <v-card-text style="width: 200px"
                                >Email</v-card-text
                            >
                            <div style="flex: 1">
                                <div v-if="activeEdit == 'email'">
                                    <v-text-field
                                        :loading="saving"
                                        :disabled="saving"
                                        ref="authEmail"
                                        label="Email"
                                        required
                                        v-model="email"
                                        :rules="emailRules"
                                    ></v-text-field>
                                    <div
                                        class="w-100 d-flex justify-content-end align-items-center"
                                    >
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="resetData"
                                            :disabled="saving"
                                        >
                                            Huỷ
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            :loading="saving"
                                            @click="saveDataUser"
                                            :disabled="!valid"
                                        >
                                            Lưu
                                        </v-btn>
                                    </div>
                                </div>
                                <div
                                    class="d-flex justify-content-start align-center"
                                    v-else
                                >
                                    <span class="edit__name mr-4">{{
                                        email
                                    }}</span>
                                    <v-icon
                                        dark
                                        class="cursor-pointer"
                                        @click="switchActiveEdit('email')"
                                    >
                                        mdi-pencil
                                    </v-icon>
                                </div>
                            </div>
                        </div>
                        <!-- -------------- -->
                        <div
                            class="d-flex justify-content-start mb-2 pb-10"
                            :class="{
                                'align-items-center':
                                    activeEdit != 'phoneNumber',
                            }"
                        >
                            <v-card-text style="width: 200px"
                                >Số điện thoại</v-card-text
                            >
                            <div style="flex: 1">
                                <div v-if="activeEdit == 'phoneNumber'">
                                    <v-text-field
                                        label="Số điện thoại"
                                        ref="authPhone"
                                        required
                                        :rules="phoneNumberRules"
                                        v-model="phoneNumber"
                                        :loading="saving"
                                        :disabled="saving"
                                    ></v-text-field>
                                    <div
                                        class="w-100 d-flex justify-content-end align-items-center"
                                    >
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="resetData"
                                            :disabled="saving"
                                        >
                                            Huỷ
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            :loading="saving"
                                            @click="saveDataUser"
                                            :disabled="!valid"
                                        >
                                            Lưu
                                        </v-btn>
                                    </div>
                                </div>
                                <div
                                    class="d-flex justify-content-start align-center"
                                    v-else
                                >
                                    <span class="edit__name mr-4">{{
                                        phoneNumber
                                    }}</span>
                                    <v-icon
                                        dark
                                        class="cursor-pointer"
                                        @click="switchActiveEdit('phoneNumber')"
                                    >
                                        mdi-pencil
                                    </v-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-form>
            </v-card>
            <!-- --------------- -->
            <v-card dark>
                <v-card-title class="setting__user-title">
                   Bảo Mật Và Đăng Nhập
                </v-card-title>
            </v-card>
            <!-- --------------- -->
            <v-card dark v-if="!loadedMe">
                <v-skeleton-loader
                    type="heading"
                    class="p-4"
                ></v-skeleton-loader>
                <div
                    class="w-100 d-flex justify-content-center flex-column align-center mb-2 setting__user-content--avatar"
                >
                    <div class="mb-2">
                        <v-skeleton-loader
                            type="avatar"
                            max-width="120"
                            height="120"
                            class="ske__avatar--settingUser"
                        ></v-skeleton-loader>
                    </div>
                    <v-skeleton-loader
                        type="button"
                        class="ske__button--settingUser"
                    ></v-skeleton-loader>
                    <!-- ----------------- -->
                    <div
                        class="d-flex justify-content-start px-8 mb-2 w-100 align-items-center"
                        v-for="i in 3"
                        :key="'ske-' + i"
                    >
                        <v-card-text class="mr-2" style="width: 200px"
                            ><v-skeleton-loader type="text"></v-skeleton-loader
                        ></v-card-text>
                        <v-card-text style="width: 200px"
                            ><v-skeleton-loader type="text"></v-skeleton-loader
                        ></v-card-text>
                        <v-skeleton-loader
                            type="button"
                            class="ske__button--settingUserPen"
                        ></v-skeleton-loader>
                    </div>
                    <!-- ---------------- -->
                </div>
            </v-card>
        </div>
    </v-container>
</template>
<script>
import user from "../mixin/user";
export default {
    mixins: [user],
    props: ["loadedMe"],
    data() {
        return {
            fileUpload: null,
            authName: null,
            saving: false,
            showCancel: false,
            valid: true,
            activeEdit: null,
            nameRules: [
                (v) => !!v || "Tên người dùng không được để trống",
                (v) =>
                    (v && v.length <= 50) || "Tên người dùng tối đa 50 ký tự",
            ],
            emailRules: [
                (v) => !!v || "E-mail dùng không được để trống",
                (v) =>
                    /.+@.+\..+/.test(v) ||
                    "E-mail bắt buộc phải đúng định dạng",
            ],
            phoneNumberRules: [
                (v) => !!v || "Số điện thoại không được để trống",
                (v) =>
                    /^[0-9]+$/.test(v) ||
                    "Số điện thoại bắt buộc phải đúng định dạng",
            ],
        };
    },
    methods: {
        changeAvatar(e) {
            const file = e.target.files[0];
            this.fileUpload = file;
            let reader = new FileReader();
            reader.onload = (e) => {
                this.$refs.authAvatar.src = reader.result;
                this.showCancel = true;
            };

            reader.readAsDataURL(this.fileUpload);
        },
        switchActiveEdit(field) {
            if (!this.saving) {
                this.activeEdit = field;
            }
        },
        async saveDataUser() {
            this.saving = true;
            await this.$store
                .dispatch("auth/updateData", {
                    image: this.fileUpload,
                    field: this.activeEdit,
                })
                .then((req) => {
                    if (req.data.isValid) {
                        this.activeEdit = null;
                        this.showCancel = false;
                        this.saving = false;
                    }
                })
                .catch((err) => {
                    this.activeEdit = null;
                    this.showCancel = false;
                    this.saving = false;
                });
        },
        resetData() {
            this.$refs.form.resetValidation();
            this.valid = true;
            this.activeEdit = null;
            this.$store.dispatch("auth/resetMe");
        },
        avatarUpload() {
            if (!this.showCancel) {
                this.$refs.avatarUpload.click();
            } else {
                this.$refs.authAvatar.src = this.avatar;
                this.showCancel = false;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.edit__name {
    font-size: 20px;
    color: #fff;
}
</style>
