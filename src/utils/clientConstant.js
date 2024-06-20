export const UIBrands = [
  { id: 'LP', label: 'Liverpool' },
  { id: 'WS', label: 'Williams-Sonoma' },
  { id: 'WLM', label: 'West Elm' },
  { id: 'PB', label: 'Pottery Barn' },
  { id: 'GAP', label: 'GAP' },
  { id: 'PBK', label: 'Pottery Barn Kids' },
  { id: 'TRU', label: 'Toys r us' },
];


export const activeSites = ["liverpool.com.mx", "potterybarnkids.com.mx", "gap.com.mx", "westelm.com.mx", "williams-sonoma.com.mx", "suburbia.com.mx","toysrus.com.mx"];

export const retreiveSiteSpecificSSLCert = (hostname,brandname) => {
  let envv = {"key": "TLS_KEY", "cert":'TLS_CERT', "ca": 'TLS_CA'};
  if(hostname !== "liverpool.com.mx")
  {
    envv = { "key": brandname+"_TLS_KEY", "cert": brandname+'_TLS_CERT', "ca":brandname+'_TLS_CA' };
  }
  return envv;
}; 

export const dollar = '$';

