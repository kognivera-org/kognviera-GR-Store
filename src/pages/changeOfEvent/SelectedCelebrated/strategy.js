import React from 'react'
import appconfig from '../../../config/appconfig'
export const strategy = {
  strategies: {
    Celebraciones: {
      types: {
        [appconfig.eventTypes.Boda]: {
          name: 'Boda',
          titlesEnabled: true,
        },
        [appconfig.eventTypes.Bebè]: {
          name: 'Bebè',
          titlesEnabled: true,
        },
        [appconfig.eventTypes.XV_Anòs]: {
          name: 'XV Anòs',
          titlesEnabled: false,
          coOwnerRole: true,
        },
        [appconfig.eventTypes.First_Communion]: {
          name: 'First Communion',
          titlesEnabled: false,
          coOwnerRole: true,
        },
        [appconfig.eventTypes.Baptism]: {
          name: 'Baptism',
          titlesEnabled: false,
          coOwnerRole: true,
        },
        [appconfig.eventTypes.Confirmaciòn]: {
          name: 'Confirmaciòn',
          titlesEnabled: false,
          coOwnerRole: true,
        },
        [appconfig.eventTypes.Other_Religious_Ceremonies]: {
          name: 'Other Religious Ceremonies',
          titlesEnabled: false,
          coOwnerRole: true,
        },
        [appconfig.eventTypes.Bar_Mitzvah]: {
          name: 'Bar Mitzvah',
          titlesEnabled: false,
          coOwnerRole: true,
        },
        [appconfig.eventTypes.Bat_Mitzvah]: {
          name: 'Bat Mitzvah',
          titlesEnabled: false,
          coOwnerRole: true,
        },
      },
    },
    Todo_tipo_de_eventos: {
      englishName: 'openEvent',
      types: {
        [appconfig.eventTypes.Open_House]: {
          name: 'Open House',
          titlesEnabled: true,
          dynamicHandling: true,
        },
        [appconfig.eventTypes.Fiesta_Reunión]: {
          name: 'Fiesta/Reunión',
          titlesEnabled: true,
          dynamicHandling: true,
        },
        [appconfig.eventTypes.Fiesta_infantil]: {
          name: 'Fiesta infantil',
          titlesEnabled: true,
          ownerRole: true,
          dynamicHandling: true,
        },
        [appconfig.eventTypes.Aniversario]: {
          name: 'Aniversario',
          nameInEnglish: 'Anniversary',
          titlesEnabled: true,
        },
        [appconfig.eventTypes.Cumpleaños]: {
          name: 'Cumpleaños',
          titlesEnabled: true,
          dynamicHandling: true,
        },
        [appconfig.eventTypes.Despedida]: {
          name: 'Despedida',
          titlesEnabled: true,
          dynamicHandling: true,
        },
        [appconfig.eventTypes.Others]: {
          name: 'Others',
          titlesEnabled: true,
          dynamicHandling: true,
        },
        [appconfig.eventTypes.Mascotas]: {
          name: 'Mascotas',
          titlesEnabled: true,
          dynamicHandling: true,
        },
      },
    },
  },
}
