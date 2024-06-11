import commonUtil from './commonUtil';

export default (event, phase, step, props) => {
  const currentUser = commonUtil.getCurrentStoreUser();
  const evenList = {
    mr: 'mesa_regalos',
  };
  const phaseList = {
    home: 'Home',
    creation: 'Crear mesa de regalos',
  };
  const stepList = {
    creation: 'Crear mesa de regalos',
    slcGRType: 'Selecciona el tipo de mesa  de regalos',
  };
  const dataLayer = window.dataLayer;
  dataLayer.push({
    event: evenList[event],
    phase: phaseList[phase],
    step: stepList[step],
    asesor: currentUser.userName,
    ...props,
  });
};
