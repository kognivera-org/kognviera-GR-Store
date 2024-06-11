import React from 'react'
import PropTypes from 'prop-types'
import CheckBox from '../../lib/ZUILib/CheckBox'
import Link from '../../lib/ZUILib/Link'

class Favourite extends React.Component {

  handleChange = (e) => {
    e.preventDefault()
    const giftItemId = e.target.getAttribute('giftItemId')
    const skuId = e.target.getAttribute('skuId')
    this.props.onchange(giftItemId, skuId, this.props.checked)
  }

  render() {
    const className = this.props.checked ? 'icon-estrella_solida' : 'icon-estrella_linea unselected'

    return (
      <React.Fragment>
        {
          this.props.display == 'icons' ?
            <React.Fragment>
              <Link className={className} onClick={this.handleChange} checked={this.props.checked} giftItemId={this.props.item && this.props.item.giftItemId} skuId={this.props.item && this.props.item.skuId} />
            </React.Fragment>
            :
            <React.Fragment>
              <CheckBox uiname={this.props.uiname} className="checkStar" id={`boxStar${this.props.id}`} checked={this.props.checked} onClickLabel={this.handleChange} nowrapper={true} labelProps={{ giftItemId: this.props.giftItemId, skuId: this.props.skuId }} />
            </React.Fragment>
        }
      </React.Fragment>
    )
  }
}
export default Favourite
