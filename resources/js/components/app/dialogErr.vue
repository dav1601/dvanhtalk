<template>
    <div>
        <div class="text-center">
            <v-dialog
                v-model="dialogErr"
                width="300"
                @click:outside="setDialogErr(false)"
            >
                <v-card>
                    <v-card-title class="text-h5">
                        {{ header }}
                    </v-card-title>

                    <v-card-text>
                        {{ content }}
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="setDialogErr(false)">
                            Đóng
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        header: {
            type: String,
            default: "Lỗi",
        },
        content: {
            type: String,
            default: "Lỗi",
        },
    },
};
</script>
<style lang=""></style>
