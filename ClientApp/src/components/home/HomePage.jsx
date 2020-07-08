// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';
import app from '../../data/app';

import ODataStore from 'devextreme/data/odata/store';
export default function HomePage() {
    
    return (
        <React.Fragment>
            <Helmet>
                <title>{`Home Page One — ${app.Name}`}</title>
            </Helmet>
            
        </React.Fragment>
    )
}