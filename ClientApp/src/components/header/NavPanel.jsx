// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// application
import NavLinks from './NavLinks';
import IndicatorSearch from './IndicatorSearch';


function NavPanel(props) {
    const { layout, wishlist } = props;

    let logo = null;
    let searchIndicator;
  
    logo = (
        <div className="nav-panel__logo">
            <Link to="/"><img className="nav-panel-logo" width={150} src={require('../../svg/logo2.png')} /></Link>
        </div>
    );

    searchIndicator = <IndicatorSearch />;



    return (
        <div className="nav-panel">
            <div className="nav-panel__container container">
                <div className="nav-panel__row">
                    {logo}                   

                    <div className="nav-panel__nav-links nav-links">
                        <NavLinks />
                    </div>

                    <div className="nav-panel__indicators">
                        {searchIndicator}
                    </div>
                </div>
            </div>
        </div>
    );
}

NavPanel.propTypes = {
    /** one of ['default', 'compact'] (default: 'default') */
    layout: PropTypes.oneOf(['default', 'compact']),
};

NavPanel.defaultProps = {
    layout: 'default',
};

const mapStateToProps = (state) => ({
    wishlist: state.wishlist,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NavPanel);
