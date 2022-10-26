import * as Yup from 'yup';

export const newTaskSchema = Yup.object({
    importanceLevel: Yup.object()
		.shape({
			value: Yup.string(),
			label: Yup.string()
		})
		.required('Importance level is required')
		.nullable(),
	subject: Yup.string().required("Subject is a field required"),
    description:Yup.string().required("Description name is a field required"),

});