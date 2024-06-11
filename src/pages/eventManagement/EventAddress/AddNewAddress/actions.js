import axios from 'axios';
import API_MAP from 'endpoints';


export function addAddress(values) {
    return {
        types: ['ADD_ADDRESS', 'ADD_ADDRESS_SUCCESS', 'ADD_ADDRESS_FAILURE'],
        ping: client => client.post(API_MAP.add_address_url_GR, {
            data: {
                profileId: values.profileId,
                eventId: values.eventId,
                ecommAddressId: values.ecommAddressId || '',
                nickname: values.nickname,
                celebrityName: values.celebrityName,
                firstName: values.firstName,
                middleName: values.middleName,
                materalName: values.materalName,
                lastName: values.lastName,
                country: values.country,
                city: values.city,
                stateId: values.stateId,
                state: values.state,
                delegationMunicipality: values.delegationMunicipality,
                delegationMunicipalityId: values.delegationMunicipalityId,
                building: values.building,
                postalCode: values.postalCode,
                neighbourhood: values.neighbourhood,
                neighbourhoodId: values.neighbourhoodId,
                address1: values.address1,
                address2: values.address2,
                address3: values.address3,
                exteriorNumber: values.exteriorNumber,
                interiorNumber: values.interiorNumber,
                particularPhoneCode: values.particularPhoneCode,
                phoneNumber: values.phoneNumber,
                businessPhoneCode: '',
                businessPhoneNumber: '',
                cellular: values.cellular,
                otherColony: values.otherColony,
                landmark: values.landmark,
            },
        }),
    }
}

export function updateAddress(values, addressId) {
    values.addressId = addressId
    values.businessPhoneCode = '';
    values.businessPhoneNumber = '';
    values.particularPhoneCode = '';
    const landmark = values.landmark
    const eventId = values.eventId
    const ownerId = values.ownerId
    const country = values.country
    const celebrityName = values.celebrityName
    delete values.landmark
    delete values.eventId
    delete values.ownerId
    delete values.country
    delete values.celebrityName
    return [{
        types: ['UPDATE_ADDRESS_GR', 'UPDATE_ADDRESS_GR_SUCCESS', 'UPDATE_ADDRESS_GR_FAILURE'],
        ping: client => client.post(API_MAP.edit_address_url_GR, {
            data: {
                ...values,
                celebrityName,
                country,
                ownerId,
                landmark,
                eventId
            },
        }),
    }, {
        types: ['UPDATE_ADDRESS', 'UPDATE_ADDRESS_SUCCESS', 'UPDATE_ADDRESS_FAILURE'],
        ping: client => client.post(API_MAP.update_address_url, {
            data: {
                ...values
            },
        }),
    }]
}

export function updateAddressGR(values, addressId) {
    values.addressId = addressId
    values.businessPhoneCode = '';
    values.businessPhoneNumber = '';
    values.particularPhoneCode = '';
    return {
        types: ['UPDATE_ADDRESS_GR', 'UPDATE_ADDRESS_GR_SUCCESS', 'UPDATE_ADDRESS_GR_FAILURE'],
        ping: client => client.post(API_MAP.edit_address_url_GR, {
            data: {
                ...values
            },
        }),
    }
}
