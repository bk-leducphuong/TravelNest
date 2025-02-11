import { useToast } from "vue-toastification";
const toast = useToast();

const errorHandler = (error) => {
    if (error.response) {
        toast.error(error.response.data.message);
    }else {
        const defaultErrorMessage = error.message || 'Something went wrong';
        toast.error(defaultErrorMessage);
    }

    console.error(error);
}

export default errorHandler;