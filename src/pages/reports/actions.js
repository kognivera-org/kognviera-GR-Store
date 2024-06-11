import 'babel-polyfill'
import axios from 'axios'
import API_MAP from '../../endpoints';
import CommonUtil from '../../../src/utils/commonUtil';

export const REPORT_PAGE_DATA = 'REPORT_PAGE_DATA';
export const REPORT_PAGE_DATA_SUCCESS = 'REPORT_PAGE_DATA_SUCCESS';
export const REPORT_PAGE_DATA_FAILURE = 'REPORT_PAGE_DATA_FAILURE';

export const FAVORITE_REPORTS = 'FAVORITE_REPORTS';
export const FAVORITE_REPORTS_SUCCESS = 'FAVORITE_REPORTS_SUCCESS';
export const FAVORITE_REPORTS_FAILURE = 'FAVORITE_REPORTS_FAILURE';

export const SAVE_FAVORITE_REPORTS = 'SAVE_FAVORITE_REPORTS';
export const SAVE_FAVORITE_REPORTS_SUCCESS = 'SAVE_FAVORITE_REPORTS_SUCCESS';
export const SAVE_FAVORITE_REPORTS_FAILURE = 'SAVE_FAVORITE_REPORTS_FAILURE';

export const DELETE_FAVORITE_REPORT = 'DELETE_FAVORITE_REPORT';
export const DELETE_FAVORITE_REPORT_SUCCESS = 'DELETE_FAVORITE_REPORT_SUCCESS';
export const DELETE_FAVORITE_REPORT_FAILURE = 'DELETE_FAVORITE_REPORT_FAILURE';

export const RETRIEVE_FAVORITE_REPORT = 'RETRIEVE_FAVORITE_REPORT';
export const RETRIEVE_FAVORITE_REPORT_SUCCESS = 'RETRIEVE_FAVORITE_REPORT_SUCCESS';
export const RETRIEVE_FAVORITE_REPORT_FAILURE = 'RETRIEVE_FAVORITE_REPORT_FAILURE';

export const GENERATE_REPORT = 'GENERATE_REPORT';
export const GENERATE_REPORT_SUCCESS = 'GENERATE_REPORT_SUCCESS';
export const GENERATE_REPORTE_FAILURE = 'GENERATE_REPORTE_FAILURE';

export const GENERATE_DOWNLOAD_REPORT = 'GENERATE_DOWNLOAD_REPORT';
export const GENERATE_DOWNLOAD_REPORT_SUCCESS = 'GENERATE_DOWNLOAD_REPORT_SUCCESS';
export const GENERATE_DOWNLOAD_REPORTE_FAILURE = 'GENERATE_DOWNLOAD_REPORTE_FAILURE';

export function getReportPageData() {
    const userInfo = CommonUtil.getCurrentStoreUser();
    return {
        types: [REPORT_PAGE_DATA, REPORT_PAGE_DATA_SUCCESS, REPORT_PAGE_DATA_FAILURE],
        ping: client => client.get(API_MAP.get_build_report_page_data, {
            params: {
                storeUserRole: userInfo && userInfo.userRoleInfo && userInfo.userRoleInfo.roleName
            }
        })
    }
}

export function getFavoriteReports(agentProfileId) {
    return {
        types: [FAVORITE_REPORTS, FAVORITE_REPORTS_SUCCESS, FAVORITE_REPORTS_FAILURE],
        ping: client => client.post(API_MAP.list_favorite_reports, {
            data: {
                agentProfileId: agentProfileId
            }
        })
    }
}

export function saveFavoriteReports(data) {
    return {
        types: [SAVE_FAVORITE_REPORTS, SAVE_FAVORITE_REPORTS_SUCCESS, SAVE_FAVORITE_REPORTS_FAILURE],
        ping: client => client.post(API_MAP.save_favorite_reports, {
            data: { ...data }
        })
    }
}

export function deleteFavoriteReport(data) {
    return {
        types: [DELETE_FAVORITE_REPORT, DELETE_FAVORITE_REPORT_SUCCESS, DELETE_FAVORITE_REPORT_FAILURE],
        ping: client => client.post(API_MAP.delete_favorite_report, {
            data: { ...data }
        })
    }
}

export function retrieveFavoriteReport(data) {
    return {
        types: [RETRIEVE_FAVORITE_REPORT, RETRIEVE_FAVORITE_REPORT_SUCCESS, RETRIEVE_FAVORITE_REPORT_FAILURE],
        ping: client => client.post(API_MAP.retrieve_favorite_report, {
            data: { ...data }
        })
    }
}

export function generateReportService(data) {
    return {
        types: [GENERATE_REPORT, GENERATE_REPORT_SUCCESS, GENERATE_REPORTE_FAILURE],
        ping: client => client.post(API_MAP.generate_report, {
            data: { ...data },
            timeout: 180000
        })
    }
}

export function generateReportDownloadService(filePath) {
    return {
        types: [GENERATE_DOWNLOAD_REPORT, GENERATE_DOWNLOAD_REPORT_SUCCESS, GENERATE_DOWNLOAD_REPORTE_FAILURE],
        ping: client => client.post(API_MAP.generate_report_file, {
            data: {
                filePath: filePath
            },
            responseType: 'blob'
        })
    }
}