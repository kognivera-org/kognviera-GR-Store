import API_MAP from '../../../endpoints';
import commonUtil from '../../../utils/commonUtil';

export async function addITemBySKU(values, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.add_gift_item_by_sku, 'POST', values);
    if (typeof callback === 'function') {
        callback(response);
    }
}

export async function removeGiftList(values, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.remove_gift, 'POST', values);
    if (typeof callback === 'function') {
        callback(response);
    }
}

export async function changeModeofDelivery(values, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.change_delivery_mode, 'POST', values);
    if (typeof callback === 'function') {
        callback(response);
    }
}

export async function changeAddressOfDelivery(values, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.change_delivery_address, 'POST', values);
    if (typeof callback === 'function') {
        callback(response);
    }
}

export async function quantitySave(values, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.save_quantity, 'POST', values);
    if (typeof callback === 'function') {
        callback(response);
    }
}

export async function setFavourite(values, callback) {
    const response = await commonUtil.triggerPostRequest(API_MAP.set_favourite, 'POST', values);
    if (typeof callback === 'function') {
        callback(response);
    }
}
