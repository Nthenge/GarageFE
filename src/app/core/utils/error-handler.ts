import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from "rxjs";

export function handleApiError(err: any) {
    let serverData = null;

    if (err instanceof HttpErrorResponse) {
        serverData = err.error;
    } else {
        serverData = err;
    }

    if (serverData && serverData.messages) {
        return throwError(() => ({
            messages: serverData.messages,
            message: serverData.message || 'Validation Failed'
        }));
    }

    let message = '';
    const backendMsg = serverData?.message || serverData?.error || serverData?.msg;

    if (backendMsg) {
        message = backendMsg;
    } else if (err.status === 0) {
        message = 'Unable to connect. Please check your internet connection';
    } else if (err.status === 400) {
        message = 'Invalid request. Please check your details.';
    } else if (err.status === 500) {
        message = 'Server error. Please try again later.';
    } else {
        message = 'An unexpected error occurred';
    }

    return throwError(() => ({ message }));
}