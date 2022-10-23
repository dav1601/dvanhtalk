<template>
    <v-card>
        <v-snackbar
            v-model="snackbar"
            :color="snackbarColor"
            :timeout="3000"
            style="z-index: 100000"
            top
        >
            {{ textSnack }}
        </v-snackbar>
        <div class="mb-4 b-b-4-d">
            <v-card-title class="dav-text-14-g"
                >Đổi mật khẩu theo mật khẩu cũ</v-card-title
            >
            <v-form class="px-2" ref="formDef">
                <v-text-field
                    v-model="dataDef.oldPass"
                    :type="toggle1.type"
                    label="Nhập Mật khẩu cũ"
                    @click:append="toggleEye(1)"
                    :append-icon="toggle1.icon"
                    :disabled="saving"
                    clearable
                ></v-text-field>
                <v-text-field
                    v-model="dataDef.newPass"
                    :type="toggle2.type"
                    label="Nhập Mật khẩu mới"
                    :append-icon="toggle2.icon"
                    clearable
                    :disabled="saving"
                    @click:append="toggleEye(2)"
                ></v-text-field>
                <v-text-field
                    v-model="dataDef.newPassConf"
                    :type="toggle3.type"
                    label="Xác nhận khẩu mới"
                    clearable
                    :disabled="saving"
                    :append-icon="toggle3.icon"
                    @click:append="toggleEye(3)"
                ></v-text-field>
                <v-card-actions>
                    <v-btn
                        color="primary"
                        @click="savePass(1)"
                        :loading="saving"
                        :disabled="!enableBtnDef || saving"
                    >
                        Đổi mật khẩu
                    </v-btn>
                </v-card-actions>
            </v-form>
        </div>
        <div class="px-2">
            <v-card-title class="dav-text-15-g"
                >Đổi mật khẩu theo email</v-card-title
            >
            <div
                v-if="
                    processEmail == 'noSend' ||
                    processEmail == 'changeSuccess' ||
                    sendingOtp
                "
            >
                <v-text-field
                    v-model="dataEmail.email"
                    type="email"
                    label="Nhập Email"
                    :loading="sendingOtp"
                    clearable
                ></v-text-field>
                <v-card-actions>
                    <v-btn
                        :loading="sendingOtp"
                        color="primary"
                        @click="sendCode"
                        :disabled="!dataEmail.email || sendingOtp"
                    >
                        Gửi code
                    </v-btn>
                </v-card-actions>
            </div>
            <div
                class="my-2 position-relative"
                style="max-width: 300px"
                v-if="processEmail == 'sended'"
            >
                <v-otp-input
                    v-model="dataEmail.otp"
                    @finish="onFinish"
                ></v-otp-input>
                <!-- <v-overlay absolute :value="loading">
                    <v-progress-circular
                        indeterminate
                        color="primary"
                    ></v-progress-circular>
                </v-overlay> -->
            </div>
            <v-form
                v-if="processEmail == 'expectedOtp'"
                ref="formEmail"
                clearable
            >
                <v-text-field
                    v-model="dataEmail.newPass"
                    :type="toggle4.type"
                    label="Nhập Mật khẩu mới"
                    :append-icon="toggle4.icon"
                    :disabled="saving"
                    clearable
                    @click:append="toggleEye(4)"
                ></v-text-field>
                <v-text-field
                    v-model="dataEmail.newPassConf"
                    :type="toggle5.type"
                    label="Xác nhận khẩu mới"
                    clearable
                    :disabled="saving"
                    :append-icon="toggle5.icon"
                    @click:append="toggleEye(5)"
                ></v-text-field>
                <v-card-actions>
                    <v-btn
                        color="primary"
                        @click="savePass(2)"
                        :disabled="!enableBtnEmail || saving"
                        :loading="saving"
                    >
                        Lưu mật khẩu
                    </v-btn>
                </v-card-actions>
            </v-form>
        </div>
    </v-card>
</template>
<script>
const dataShow = { icon: "mdi-eye-off", type: "text" };
const dataHide = { icon: "mdi-eye", type: "password" };
export default {
    props: ["dialog"],
    data() {
        return {
            showPass: {
                oldPass: false,
                newPass: false,
                newPassConf: false,
                EmailNewPass: false,
                EmailNewPassConf: false,
            },
            processEmail: "noSend",
            dataDef: {
                oldPass: "",
                newPass: "",
                newPassConf: "",
                valid: false,
            },
            dataEmail: {
                email: "",
                otp: "",
                expectedOtp: "",
                newPass: "",
                newPassConf: "",
                valid: false,
            },
            saving: false,
            snackbar: false,
            snackbarColor: "error",
            textSnack: "OTP không chính xác",
            required: [(v) => !!v || "Bạn chưa nhập ký tự"],
        };
    },
    computed: {
        toggle1() {
            return this.showPass.oldPass ? dataShow : dataHide;
        },
        toggle2() {
            return this.showPass.newPass ? dataShow : dataHide;
        },
        toggle3() {
            return this.showPass.newPassConf ? dataShow : dataHide;
        },
        toggle4() {
            return this.showPass.EmailNewPass ? dataShow : dataHide;
        },
        toggle5() {
            return this.showPass.EmailNewPassConf ? dataShow : dataHide;
        },
        enableBtnDef() {
            if (
                this.dataDef.oldPass &&
                this.dataDef.newPass &&
                this.dataDef.newPassConf
            ) {
                return true;
            }
            return false;
        },
        enableBtnEmail() {
            if (this.dataEmail.newPass && this.dataEmail.newPassConf) {
                return true;
            }
            return false;
        },
        sendingOtp() {
            return this.processEmail == "sendingCode";
        },
    },
    methods: {
        async sendCode() {
            this.setProcess("sendingCode");
            await this.$store
                .dispatch("auth/sendingCode", this.dataEmail.email)
                .then((req) => {
                    const data = req.data;
                    this.setProcess("sended");
                    this.textSnack =
                        "Mã OTP đã gửi thành công bạn vui lòng kiểm tra email";
                    this.snackbarColor = "success";
                    this.snackbar = true;
                    this.dataEmail.expectedOtp = data.code;
                })
                .catch((err) => {
                    const dataErr = err.response.data;
                    this.setProcess("noSend");
                    this.textSnack = dataErr.error;
                    this.snackbar = true;
                });
        },
        setProcess(process = "noSend") {
            this.processEmail = process;
        },
        resetAll() {
            this.dataEmail.email = "";
            this.dataEmail.otp = "";
            this.dataEmail.expectedOtp = "";
            this.dataEmail.newPass = "";
            this.dataEmail.newPassConf = "";
            this.dataEmail.valid = false;
            this.dataDef.oldPass = "";
            this.dataDef.newPass = "";
            this.dataDef.newPassConf = "";
            this.dataDef.valid = false;
            this.setProcess("noSend");
        },

        async savePass(type) {
            this.saving = true;
            let data = {};
            if (type == 1) {
                data = this.dataDef;
            } else {
                data = this.dataEmail;
            }
            data["type"] = type;
            await this.$store
                .dispatch("auth/savePass", data)
                .then((req) => {
                    console.log(req);
                    this.saving = false;
                    this.setProcess("changeSuccess");
                    this.textSnack =
                        "Đổi mật khẩu thành công hệ thống sẽ tự động đăng xuất trong 3 giây";
                    this.snackbarColor = "success";
                    this.snackbar = true;
                })
                .catch((err) => {
                    const dataErr = err.response.data;
                    this.saving = false;
                    this.textSnack = dataErr.error;
                    this.snackbarColor = "error";
                    this.snackbar = true;
                    this.resetAll();
                });
        },
        toggleEye(type) {
            switch (type) {
                case 1:
                    return (this.showPass.oldPass = !this.showPass.oldPass);
                    break;
                case 2:
                    return (this.showPass.newPass = !this.showPass.newPass);
                    break;
                case 3:
                    return (this.showPass.newPassConf =
                        !this.showPass.newPassConf);
                    break;
                case 4:
                    return (this.showPass.EmailNewPass =
                        !this.showPass.EmailNewPass);
                    break;
                case 5:
                    return (this.showPass.EmailNewPassConf =
                        !this.showPass.EmailNewPassConf);
                    break;
                default:
                    return;
            }
        },
        onFinish(rsp) {
            if (rsp == this.dataEmail.expectedOtp) {
                this.setProcess("expectedOtp");
            } else {
                this.snackbar = true;
            }
        },
    },
    watch: {
        processEmail(process) {
            if (process == "noSend") {
                this.resetAll();
            }
        },
        dialog(newVal) {
            this.resetAll();
        },
        snackbar(open) {
            if (!open) {
                if (this.processEmail == "changeSuccess") {
                    this.logout();
                }
            }
        },
    },
};
</script>
