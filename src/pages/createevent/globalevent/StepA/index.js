import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectionTab from '../../../../lib/ZUILib/SelectionTab';
import {
  handleSelectGRType,
  getCategorySpecificEvents,
  getEventCategories,
  resetEventData,
} from '../../actions';
import Form from '../../../../lib/ZUILib/Form';
import { getLabels } from '../../../global/Labels/actions';
import commonUtil from '../../../../utils/commonUtil';
import appconfig from '../../../../config/appconfig';
import tagging from '../../../../utils/tagging';

const settingsFile = require('../../../../../settings');


@connect(
  store => ({
    labels: store.labels.labels,
    eventTypes: store.createevent.eventTypes,
    fetchingEventTypes: store.createevent.fetchingEventTypes,
    eventData: store.createevent.eventData,
  }),
  {
    handleSelectGRType,
    getCategorySpecificEvents,
    getLabels,
    getEventCategories,
    resetEventData,
  },
)
class StepA extends Component {
  constructor(props) {
    super(props);
    this.pageName = '';
    this.settings = {};
  }

  componentWillMount = () => {
    if (!this.props.labels) { this.props.getLabels(); }
    this.settings = settingsFile[process.env.NODE_ENV || 'development'];
    this.props.getEventCategories();
  };

  state = {
    formErrors: {},
  };

  onChangeGiftType = (e) => {
    const val = e.currentTarget.value;
    if (val !== '') {
      this.props.getCategorySpecificEvents(val);
      if (this.state.errors) {
        this.setState({
          errors: {
            ...this.state.errors,
            [e.target.name]: null,
          },
        });
      }
    }
  };

  onChangeCelebrationType = (e) => {
    const val = e.currentTarget.value;
    if (val !== '') {
      if (this.state.errors) {
        this.setState({
          errors: {
            ...this.state.errors,
            [e.target.name]: null,
          },
        });
      }
    }
  };

  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors,
    });
    if (isValidForm) {
      const eventData = this.props.eventData;
      const eventType =
        eventData && eventData.GRType ? eventData.GRType.tipoCelebracion : '';
      const selectedEventType = formValues.tipoCelebracion;
      localStorage.setItem('GRType', JSON.stringify(formValues));
      if (eventType && eventType !== selectedEventType) {
        this.props.resetEventData();
      }
      this.props.handleSelectGRType(formValues);
      const selection = `${formValues.tipoMesa} │ ${formValues.tipoCelebracion}`;
      const isGrEmployee = formValues.isEmployeeEvent ? 'SI' : 'NO';
      tagging('mr', 'creation', 'slcGRType', { selection, mesa_empleado: isGrEmployee });
      // ----- CHECK: QA or Dev or Prod -----
      const isProd = true;
      const redirectAuth = isProd ? this.settings.redirectauth : 'https://dtaqa.liverpool.com.mx/tienda';
      window.location.replace(
       `${redirectAuth}/login?redirectAfterLoginHref=${redirectAuth}/afterLogin?dataToGR`);
    }
  };

  render() {
    const { labels, eventData } = this.props;
    const GRType = eventData && eventData.GRType;
    const SelectionOptions = {
      options: [
        {
          option: commonUtil.getLabel(
            labels,
            'categoryLanding.celebration.name'),
          value: appconfig.eventCategory.CELEBRATION,
          disabled: false,
          selected: false,
        },
        {
          option: commonUtil.getLabel(labels, 'categoryLanding.open.name'),
          value: appconfig.eventCategory.OPENEVENT,
          disabled: false,
          selected: false,
        },
      ],
    };

    const { errors } = this.state;
    const { eventTypes } = this.props;
    let tipoCelebracionOptions = {};
    const options = [];
    if (
      eventTypes &&
      eventTypes.eventTypesInfo &&
      eventTypes.eventTypesInfo.length > 0
    ) {
      eventTypes.eventTypesInfo.forEach((eventTypeInfo) => {
        const option = {
          option: eventTypeInfo.name,
          value: eventTypeInfo.name,
          disabled: eventTypeInfo.enabled !== true,
          selected: false,
        };
        options.push(option);
      });
      tipoCelebracionOptions = { options };
    }

    return (
      <React.Fragment>
        <div className="grid-centered-big">
          <div />
          <div className="container-full white shadow">
            <div className="grid-centered-small">
              <div />
              <div className="row">
                <div className="col-md-12">
                  <p className="title text-centered titleModule">
                    {commonUtil.getLabel(labels, 'category.selection.message')}
                  </p>
                </div>
                <div className="col-md-12">
                  <div className="grid-centered-big">
                    <div />
                    <div className="row">
                      <Form onSubmit={this.handleSubmit}>
                        <div className="col-md-12">
                          <p className="text-right requiredFields">
                            * Campos Requeridos
                          </p>
                        </div>
                        <div className="col-md-12">
                          <SelectionTab
                            value={GRType && GRType.tipoMesa}
                            id={'tipoMesa'}
                            name={'tipoMesa'}
                            showArrow={false}
                            options={SelectionOptions.options}
                            optionCaption={commonUtil.getLabel(
                              labels,
                              'category.selection.message')
                            }
                            errors={errors}
                            disable={SelectionOptions.options.length < 0}
                            validators={[
                              {
                                type: 'required',
                                errorMessage: 'Seleccione una opción',
                              },
                            ]}
                            onChange={this.onChangeGiftType}
                          />
                        </div>
                        <div className="col-md-12">
                          <SelectionTab
                            value={GRType && GRType.tipoCelebracion}
                            id={'tipoCelebracion'}
                            name={'tipoCelebracion'}
                            showArrow={false}
                            options={tipoCelebracionOptions.options}
                            optionCaption={commonUtil.getLabel(
                              labels,
                              'category.eventType.selection.message')
                            }
                            optionText={'option'}
                            optionValue={'value'}
                            errors={errors}
                            disable={
                              tipoCelebracionOptions.options
                                ? tipoCelebracionOptions.options.length < 0
                                : true
                            }
                            validators={[
                              {
                                type: 'required',
                                errorMessage: 'Seleccione una opción',
                              },
                            ]}
                            onChange={this.onChangeCelebrationType}
                          />
                        </div>
                        <div className="col-md-12">
                          <div className="checkbox">
                            <input
                              id="chkEventoEmpleado"
                              type="checkbox"
                              defaultChecked={
                                GRType && GRType.isEmployeeEvent === 'true'
                              }
                              name="isEmployeeEvent"
                              disabled={
                                tipoCelebracionOptions.options
                                  ? tipoCelebracionOptions.options.length < 0
                                  : true
                              }
                              value="true"
                            />
                            <label htmlFor="chkEventoEmpleado">
                              Evento de empleado
                            </label>
                          </div>
                        </div>
                        <div className="col-md-12 centered">
                          <button
                            className="btnPrimary size-ExtraLarge"
                            disabled={!!this.props.fetchingEventTypes}
                          >
                            Crear un nuevo evento
                          </button>
                        </div>
                      </Form>
                    </div>
                    <div />
                  </div>
                </div>
              </div>
              <div />
            </div>
          </div>
          <div />
        </div>
      </React.Fragment>
    );
  }
}

export default StepA;
