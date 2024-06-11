export const UPLOAD_VERIFICATION_DOC = 'UPLOAD_VERIFICATION_DOC';
export const UPLOAD_VERIFICATION_DOC_SUCCESS = 'UPLOAD_VERIFICATION_DOC_SUCCESS';
export const UPLOAD_VERIFICATION_DOC_FAILURE = 'UPLOAD_VERIFICATION_DOC_FAILURE';

export const GET_VERIFICATION_DOCS = 'GET_VERIFICATION_DOCS';
export const GET_VERIFICATION_DOCS_SUCCESS = 'GET_VERIFICATION_DOCS_SUCCESS';
export const GET_VERIFICATION_DOCS_FAILURE = 'GET_VERIFICATION_DOCS_FAILURE';

export const REMOVE_VERIFICATION_DOC = 'REMOVE_VERIFICATION_DOC';
export const REMOVE_VERIFICATION_DOC_SUCCESS = 'REMOVE_VERIFICATION_DOC_SUCCESS';
export const REMOVE_VERIFICATION_DOC_FAILURE = 'REMOVE_VERIFICATION_DOC_FAILURE';

export const DOWNLOAD_VERIFICATION_DOC = 'DOWNLOAD_VERIFICATION_DOC';
export const DOWNLOAD_VERIFICATION_DOC_SUCCESS = 'DOWNLOAD_VERIFICATION_DOC_SUCCESS';
export const DOWNLOAD_VERIFICATION_DOC_FAILURE = 'DOWNLOAD_VERIFICATION_DOC_FAILURE';

export function getVerificationDocuments(eventId) {

  return {
    types: [GET_VERIFICATION_DOCS, GET_VERIFICATION_DOCS_SUCCESS, GET_VERIFICATION_DOCS_FAILURE],
    ping: client => client.post('/api/getEventDocuments', {
      data: {
        // channel: "INSTORE",
        // brand: "LP",
        eventId: eventId
      }
    }),
  };
}

export function uploadVerificationDocument(data, onUploadProgress) {
  let formData = new FormData();
  formData.append('file', data.file);
  formData.append('documentName', data.documentName);
  formData.append('eventId', data.eventId);
  return [{
    types: [UPLOAD_VERIFICATION_DOC, UPLOAD_VERIFICATION_DOC_SUCCESS, UPLOAD_VERIFICATION_DOC_FAILURE],
    ping: client => client.post('/api/uploadEventDocument', {
      data: formData,
      headers: {
        'content-type': 'multipart/form-data'
      },
      onUploadProgress
    }),
  }, {
    types: [GET_VERIFICATION_DOCS, GET_VERIFICATION_DOCS_SUCCESS, GET_VERIFICATION_DOCS_FAILURE],
    ping: client => client.post('/api/getEventDocuments', {
      data: {
        eventId: data.eventId
      }
    }),
  }];
}

export function removeVerificationDocument(values) {
  return [{
    types: [REMOVE_VERIFICATION_DOC, REMOVE_VERIFICATION_DOC_SUCCESS, REMOVE_VERIFICATION_DOC_FAILURE],
    ping: client => client.post('/api/removeEventDocument', {
      data: {
        // channel: "INSTORE",
        // brand: "LP",
        eventId: values.eventId.value,
        documentName: values.removeDocumentName.value,
        documentId: values.removeDocumentId.value,
      }
    }),
  }, {
    types: [GET_VERIFICATION_DOCS, GET_VERIFICATION_DOCS_SUCCESS, GET_VERIFICATION_DOCS_FAILURE],
    ping: client => client.post('/api/getEventDocuments', {
      data: {
        eventId: values.eventId.value
      }
    }),
  }];
}

export function downloadVerificationDocument(values) {
  return {
    types: [DOWNLOAD_VERIFICATION_DOC, DOWNLOAD_VERIFICATION_DOC_SUCCESS, DOWNLOAD_VERIFICATION_DOC_FAILURE],
    ping: client => client.post('/api/downloadEventDocument', {
      data: {
        // channel: "INSTORE",
        // brand: "LP",
        ...values
      },
      responseType: 'blob'
    }),
  };

}