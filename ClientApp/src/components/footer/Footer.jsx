// react
import React from 'react';
import { connect } from 'react-redux';
import { getAppInfo } from '../../store/app/appActions';

function Footer(props) {    

    let  { app, getAppInfo } = props;
    getAppInfo();

    return (
        <div className="site-footer">
            <div className="container">              

                <div className="site-footer__bottom">
                    <div className="site-footer__copyright">
                        {app.name}
                        {' '}                       
                        — Version 
                        {' '}
                        {app.version}
                    </div>
                    <div className="site-footer__payments">
                        <img src="images/payments.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({   
    app: state.appInfo,        
});

const mapDispatchToPros = ({
    getAppInfo
});

export default connect(mapStateToProps, mapDispatchToPros)(Footer);
