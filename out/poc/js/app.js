;(function() {
  let rachioKey = null;
  let entityId = null;
  let fullName = '';
  let deviceActiveZones = [];
  let activeDeviceId = false;
  let winterizingInterval = false;

  const inputApiKey = document.querySelector('#api-key');
  const inputTimeToBlow = document.querySelector('#time-to-blow');
  const inputTimeToRecover = document.querySelector('#time-to-recover');
  const inputCycles = document.querySelector('#cycles');
  const buttonFetchApi = document.querySelector('#fetch-api');
  const buttonCancelWinterize = document.querySelector('#cancel-winterize');
  const buttonWinterize = document.querySelector('#run-winterize');

  buttonFetchApi.addEventListener('click', function() {
    rachioKey = inputApiKey.value;
    initializeData(rachioKey);
  });

  buttonCancelWinterize.addEventListener('click', function() {
    if (activeDeviceId && winterizingInterval) {
      stopBlowout();
    }
  });

  buttonWinterize.addEventListener('click', function() {
    if (!winterizingInterval) {
      if (!activeDeviceId) {
        activeDeviceId = deviceActiveZones[0].id;
      }
      startBlowout(activeDeviceId, inputTimeToBlow.value, inputTimeToRecover.value, inputCycles.value);
    }
  });

  /**
   * Stops the winterization/blow out process
   */
  function stopBlowout() {
    deviceStopWater(rachioKey, activeDeviceId);
    clearInterval(winterizingInterval);
    winterizingInterval = false;
  }

  /**
   * Starts the winterization/blow out process
   * @param activeDeviceId String The device id to start winterization process
   * @param duration Number The time to run air through the zone
   * @param recovery Number The time to allow the air compressor to recover
   * @param cycles Number The number of times to cycle through the zones
   */
  function startBlowout(activeDeviceId, duration, recovery, cycles = 1) {
    function startZone(id) {
      console.log(id, 'cycle: ' + cycles);
      zoneStart(rachioKey, id, duration);
    }
    const activeZone = deviceActiveZones.filter(device => device.id === activeDeviceId)[0];

    let index = 0;
    startZone(activeZone.zones[index].id)
    winterizingInterval = setInterval(() => {
      if (typeof activeZone.zones[++index] === 'undefined') {
        if (--cycles) {
          index = 0;
        } else {
          stopBlowout();
          return;
        }
      }
      startZone(activeZone.zones[index].id)
    }, duration * 1000 + recovery * 1000);
  }

  /**
   * Initialize the data using the API key
   * @param rachioKey String The key to authenticate to the API
   */
  function initializeData(rachioKey) {
    getPersonEntity(rachioKey).then(entity => {
      entityId = entity.id;
      getDeviceInfo(rachioKey, entityId).then(info => {
        fullName = info.fullName;
        deviceActiveZones = info.devices.map(device => {
          return {
            name: device.name,
            id: device.id,
            latitude: device.latitude,
            longitude: device.longitude,
            zones: device.zones.filter(z => z.enabled).sort((a, b) => a.zoneNumber - b.zoneNumber),
          };
        });

        /* console log initialized data
         */
        console.log(info);
        deviceActiveZones.forEach(device => {
          console.log(fullName, device.name, device.id, device.latitude, device.longitude);
          console.table(device.zones.map(z => {
            return {
              name: z.name, 
              id: z.id
            };
          }));
        });

      });
    });
  }

  /**
   * Retrieve the id for the person entity currently logged in through OAuth.
   * @param rachioKey String The key to authenticate to the API
   * @returns {Promise<*>} Object The id of the person entity
   */
  async function getPersonEntity(rachioKey) {
    const response = await fetch('https://api.rach.io/1/public/person/info',{
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${rachioKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error getting person entity: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Retrieve the information for a person entity
   * @param rachioKey String The key to authenticate to the API
   * @param entityId String The id of the person entity
   * @returns {Promise<any>} Object Promise contains the person entity information
   */
  async function getDeviceInfo(rachioKey, entityId) {
    const response = await fetch(`https://api.rach.io/1/public/person/${entityId}`, {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${rachioKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error getting device info: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Stop all watering on device
   * @param rachioKey String The key to authenticate to the API
   * @param deviceId String The device's unique id
   */
  function deviceStopWater(rachioKey, deviceId) {
    fetch('https://api.rach.io/1/public/device/stop_water', {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${rachioKey}`,
      },
      body: JSON.stringify({
        id: deviceId
      }),
    }).catch((error) => {
      throw new Error(`Error stopping watering: ${error}`);
    });
  }

  /**
   * Start a zone
   * @param rachioKey String The key to authenticate to the API
   * @param zoneId String The zone's unique id
   * @param duration Number Duration in seconds (Range is 0 - 10800 (3 Hours) )
   */
  function zoneStart(rachioKey, zoneId, duration) {
    fetch('https://api.rach.io/1/public/zone/start', {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${rachioKey}`,
      },
      body: JSON.stringify({
        id: zoneId,
        duration: parseFloat(duration)
      }),
    }).catch((error) => {
      throw new Error(`Error starting watering: ${error}`);
    });
  }
  
}());
