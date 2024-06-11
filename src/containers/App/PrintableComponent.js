import React, { Component } from 'react';
import routeconfig from '../../config/routeconfig';
import Contract from '../../pages/createevent/globalevent/StepG/contractPageForDownloadPDF'
import UpdatedContract from '../../pages/changeOfEvent/Contract/contractPageForDownloadPDF'
import EventContract from '../../pages/eventManagement/Contract/printableContract'
import StatementPrintAndDownload from '../../pages/accountSummary/components/StatementPrintAndDownload'
// import ClosureConfirmation from '../../pages/accountSummary/components/ClosureTransference/ClosureConfirmation'
// import PartialConfirmation from '../../pages/accountSummary/components/PartialTransference/PartialConfirmation';

export default class PrintableComponent extends Component {

    // printableContent = () => {
    //     const { router } = this.props;
    //     const currentLocation = router.getCurrentLocation()
    //     if (currentLocation.pathname === routeconfig.globalstepg) {
    //         return <Contract {...this.props} />
    //     }
    // }

    // componentWillUnmount() {
    //     window.removeEventListener("onafterprint", () => {
    //         console.log('removeEventListener', 'window.printclose');
    //     });
    // }

    //     •	Regalos Registrados
    // •	Regalos Recibidos
    // •	Compras Personales
    // •	Event Account Statement
    // •	Gift Messages in Recibidos 
    // •	Event Contract


    render() {
        const { currentRoute } = this.props
        const { router } = this.props;
        const currentLocation = router.getCurrentLocation()
        return (
            <React.Fragment>
                {currentLocation.pathname === `/${routeconfig.globalstepg}` && <Contract {...this.props} />}
                {currentLocation.pathname === `/${routeconfig.updatedcontract}` && <UpdatedContract {...this.props} />}
                {currentRoute.path === `${routeconfig.eventcontract}` && <EventContract {...this.props} />}
                {currentRoute.path === `${routeconfig.statementaccountsummary}` && <StatementPrintAndDownload {...this.props} />}
                {currentRoute.path === `${routeconfig.physicalgiftsdetail}` && <StatementPrintAndDownload {...this.props} />}
                {currentRoute.path === `${routeconfig.personalpurchasesdetail}` && <StatementPrintAndDownload {...this.props} />}
                {currentRoute.path === `${routeconfig.electronicgiftsdetail}` && <StatementPrintAndDownload {...this.props} />}
                {currentRoute.path === `${routeconfig.bonusdetail}` && <StatementPrintAndDownload {...this.props} />}
                {currentRoute.path === `${routeconfig.statementpartialtransference}` && <StatementPrintAndDownload {...this.props} />}
                {/* {currentRoute.path === `${routeconfig.closureconfirmation}` && <ClosureConfirmation {...this.props} />} */}
                {/* {currentRoute.path === `${routeconfig.partialconfirmation}` && <PartialConfirmation {...this.props} />} */}

            </React.Fragment>
        )
    }
}