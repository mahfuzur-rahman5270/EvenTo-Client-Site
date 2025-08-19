import { UAParser } from "ua-parser-js";


const GetDeviceInfo = () => {
    const parser = new UAParser();
    const result = parser.getResult();
    return {
        browser: result.browser.name,
        browserVersion: result.browser.version,
        os: result.os.name,
        osVersion: result.os.version,
        deviceType: result.device.type || 'Desktop',
        date: new Date()
    };
};

export default GetDeviceInfo;
