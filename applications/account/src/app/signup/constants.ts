import { getFreeCheckResult } from 'proton-shared/lib/subscription/freePlans';
import { SIGNUP_STEPS, SignupModel } from './interfaces';

export const YANDEX_DOMAINS = ['yandex.ru', 'yandex.ua'];
export const YAHOO_DOMAINS = [
    'yahoo.at',
    'yahoo.be',
    'yahoo.ca',
    'yahoo.co.id',
    'yahoo.co.il',
    'yahoo.co.in',
    'yahoo.co.jp',
    'yahoo.co.nz',
    'yahoo.co.th',
    'yahoo.co.uk',
    'yahoo.co.za',
    'yahoo.com',
    'yahoo.com.ar',
    'yahoo.com.br',
    'yahoo.com.co',
    'yahoo.com.hk',
    'yahoo.com.my',
    'yahoo.com.ph',
    'yahoo.com.sg',
    'yahoo.com.tr',
    'yahoo.com.tw',
    'yahoo.com.vn',
    'yahoo.cz',
    'yahoo.de',
    'yahoo.dk',
    'yahoo.es',
    'yahoo.fi',
    'yahoo.fr',
    'yahoo.gr',
    'yahoo.hu',
    'yahoo.ie',
    'yahoo.in',
    'yahoo.it',
    'yahoo.nl',
    'yahoo.no',
    'yahoo.pl',
    'yahoo.pt',
    'yahoo.ro',
    'yahoo.se',
    'ymail.com',
    'rocketmail.com',
];
export const AOL_DOMAINS = [
    'aol.asia',
    'aol.at',
    'aol.be',
    'aol.ch',
    'aol.cl',
    'aol.co.nz',
    'aol.co.uk',
    'aol.com',
    'aol.com.ar',
    'aol.com.au',
    'aol.com.br',
    'aol.com.co',
    'aol.com.mx',
    'aol.com.tr',
    'aol.com.ve',
    'aol.cz',
    'aol.de',
    'aol.dk',
    'aol.es',
    'aol.fi',
    'aol.fr',
    'aol.in',
    'aol.it',
    'aol.jp',
    'aol.nl',
    'aol.pl',
    'aol.se',
    'aol.tw',
    'wow.com',
    'games.com',
    'love.com',
    'ygm.com',
];
export const MAIL_RU_DOMAINS = ['mail.ru', 'inbox.ru', 'list.ru', 'bk.ru'];
export const GMAIL_DOMAINS = ['gmail.com', 'googlemail.com', 'google.com', 'googlegroups.com'];

export const INSECURE_DOMAINS = [
    ...GMAIL_DOMAINS,
    ...AOL_DOMAINS,
    ...YAHOO_DOMAINS,
    ...YANDEX_DOMAINS,
    ...MAIL_RU_DOMAINS,
];

export const DEFAULT_SIGNUP_MODEL: SignupModel = {
    step: SIGNUP_STEPS.ACCOUNT_CREATION_USERNAME,
    stepHistory: [],
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    signupType: 'username',
    domains: [],
    recoveryEmail: '',
    recoveryPhone: '',
    currency: 'EUR',
    cycle: 12,
    planIDs: {},
    humanVerificationMethods: [],
    humanVerificationToken: '',
    checkResult: getFreeCheckResult(),
};
