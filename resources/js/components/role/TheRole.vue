<template>
    <div>
        <img
            v-if="type == 'icon' && getRole"
            class="img__obj--cover"
            :src="getRole.icon"
            :alt="'royal-role' + role"
            :width="width"
            :height="height"
        />
        <img
            v-if="type == 'join' && getRole"
            class="img__obj--cover"
            :src="getRole.joinGit"
            :alt="'royal-role' + role"
            :width="width"
            :height="height"
        />
    </div>
</template>
<script>
export default {
    props: {
        role: {
            type: Number,
            default: 2,
        },
        type: {
            type: String,
            default: "icon",
        },
        width: {
            default: "32",
        },
        height: {
            default: "32",
        },
    },
    data() {
        return {
            dataRole: [
                {
                    role: 0,
                    icon: "https://res.cloudinary.com/team151/image/upload/v1655992061/icon/dragon_1_dtjzrr.png",
                    joinGit:
                        "https://res.cloudinary.com/team151/image/upload/v1655990940/icon/6NeK-t6eskg-unscreen_xqezyi.gif",
                },
                {
                    role: 1,
                    icon: "https://res.cloudinary.com/team151/image/upload/v1653124964/icon/phoenix_cldjpu.png",
                    joinGit:
                        "https://res.cloudinary.com/team151/image/upload/v1655990940/icon/6NeK-t6eskg-unscreen_xqezyi.gif",
                },
            ],
        };
    },
    computed: {
        getRole() {
            const role = this.dataRole.find((role) => role.role == this.role);
            if (role) {
                return role;
            } else {
                return false;
            }
        },
    },
};
</script>
