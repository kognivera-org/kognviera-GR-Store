import React from 'react';
import appconfig from '../../../config/appconfig';

const Image = (props) => {
  const ImageProps = Object.assign({}, props);
  delete ImageProps.asset;
  delete ImageProps.svg;

  if (!ImageProps.src) {
    ImageProps.src = '';
  }

  if (props.asset) {
    ImageProps.src = appconfig.assets + ImageProps.src;
  }

  if (!props.onError) {
    ImageProps.onError = (e) => e.target.src = ImageProps.altimg || appconfig.imageUrl;
  }

  if (props.svg) {
    return <object data={ImageProps.src} type="image/svg+xml" />;
  } else {
    return <img {...ImageProps}>{ImageProps.children}</img>;
  }
};

Image.displayName = 'Image';
export default Image;