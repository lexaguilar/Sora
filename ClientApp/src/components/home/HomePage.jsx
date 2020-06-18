// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';
import app from '../../data/app';

export default function HomePage() {
    return (
        <React.Fragment>
            <Helmet>
                <title>{`Home Page One — ${app.name}`}</title>
            </Helmet>
        </React.Fragment>
    )
}