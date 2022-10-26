import * as Yup from 'yup';

export const newCollaboratorSchema = Yup.object({
    blockAccountDropDown: Yup.object()
		.shape({
			value: Yup.string(),
			label: Yup.string()
		})
		.required('This account will be private')
		.nullable(),
	name: Yup.string().required("Name is a field required"),
    lastName:Yup.string().required("Last name is a field required"),
    email:Yup.string().required("Email is a field required"),
    occupation:Yup.string().required("Occupation is a field required")
});