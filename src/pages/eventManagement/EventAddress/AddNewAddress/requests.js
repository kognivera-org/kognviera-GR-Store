import commonUtil from '../../../../utils/commonUtil'

export async function addAddressReq(values, callback) {
  const data = {
    profileId: values.profileId,
    nickname: values.nickname,
    newNickname: values.newNickname,
    firstName: values.firstName,
    lastName: values.lastName,
    city: values.city,
    state: values.state,
    delegationMunicipality: values.delegationMunicipality,
    building: values.building,
    otherColony: values.otherColony,
    postalCode: values.postalCode,
    neighbourhood: values.neighbourhood,
    exteriorNumber: values.exteriorNumber,
    interiorNumber: values.interiorNumber,
    particularPhoneCode: values.particularPhoneCode,
    phoneNumber: values.phoneNumber,
    stateId: values.stateId,
    cellular: values.cellular,
    delegationMunicipalityId: values.delegationMunicipalityId,
    neighbourhoodId: values.neighbourhoodId,
    businessPhoneCode: '',
    businessPhoneNumber: '',
    address1: values.address1,
    address2: values.address2,
    address3: values.address3,
    maternalName: values.maternalName,
    middleName: values.middleName,
  }
  const response = await commonUtil.triggerPostRequest('/api/createEventAddAddress', 'POST', data)
  if (typeof callback === 'function') {
    callback(response)
  }
}
