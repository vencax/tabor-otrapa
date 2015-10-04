
require('coffee-script/register');

opts = {
  site: 'http://www.taborcz.eu',
  folder: process.env.STORAGE_FOLDER || '.storage'
};

require("./lib/rada")(opts);
require("./lib/zm")(opts);
