// react
import React from 'react';

// application
import FooterContacts from './FooterContacts';
import FooterLinks from './FooterLinks';
import FooterNewsletter from './FooterNewsletter';

// data stubs
import app from '../../data/app';


export default function Footer() {
    const informationLinks = [
        { title: 'About Us', url: '' },
        { title: 'Delivery Information', url: '' },
        { title: 'Privacy Policy', url: '' },
        { title: 'Brands', url: '' },
        { title: 'Contact Us', url: '' },
        { title: 'Returns', url: '' },
        { title: 'Site Map', url: '' },
    ];

    const accountLinks = [
        { title: 'Store Location', url: '' },
        { title: 'Order History', url: '' },
        { title: 'Wish List', url: '' },
        { title: 'Newsletter', url: '' },
        { title: 'Specials', url: '' },
        { title: 'Gift Certificates', url: '' },
        { title: 'Affiliate', url: '' },
    ];

    return (
        <div className="site-footer">
            <div className="container">              

                <div className="site-footer__bottom">
                    <div className="site-footer__copyright">
                        Powered by
                        {' '}
                        <a href="https://reactjs.org/" rel="noopener noreferrer" target="_blank">React</a>
                        {' '}
                        — Design by
                        {' '}
                        <a href={app.author.profile_url} target="_blank" rel="noopener noreferrer">
                            {app.author.name}
                        </a>
                    </div>
                    <div className="site-footer__payments">
                        <img src="images/payments.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}
