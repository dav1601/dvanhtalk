export default {
    methods: {
        getAssetsPatch(patch = "") {
            console.log(window.location);
        },
        isEmpty(obj) {
            return Object.keys(obj).length === 0;
        },
        GetPropertyValue(obj1, dataToRetrieve) {
            return dataToRetrieve
                .split(".") // split string based on `.`
                .reduce(function (o, k) {
                    return o && o[k]; // get inner property if `o` is defined else get `o` and return
                }, obj1); // set initial value as object
        },
    },
};
