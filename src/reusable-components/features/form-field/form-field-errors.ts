
export function getRealsoftFormFieldDuplicateHintError(align: string): Error {
    return Error(`A hint was already declared for 'align="${align}"'.`);
}

export function getRealsoftFormFieldMissingControlError(): Error {
    return Error('realsoft-form-field must contain a RealsoftFormFieldControl.');
}

