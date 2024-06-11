const os = require('os');
const v = require('./version.json');
// Declare server api modules here
const modules = [
  'user',
  'activityLogs',
  'eventsearch',
  'addPlasticCard',
  'eventdetails',
  'eventCreation',
  'contract',
  'labels',
  'dashboard',
  'predeterminedLists',
  'verificationDocuments',
  'delivery',
  'eventManagement/failedTransferences',
  'eventManagement/getAccountPartialTransferDetails',
  'eventManagement/plasticCard',
  'eventManagement/getEventAccountStatementDetails',
  'eventManagement/getGiftsAndPurchases',
  'eventManagement/notes',
  'eventManagement/closingGiftPriceRange',
  'eventManagement/openingGift',
  'eventMangementGiftList/getRegalosRegistrados',
  'eventManagement/EditEventInfo',
  'eventManagement/EventGralInfo',
  'eventManagement/fraudManagement',
  'eventMangementGiftList/regaloRecibidos',
  'eventManagement/preferredDeliveryDay',
  'eventMangementGiftList/personalPurchase',
  'accountSummary',
  'reports',
  'eventMangementGiftList/addGiftItemBySKUID',
  'eventManagement/eventAddress',
  'eventManagement/addAddress',
  'eventManagement/editAddress',
  'eventManagement/Header',
  'eventManagement/EmployeeCardInfo',
  'return',
  'cachecontrols',
  'changeOfEvent',
  'print',
];
const allmodules = modules.map(item => `modules/${item}`);

// Common configuration for all environments
const commonconfig = {
  version: v && v.version,
  modules: allmodules,
  scheduler: {
    enable: false,
  },
  swagger: {
    info: {
      title: 'Liverpool GR - API Documentation',
    },
    grouping: 'tags',
  },
  viewEngine: {
    type: 'nunjucks',
  },
  verificationDocsDir: '/verificationDocuments/',
  notificationsDir: '/notifications/callcenter/',
  reportsDir: '/reports/',
  directoryPermissions: 0o775,
  filePermissions: 0o664,
};

// Get current ECOM site. point to sitea by default.
const ecom = (points) => {
  const env = process.env.ECOM_SITE;
  return points[env] || points.siteb;
};

// Environment specific configuration
module.exports = {
  development: {
    connection: {
      port: 4000,
      routes: { security: { xframe: 'sameorigin' } },
    },
    endpoints: {
      gr: 'http://172.16.215.181:8082',
      commerce: ecom({
        sitea: 'http://172.16.213.171:7001',
        siteb: 'http://172.16.213.171:7001',
      }),
      // shoapp: "http://localhost:5001/lamejorjugueteriaqa/us-central1/reAuth",
      shoapp: 'https://shopappst.liverpool.com.mx',
      otpapp: 'https://gradapterpwaqa2.liverpool.com.mx',
      cache: `${os.hostname()}:9089`,
    },
    redirectauth: 'https://dtaqa.liverpool.com.mx/tienda',
    mount: '/opt/instoreshared',
    exportToClient: {
      assets: '/assets',
      ico: '//assetspwa.liverpool.com.mx/assetso/favicon.ico',
    },
    // Tagg variables
    taggingAuth: 'GTM-PV3F9QTSD',
    ...commonconfig,
  },

  qc: {
    connection: {
      port: 8000,
      routes: { security: { xframe: 'sameorigin' } },
    },
    endpoints: {
      gr: 'http://172.21.22.164:7011',
      commerce: 'http://172.21.22.164:7009',
      cache: `${os.hostname()}:9089`,
      otpapp: 'https://gradapterpwaqa2.liverpool.com.mx',
      shoapp: 'https://shopappqa3.liverpool.com.mx',
    },
    redirectauth: 'https://odtaqaa.liverpool.com.mx/tienda',
    mount: '/opt/instoreshared',
    exportToClient: {
      assets: '/assets',
      ico: '//assetspwa.liverpool.com.mx/assetso/favicon.ico',
    },
    ...commonconfig,
  },

  reporting: {
    connection: {
      port: 8000,
      routes: { security: { xframe: 'sameorigin' } },
    },
    endpoints: {
      gr: 'http://172.21.22.165:7013',
      commerce: 'http://172.21.22.155:7011',
      cache: '10.102.21.151:9089',
      shoapp: 'https://shopappqa3.liverpool.com.mx',
      otpapp: 'https://gradapterpwaqa2.liverpool.com.mx',
    },
    redirectauth: 'https://odtaqaa.liverpool.com.mx/tienda',
    mount: '/opt/instoreshared',
    exportToClient: {
      assets: '/assets',
      ico: '//assetspwa.liverpool.com.mx/assetso/favicon.ico',
    },
    ...commonconfig,
  },

  sit: {
    connection: {
      port: 8090,
      routes: { security: { xframe: 'sameorigin' } },
    },
    endpoints: {
      gr: 'http://172.16.213.235:8082',
      commerce: ecom({
        sitea: 'https://pwassosit.liverpool.com.mx:8443',
        siteb: 'https://pwassosit.liverpool.com.mx:8443',
      }),
      cache: `${os.hostname()}:9099`,
      shoapp: 'https://shopappst.liverpool.com.mx',
      otpapp: 'https://gradapterpwaqa2.liverpool.com.mx',
    },
    redirectauth: 'https://odtaqaa.liverpool.com.mx/tienda',
    mount: '/u01/oracle/atg/data/GR',
    exportToClient: {
      assets: '//assetsmri.liverpool.com.mx/assetsi',
      ico: '//assetspwa.liverpool.com.mx/assetso/favicon.ico',
    },
    dynatrace: {
      server: 'https://172.16.212.108:8043',
      agentName: 'CC_NodejsSIT',
    },
    taggingAuth: 'GTM-PV3F9QTSS',
    ...commonconfig,
  },

  qa: {
    connection: {
      port: 8090,
      routes: { security: { xframe: 'sameorigin' } },
    },
    endpoints: {
      gr: 'http://172.16.213.134:8082',
      commerce: ecom({
        sitea: 'https://pwassoqa.liverpool.com.mx:8443',
        siteb: 'https://pwassoqa.liverpool.com.mx:8443',
      }),
      cache: `${os.hostname()}:9099`,
      shoapp: 'https://shopappst.liverpool.com.mx',
      otpapp: 'https://gradapterpwaqa2.liverpool.com.mx',
    },
    redirectauth: 'https://pwaqa.liverpool.com.mx/tienda',
    mount: '/u01/oracle/atg/data/GR',
    exportToClient: {
      assets: '//assetspwaqa.liverpool.com.mx/assetsi',
      ico: '//assetspwa.liverpool.com.mx/assetso/favicon.ico',
    },
    taggingAuth: 'GTM-PV3F9QTSQA1',
    ...commonconfig,
  },

  qa2: {
    connection: {
      port: 8090,
      routes: { security: { xframe: 'sameorigin' } },
    },
    endpoints: {
      gr: 'http://172.16.215.181:8082',
      commerce: ecom({
        sitea: 'https://pwassoqa2.liverpool.com.mx:8443',
        siteb: 'https://pwassoqa2.liverpool.com.mx:8449',
      }),
      cache: `${os.hostname()}:9099`,
      shoapp: 'https://shopappst.liverpool.com.mx',
      otpapp: 'https://gradapterpwaqa2.liverpool.com.mx',
    },
    redirectauth: 'https://dtaqa.liverpool.com.mx/tienda',
    mount: '/u01/oracle/atg/data/GR',
    exportToClient: {
      assets: '//assetspwaqa.liverpool.com.mx/assetsi',
      ico: '//assetspwa.liverpool.com.mx/assetso/favicon.ico',
    },
    taggingAuth: 'GTM-PV3F9QTSQA2',
    ...commonconfig,
  },

  qa3: {
    connection: {
      port: 8090,
      routes: { security: { xframe: 'sameorigin' } },
    },
    endpoints: {
      gr: 'http://172.16.216.153:7003',
      commerce: ecom({
        sitea: 'https://pwassoqa3.liverpool.com.mx:8443',
        siteb: 'https://pwassoqa3.liverpool.com.mx:8443',
      }),
      cache: `${os.hostname()}:9099`,
      shoapp: 'https://shopappst.liverpool.com.mx',
      otpapp: 'https://gradapterpwaqa2.liverpool.com.mx',
    },
    redirectauth: 'https://qa3.liverpool.com.mx/tienda',
    mount: '/u01/oracle/atg/data/GR',

    exportToClient: {
      assets: '//assetspwaqa.liverpool.com.mx/assetsi',
      ico: '//assetspwa.liverpool.com.mx/assetso/favicon.ico',
    },
    taggingAuth: 'GTM-PV3F9QTSQA3',
    ...commonconfig,
  },

  production: {
    connection: {
      port: 8090,
      routes: { security: { xframe: 'sameorigin' } },
    },
    endpoints: {
      // ----- CHECK: GR Site -----
      gr: 'http://24.24.24.164:8082', // GR Site C
      // gr: 'http://26.26.26.183:8082', // GR Site D
      commerce: ecom({
        sitea: 'https://pwassoc.liverpool.com.mx:8443',
        siteb: 'https://pwassoc.liverpool.com.mx:8443',
        qa: 'https://ognqaa.liverpool.com.mx',
        www: 'https://pwassoc.liverpool.com.mx:8443',
      }),
      cache: `${os.hostname()}:9099`,
      shoapp: 'https://appvendor.liverpool.com.mx',
      otpapp: 'https://gradapter.liverpool.com.mx',
    },
    redirectauth: 'https://www.liverpool.com.mx/tienda',
    mount: '/u01/oracle/atg/data/GR',
    exportToClient: {
      assets: '//assetspwa.liverpool.com.mx/assetsi',
      ico: '//assetspwa.liverpool.com.mx/assetso/favicon.ico',
    },
    dynatrace: {
      server: 'https://172.16.212.108:8043',
      agentName: 'CC_NodeJS_GR',
    },
    taggingAuth: 'GTM-PV3F9Q8R',
    ...commonconfig,
  },
};
