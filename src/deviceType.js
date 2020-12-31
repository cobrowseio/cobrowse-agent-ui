import parser from 'ua-parser-js';

export default function deviceType({ platform, device }) {
    switch (platform) {
        case 'web': {
            const ua = parser(device);
            return `${ua.browser.name} on ${ua.os.name}`;
        }
        case 'ios': return 'iOS Device';
        case 'android': return 'Android Device';
        case 'windows': return 'Windows Device';
        case 'macos': return 'Mac OS Device';
        default: return platform;
    }
}
