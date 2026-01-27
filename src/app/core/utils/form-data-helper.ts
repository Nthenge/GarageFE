export function formToFormData(
    formValue: any,
    parentKey = '', //used internally for nested fields
    formData = new FormData() //the object to accumulate key/value pairs
): FormData {

    //loop through every field

    Object.keys(formValue).forEach(key =>{
        const value = formValue[key];  //////do not know
        const fullKey = parentKey ?  `${parentKey}.${key}` : key;

        if (value instanceof File) {  //if it is a file
            formData.append(fullKey, value);  //add file to formdata
        } else if (value !== null && typeof value === 'object' && !(value instanceof Date)){

         // If it’s a nested object (like personal, vehicle, history)
         formToFormData(value, fullKey, formData); //recurse to flatten it
        } else if (value !== null && value !== undefined){
            formData.append(fullKey, value.toString()); 
            //add normal fields as strings
        }
    });
return formData;

}