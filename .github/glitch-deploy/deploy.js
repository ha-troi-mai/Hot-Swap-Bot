const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/good-verbose-alligator|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/prickly-surf-fox|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/guttural-odd-homegrown|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/checker-golden-brother|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/marble-plump-move|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/bony-bustling-property|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/scalloped-jolly-legal|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/noble-pie-settee|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/adaptive-quasar-music|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/great-bottlenose-pig|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/factual-noble-earth|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/pumped-pentagonal-horesradish|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/necessary-lean-rock|https://3d2ab227-d741-40bc-b7ed-b5fec1b7ee3c@api.glitch.com/git/peat-electric-scene`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();