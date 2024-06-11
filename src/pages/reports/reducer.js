import {
    REPORT_PAGE_DATA_SUCCESS,
    FAVORITE_REPORTS_SUCCESS,
    FAVORITE_REPORTS_FAILURE,
    RETRIEVE_FAVORITE_REPORT_SUCCESS,
    DELETE_FAVORITE_REPORT_SUCCESS,
    SAVE_FAVORITE_REPORTS_SUCCESS,
    SAVE_FAVORITE_REPORTS_FAILURE,
    GENERATE_REPORT,
    GENERATE_REPORT_SUCCESS,
    GENERATE_REPORTE_FAILURE,
    GENERATE_DOWNLOAD_REPORT,
    GENERATE_DOWNLOAD_REPORT_SUCCESS,
    GENERATE_DOWNLOAD_REPORTE_FAILURE,
    REPORT_PAGE_DATA
} from './actions'

const initialState = {
    reportPageData: {},
    favouriteReports: false,
    favoriteReportInfo: {},
    deleteFavouriteInfo: {},
    saveFavoriteReports: {},
    saveFavoriteReportsErrorsPopup: {},
    saveFavoriteReportsErrors: null,
    generateReportFilePath: '',
    generateReportDownloadFile: null,
    isBuildReportPageDataLoaded: false,
    isReportDownloadServiceLoaded: true
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case REPORT_PAGE_DATA:
            return {
                ...state,
                reportPageData: action.payload,
                isBuildReportPageDataLoaded: false
            }
        case REPORT_PAGE_DATA_SUCCESS:
            return {
                ...state,
                reportPageData: action.payload,
                isBuildReportPageDataLoaded: true
            }
        case FAVORITE_REPORTS_SUCCESS:
            return {
                ...state,
                favouriteReports: action.payload.favouriteReports
            }
        case FAVORITE_REPORTS_FAILURE:
            return {
                ...state,
                favouriteReports: []
            }
        case RETRIEVE_FAVORITE_REPORT_SUCCESS:
            return {
                ...state,
                favoriteReportInfo: action.payload
            }
        case DELETE_FAVORITE_REPORT_SUCCESS:
            return {
                ...state,
                deleteFavouriteInfo: action.payload,
                saveFavoriteReportsErrors: null
            }
        case SAVE_FAVORITE_REPORTS_SUCCESS:
            return {
                ...state,
                saveFavoriteReportsInfo: action.payload,
                saveFavoriteReportsErrorsPopup: {},
                saveFavoriteReportsErrors: null
            }
        case SAVE_FAVORITE_REPORTS_FAILURE:
            return {
                ...state,
                saveFavoriteReportsErrorsPopup: action.payload,
                saveFavoriteReportsErrors: action.payloads
            }
        case GENERATE_REPORT:
            return {
                ...state,
                generateReportFilePath: '',
                generateReportDownloadFile: null,
                isReportDownloadServiceLoaded: false
            }
        case GENERATE_REPORT_SUCCESS:
            return {
                ...state,
                generateReportFilePath: action.payload,
                saveFavoriteReportsErrors: null,
                isReportDownloadServiceLoaded: true
            }
        case GENERATE_REPORTE_FAILURE:
            return {
                ...state,
                saveFavoriteReportsErrors: action.payload,
                generateReportFilePath: '',
                isReportDownloadServiceLoaded: true
            }

        case GENERATE_DOWNLOAD_REPORT:
            return {
                ...state,
                generateReportDownloadFile: null,
                isReportDownloadServiceLoaded: false
            }
        case GENERATE_DOWNLOAD_REPORT_SUCCESS:
            return {
                ...state,
                generateReportDownloadFile: action.payload,
                isReportDownloadServiceLoaded: true
            }
        case GENERATE_DOWNLOAD_REPORTE_FAILURE:
            return {
                ...state,
                saveFavoriteReportsErrors: action.payload,
                generateReportDownloadFile: null,
                isReportDownloadServiceLoaded: false
            }
        default:
            return {
                ...state
            }
    }
}