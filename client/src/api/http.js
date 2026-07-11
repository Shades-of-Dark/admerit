export async function parseErrorResponse(res, fallbackMessage) {
    const data = await res.json().catch(() => ({}));
    if (data.errors) {
        const error = new Error("Validation failed");
        error.fieldErrors = data.errors;
        throw error;
    }
    throw new Error(data.error || fallbackMessage);
}
