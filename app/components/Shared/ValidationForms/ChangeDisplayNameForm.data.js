import * as Yup from "yup"  

export function initialValues(){
    return{
        name: "",
    };
}

export function validationSchema() {
    return Yup.object({
        name: Yup.string().required("A new name is mandatory to change")
    })
}