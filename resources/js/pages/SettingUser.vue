<template>
    <v-container id="setting__user">
        <div class="setting__user">
            <v-dialog
                :fullscreen="!isIpadProUp"
                transition="dialog-top-transition"
                max-width="600"
                v-model="dialgUpdateAvatar"
            >
                <v-card dark>
                    <v-card-title>Cập nhật ảnh đại diện</v-card-title>
                    <div id="update__avatar">
                        <avatar-editor
                            class="d-flex justify-content-center upd__avatar"
                            :width="300"
                            :height="300"
                            :rotation="rotation"
                            :borderRadius="borderRadius"
                            :scale="scale"
                            ref="vueavatar"
                            :image="fileUpload"
                            @click.stop="block"
                            @vue-avatar-editor:image-ready="onImageReady"
                            :reset="resetImage"
                        >
                        </avatar-editor>
                    </div>
                    <v-card-actions class="justify-end">
                        <v-btn
                            :disabled="saving"
                            text
                            @click="dialgUpdateAvatar = false"
                            >Huỷ</v-btn
                        >
                        <v-btn
                            color="primary"
                            @click="savedAvatar"
                            :loading="saving"
                            :disabled="saving"
                            >Lưu</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-card dark>
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
                                    v-if="avatar != null || fileUpload != null"
                                    :src="avatar"
                                    ref="authAvatar"
                                    class="img__obj--cover rounded-circle"
                                    width="120"
                                    height="120"
                                    alt=""
                                />
                                <item-avatar
                                    :img="null"
                                    :username="authName"
                                    height="120px"
                                    width="120px"
                                    font="5vw"
                                    v-else
                                ></item-avatar>
                            </div>
                            <v-btn
                                color="blue-grey"
                                class="ma-2 white--text"
                                @click.stop="openInput"
                                :disabled="saving"
                            >
                                Cập nhật
                            </v-btn>
                            <input
                                type="file"
                                class="d-none"
                                ref="inputAvatar"
                                @change="changeAvatar"
                                accept="image/*"
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
                                        v-model="authName"
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
                                        authName
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
                    Cài Đặt Cuộc Gọi
                </v-card-title>
                <v-btn
                    color="primary"
                    class="mb-3 ml-3"
                    @click="dialgSettingCall = true"
                    >Mở cài đặt
                    <v-icon right dark> mdi-phone-dial </v-icon>
                </v-btn>
                <setting-call
                    :dialogSettingCall="dialgSettingCall"
                    @setting-call="settingCall"
                ></setting-call>
            </v-card>

            <!-- --------------- -->
            </div>
    </v-container>
</template>
<script>
import AvatarEditor from "../components/users/AvatarEditor";
import SettingCall from "../components/chat/SettingCall.vue";
export default {
    components: { AvatarEditor, SettingCall },
    data() {
        return {
            fileUpload: null,
            saving: false,
            showCancel: false,
            valid: true,
            activeEdit: null,
            rotation: 0,
            scale: 1,
            resetImage: false,
            borderRadius: 200,
            dialgUpdateAvatar: false,
            dialgSettingCall: false,
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
        settingCall(v) {
            this.dialgSettingCall = v;
        },

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
        resetCanvas() {
            this.fileUpload = null;
            this.scale = 1;
            this.rotation = 0;
            this.resetImage = false;
        },
        onImageReady() {
            this.scale = 1;
            this.rotation = 0;
        },
        block() {
            console.log("ok");
        },
        openInput() {
            return this.$refs.inputAvatar.click();
        },
        changeAvatar(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (files.length < 1) {
                this.fileUpload = null;
            }
            var reader = new FileReader();
            reader.onload = (e) => {
                this.fileUpload = reader.result;
            };
            reader.readAsDataURL(files[0]);
            this.activeEdit = "avatar";
            this.dialgUpdateAvatar = true;
        },
        savedAvatar() {
            var img = this.$refs.vueavatar.getImageScaled();
            const dataURL = img.toDataURL();
            var blobBin = atob(dataURL.split(",")[1]);
            var array = [];
            for (var i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }
            var file = new Blob([new Uint8Array(array)], { type: "image/*" });
            this.saveDataUser(file);
        },
        switchActiveEdit(field) {
            if (!this.saving) {
                this.activeEdit = field;
            }
        },
        async saveDataUser(file = null) {
            this.saving = true;
            await this.$store
                .dispatch("auth/updateData", {
                    avatar: file,
                    field: this.activeEdit,
                })
                .then((req) => {
                    if (req.data.isValid) {
                        this.activeEdit = null;
                        this.showCancel = false;
                        this.saving = false;
                        this.dialgUpdateAvatar = false;
                    }
                })
                .catch((err) => {
                    this.dialgUpdateAvatar = false;
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
    watch: {
        dialgUpdateAvatar(show) {
            if (!show) {
                this.activeEdit = null;
                this.resetImage = true;
                this.resetCanvas();
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
