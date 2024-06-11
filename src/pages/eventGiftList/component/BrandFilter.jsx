import React, { Component } from "react";
import { connect } from "react-redux";
import Image from "lib/ZUILib/Image";
import commonUtil from "../../../utils/commonUtil";
import appconfig from "../../../config/appconfig";

class BrandFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: commonUtil.getBrand(),
    };
    this.tmpFilter = [
      { title: "LP", url: "/images/lvlogo.jpg", width: "34px" },
      { title: "WS", url: "/images/wsLogo.png" },
      { title: "PB", url: "/images/pbLogo.png" },
      { title: "PBK", url: "/images/pbkLogo.png" },
      { title: "GAP", url: "/images/gapLogo.png", width: "34px" },
      { title: "WLM", url: "/images/whLogo.png" },
      { title: "TRU", url: "/images/truLogo.png" },
    ];
  }
  handleBrandFilter = (e) => {
    this.setState({
      brand: e.target.title,
    });
    this.props.onBrandSelection(e.target.title);
  };
  render() {
    const { className } = this.props;
    const getBrandRow = (i, row) => {
      return (
        <li className={this.state.brand === row.title ? "active" : ""} key={i}>
          <a>
            <Image
              asset
              src={row.url}
              title={row.title}
              width={row.width && row.width}
              onClick={(e) => this.handleBrandFilter(e)}
            />
          </a>
        </li>
      );
    };
    let rows = [];
    for (let i = 0; i < this.tmpFilter.length; ++i) {
      rows.push(getBrandRow(i, this.tmpFilter[i]));
    }
    return (
      <React.Fragment>
        <ul className={className ? className : "giftList"}>{rows}</ul>
        <input type="hidden" id="selectedbrandid" value={this.state.brand} />
      </React.Fragment>
    );
  }
}

export default BrandFilter;
