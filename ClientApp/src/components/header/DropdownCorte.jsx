// react
import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { getCorte } from '../../store/corte/corteActions'
import { Component } from 'react';

import Dropdown from './Dropdown';

class DropdownCorte extends Component {
    constructor(props) {
        super(props)
        
    }        

    componentDidMount(){
        
        const { getCorte } = this.props;
        getCorte();

    }
   
    render(){

        const { cortes, user } = this.props;

        const corte = cortes.find(x => x.id == user.corteId);    
    
        const title = (
            <React.Fragment>
                <FormattedMessage id="topbar.corte" defaultMessage="Corte" />
                {': '}
                <span className="topbar__item-value">{corte?corte.descripcion:''}</span>
            </React.Fragment>
        );

        
        return (
            <Dropdown
            title={title}
            items={cortes.map(x =>({title:x.descripcion}))}
            //onClick={(item) => changeCurrency(item.currency)}
            />
            );
        }
    }

DropdownCorte.propTypes = {
    cortes: PropTypes.array,
    user  : PropTypes.object
}

const mapDispatchToPros = ({
    getCorte
});

const mapStateToProps = (state) => ({     
        cortes: state.cortes,
        user: state.user,
});

export default connect(mapStateToProps, mapDispatchToPros)(DropdownCorte);
