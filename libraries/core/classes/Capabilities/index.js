import { getWebStorageEntry } from '../../commands/webStorage';

/**
 * Client information promise.
 * @type {Promise}
 */
const getClientInformation = getWebStorageEntry({ name: 'clientInformation'});

/**
 * Map with libversion which is used by iOS with corresponding Android app version.
 * @type {Object}
 */
const libVersionWithAndroidAppVersion = {
  // TODO check with App team if we can dump appVersions and rely on libVersion already.
  '17': {
    libVersion: '17.0',
    appVersion: '5.27', // TODO change to 5.29 before LIVE
  }
};

class Capabilities {
  static commandRequirements = {
    'getCurrentBrightness': libVersionWithAndroidAppVersion['17'],
    'resetBrightness': libVersionWithAndroidAppVersion['17'],
    'setBrightness': libVersionWithAndroidAppVersion['17'],
  };

  static compareVersionsAtLeast(requiredVersion, currentVersion) {
    const [ rMajor, rMinor, rMicro ] = requiredVersion.split('.');
    const [ cMajor, cMinor, cMicro ] = currentVersion.split('.');

    // Requested major is greater than current major.
    if (rMajor > cMajor) {
      return false;
    }
    // Requested major is lower than current. Minor and micro doesn't matter then.
    if (rMajor < cMajor) {
      return true;
    }

    // rMajor === cMajor => true.
    if (typeof rMinor === 'undefined' || typeof cMinor === 'undefined') {
      return true;
    }

    // Requested minor is greater than current minor.
    if (rMinor > cMinor) {
      return false;
    }

    // If any of them is undefined, no need to check further.
    if (typeof cMicro === 'undefined' || typeof cMicro === 'undefined') {
      return true;
    }

    if (rMicro > cMicro) {
      return false;
    }

    return true;
  };

  static versionsAreAtLeast({ libVersion, appVersion }) {
    return new Promise((resolve, reject) => {
      getClientInformation
        .then((clientInformation) => {
          if (clientInformation.value.device.os.platform === 'android') {
            return this.compareVersionsAtLeast(appVersion, clientInformation.value.appVersion) ?
              resolve() : reject();
          }
          return this.compareVersionsAtLeast(libVersion, clientInformation.value.libVersion) ?
            resolve() : reject();
        })
        .catch((err) => reject(err))
    });
  }
  isCommandSupported(name) {
    if (!this.constructor.commandRequirements.hasOwnProperty(name)) {
      return new Promise(resolve => resolve());
    }
    return this.constructor.versionsAreAtLeast(this.constructor.commandRequirements[name]);
  }
}

export default new Capabilities();