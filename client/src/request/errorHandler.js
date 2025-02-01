import { useToast } from "vue-toastification";

function handleErrorResponse(response) {
    const toast = useToast();
    if (!response) {
        return response.json().then(error => {
            const errorMessage = error.message || 'An unknown error occurred';
            toast.error(errorMessage);
        });
    }
    return response.json();
}

export default handleErrorResponse;