import _ from 'lodash';
import {
  GET_VERIFICATION_DOCS,
  GET_VERIFICATION_DOCS_SUCCESS,
  GET_VERIFICATION_DOCS_FAILURE,
  UPLOAD_VERIFICATION_DOC,
  UPLOAD_VERIFICATION_DOC_SUCCESS,
  UPLOAD_VERIFICATION_DOC_FAILURE,
  REMOVE_VERIFICATION_DOC,
  REMOVE_VERIFICATION_DOC_SUCCESS,
  REMOVE_VERIFICATION_DOC_FAILURE,
  DOWNLOAD_VERIFICATION_DOC,
  DOWNLOAD_VERIFICATION_DOC_SUCCESS,
  DOWNLOAD_VERIFICATION_DOC_FAILURE
} from './actions';
import config from 'config/appconfig';

const initialState = {
  loading: false,
  error: {},
  data: {},
  filenames: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPLOAD_VERIFICATION_DOC:
      return {
        ...state,
        loading: true,
      };
    case UPLOAD_VERIFICATION_DOC_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case UPLOAD_VERIFICATION_DOC_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_VERIFICATION_DOCS:
      return {
        ...state,
        loading: true
      };
    case GET_VERIFICATION_DOCS_SUCCESS:
      return {
        ...state,
        loading: false,
        filenames: action.payload.listOfUploadedDocuments
      };
    case GET_VERIFICATION_DOCS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case REMOVE_VERIFICATION_DOC:
      return {
        ...state,
        loading: true
      };
    case REMOVE_VERIFICATION_DOC_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    case REMOVE_VERIFICATION_DOC_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DOWNLOAD_VERIFICATION_DOC:
      return {
        ...state,
        loading: true,
        downloadedFile: null
      };
    case DOWNLOAD_VERIFICATION_DOC_SUCCESS:
      return {
        ...state,
        loading: false,
        downloadedFile: action.payload
      };
    case DOWNLOAD_VERIFICATION_DOC_FAILURE:
      return {
        ...state,
        loading: false,
        error: config.defaultError,
        downloadedFile: null
      };

    default:
      return state;
  }
}