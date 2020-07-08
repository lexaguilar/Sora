// react
import React from 'react';

// third-party
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

    var color = layout == 'conta' ? '#ffd333' : layout == 'inv' ? '#03A9F4' : '#4CAF50';

    return (
        <div className="nav-panel" style={{background : color}}>
            <div className="nav-panel__container container">
                <div className="nav-panel__row">
                    {logo}                   

                    <div className="nav-panel__nav-links nav-links">
                        <NavLinks layout={layout} />
                    </div>

                    <div className="nav-panel__indicators">
                        {searchIndicator}
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    wishlist: state.wishlist,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NavPanel);
