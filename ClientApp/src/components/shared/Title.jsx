// react
import React from 'react';
import { Helmet } from 'react-helmet';
import app from '../../data/app';

function Title(props) {
    const { title } = props;

    return  <Helmet>
                <title>{app.Name} - {title}</title>
            </Helmet>
}

export default Title;
