import mailerGun from 'nodemailer-mailgun-transport';
import nodemailer from 'nodemailer';

import { API_KEY, domain } from '../config/config';


const transporter = () => nodemailer.createTransport(mailerGun({
  auth: {
    // eslint-disable-next-line object-shorthand
    domain: domain,
    api_key: API_KEY
  }
}));


export default transporter;
